import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { AuthProvider } from "./context/AuthProvider.jsx";
import { SnackbarProvider } from "notistack";
import { StrictMode } from "react";

import {
  ThemeProvider,
  createTheme,
  responsiveFontSizes,
} from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

/* 🔥 DESIGN SYSTEM */
let theme = createTheme({
  palette: {
    mode: "light",

    /* 🔥 PRIMARY (UPDATED) */
    primary: {
      main: "#0f172a",
      dark: "#020617",
      light: "#334155",
    },

    /* 🔥 SECONDARY (KEEP CLEAN DARK) */
    secondary: {
      main: "#111827",
    },

    /* BACKGROUND */
    background: {
      default: "#f9fafb",
      paper: "#ffffff",
    },

    /* TEXT */
    text: {
      primary: "#111827",
      secondary: "#6b7280",
    },

    /* DIVIDER */
    divider: "#e5e7eb",

    /* OPTIONAL SUCCESS/ERROR (more realistic) */
    success: {
      main: "#22c55e",
    },
    error: {
      main: "#ef4444",
    },
  },

  typography: {
    fontFamily: "Inter, Roboto, sans-serif",

    h4: { fontWeight: 700 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },

    body1: { fontSize: 14 },
    body2: { fontSize: 13 },

    button: {
      textTransform: "none",
      fontWeight: 600,
    },
  },

  shape: {
    borderRadius: 12,
  },

  spacing: 8,

  components: {
    /* BUTTON */
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          padding: "10px 16px",
        },
      },
    },

    /* PAPER */
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 14,
        },
      },
    },

    /* CARD */
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 14,
          border: "1px solid #e5e7eb",
          transition: "0.3s",

          "&:hover": {
            boxShadow: "0 8px 25px rgba(0,0,0,0.08)",
          },
        },
      },
    },

    /* CHIP */
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
        },
      },
    },

    /* TEXTFIELD */
    MuiTextField: {
      styleOverrides: {
        root: {
          backgroundColor: "#fff",
        },
      },
    },
  },
});

/* RESPONSIVE TYPOGRAPHY */
theme = responsiveFontSizes(theme);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <Provider store={store}>
        <AuthProvider>
          <SnackbarProvider
            maxSnack={3}
            autoHideDuration={3000}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <App />
          </SnackbarProvider>
        </AuthProvider>
      </Provider>
    </ThemeProvider>
  </StrictMode>,
);
