import React from "react";

import { Layout, Menu } from "antd";
import { NetworkSwitch, Account, FaucetHint, NetworkDisplay } from "../components";
import { ethers } from "ethers";

const { Header } = Layout;

const menuItems = [
  { key: "surveys", label: "Surveys" },
  { key: "responses", label: "Responses" },
];

const TopBar = ({
  useNetworkSelector,
  useBurnerWallet,
  networkCheck,
  networkOptions,
  targetNetwork,
  selectedNetwork,
  setSelectedNetwork,
  localProvider,
  mainnetProvider,
  address,
  price,
  userSigner,
  web3Modal,
  loadWeb3Modal,
  logoutOfWeb3Modal,
  blockExplorer,
  yourLocalBalance,
}) => {
  const localChainId = localProvider && localProvider._network && localProvider._network.chainId;
  const selectedChainId =
    userSigner && userSigner.provider && userSigner.provider._network && userSigner.provider._network.chainId;

  return (
    <Header>
      <h3 className="logo t-c-w">ETH Poller</h3>
      <Menu theme="dark" mode="horizontal" defaultSelectedKeys={["surveys"]} items={menuItems} />
      {useNetworkSelector && (
        <div style={{ marginRight: 20 }}>
          <NetworkSwitch
            networkOptions={networkOptions}
            selectedNetwork={selectedNetwork}
            setSelectedNetwork={setSelectedNetwork}
          />
        </div>
      )}
      <Account
        useBurner={useBurnerWallet}
        address={address}
        localProvider={localProvider}
        userSigner={userSigner}
        mainnetProvider={mainnetProvider}
        price={price}
        web3Modal={web3Modal}
        loadWeb3Modal={loadWeb3Modal}
        logoutOfWeb3Modal={logoutOfWeb3Modal}
        blockExplorer={blockExplorer}
      />
      {yourLocalBalance.lte(ethers.BigNumber.from("0")) && (
        <FaucetHint localProvider={localProvider} targetNetwork={targetNetwork} address={address} />
      )}
      <NetworkDisplay
        NETWORKCHECK={networkCheck}
        localChainId={localChainId}
        selectedChainId={selectedChainId}
        targetNetwork={targetNetwork}
        logoutOfWeb3Modal={logoutOfWeb3Modal}
        USE_NETWORK_SELECTOR={useNetworkSelector}
      />
    </Header>
  );
};

export default TopBar;
