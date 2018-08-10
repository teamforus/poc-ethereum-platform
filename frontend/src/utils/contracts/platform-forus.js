module.exports = [
    {
        "constant": true,
        "inputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "tokens",
        "outputs": [
            {
                "name": "",
                "type": "address"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "assets",
        "outputs": [
            {
                "name": "",
                "type": "address"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "name": "_asset",
                "type": "address"
            },
            {
                "indexed": false,
                "name": "_owner",
                "type": "address"
            }
        ],
        "name": "AssetAdded",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "name": "_token",
                "type": "address"
            },
            {
                "indexed": false,
                "name": "sponsor",
                "type": "address"
            }
        ],
        "name": "TokenAdded",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "name": "_token",
                "type": "address"
            },
            {
                "indexed": false,
                "name": "sponsor",
                "type": "address"
            },
            {
                "indexed": false,
                "name": "requester",
                "type": "address"
            },
            {
                "indexed": false,
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "VoucherGranted",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "name": "_token",
                "type": "address"
            },
            {
                "indexed": false,
                "name": "sponsor",
                "type": "address"
            },
            {
                "indexed": false,
                "name": "provider",
                "type": "address"
            },
            {
                "indexed": false,
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "TokenReturned",
        "type": "event"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "_asset",
                "type": "address"
            }
        ],
        "name": "assetExists",
        "outputs": [
            {
                "name": "_exists",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "_token",
                "type": "address"
            }
        ],
        "name": "tokenExists",
        "outputs": [
            {
                "name": "_exists",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_token",
                "type": "address"
            },
            {
                "name": "_sponsor",
                "type": "address"
            }
        ],
        "name": "requestFund",
        "outputs": [
            {
                "name": "success",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "name",
                "type": "string"
            }
        ],
        "name": "createAsset",
        "outputs": [
            {
                "name": "newAsset",
                "type": "address"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "providerIdentity",
                "type": "address"
            },
            {
                "name": "_token",
                "type": "address"
            }
        ],
        "name": "addProvider",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "validated",
                "type": "address"
            },
            {
                "name": "key",
                "type": "bytes32"
            },
            {
                "name": "operator",
                "type": "bytes2"
            },
            {
                "name": "value",
                "type": "bytes32"
            }
        ],
        "name": "addValidationRule",
        "outputs": [
            {
                "name": "success",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "name",
                "type": "string"
            },
            {
                "name": "fundSize",
                "type": "uint256"
            },
            {
                "name": "supplySize",
                "type": "uint256"
            },
            {
                "name": "expires",
                "type": "uint256"
            }
        ],
        "name": "createToken",
        "outputs": [
            {
                "name": "newToken",
                "type": "address"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "validated",
                "type": "address"
            }
        ],
        "name": "enable",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "assetsLength",
        "outputs": [
            {
                "name": "_length",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "tokensLength",
        "outputs": [
            {
                "name": "_length",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    }
];