import React, { useState } from "react";
import { List, Card, Input, Button, Typography } from "antd";
import { constants, utils } from "ethers";

import { Address, BytesStringInput } from "../components";

const { Text } = Typography;

function CommitReveal({ commitEvents, revealEvents, mainnetProvider, readContracts, writeContracts, tx }) {
  const [hashData, setHashData] = useState(constants.HashZero);
  const [commitHash, setCommitHash] = useState("");
  const [blockNumber, setBlockNumber] = useState(-1);

  const [revealData, setRevealData] = useState(constants.HashZero);
  const [revealHash, setRevealHash] = useState("");

  const getHash = hashData => {
    return utils.solidityKeccak256(["address", "bytes32"], [readContracts.YourContract.address, hashData]);
  };

  const onCommit = () => {
    tx(writeContracts.YourContract.commit(commitHash, blockNumber));
  };

  const onReveal = () => {
    tx(writeContracts.YourContract.reveal(revealData));
  };

  return (
    <div style={{ margin: "auto", width: "70vw" }}>
      <Card title="Commit" size="large" style={{ marginTop: 25, width: "100%" }}>
        <BytesStringInput
          autofocus
          value={hashData}
          placeholder="Enter value..."
          onChange={function(value) {
            setHashData(value);
            const hash = getHash(value);
            setCommitHash(hash);
          }}
        />
        <Text copyable={{ text: commitHash }}> {commitHash} </Text>
        <Input
          value={blockNumber}
          onChange={e => setBlockNumber(e.target.value)}
          placeholder="Set block number..."
          style={{ marginTop: "15px" }}
        />
        <Button onClick={onCommit} style={{ marginTop: "15px" }}>
          Commit
        </Button>
      </Card>

      <Card title="Reveal" size="large" style={{ marginTop: 25, width: "100%" }}>
        <BytesStringInput
          autofocus
          value={revealData}
          placeholder="Enter reveal data..."
          onChange={function(value) {
            setRevealData(value);
            const hash = getHash(value);
            setRevealHash(hash);
          }}
        />
        <Text copyable={{ text: revealHash }}> {revealHash} </Text>
        <Button onClick={onReveal} style={{ marginTop: "15px" }}>
          Reveal
        </Button>
      </Card>

      <Card title="Commit Events" size="large" style={{ marginTop: 25, width: "100%" }}>
        <List
          bordered
          dataSource={commitEvents}
          renderItem={item => {
            return (
              <List.Item style={{ overflow: "scroll" }}>
                <Address value={item.args.sender} ensProvider={mainnetProvider} fontSize={16} /> =>
                {item.args.dataHash}
              </List.Item>
            );
          }}
        />
      </Card>
      <Card title="Reveal Events" size="large" style={{ marginTop: 25, width: "100%" }}>
        <List
          bordered
          dataSource={revealEvents}
          renderItem={item => {
            return (
              <List.Item style={{ overflow: "scroll" }}>
                <Address value={item.args.sender} ensProvider={mainnetProvider} fontSize={16} /> =>
                {item.args.revealData}
                <h4>Random number: {item.args.randomNum}</h4>
              </List.Item>
            );
          }}
        />
      </Card>
    </div>
  );
}

export default CommitReveal;
