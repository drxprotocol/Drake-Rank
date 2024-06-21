const Trading_abi = [
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_portfolio",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "_pendingOrdId",
                "type": "uint256"
            }
        ],
        "name": "executePendingOrder",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_portfolio",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "_instId",
                "type": "uint256"
            }
        ],
        "name": "liquidatePosition",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
];
export default Trading_abi;
