import { useSelector } from "react-redux";
import { useContractLoader, useGasPrice } from "eth-hooks";

// contracts
import externalContracts from "../contracts/external_contracts";
import deployedContracts from "../contracts/hardhat_contracts.json";

import { getTargetNetwork } from "../store/networkSlice";

import { Transactor } from "../helpers";

const contractConfig = { deployedContracts: deployedContracts || {}, externalContracts: externalContracts || {} };

const useEPContract = (userSigner, localChainId) => {
  // Load in your local 📝 contract and read a value from it:
  const readContracts = useContractLoader(userSigner, contractConfig, localChainId);

  // If you want to make 🔐 write transactions to your contracts, use the userSigner:
  const writeContracts = useContractLoader(userSigner, contractConfig, localChainId);

  /* 🔥 This hook will get the price of Gas from ⛽️ EtherGasStation */
  const targetNetwork = useSelector(getTargetNetwork);
  const gasPrice = useGasPrice(targetNetwork, "fast");

  // The transactor wraps transactions and provides notificiations
  const tx = Transactor(userSigner, gasPrice);

  return [readContracts, writeContracts, tx];
};

export default useEPContract;
