import React from "react";
import { Route, Redirect } from "react-router-dom";
import { useSelector } from "react-redux";

import { getAddress } from "../store/accountSlice";

const AuthorizedRoute = ({ component: Component, componentProps, ...rest }) => {
  const address = useSelector(getAddress);

  return (
    <Route
      {...rest}
      render={props => {
        if (!address) {
          // not connected to wallet, so redirect to connect to wallet with the return url
          return <Redirect to={{ pathname: "/connectWallet", state: { from: props.location } }} />;
        }
        //
        // authorized so return component
        return <Component {...props} {...componentProps} />;
      }}
    />
  );
};

export default AuthorizedRoute;
