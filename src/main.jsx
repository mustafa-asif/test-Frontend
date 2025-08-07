import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { LocaleProvider } from "./i18n/provider";
import { StoreProvider } from "easy-peasy";
import { SnackbarProvider } from "notistack";
import { ToolsProvider } from "./components/shared/ToolsProvider";
import { LastLocationProvider } from "./components/shared/LastLocation";
import { SoundsProvider } from "./sounds/Sounds";
import { InternetStatus } from "./components/shared/InternetStatus";
import posthog from 'posthog-js';
import { PostHogProvider } from 'posthog-js/react'
import store from "./store";
import CacheBuster from 'react-cache-buster';

posthog.init(
  process.env.REACT_APP_PUBLIC_POSTHOG_KEY,
  {
    api_host: process.env.REACT_APP_PUBLIC_POSTHOG_HOST,
  }
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <CacheBuster
      currentVersion={process.env.VITE_APP_BUILD_VERSION}
      isEnabled={true}
      isVerboseMode={false}
      loadingComponent={<div>Loading...</div>}
      metaFileDirectory={'.'}
    >
      <StoreProvider store={store}>
        <BrowserRouter>
          <LocaleProvider>
            <SnackbarProvider>
              <SoundsProvider>
                <ToolsProvider>
                  <LastLocationProvider>
                    <InternetStatus>
                      <PostHogProvider client={posthog}>
                        <App />
                      </PostHogProvider>
                    </InternetStatus>
                  </LastLocationProvider>
                </ToolsProvider>
              </SoundsProvider>
            </SnackbarProvider>
          </LocaleProvider>
        </BrowserRouter>
      </StoreProvider>
    </CacheBuster>
  </React.StrictMode >
);
