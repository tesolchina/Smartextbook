import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Router } from "wouter";

import App from "./App";
import PasswordGate from "./PasswordGate";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <PasswordGate>
      <Router base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
        <App />
      </Router>
    </PasswordGate>
  </StrictMode>,
);
