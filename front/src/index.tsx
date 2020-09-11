import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import theme from "./theme";
import { ThemeProvider, CSSReset } from "@chakra-ui/core";
import "react-toastify/dist/ReactToastify.min.css";
import "../src/assets/style/style.css";

import * as serviceWorker from "./serviceWorker";

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CSSReset />
      <App />
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

serviceWorker.register();
