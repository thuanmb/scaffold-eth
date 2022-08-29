pragma solidity >=0.8.0 <0.9.0;
//SPDX-License-Identifier: MIT

import "hardhat/console.sol";
// import "@openzeppelin/contracts/access/Ownable.sol";
// https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol

contract YourContract {

  struct Commit {
    bytes32 hashData;
    uint64 blockNumber;
    bool isRevealed;
  }

  mapping(address => Commit) public commits;

  uint8 public constant maxRandomNum = 100;

  event CommitHash(address sender, bytes32 dataHash, uint64 blockNumber);
  event RevealHash(address sender, bytes32 revealData, uint8 randomNum);

  function getHash(bytes32 data) public view returns(bytes32) {
    return keccak256(abi.encodePacked(address(this), data));
  }

  function commit(bytes32 hashData, uint64 blockNumber) public {
    require(blockNumber > block.number, "CommitReveal::commit: The block number is greater than current block number");
    commits[msg.sender].hashData = hashData;
    commits[msg.sender].blockNumber = blockNumber;
    commits[msg.sender].isRevealed = false;

    emit CommitHash(msg.sender, hashData, blockNumber);
  }

  function reveal(bytes32 revealData) public {
    require(!commits[msg.sender].isRevealed, "CommitReveal::reveal: Already revealed");
    require(commits[msg.sender].hashData == getHash(revealData), "CommitReveal::reveal: The reveal hash is different from committed hash");

    commits[msg.sender].isRevealed = true;
    bytes32 blockHash = blockhash(commits[msg.sender].blockNumber);
    uint8 randomNum = uint8(uint(keccak256(abi.encodePacked(blockHash, revealData)))) % maxRandomNum;

    emit RevealHash(msg.sender, revealData, randomNum);
  }
}
