import React from "react";
import { useSelector } from "react-redux";

import { Layout } from "antd";
import { ethers } from "ethers";

import { getAddress } from "../store/accountSlice";
import { getTargetNetwork } from "../store/networkSlice";
import { isDebugMode } from "../store/appConfigSlice";

import Account from "../components/Account";
import FaucetHint from "../components/FaucetHint";
import NetworkDisplay from "../components/NetworkDisplay";

const { Header } = Layout;

const TopBar = ({
  useBurnerWallet,
  networkCheck,
  localProvider,
  mainnetProvider,
  price,
  userSigner,
  blockExplorer,
  yourLocalBalance,
}) => {
  const address = useSelector(getAddress);
  const targetNetwork = useSelector(getTargetNetwork);
  const debug = useSelector(isDebugMode);

  const localChainId = localProvider && localProvider._network && localProvider._network.chainId;
  const selectedChainId =
    userSigner && userSigner.provider && userSigner.provider._network && userSigner.provider._network.chainId;

  return (
    <Header>
      <h3 className="logo t-c-w">ETH Poller</h3>
      {address && (
        <Account
          useBurner={useBurnerWallet}
          address={address}
          localProvider={localProvider}
          userSigner={userSigner}
          mainnetProvider={mainnetProvider}
          price={price}
          blockExplorer={blockExplorer}
        />
      )}
      {debug && address && yourLocalBalance.lte(ethers.BigNumber.from("0")) && (
        <FaucetHint localProvider={localProvider} targetNetwork={targetNetwork} address={address} />
      )}
      {address && (
        <NetworkDisplay
          NETWORKCHECK={networkCheck}
          localChainId={localChainId}
          selectedChainId={selectedChainId}
          targetNetwork={targetNetwork}
          USE_NETWORK_SELECTOR={false}
        />
      )}
    </Header>
  );
};

export default TopBar;
