import { useState } from "react";
import { useSelector } from "react-redux";
import { useUserProviderAndSigner } from "eth-hooks";

import useStaticJsonRPC from "./useStaticJsonRPC";

import { getTargetNetwork } from "../store/networkSlice";

import { ALCHEMY_KEY, USE_BURNER_WALLET } from "../constants";

// 🛰 providers
const PROVIDERS = [
  "https://eth-mainnet.gateway.pokt.network/v1/lb/611156b4a585a20035148406",
  `https://eth-mainnet.alchemyapi.io/v2/${ALCHEMY_KEY}`,
  "https://rpc.scaffoldeth.io:48544",
];

const useBlockchainProvider = () => {
  const targetNetwork = useSelector(getTargetNetwork);
  const [injectedProvider, setInjectedProvider] = useState();
  const localProvider = useStaticJsonRPC([
    process.env.REACT_APP_PROVIDER ? process.env.REACT_APP_PROVIDER : targetNetwork.rpcUrl,
  ]);
  const mainnetProvider = useStaticJsonRPC(PROVIDERS);

  // Use your injected provider from 🦊 Metamask or if you don't have it then instantly generate a 🔥 burner wallet.
  const userProviderAndSigner = useUserProviderAndSigner(injectedProvider, null, USE_BURNER_WALLET);
  const userSigner = userProviderAndSigner.signer;

  return [injectedProvider, localProvider, mainnetProvider, userSigner, setInjectedProvider];
};

export default useBlockchainProvider;
