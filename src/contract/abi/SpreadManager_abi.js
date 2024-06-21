const SpreadManager_abi = [
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_asset",
                "type": "address"
            },
            {
                "components": [
                    {
                        "internalType": "uint256",
                        "name": "onePercentDepthBid",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "onePercentDepthAsk",
                        "type": "uint256"
                    }
                ],
                "internalType": "struct SpreadManager.OnePercentDepth",
                "name": "_onePercentDepth",
                "type": "tuple"
            }
        ],
        "name": "setOnePercentDepth",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
];
export default SpreadManager_abi;
