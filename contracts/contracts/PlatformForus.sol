pragma solidity ^0.4.24;

import { Asset } from "./Asset.sol";
import { Identity } from "./Identity.sol";
import { Token } from "./Token.sol"; 
import { Validated } from "./Validated.sol";

contract PlatformForus {

    event AssetAdded(Asset _asset, address _owner);
    event TokenAdded(address _token, address sponsor);

    event VoucherGranted(address _token, address sponsor, address requester, uint amount);
    event TokenReturned(address _token, address sponsor, address provider, uint amount);

    address _owner;

    Asset[] public assets;
    Token[] public tokens;

    constructor() public {
        _owner = msg.sender;
    }

    function assetExists(Asset _asset) public view returns (bool _exists) {
        for (uint i = 0; i < assets.length; i++) {
            if (address(_asset) == address(assets[i])) {
                return true;
            }
        }
        return false;
    }

    function tokenExists(Token _token) public view returns (bool _exists) {
        for (uint i = 0; i < tokens.length; i++) {
            if (address(_token) == address(tokens[i])) {
                return true;
            }
        }
        return false;
    }

    /*** Requester methods */

    function requestFund(Token _token, address _sponsor) public returns (bool success) {
        if (_token.requestFor(_sponsor, msg.sender)) {
            emit VoucherGranted(_token, _token.owner(), msg.sender, _token.fundSize());
            return true;
        } 
        return false;
    } 

    /*** Provider methods */

    /***
        For "addValidationRule", see Sponsor methods
     */

    function createAsset(string name) public returns (Asset newAsset) {
        uint index = assets.push(new Asset(msg.sender, name));
        emit AssetAdded(assets[index], msg.sender);
        return assets[index];
    }

    /*** SPONSOR METHODS */
    function addProvider(Identity providerIdentity, Token _token) public {
        require(_token.isOwner(msg.sender));
        require(tokenExists(_token));
        _token.addProvider(providerIdentity);
    }

    function addValidationRule(Validated validated, bytes32 key, bytes2 operator, bytes32 value) public returns (bool success) {
        require(validated.isOwner(msg.sender));
        return (validated.addValidationRule(key, operator, value) > 0);
    }

    function createToken(string name, uint fundSize, uint supplySize, uint expires) public returns (Token newToken) {
        uint index = tokens.length;
        tokens.push(new Token(name, msg.sender, fundSize, supplySize, expires));
        emit TokenAdded(tokens[index], msg.sender);
        return tokens[index];
    }

    function enable(Validated validated) public {
        require(validated.isOwner(msg.sender));
        validated.enable();
    }

    function assetsLength() public view returns (uint _length) {
        return assets.length;
    }

    function tokensLength() public view returns (uint _length) {
        return tokens.length;
    }
}