
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "transparent",
      paper: "rgba(255, 255, 255, 0.05)",
    },
    primary: {
      main: "#00bcd4",
    },
    secondary: {
      main: "#ff4081",
    },
    text: {
      primary: "#ffffff",
      secondary: "#b0bec5",
    },
  },
  typography: {
    fontFamily: [
      "Roboto",
      "Inter",
      "Helvetica Neue",
      "Arial",
      "sans-serif",
    ].join(","),
  },
});

export default theme;
