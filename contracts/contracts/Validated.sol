pragma solidity ^0.4.17;

import { Identity } from "./Identity.sol";
import { Owned } from "./Owned.sol";

contract Validated is Owned {
    bool public enabled = false;
    ValidationRule[] private validationRules;

    event Enabled();
    event ValidationRuleAdded(uint _index, bytes32 _key, bytes2 _operator, bytes32 _value);
    event ValidationRuleRemoved(uint _index);

    struct ValidationRule {
        bytes32 key;
        bytes2 operator;
        bytes32 comparison;
    }

    modifier cannotBeEnabled() {
        require (!enabled);
        _;
    }

    modifier mustBeEnabled() {
        require (enabled);
        _;
    }

    modifier requiresPermissionFrom(Identity _identity, bytes32 _key) {
        require (hasPermission(_identity, _key));
        _;
    }

    constructor(address _owner) public Owned(_owner) {}

    function addValidationRule(bytes32 _key, bytes2 _operator, bytes32 _value) public 
                requiresOwner(msg.sender) cannotBeEnabled() returns (uint _index) {
        require (isValidOperator(_operator));
        ValidationRule memory newRule = ValidationRule({key: _key, operator: _operator, comparison: _value});
        uint newLength = validationRules.push(newRule);
        emit ValidationRuleAdded(newLength-1, _key, _operator, _value);
        return newLength-1;
    }

    function enable() public requiresOwner(msg.sender) cannotBeEnabled() {
        enabled = true; 
        emit Enabled();
    }

    function getValidOperators() public pure returns (bytes2[6] _operators) {
        bytes2[6] memory ret;
        ret[0] = 0x3c00; // <
        ret[1] = 0x3c3d; // <=
        ret[2] = 0x3d3d; // ==
        ret[3] = 0x3e3d; // >=
        ret[4] = 0x3e00; // >
        ret[5] = 0x213d; // !=
        return ret;
    }

    function hasPermission(Identity _identity, bytes32 _key) public view returns (bool _hasPermission) {
        return _identity.hasPermission(address(this), _key);
    }

    function isRequiredPermission(bytes32 _key) public view returns (bool _isRequiredPermission) {
        for (uint i = 0; i < validationRules.length; i++) {
            if (_key == validationRules[i].key) {
                return true;
            }
        }
        return false;
    }

    function isValidOperator(bytes2 _operator) public pure returns (bool _isValidOperator) {
        bytes2[6] memory operators = getValidOperators();
        for (uint i = 0; i < operators.length; i++) {
            if (_operator == operators[i]) {
                return true;
            }
        }
        return false;
    }

    function removeValidationRule(uint _index) public requiresOwner(msg.sender) cannotBeEnabled() {
        delete validationRules[_index];
    }

    function validate(address _identity) public mustBeEnabled() view returns (bool isValid) {
        for (uint i = 0; i < validationRules.length; i++) {
            if (validationRules[i].operator != 0x0000) {
                if (!validateValue(Identity(_identity), i)) {
                    return false;
                }
            }
        }
        return true; 
    }

    function validateValue(Identity _identity, uint _ruleIndex) private view returns (bool isValid) {
        ValidationRule memory rule = validationRules[_ruleIndex];
        if (rule.operator > 0) {
            bool success;
            bytes32 value;
            ( success, value ) = _identity.getRecord(rule.key, 0x0);
            bytes2 operator = rule.operator;
            if (success) {
                if (operator == 0x3e3d) {               // >=
                    return value >= rule.comparison;
                } else if (operator == 0x3c3d) {        // <=
                    return value <= rule.comparison;
                } else if (operator == 0x3d3d) {        // ==
                    return value == rule.comparison;
                } else if (operator == 0x213d) {        // !=
                    return value != rule.comparison;
                } else if (operator == 0x3e00) {        //  > 
                    return value > rule.comparison;
                } else if (operator == 0x3c00) {        //  <
                    return value < rule.comparison;
                } 
            }
        }
        return false;
    }
}