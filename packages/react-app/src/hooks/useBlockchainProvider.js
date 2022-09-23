import { useState } from "react";
import { useSelector } from "react-redux";
import { useUserProviderAndSigner } from "eth-hooks";

import useStaticJsonRPC from "./useStaticJsonRPC";

import { getTargetNetwork } from "../store/networkSlice";

import { USE_BURNER_WALLET, PROVIDERS } from "../constants";

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
