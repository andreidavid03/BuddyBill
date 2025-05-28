import React from "react";
import ReactDOM from "react-dom/client";
import AppRoutes from "./App";
import "./index.css";

// ✏️ MUI ThemeProvider & CssBaseline
import { ThemeProvider, CssBaseline } from "@mui/material";
import theme from "./theme"; // fișierul cu tema noastră globală

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* Elimină stilurile implicite și adaugă dark mode */}
      <AppRoutes />
    </ThemeProvider>
  </React.StrictMode>
);
