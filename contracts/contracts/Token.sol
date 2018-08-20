pragma solidity ^0.4.24;

import { ERC20 } from "./ERC20.sol";
import { Identity } from "./Identity.sol";
import { Validated } from "./Validated.sol";

contract Token is ERC20, Validated {

    event ProviderAdded(address _provider);
    event ProviderApplicationReceived(address _applicationAddress);

    // TODO perhaps this should be decided in the constructor.
    uint constant private DECIMALS = 2;

    uint public expiresOn;
    uint public fundSize;
    string public name;
    address[] public providers;
    uint private maximum;
    mapping (address => mapping(address => uint)) vouchers;
    mapping (address => uint) private wallets;

    modifier notExpired() {
        require(!isExpired(block.timestamp), "101:tokenExpired");
        _;
    }

    modifier providerApproved(address _identity) {
        require(isProvider(_identity), "102:providerNotApproved");
        _;
    }

    modifier requiresAllowance(address tokenOwner, address spender, uint amount) {
        require(allowance(tokenOwner, spender) >= amount, "103:allowanceNotSufficient");
        _;
    }

    modifier requiresSufficientFund(address sender, uint amount) {
        require(wallets[sender] >= amount, "104:balanceNotSufficient");
        _;
    }

    constructor(string _name, address _owner, uint _fundSize, uint _initialBalance, uint _expires) public Validated(_owner) {
        name = _name;
        fundSize = _fundSize;
        maximum = _initialBalance;
        wallets[_owner] = _initialBalance;
        expiresOn = _expires;
    }

    function addProvider(address _provider) public 
        	    notExpired() mustBeEnabled()  requiresOwner(msg.sender) returns (uint _index) {
        require(!isProvider(_provider), "105:cannotApproveApprovedProvider");
        return providers.push(_provider);
    }

    function allowance(address _tokenOwner, address _spender) public view returns (uint _remaining) {
        return vouchers[_tokenOwner][_spender];
    }

    function applyForProvider() public {
        require(!isProvider(msg.sender), "107:approvedProviderCannotApply");
        emit ProviderApplicationReceived(msg.sender);
    }

    function approve(address _spender, uint _tokens) public 
                requiresSufficientFund(msg.sender, _tokens - vouchers[msg.sender][_spender]) returns (bool _success) {
        // Return remaining allowance, basically a reset.
        wallets[msg.sender] += vouchers[msg.sender][_spender];
        wallets[msg.sender] -= _tokens;
        vouchers[msg.sender][_spender] = _tokens;
        return true;
    }
 
    function balanceOf(address _identity) public view returns (uint _balance) {
        return (wallets[_identity]);
    }

    function isExpired(uint _now) public view returns (bool _isExpired) {
        return _now > expiresOn;
    }

    function isProvider(address _identity) public view returns (bool _valid) {
        for (uint i = 0; i < providers.length; i++) {
            if (address(providers[i]) == _identity) {
                return true;
            }
        }
        return false;
    }

    function providerCount() public view returns (uint _count) {
        return providers.length;
    }

    function removeProvider(address _provider) public notExpired() mustBeEnabled() requiresOwner(msg.sender) {
        for (uint i = 0; i < providers.length; i++) {
            if (providers[i] == _provider) {
                delete providers[i];
                return;
            }
        }
        // No changes, undo and refund gas
        revert();
    }

    function requestFor(address _sponsor, address _identity) public 
                notExpired() mustBeEnabled() requiresSufficientFund(_sponsor, fundSize) returns (bool _success) {
        require (validate(_identity), "109:doesNotMeetValidationRules");
        vouchers[_sponsor][_identity] += fundSize;
        wallets[_sponsor] -= fundSize;
        emit Approval(_sponsor, _identity, fundSize);
        return true;
    }

    function totalSupply() public view returns (uint _totalSupply) {
        return maximum;
    }

    function transfer(address _to, uint _amount) public requiresSufficientFund(msg.sender, _amount) returns (bool _success) {
        wallets[msg.sender] -= _amount;
        wallets[_to] += _amount;
        return true;
    }

    function transferFrom(address _from, address _to, uint _amount) public 
                providerApproved(_to) requiresAllowance(_from, msg.sender, _amount) returns (bool _success) {
        vouchers[_from][msg.sender] -= _amount;
        wallets[_to] += _amount;
        return true;
    }
}