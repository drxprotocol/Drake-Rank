import {database} from "../../common/database.js";
import ApplicationConfig from "../../../ApplicationConfig.js";
import {queryReferral, queryReferred} from "../referral/referralService.js";
import ContractConfig from "../../../contract/ContractConfig.js";
import {chainConfig, multicall} from "../../common/webThree.js";
import BigNumber from "bignumber.js";
import {tokenUSDC, tokenMap, USD_VALUE_DECIMALS, allSettleCcyTokenArr} from "../automation/web3Multicall/tokenService.js";
import {toOffChainValue} from "../../../utils/NumberFormat.js";
import {getAllInstruments} from "../automation/web3Multicall/instrumentService.js";
import {Pnl, LastUpdatedTimeCacheKey, LastRankingArrCacheKey, LastRankingMapCacheKey, LastTopRankingArrCacheKey} from "./pnlRankStructure.js";

const savePnlRank = (pnlData) => {
    let {pnlArr, topRank, pnlMap, lastUpdatedTime} = pnlData;

    console.debug(`=============`);
    database().setInfo(LastUpdatedTimeCacheKey, lastUpdatedTime, function(err, key, value) {
        if (err) {
            console.log(err);
            return;
        }

        console.log(
            `lastRankingUpdatedTime:`, value,
        );
    });


    pnlArr.forEach(pnl => {
        console.log(
            `pnlRank:`,
            `ranking =>`, pnl.ranking,
            `address =>`, pnl.address,
            `finalPnl =>`, pnl.finalPnl,
        );
    });
    database().setInfo(LastRankingArrCacheKey, pnlArr, function(err, key, value) {
        if (err) {
            console.log(err);
            return;
        }
    });


    database().setInfo(LastTopRankingArrCacheKey, topRank, function(err, key, value) {
        if (err) {
            console.log(err);
            return;
        }
    });

    database().setInfo(LastRankingMapCacheKey, pnlMap, function(err, key, value) {
        if (err) {
            console.log(err);
            return;
        }
    });
    console.debug(`=============`);
};

export const queryLastRankingArr = () => {
    return new Promise((resolve, reject) => {
        database().getInfo(LastRankingArrCacheKey, function(err, key, value) {
            if (err) {
                console.log(err);
                resolve([]);
            }

            resolve(value);
        });
    });
};

export const queryLastTopRankingArr = () => {
    return new Promise((resolve, reject) => {
        database().getInfo(LastTopRankingArrCacheKey, function(err, key, value) {
            if (err) {
                console.log(err);
                resolve([]);
            }

            resolve(value);
        });
    });
};

export const queryMyRankingArr = (address) => {
    return new Promise((resolve, reject) => {
        database().getInfo(LastRankingMapCacheKey, function(err, key, value) {
            if (err) {
                console.log(err);
                resolve({});
            }

            let myRanking = value[address.toLocaleLowerCase()] || {};
            resolve(myRanking);
        });
    });
};


// Isolated Equity = Balance in the Isolated margin account + PnL in Isolated margin positions +  Liability (0)
//     Balance in the account  = Avaiable capital + in use
const fetchIsolatedEquity = (accountArr) => {
    return new Promise((resolve, reject) => {
        let multicallContext = [];

        let assets = allSettleCcyTokenArr();

        let instrumentIdsForAssetMap = {};
        let instrumentIdsForAssets = [];
        let instruments = getAllInstruments();
        assets.forEach(asset => {
            let instrumentIdsForAsset = instruments.filter(instrument => {
                return instrument?.settleCcy === asset?.address;
            });
            instrumentIdsForAssetMap[asset?.address] = instrumentIdsForAsset;

            instrumentIdsForAsset.forEach(instrument => {
                instrumentIdsForAssets.push(instrument);
            });
        });

        // console.debug(
        //     `instrumentIdsForAssets =>`, instrumentIdsForAssets,
        // );



        let impContractConfig = ContractConfig.TradingMeta.IsolatedMarginPortfolio;

        let pleContractConfig = ContractConfig.TradingMeta.PortfolioLibraryExternal;
        let pleContractAddress = pleContractConfig.address(chainConfig.chainId);

        accountArr.forEach(account => {
            let impContractAddress = account.impAddress;

            let fetchAssetBalanceInPortfolioCalls = [];
            assets.forEach(asset => {
                let assetName = asset.name;
                let tokenContractAddress = asset.address;

                fetchAssetBalanceInPortfolioCalls.push(
                    { reference: `fetchAssetBalanceInPortfolio_available_${assetName}_${tokenContractAddress}_${impContractAddress}`, methodName: 'getAvailableBal', methodParameters: [tokenContractAddress] }
                );
                fetchAssetBalanceInPortfolioCalls.push(
                    { reference: `fetchAssetBalanceInPortfolio_frozen_${assetName}_${tokenContractAddress}_${impContractAddress}`, methodName: 'frozenBalance', methodParameters: [tokenContractAddress] }
                );
            });

            multicallContext.push({
                reference: `fetchAssetBalanceInPortfolio_${impContractAddress}`,
                contractAddress: impContractAddress,
                abi: impContractConfig.abi,
                calls: fetchAssetBalanceInPortfolioCalls
            });


            let fetchAssetPnLInPortfolioCalls = [];
            instrumentIdsForAssets.forEach(instrument => {
                let instrumentId = instrument?.id;

                fetchAssetPnLInPortfolioCalls.push(
                    { reference: `fetchAsset_pnl_${impContractAddress}_${instrumentId}`, methodName: 'getUnPnLEst', methodParameters: [impContractAddress, instrumentId] }
                );
                fetchAssetPnLInPortfolioCalls.push(
                    { reference: `fetchAsset_positionMargin_${impContractAddress}_${instrumentId}`, methodName: 'getPosMargin', methodParameters: [impContractAddress, instrumentId] }
                );
            });

            multicallContext.push({
                reference: `fetchAssetPnLInPortfolio_${impContractAddress}`,
                contractAddress: pleContractAddress,
                abi: pleContractConfig.abi,
                calls: fetchAssetPnLInPortfolioCalls
            });
        });





        let dataMap = {};
        multicall.call(multicallContext).then(result => {

            accountArr.forEach(account => {
                let dataForImpMap = {};

                let impContractAddress = account.impAddress;

                let assetBalanceCallsReturnContext = result?.results[`fetchAssetBalanceInPortfolio_${impContractAddress}`]?.callsReturnContext || [];
                assetBalanceCallsReturnContext.forEach(theCallResult => {
                    if(theCallResult.success && theCallResult.returnValues.length){
                        let infos = theCallResult.reference.split('_');
                        let fetch = infos[1];
                        let tokenName = infos[2];
                        let tokenContractAddress = infos[3];
                        let token = tokenMap[tokenContractAddress];

                        let bn = toOffChainValue(theCallResult.returnValues[0], token.decimals);

                        if(!dataForImpMap[tokenContractAddress]){
                            dataForImpMap[tokenContractAddress] = {};
                        }
                        dataForImpMap[tokenContractAddress][fetch] = bn;

                        // console.debug(
                        //     `fetchAssetBalanceInPortfolio:`,
                        //     `fetch =>`, fetch,
                        //     `tokenName =>`, tokenName,
                        //     `tokenContractAddress =>`, tokenContractAddress,
                        //     `impContractAddress =>`, impContractAddress,
                        //     `value =>`, bn.toFixed(8),
                        //     // `dataForImpMap =>`, dataForImpMap
                        // );
                    }
                });




                let pnlForImpMap = {};
                let assetPnlCallsReturnContext = result?.results[`fetchAssetPnLInPortfolio_${impContractAddress}`]?.callsReturnContext || [];
                assetPnlCallsReturnContext.forEach(theCallResult => {
                    if(theCallResult.success && theCallResult.returnValues.length){
                        let infos = theCallResult.reference.split('_');
                        let fetch = infos[1];
                        let instrumentId = infos[3];

                        let bn = toOffChainValue(theCallResult.returnValues[0], 0);

                        if(!pnlForImpMap[instrumentId]){
                            pnlForImpMap[instrumentId] = {};
                        }
                        pnlForImpMap[instrumentId][fetch] = bn;

                        // console.debug(
                        //     `fetchAssetPnLInPortfolio:`,
                        //     `fetch =>`, fetch,
                        //     `impContractAddress =>`, impContractAddress,
                        //     `instrumentId =>`, instrumentId,
                        //     `value =>`, bn.toFixed(8),
                        // );
                    }
                });

                assets.forEach(asset => {
                    let totalPnlBn = instrumentIdsForAssetMap[asset?.address].map(instrument => {
                        let pnlMap = pnlForImpMap[instrument.id];
                        return pnlMap?.pnl || new BigNumber(0);
                    }).reduce((total, amount, index) => {
                        return total.plus(amount);
                    }, new BigNumber(0));
                    let totalPnl = toOffChainValue(totalPnlBn, asset?.decimals);

                    let fetch = 'pnl';
                    dataForImpMap[asset.address][fetch] = totalPnl;

                    let totalMarginBn = instrumentIdsForAssetMap[asset?.address].map(instrument => {
                        let pnlMap = pnlForImpMap[instrument.id];
                        return pnlMap?.positionMargin || new BigNumber(0);
                    }).reduce((total, amount, index) => {
                        return total.plus(amount);
                    }, new BigNumber(0));
                    let totalMargin = toOffChainValue(totalMarginBn, asset?.decimals);

                    fetch = 'positionMargin';
                    dataForImpMap[asset.address][fetch] = totalMargin;


                    // console.debug(
                    //     `calculate total pnl:`,
                    //     `asset.name`, asset.name,
                    //     `asset.address`, asset.address,
                    //     `totalPnl =>`, totalPnl.toFixed(8),
                    //     `totalPnlBn =>`, totalPnlBn.toFixed(8),
                    //     `totalMargin =>`, totalMargin.toFixed(8),
                    //     `totalMarginBn =>`, totalMarginBn.toFixed(8),
                    // );
                });



                let totalEquity = assets.map(asset => {
                    let dataForImp = dataForImpMap[asset.address];

                    if(!dataForImp){
                        return new BigNumber(0);
                    }

                    console.debug(`dataForImpMap =>`, asset.address, dataForImp);

                    let available = dataForImp['available'] || new BigNumber(0);

                    let totalFrozen = dataForImp['frozen'] || new BigNumber(0);
                    let positionMargin = dataForImp['positionMargin'] || new BigNumber(0);
                    let inUse = totalFrozen.plus(positionMargin);

                    let pnl = dataForImp['pnl'] || new BigNumber(0);

                    let equity = available.plus(inUse).plus(pnl);

                    console.debug(
                        `imp equity:`,
                        `asset.name`, asset.name,
                        `asset.address`, asset.address,
                        `available =>`, available.toFixed(8),
                        `totalFrozen =>`, totalFrozen.toFixed(8),
                        `positionMargin =>`, positionMargin.toFixed(8),
                        `inUse =>`, inUse.toFixed(8),
                        `pnl =>`, pnl.toFixed(8),
                        `equity =>`, equity.toFixed(8),
                    );

                    return equity;
                }).reduce((total, amount, index) => {
                    return total.plus(amount);
                }, new BigNumber(0));

                console.debug(
                    `fetchIsolatedEquity:`,
                    `address =>`, account.address,
                    `imp address =>`, impContractAddress,
                    `value =>`, totalEquity.toFixed(8),
                );

                dataMap[account.address] = totalEquity;
            });

            resolve(dataMap);
        }).catch(e => {
            console.error(`failed to fetch Isolated Equity. Error:`, e);
            resolve(dataMap);
        });

    });
};

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
                    let cmpAddress = infos[2];

                    console.debug(
                        `fetchCrossEquity:`,
                        `address =>`, address,
                        `cmpAddress =>`, cmpAddress,
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

const fetchUSDCTokenBalance = (accountArr) => {
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

const fetchReferredInfo = (accountArr) => {
    return new Promise((resolve, reject) => {
        let referredInfoArr = [];
        let referredInfoMap = {};

        accountArr.forEach(account => {
            let address = account.address;

            queryReferred(account.referralCode, (err, items) => {
                let referred = items || [];
                let referredSize = referred.length;
                let referredAddress = referred.map(item => {
                    return item.address;
                });

                let referredInfo = {
                    referredSize,
                    referredAddress,
                }

                referredInfoMap[address] = referredInfo;
                referredInfoArr.push(referredInfo);

                if(referredInfoArr.length === accountArr.length){
                    resolve(referredInfoMap);
                }
            });
        });
    });
};

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
const calculatePnL = (accountArr, referredInfoMap, isolatedEquityMap, crossEquityMap, tokenBalanceMap) => {
    return new Promise((resolve, reject) => {
        let pnlArr = [];
        let pnlMap = {};

        let decimals = tokenUSDC.decimals;
        let lastUpdatedTime = new Date().getTime();

        accountArr.forEach(account => {
            let address = account.address;

            let referredInfo = referredInfoMap[address];

            let impEquityBn = isolatedEquityMap[address] || new BigNumber(0);
            let impEquity = impEquityBn.toFixed(decimals);

            let cmpEquityBn = crossEquityMap[address] || new BigNumber(0);
            let cmpEquity = cmpEquityBn.toFixed(decimals);

            let usdcBalanceBn = tokenBalanceMap[address] || new BigNumber(0);
            let usdcBalance = usdcBalanceBn.toFixed(decimals);

            let oraginalBalance = new BigNumber(100000);

            let pnlBn = impEquityBn.plus(cmpEquityBn).plus(usdcBalanceBn).minus(oraginalBalance);
            let tradingPnl = pnlBn.toFixed(decimals);

            let finalPnlBn = pnlBn;
            let finalPnl = finalPnlBn.toFixed(decimals);



            let pnlRank = new Pnl({
                ...account,
                ...referredInfo,
                usdcBalance,
                tradingPnl,
                impEquity,
                cmpEquity,

                finalPnl,

                lastUpdatedTime,
            });

            pnlArr.push(pnlRank);
        });

        pnlArr = pnlArr.sort((p1, p2)=>{
            let pnl1 = new BigNumber(p1.finalPnl);
            let pnl2 = new BigNumber(p2.finalPnl);
            return pnl2.comparedTo(pnl1);
        });

        let validPnLArr = pnlArr.filter(pnl => {
            return !ApplicationConfig.pnlRankAccountBlackList.includes(pnl.address.toLocaleLowerCase());
        }).map((pnl, index) => {
            let ranking = index + 1;
            let validPnL = {
                ...pnl,
                ranking,
            };

            return validPnL;
        });

        let unvalidPnlArr = pnlArr.filter(pnl => {
            return ApplicationConfig.pnlRankAccountBlackList.includes(pnl.address.toLocaleLowerCase());
        });

        pnlArr = validPnLArr.concat(unvalidPnlArr);
        pnlArr.forEach(pnl => {
            pnlMap[pnl?.address.toLocaleLowerCase()] = pnl;
        });

        let topRank = validPnLArr.slice(0, ApplicationConfig.pnlTopRankLength);

        resolve({
            pnlArr: validPnLArr,
            topRank,
            pnlMap,
            lastUpdatedTime,
        });
    });
};


const updatePnlDataForAccountArr = (accountArr) => {
    return new Promise((resolve, reject) => {
        fetchReferredInfo(accountArr).then(referredInfoMap => {
            fetchIsolatedEquity(accountArr).then(isolatedEquityMap => {
                fetchCrossEquity(accountArr).then(crossEquityMap => {
                    fetchUSDCTokenBalance(accountArr).then(tokenBalanceMap => {
                        calculatePnL(accountArr, referredInfoMap, isolatedEquityMap, crossEquityMap, tokenBalanceMap).then(pnlData => {
                            // console.debug(`pnlData =>`, pnlData);
                            savePnlRank(pnlData);
                            resolve(pnlData);
                        });
                    });
                });
            });
        });
    });
};

export const executeUpdatePnLData = () => {
    return new Promise((resolve, reject) => {
        queryReferral({}, (err, items) => {
            //TODO group
            if(items && items.length){
                updatePnlDataForAccountArr(items).then(pnlData => {
                    resolve(pnlData)
                });
            }
        });
    });
};

export const updatePnLData = () => {
    executeUpdatePnLData().then(pnlData => {

    });
};