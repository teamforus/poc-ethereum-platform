pragma solidity ^0.4.24;

contract Owned {
    event NewOwner(address newOwner);

    address public owner;

    modifier requiresOwner(address identity) {
        require(isOwner(identity));
        _;
    }

    constructor (address _owner) public {
        owner = _owner;
    }

    function isOwner(address identity) public view returns (bool) {
        return owner == identity;
    }

    function setOwner(address identity) public requiresOwner(msg.sender) {
        owner = identity; 
    }
}