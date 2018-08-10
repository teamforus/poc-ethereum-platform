module.exports = [
    {
        "inputs": [
            {
                "name": "_account",
                "type": "address"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "name": "_key",
                "type": "bytes32"
            },
            {
                "indexed": false,
                "name": "_claimPlacer",
                "type": "bytes32"
            }
        ],
        "name": "RecordAdded",
        "type": "event"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_newDelegate",
                "type": "address"
            }
        ],
        "name": "addDelegate",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_caller",
                "type": "address"
            },
            {
                "name": "_key",
                "type": "bytes32"
            },
            {
                "name": "_until",
                "type": "uint256"
            }
        ],
        "name": "addPermission",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_key",
                "type": "bytes32"
            },
            {
                "name": "_value",
                "type": "bytes32"
            }
        ],
        "name": "addRecord",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "_key",
                "type": "bytes32"
            },
            {
                "name": "_byValidator",
                "type": "address"
            }
        ],
        "name": "getRecord",
        "outputs": [
            {
                "name": "_success",
                "type": "bool"
            },
            {
                "name": "_value",
                "type": "bytes32"
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
                "name": "_caller",
                "type": "address"
            },
            {
                "name": "_key",
                "type": "bytes32"
            }
        ],
        "name": "hasPermission",
        "outputs": [
            {
                "name": "_hasPermission",
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
                "name": "_caller",
                "type": "address"
            },
            {
                "name": "_key",
                "type": "bytes32"
            }
        ],
        "name": "hasPermissionUntil",
        "outputs": [
            {
                "name": "_timestamp",
                "type": "uint256"
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
                "name": "account",
                "type": "address"
            }
        ],
        "name": "isOwner",
        "outputs": [
            {
                "name": "",
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
                "name": "newOwner",
                "type": "address"
            }
        ],
        "name": "recover",
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
                "name": "_delegate",
                "type": "address"
            }
        ],
        "name": "removeDelegate",
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
                "name": "_caller",
                "type": "address"
            },
            {
                "name": "_key",
                "type": "bytes32"
            }
        ],
        "name": "removePermission",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_key",
                "type": "bytes32"
            }
        ],
        "name": "unsetRecord",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    }
];