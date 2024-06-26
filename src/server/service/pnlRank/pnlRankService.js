import {database} from "../../common/database.js";
import ApplicationConfig from "../../../ApplicationConfig.js";
import {queryReferral} from "../referral/referralService.js";
import ContractConfig from "../../../contract/ContractConfig.js";
import {chainConfig, multicall} from "../../common/webThree.js";
import BigNumber from "bignumber.js";
import {tokenUSDC, USD_VALUE_DECIMALS} from "../automation/web3Multicall/tokenService.js";
import {toOffChainValue} from "../../../utils/NumberFormat.js";

// | Ranking | Address  | Trading PNL |  Trading Volume | Number of  Referee | Total Referee PNL | Feedback Bonus | Final PNL |
// | --- | --- | --- | --- | --- | --- | --- | --- |
// | 1 | 0xcA0b…FcEF | $14,224.24 | $514,205.14 | 5 | $1,152.54 | 10% | $16,914.45 |
// | 2 | 0x7969…13a7 | $9,547.98 | $501,114.46 | 2 | $2,478.73 | 20% | $14,432.05 |
// | 3 | 0xA3c7…Cb1b | $7,834.82 | $405,772.15 | 4 | $5,017.12 | 10% | $14,137.13 |
// | 4 | 0xA453…Dc4F | $10,852.55 | $481,772.43 | 1 | $1,432.77 | 0 | $12,285.32 |
// | 5 | 0xDa15…5C47 | $6,871.72 | $381,185.71 | 1 | $1,852.44 | 0 | $8,724.16 |
// | 6 | 0xF315…47F7 | $5,371.72 | $341,185.71 | 1 | $202.53 | 0 | $5,574.25 |
// | 7 | 0xb315…jk23 | $4,852.55 | $623,405.74 | 1 | $656.23 | 0 | $5,508.88 |
// | 8 | 0x9h6k…i8rd | $3,547.98 | $314,205.14 | 1 | $354.34 | 0 | $3,902.32 |
// | 9 | 0x0U80…yi67 | $1,534.38 | $455.890.23 | 0 | 0 | 0 | $1,534.38 |
// | 10 | 0x12E0…12dE | $956.23 | $6.534.23 | 0 | 0 | 0 | $956.23 |
//
// PNL = Isolated Equity + Cross Equity + Wallet Balance - 100,000 USDC

const fetchCrossEquity = (accountArr) => {
    return new Promise((resolve, reject) => {
        let contractConfig = ContractConfig.TradingMeta.PortfolioLibrary;
        let contractAddress = contractConfig.address(chainConfig.chainId);

        let fetchMethodName = 'getEquityEst';
        let fetchCrossEquityCalls = accountArr.map(account => {
            return { reference: `fetchCrossEquity_${account.address}_${account.cmpAddress}`, methodName: fetchMethodName, methodParameters: [account.cmpAddress] };
        });

        let multicallContext = [
            {
                reference: `fetchCrossEquity`,
                contractAddress: contractAddress,
                abi: contractConfig.abi,
                calls: fetchCrossEquityCalls
            }
        ];

        let dataMap = {};
        multicall.call(multicallContext).then(result => {
            result?.results[`fetchCrossEquity`].callsReturnContext.forEach(theCallResult => {
                if(theCallResult.success && theCallResult.returnValues.length){
                    let bn = toOffChainValue(theCallResult.returnValues[0], USD_VALUE_DECIMALS);

                    let infos = theCallResult.reference.split('_');
                    let address = infos[1];

                    console.debug(
                        `fetchCrossEquity:`,
                        `address =>`, address,
                        `value =>`, bn.toFixed(0),
                    );

                    dataMap[address] = bn;
                }
            });

            resolve(dataMap);
        }).catch(e => {
            console.error(`failed to fetch Cross Equity. Error:`, e);
            resolve(dataMap);
        });
    });
};

const fetchTokenBalance = (accountArr) => {
    return new Promise((resolve, reject) => {
        let contractConfig = ContractConfig.asset.ERC20;
        let contractAddress = tokenUSDC.address;

        let fetchMethodName = 'balanceOf';
        let fetchBalanceCalls = accountArr.map(account => {
            return { reference: `fetchBalance_${account.address}_${contractAddress}`, methodName: fetchMethodName, methodParameters: [account.address] };
        });

        let multicallContext = [
            {
                reference: `fetchBalance`,
                contractAddress: contractAddress,
                abi: contractConfig.abi,
                calls: fetchBalanceCalls
            }
        ];

        let dataMap = {};
        multicall.call(multicallContext).then(result => {
            result?.results[`fetchBalance`].callsReturnContext.forEach(theCallResult => {
                if(theCallResult.success && theCallResult.returnValues.length){
                    let bn = toOffChainValue(theCallResult.returnValues[0], tokenUSDC);

                    let infos = theCallResult.reference.split('_');
                    let address = infos[1];

                    console.debug(
                        `fetchBalance:`,
                        `address =>`, address,
                        `value =>`, bn.toFixed(0),
                    );

                    dataMap[address] = bn;
                }
            });

            resolve(dataMap);
        }).catch(e => {
            console.error(`failed to fetch USDC balance. Error:`, e);
            resolve(dataMap);
        });
    });
};

const updatePnlDataForAccountArr = (accountArr) => {
    return new Promise((resolve, reject) => {
        fetchCrossEquity(accountArr).then(crossEquityMap => {
            fetchTokenBalance(accountArr).then(tokenBalanceMap => {

            });
        });
    });
};

export const updatePnLData = () => {
    queryReferral({}, (err, items) => {
        //TODO group
        if(items && items.length){
            updatePnlDataForAccountArr(items).then(data => {

            });
        }
    });
};