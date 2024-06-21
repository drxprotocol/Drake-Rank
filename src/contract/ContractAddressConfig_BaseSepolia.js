const ContractAddressConfig_BaseSepolia = {
    etherscan: 'https://sepolia.basescan.org',
    instruments: [
        {
            id: 1,
            name: `WETH-USDC-USDC`,
            tokens: {
                baseCcy: '0x874F29f131Cb0A49cCA9613c53D431c73f9C5991',
                quoteCcy: '0x798573500F12695fe8256892d33C0f9E849Fbb1E',
                settleCcy: '0x798573500F12695fe8256892d33C0f9E849Fbb1E',
            },
        },
        {
            id: 2,
            name: `WBTC-USDC-USDC`,
            tokens: {
                baseCcy: '0x2FDcB26e3b65446732cB1f77523E0fBCFd6DB519',
                quoteCcy: '0x798573500F12695fe8256892d33C0f9E849Fbb1E',
                settleCcy: '0x798573500F12695fe8256892d33C0f9E849Fbb1E',
            },
        },
    ],
    allSettleCcy: [
        '0x798573500F12695fe8256892d33C0f9E849Fbb1E',
        '0x874F29f131Cb0A49cCA9613c53D431c73f9C5991',
        '0x2FDcB26e3b65446732cB1f77523E0fBCFd6DB519',
    ],
    asset: {
        ETH: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
        USDC: '0x798573500F12695fe8256892d33C0f9E849Fbb1E',
        ARB: '0x91fcF4AAA4C42FdbF34Ba868B653b26C7c3c3F51',
        WETH: '0x874F29f131Cb0A49cCA9613c53D431c73f9C5991',
        WBTC: '0x2FDcB26e3b65446732cB1f77523E0fBCFd6DB519',
        USDT: '0xb7592e7c9d125715cC08d10B29F1E9a701e18e83',
        DAI: '0x16306593BE20EA1D499261081b8040e3F675FECE',
    },
    chinlinkFeedId: {
        WETH: '0x00027bbaff688c906a3e20a34fe951715d1018d262a5b66e38eda027a674cd1b',
        WBTC: '0x00020ffa644e6c585a5bec0e25ca476b9538198259e22b6240957720dcba0e14',
        USDT: '0x000216e69b26a7c5716333fe0fddd1d2d468193b6ea9083ca926be71046f08b1',
        USDC: '',
    },

    "TradingMeta": {
        "IsolatedMarginPortfolioFactory": "0xc2611302D73f46fb527A19e43a5F49CEe64B16A1",
        "CrossMarginPortfolioFactory": "0x4b72365148E813F4913F11d74E1B17aCE5e36372",
        "Instrument": "0x977D1F01eC78815d1F5b501e022c2A498AD84bd4",
        "PriceAggregator": "0x1686e4a89C59aa669a61259655E83101fF5371bf",
        "CrossMarginPortfolioController": "0xcBc1B09C6906708aE4244EB4615cc593c4f91264",
        "PortfolioLibrary": "0x04b2A5e54Ea904E5b095A15D170773bD7E4D759d",
        "PortfolioLibraryExternal": "0x80c883477D16929367012144c823F82f28BA60e8",
        "RiskController": "0x66Ded395E1E6D4f1Fabd0e7EC92c9D1a5946B564",
        "OIAndPnLManager": "0x018Df6177118C9F89F0450384a46Dd53c3C03bCc",
        "CMPLiabilityManager": "0xeD7A5c2a93147a7A721Dfd2db1a8AA9B71dC1677",
        "CMPLiabilityController": "0xeD7A5c2a93147a7A721Dfd2db1a8AA9B71dC1677",
        "CMPLiabilityInterestManager": "0x7cAb679620980c5E7F0E5C14C1E5323D16d720FC",
        "CMPAutoRepayManager": "0x40237a4278a7de7F57330061306b91C8e403102a",
        "Trading": "0x0a3bF1Af83B3E74E500f6522809bF874a2D3B07F",
        "CLPriceVerifierHelper": "0x5D1A4235Abf78d751B5DB2dB9A0CF3e5Cb394c5b",
        "IMPController": "0x19C002Db00907b3090f507186fDEC4090149628f",
        "CMPController": "0xcBc1B09C6906708aE4244EB4615cc593c4f91264",
        "FeeManager": "0x55a369d35e94090f85d0E265BEebec0Ed485b93F",
        "SpreadManager": "0x02158D9F67f1c0a31a8724F6369353DcA2D3a030",
        "Logger": "0x73470Ab2872f9FeC9C143aF5EdD9df00778Fce9B"
    },
    "Earn": {
        "Vault": {
            "USDC": "0xd29B5CDe4b632bFf0c84Af85356Fe7b67E318735"
        },
        "NFTManager": {
            "USDC": "0x0A0CaCAe054A518e65e0Fc22D86B9062685338aA",
            "WETH": "0xE5793a1293eb310f43Ad2c430a367c9F73a6F780",
            "WBTC": "0xe163ab424BBb99abE236e22ab5fE658EED635B8e"
        }
    }
};

export default ContractAddressConfig_BaseSepolia;
