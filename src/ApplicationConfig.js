import { ethers } from 'ethers';

const RPC_URL_Mapping = {
    RPCForBaseSepoliaTestNet: process.env.RPC_BASE_SEPOLIA || 'https://sepolia.base.org',
};
const provider = new ethers.providers.JsonRpcProvider(RPC_URL_Mapping.RPCForBaseSepoliaTestNet);

const defaultMulticall3ContractOnBaseSepolia = {
    address: '0xcA11bde05977b3631167028862bE2a173976CA11',
    blockCreated: 1059647,
};

export default {
    provider,

    RPCForBaseSepoliaTestNet: RPC_URL_Mapping.RPCForBaseSepoliaTestNet,

    chainConfigForBaseSepoliaTestNet: {
        chainId: 84532,
        chainName: 'Base Sepolia',
        isTestChain: true,
        isLocalChain: false,
        multicallAddress: '0x1b39523b4016f8898EE41aC1a6B2BD7186C6cdAE',
        multicall2Address: '0xF82D64357D9120a760e1E4C75f646C0618eFc2F3',
        multicall3: defaultMulticall3ContractOnBaseSepolia,
        getExplorerAddressLink: (address) => `https://sepolia.basescan.org/address/${address}`,
        getExplorerTransactionLink: (transactionHash) => `https://sepolia.basescan.org/tx/${transactionHash}`,
        // Optional parameters:
        rpcUrl: RPC_URL_Mapping.RPCForBaseSepoliaTestNet,
        blockExplorerUrl: 'https://sepolia.basescan.org',
        nativeCurrency: {
            name: 'Base ETH',
            symbol: 'ETH',
            decimals: 18,
        },
    },

    serverPort: 9027,

    emptyContractAddress: '0x0000000000000000000000000000000000000000',
    maxAmountOnChain: '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',

    // backend config

};
