import { StyledEngineProvider } from "@mui/material";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { RouterProvider } from "react-router-dom";
import routes from "./config/routes.config";
import "./index.css";
import { store } from "./store/store";
import CustomThemeProvider from "./theme/mui.theme";

import { ToastProvider } from "./context/ToastContext"; // Import the ToastProvider

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <StyledEngineProvider injectFirst>
      <Provider store={store}>
        <CustomThemeProvider>
             <ToastProvider> {/* Add ToastProvider here */}
            <RouterProvider router={routes} />
          </ToastProvider>
        </CustomThemeProvider>
      </Provider>
    </StyledEngineProvider>
  </StrictMode>
);
