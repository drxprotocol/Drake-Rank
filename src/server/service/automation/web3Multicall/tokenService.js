import ApplicationConfig from "../../../../ApplicationConfig.js";
import ContractConfig from "../../../../contract/ContractConfig.js";
import {chainConfig} from "../../../common/webThree.js";

const tokenAddressConfig = ContractConfig.getChainAddressConfig(chainConfig.chainId).asset;
const chinlinkFeedIdConfig = ContractConfig.getChainAddressConfig(chainConfig.chainId).chinlinkFeedId;

export const tokens={
    USD: ApplicationConfig.emptyContractAddress,
    WETH: tokenAddressConfig.WETH,
    WBTC: tokenAddressConfig.WBTC,
    USDT: tokenAddressConfig.USDT,
    USDC: tokenAddressConfig.USDC,
    ARB: tokenAddressConfig.ARB,
};

export const USD_VALUE_DECIMALS = 8;

export const ValueInUSD = {
    name: 'ValueInUSD',
    address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
    decimals: USD_VALUE_DECIMALS,
};

export const tokenUSD = {
    name: 'USD',
    address: tokens.USD,
    decimals: 18,
};
export const tokenWETH = {
    name: 'WETH',
    address: tokens.WETH,
    decimals: 18,
    chainLinkFeedId: chinlinkFeedIdConfig.WETH,
};
export const tokenWBTC = {
    name: 'WBTC',
    address: tokens.WBTC,
    decimals: 8,
    chainLinkFeedId: chinlinkFeedIdConfig.WBTC,
};
export const tokenUSDT = {
    name: 'USDT',
    address: tokens.USDT,
    decimals: 6,
    chainLinkFeedId: chinlinkFeedIdConfig.USDT,
};
export const tokenUSDC = {
    name: 'USDC',
    address: tokens.USDC,
    decimals: 6,
    chainLinkFeedId: chinlinkFeedIdConfig.USDC,
};
export const tokenARB = {
    name: 'ARB',
    address: tokens.ARB,
    decimals: 18,
    // chainLinkFeedId: chinlinkFeedIdConfig.USDT,
};

const tokenArrForArbitrum = [
    tokenUSD,
    tokenWETH,
    tokenWBTC,
    tokenUSDT,
];
const tokenArrForBase = [
    tokenUSD,
    tokenWETH,
    tokenWBTC,
    tokenUSDC,
];
export const tokenArr = tokenArrForArbitrum;


export const tokenArrMap = {
    [ApplicationConfig.chainConfigForBaseSepoliaTestNet.chainId]: tokenArrForBase,
};

export const tokenMap = {
    [tokens.USD]: tokenUSD,
    [tokens.WETH]: tokenWETH,
    [tokens.WBTC]: tokenWBTC,
    [tokens.USDT]: tokenUSDT,
    [tokens.USDC]: tokenUSDC,
};
export const tokenChinlinkFeedIdMap = {
    [chinlinkFeedIdConfig.WETH]: tokenWETH,
    [chinlinkFeedIdConfig.WBTC]: tokenWBTC,
    [chinlinkFeedIdConfig.USDT]: tokenUSDT,
    [chinlinkFeedIdConfig.USDC]: tokenUSDC,
};

export const allSettleCcyTokenArr = () => {
    return ContractConfig.getChainAddressConfig(chainConfig.chainId).allSettleCcy.map(settleCcy => {
        return tokenMap[settleCcy];
    });
};

export const allAssetsRankedByLiq = [
    tokenUSDT,
    tokenWBTC,
    tokenWETH,
];

export const allAssetsAddressRankedByLiq = allAssetsRankedByLiq.map(token => {
   return token.address;
});

export const getVaultAddressByTokenAddress = (token) => {
    let tokenName = tokenMap[token].name;
    let vaultAddressConfig = ContractConfig.getChainAddressConfig(chainConfig.chainId).Earn.Vault;
    return vaultAddressConfig[tokenName];
};

export const volatileTokenArr = [
    {
        token: tokenWBTC,
        tradingPairSymbol: 'BTCUSDT',
    },
    {
        token: tokenWETH,
        tradingPairSymbol: 'ETHUSDT',
    },
    {
        token: tokenARB,
        tradingPairSymbol: 'ARBUSDT',
    },
];