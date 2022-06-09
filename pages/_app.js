import React from "react";
import Head from "next/head";
import "../styles/globals.css";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { Auth, Amplify } from "aws-amplify";
import awsExports from "./aws-exports";
import { AuthContext } from "../src/context/authContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

Amplify.configure({ ...awsExports, ssr: true });

function MyApp({ Component, pageProps }) {
  const theme = createTheme();
  return (
    <React.Fragment>
      <Head>
        <title>Amplify Demo - Home</title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <AuthContext>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Component {...pageProps} />
        </ThemeProvider>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </AuthContext>
    </React.Fragment>
  );
}

export default MyApp;
