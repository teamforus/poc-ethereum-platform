pragma solidity ^0.4.24;

contract Identity {

    event RecordAdded(bytes32 _key, bytes32 _claimPlacer);

    modifier requiresDelegate(address mender) {
        require(isDelegate(mender));
        _;    
    }

    modifier requiresOwner() {
        require(isOwner(msg.sender));
        _;
    }

    modifier requiresPermission(address _sender, bytes32 _key) {
        require(hasPermission(_sender, _key));
        _;
    }

    address owner;
    address[] private delegates;
    // key => (caller => permission until timestamp)
    mapping (bytes32 => mapping(address => uint)) permissions;
    // key => (he-who-claims => value)
    mapping (bytes32 => mapping(address => bytes32)) records;

    struct Voting {
        // Validator/voter => value
        uint highestVote;
        mapping (address => uint8) votes;
        address[] validators;
    }

    constructor (address _account) public {
        owner = _account;
    }

    function addDelegate(address _newDelegate) public requiresOwner() {
        require(!isDelegate(_newDelegate));
        delegates.push(_newDelegate);
    }

    function addPermission(address _caller, bytes32 _key, uint _until) public requiresOwner() {
        permissions[_key][_caller] = _until;
    }

    function addRecord(bytes32 _key, bytes32 _value) public {
        records[_key][msg.sender] = _value;
    }

    function getDelegates() private view returns (address[] _delegates) {
        return delegates;
    }

    function getRecord(bytes32 _key, address _byValidator) public 
                view requiresPermission(msg.sender, _key) returns (bool _success, bytes32 _value) {
        address validator = _byValidator;
        if (validator == 0x0) {
            validator = owner;
        }
        return (true, records[_key][validator]);
    }

    function hasPermission(address _caller, bytes32 _key) public view returns(bool _hasPermission) {
        return  isOwner(_caller) || permissions[_key][_caller] >= block.timestamp;
    }

    function hasPermissionUntil(address _caller, bytes32 _key) public view returns (uint _timestamp) {
        return permissions[_key][_caller];
    }

    function isDelegate(address _account) private view returns (bool _isDelegate) {
        address[] memory _delegates = getDelegates();
        for (uint i = 0; i < _delegates.length; i++) {
            if (_account == _delegates[i]) {
                return true;
            }
        }
        return false;
    }

    function isOwner(address account) public view returns(bool) {
        return account == owner;
    }

    function recover(address newOwner) public returns (bool success) {
        if (isDelegate(msg.sender) || isOwner(msg.sender)) {
            owner = newOwner;
            return true;
        }
        return false;
    }

    function removeDelegate(address _delegate) public returns (bool success) {
        if (isOwner(msg.sender) || (isDelegate(msg.sender) && msg.sender == _delegate)) {
            for (uint i = 0; i < delegates.length; i++) {
                if (delegates[i] == _delegate) {
                    delete delegates[i];
                    return true;
                }
            }
        }
        return false;
    }

    function removePermission(address _caller, bytes32 _key) public requiresOwner() {
        permissions[_key][_caller] = 0;
    }

    function unsetRecord(bytes32 _key) public {
        delete records[_key][msg.sender];
    }
    
}