import React, { useEffect } from "react";
import "antd/dist/antd.css";
import "./App.css";

import { Router, Route, Redirect, useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { ethers } from "ethers";
import { useBalance } from "eth-hooks";
import { useExchangeEthPrice } from "eth-hooks/dapps/dex";

import { Layout } from "antd";

import TopBar from "./views/TopBar";
import SurveysPage from "./views/SurveysPage";
import SurveyCreatePage from "./views/SurveyCreatePage";
import ConnectWalletPage from "./views/ConnectWalletPage";

import AuthorizedRoute from "./components/AuthorizedRoute";

import useBlockchainProvider from "./hooks/useBlockchainProvider";
import useEPContract from "./hooks/useEPContract";
import useGetSurveys from "./hooks/useGetSurveys";

import { getAddress, setAddress } from "./store/accountSlice";
import { getTargetNetwork } from "./store/networkSlice";
import { isDebugMode } from "./store/appConfigSlice";

import { USE_BURNER_WALLET, NETWORKCHECK } from "./constants";

// ------------------------------------------------------------------------------
const DEBUG = true;

const { Content, Footer } = Layout;

const App = () => {
  const history = useHistory();
  const dispatch = useDispatch();

  const address = useSelector(getAddress);
  const targetNetwork = useSelector(getTargetNetwork);
  const debug = useSelector(isDebugMode);

  // 🔭 block explorer URL
  const blockExplorer = targetNetwork.blockExplorer;

  // load all your providers
  const [injectedProvider, localProvider, mainnetProvider, userSigner, setInjectedProvider] = useBlockchainProvider();

  /* 💵 This hook will get the price of ETH from 🦄 Uniswap: */
  const price = useExchangeEthPrice(targetNetwork, mainnetProvider);

  useEffect(() => {
    async function getAddress() {
      if (userSigner) {
        const newAddress = await userSigner.getAddress();
        dispatch(setAddress(newAddress));
      }
    }
    getAddress();
  }, [userSigner, dispatch]);

  // 🏗 scaffold-eth is full of handy hooks like this one to get your balance:
  const yourLocalBalance = useBalance(localProvider, address);
  const yourMainnetBalance = useBalance(mainnetProvider, address);

  // setup readContracts and writeContracts
  const localChainId = localProvider && localProvider._network && localProvider._network.chainId;
  const [readContracts, writeContracts, tx] = useEPContract(userSigner, localChainId);

  // trigger get the survey list
  useGetSurveys(readContracts);

  //
  // 🧫 DEBUG 👨🏻‍🔬
  //
  useEffect(() => {
    if (DEBUG) {
      console.log("_____________________________________ 🏗 scaffold-eth _____________________________________");
      console.log("🌎 mainnetProvider", mainnetProvider);
      console.log("👩‍💼 selected address:", address);
      console.log("💵 yourLocalBalance", yourLocalBalance ? ethers.utils.formatEther(yourLocalBalance) : "...");
      console.log("💵 yourMainnetBalance", yourMainnetBalance ? ethers.utils.formatEther(yourMainnetBalance) : "...");
      console.log("userSigner", userSigner);
    }
  }, [mainnetProvider, address, yourLocalBalance, yourMainnetBalance, userSigner]);

  const routesOnProdMode = [
    <Redirect from="*" to="/" />,
    <AuthorizedRoute exact path="/" component={SurveysPage} componentProps={{ mainnetProvider, blockExplorer }} />,
    <AuthorizedRoute exact path="/createSurvey" component={SurveyCreatePage} componentProps={{ writeContracts, tx }} />,
  ];

  const routesOnDebugMode = [
    <Redirect from="/" to="/surveys" />,
    <Route
      path="/surveys"
      render={props => <SurveysPage {...props} mainnetProvider={mainnetProvider} blockExplorer={blockExplorer} />}
    />,
    <Route
      path="/createSurvey"
      render={props => <SurveyCreatePage {...props} writeContracts={writeContracts} tx={tx} />}
    />,
  ];

  return (
    <Layout className="layout">
      <TopBar
        useBurnerWallet={USE_BURNER_WALLET}
        networkCheck={NETWORKCHECK}
        localProvider={localProvider}
        mainnetProvider={mainnetProvider}
        price={price}
        userSigner={userSigner}
        blockExplorer={blockExplorer}
        yourLocalBalance={yourLocalBalance}
      />
      <Content
        style={{
          padding: "0 50px",
        }}
      >
        <Router history={history}>
          {!debug && routesOnProdMode}
          {debug && routesOnDebugMode}
          <Route
            path="/connectWallet"
            render={props => (
              <ConnectWalletPage
                {...props}
                injectedProvider={injectedProvider}
                setInjectedProvider={setInjectedProvider}
              />
            )}
          />
        </Router>
      </Content>
      <Footer
        style={{
          textAlign: "center",
        }}
      >
        Thuan Bui ©2022 (buimthuan@gmail.com)
      </Footer>
    </Layout>
  );
};

export default App;
