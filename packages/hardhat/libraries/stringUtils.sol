pragma solidity >=0.8.0 <0.9.0;
//SPDX-License-Identifier: MIT

library StringUtils{
    function equals(string memory self, string memory other) internal pure returns (bool) {
        return keccak256(bytes(self)) == keccak256(bytes(other));
    }
}
