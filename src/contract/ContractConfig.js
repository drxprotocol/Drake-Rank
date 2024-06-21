/**
 * @Author: DAPP
 * @Date:   2021-06-17 15:43:43
 * @Last Modified by:   DAPP
 * @Last Modified time: 2021-07-12 21:05:43
 */
import ApplicationConfig from '../ApplicationConfig.js';

import ERC20Token_abi from './abi/ERC20Token_abi.js';
import TestERC20Token_abi from "./abi/TestERC20Token_abi.js";
import Instrument_abi from "./abi/Instrument_abi.js";
import PriceAggregator_abi from "./abi/PriceAggregator_abi.js";
import IsolatedMarginPortfolioFactory_abi from "./abi/IsolatedMarginPortfolioFactory_abi.js";
import IsolatedMarginPortfolio_abi from "./abi/IsolatedMarginPortfolio_abi.js";
import CrossMarginPortfolioFactory_abi from "./abi/CrossMarginPortfolioFactory_abi.js";
import CrossMarginPortfolio_abi from "./abi/CrossMarginPortfolio_abi.js";
import CrossMarginPortfolioController_abi from "./abi/CrossMarginPortfolioController_abi.js";
import PortfolioLibrary_abi from "./abi/PortfolioLibrary_abi.js";
import RiskController_abi from "./abi/RiskController_abi.js";
import Vault_abi from "./abi/Vault_abi.js";
import VaultNFTManager_abi from "./abi/VaultNFTManager_abi.js";
import Trading_abi from "./abi/Trading_abi.js";
import ContractAddressConfig_BaseSepolia from "./ContractAddressConfig_BaseSepolia.js";
import CLPriceVerifierHelper_abi from "./abi/CLPriceVerifierHelper_abi.js";
import CMPController_abi from "./abi/CMPController_abi.js";
import IMPController_abi from "./abi/IMPController_abi.js";
import CMPLiabilityManager_abi from "./abi/CMPLiabilityManager_abi.js";
import CMPAutoRepayManager_abi from "./abi/CMPAutoRepayManager_abi.js";
import CMPLiabilityInterestManager_abi from "./abi/CMPLiabilityInterestManager_abi.js";
import FeeManager_abi from "./abi/FeeManager_abi.js";
import SpreadManager_abi from "./abi/SpreadManager_abi.js";

const getContractOnBaseSepolia = () => {
    return ContractAddressConfig_BaseSepolia;
};

const ChainAddressMap = {
    84532: {
        name: 'Base Sepolia',
        getAddressConfig: getContractOnBaseSepolia,
    },
    '0x14a34': {
        name: 'Base Sepolia',
        getAddressConfig: getContractOnBaseSepolia,
    },
};

const getChainAddress = (chainId) => {
    let _chainId = chainId || ApplicationConfig.defaultChain.id;
    let chainConfig = ChainAddressMap[_chainId] && ChainAddressMap[_chainId];
    let config = chainConfig.getAddressConfig ? chainConfig.getAddressConfig() : chainConfig.addressConfig;

    // console.debug(
    //     `contractConfig =>`, config,
    // );

    return config;
};

const ContractConfig = {
    etherscan: (chainId) => {
        let _chainId = chainId || ApplicationConfig.defaultChain.id;
        return ChainAddressMap[_chainId] && ChainAddressMap[_chainId].addressConfig.etherscan;
    },
    getChainAddressConfig: getChainAddress,
    asset: {
        ERC20: {
            name: 'ERC20 Token',
            abi: ERC20Token_abi,
        },
        TestERC20: {
            name: 'ERC20 Token',
            abi: TestERC20Token_abi,
        },
        /**
         * get asset config. e.g.:
         *      ContractConfig.asset.getAsset('SPA')
         *      ContractConfig.asset.getAsset('ETH-SPA@Uniswap')
         * @param name
         */
        getAsset: (name) => {
            if (name.indexOf('@') > 0) {
                let dexName = name.split('@')[1];
                return ContractConfig.asset[`LP_${dexName}`];
            } else {
                return ContractConfig.asset[name];
            }
        },
        getTokenAddress: (name, chainId) => {
            let addressConfig = getChainAddress(chainId);
            return addressConfig && addressConfig?.asset[name];
        },
    },

    TradingMeta: {
        Instrument: {
            name: 'Instrument',
            abi: Instrument_abi,
            address(chainId) {
                let addressConfig = getChainAddress(chainId);
                return addressConfig && addressConfig?.TradingMeta?.Instrument;
            },
        },
        IsolatedMarginPortfolioFactory: {
            name: 'IsolatedMarginPortfolioFactory',
            abi: IsolatedMarginPortfolioFactory_abi,
            address(chainId) {
                let addressConfig = getChainAddress(chainId);
                return addressConfig && addressConfig?.TradingMeta?.IsolatedMarginPortfolioFactory;
            },
        },
        IsolatedMarginPortfolio: {
            name: 'IsolatedMarginPortfolio',
            abi: IsolatedMarginPortfolio_abi,
        },
        CrossMarginPortfolioController: {
            name: 'CrossMarginPortfolioController',
            abi: CrossMarginPortfolioController_abi,
            address(chainId) {
                let addressConfig = getChainAddress(chainId);
                return addressConfig && addressConfig?.TradingMeta?.CrossMarginPortfolioController;
            },
        },
        CrossMarginPortfolioFactory: {
            name: 'CrossMarginPortfolioFactory',
            abi: CrossMarginPortfolioFactory_abi,
            address(chainId) {
                let addressConfig = getChainAddress(chainId);
                return addressConfig && addressConfig?.TradingMeta?.CrossMarginPortfolioFactory;
            },
        },
        CrossMarginPortfolio: {
            name: 'CrossMarginPortfolio',
            abi: CrossMarginPortfolio_abi,
        },
        PriceAggregator: {
            name: 'PriceAggregator',
            abi: PriceAggregator_abi,
            address(chainId) {
                let addressConfig = getChainAddress(chainId);
                return addressConfig && addressConfig?.TradingMeta?.PriceAggregator;
            },
        },
        PortfolioLibrary: {
            name: 'PortfolioLibrary',
            abi: PortfolioLibrary_abi,
            address(chainId) {
                let addressConfig = getChainAddress(chainId);
                return addressConfig && addressConfig?.TradingMeta?.PortfolioLibrary;
            },
        },
        RiskController: {
            name: 'RiskController',
            abi: RiskController_abi,
            address(chainId) {
                let addressConfig = getChainAddress(chainId);
                return addressConfig && addressConfig?.TradingMeta?.RiskController;
            },
        },
        CMPLiabilityManager: {
            name: 'CMPLiabilityManager',
            abi: CMPLiabilityManager_abi,
            address(chainId) {
                let addressConfig = getChainAddress(chainId);
                return addressConfig && addressConfig?.TradingMeta?.CMPLiabilityManager;
            },
        },
        CMPLiabilityInterestManager: {
            name: 'CMPLiabilityInterestManager',
            abi: CMPLiabilityInterestManager_abi,
            address(chainId) {
                let addressConfig = getChainAddress(chainId);
                return addressConfig && addressConfig?.TradingMeta?.CMPLiabilityInterestManager;
            },
        },
        CMPAutoRepayManager: {
            name: 'CMPAutoRepayManager',
            abi: CMPAutoRepayManager_abi,
            address(chainId) {
                let addressConfig = getChainAddress(chainId);
                return addressConfig && addressConfig?.TradingMeta?.CMPAutoRepayManager;
            },
        },
        Trading: {
            name: 'Trading',
            abi: Trading_abi,
            address(chainId) {
                let addressConfig = getChainAddress(chainId);
                return addressConfig && addressConfig?.TradingMeta?.Trading;
            },
        },
        CLPriceVerifierHelper: {
            name: 'CLPriceVerifierHelper',
            abi: CLPriceVerifierHelper_abi,
            address(chainId) {
                let addressConfig = getChainAddress(chainId);
                return addressConfig && addressConfig?.TradingMeta?.CLPriceVerifierHelper;
            },
        },
        IMPController: {
            name: 'IMPController',
            abi: IMPController_abi,
            address(chainId) {
                let addressConfig = getChainAddress(chainId);
                return addressConfig && addressConfig?.TradingMeta?.IMPController;
            },
        },
        CMPController: {
            name: 'CMPController',
            abi: CMPController_abi,
            address(chainId) {
                let addressConfig = getChainAddress(chainId);
                return addressConfig && addressConfig?.TradingMeta?.CMPController;
            },
        },
        FeeManager: {
            name: 'FeeManager',
            abi: FeeManager_abi,
            address(chainId) {
                let addressConfig = getChainAddress(chainId);
                return addressConfig && addressConfig?.TradingMeta?.FeeManager;
            },
        },
        SpreadManager: {
            name: 'SpreadManager',
            abi: SpreadManager_abi,
            address(chainId) {
                let addressConfig = getChainAddress(chainId);
                return addressConfig && addressConfig?.TradingMeta?.SpreadManager;
            },
        },
    },

    Earn: {
        Vault: {
            name: 'Vault',
            abi: Vault_abi,
            address(chainId, vaultToken) {
                let addressConfig = getChainAddress(chainId);
                return addressConfig && addressConfig?.Earn?.Vault[vaultToken];
            },
        },
        NFTManager: {
            name: 'NFTManager',
            abi: VaultNFTManager_abi,
            address(chainId, vaultToken) {
                let addressConfig = getChainAddress(chainId);
                return addressConfig && addressConfig?.Earn?.NFTManager[vaultToken];
            },
        },
    },
};

export default ContractConfig;
