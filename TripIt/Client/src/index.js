import { LicenseInfo } from "@mui/x-license";
import { createRoot } from "react-dom/client";
import React from "react";
import App from "./App.tsx";
import "./index.css";

// MUI X Pro License - Global Setup
const muiLicenseKey = import.meta.env.VITE_MUI_X_LICENSE_KEY;
if (muiLicenseKey) {
  LicenseInfo.setLicenseKey(muiLicenseKey);
} else {
  console.warn(
    "Missing VITE_MUI_X_LICENSE_KEY. MUI X Pro features may be disabled.",
  );
}

const container = document.getElementById("root");
const root = createRoot(container);
root.render(React.createElement(App));
