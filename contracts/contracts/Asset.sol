pragma solidity ^0.4.24;

import { ERC20 } from "./ERC20.sol";
import { Validated } from "./Validated.sol";

contract Asset is Validated {
    
    string private _name;

    constructor(address owner, string name) public Validated(owner) {
        _name = name;
    }

    function getName() public view returns (string name) {
        return _name;
    }

    function sell(address _to, ERC20 _token, uint _price) public requiresOwner(msg.sender) returns (bool success) {
        require(_token.allowance(_to, address(this)) >= _price);
        require(validate(_to));
        _token.transferFrom(_to, owner, _price);
        setOwner(_to);
        return true;
    }

}