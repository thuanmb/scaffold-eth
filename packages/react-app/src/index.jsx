import React from "react";
import { ThemeSwitcherProvider } from "react-css-theme-switcher";
import { BrowserRouter } from "react-router-dom";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";

import App from "./App";
import "./index.css";

import store from "./store/store";

const themes = {
  dark: `${process.env.PUBLIC_URL}/dark-theme.css`,
  light: `${process.env.PUBLIC_URL}/light-theme.css`,
};

const prevTheme = window.localStorage.getItem("theme");

ReactDOM.render(
  <Provider store={store}>
    <ThemeSwitcherProvider themeMap={themes} defaultTheme={prevTheme || "light"}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeSwitcherProvider>
  </Provider>,
  document.getElementById("root"),
);
