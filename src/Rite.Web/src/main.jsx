import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { App } from "./App.jsx";
import { LanguageProvider } from "./i18n.jsx";
import { AccountProvider } from "./context/AccountContext.jsx";
import "./styles.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <LanguageProvider>
        <AccountProvider>
          <App />
        </AccountProvider>
      </LanguageProvider>
    </BrowserRouter>
  </StrictMode>
);
