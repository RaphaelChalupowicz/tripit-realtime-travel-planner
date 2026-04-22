import {
  CssBaseline,
  ThemeProvider,
  createTheme,
  type PaletteMode,
} from "@mui/material";
import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type ThemeModeContextValue = {
  mode: PaletteMode;
  toggleMode: () => void;
};

const STORAGE_KEY = "tripit.theme-mode";

const ThemeModeContext = createContext<ThemeModeContextValue | undefined>(
  undefined,
);

function getInitialMode(): PaletteMode {
  if (typeof window === "undefined") {
    return "light";
  }

  const storedMode = window.localStorage.getItem(STORAGE_KEY);
  if (storedMode === "light" || storedMode === "dark") {
    return storedMode;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function ThemeModeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<PaletteMode>(getInitialMode);

  const toggleMode = () => {
    setMode((currentMode) => {
      const nextMode: PaletteMode = currentMode === "light" ? "dark" : "light";
      window.localStorage.setItem(STORAGE_KEY, nextMode);
      return nextMode;
    });
  };

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          ...(mode === "light"
            ? {
                background: {
                  default: "#f8fafc",
                  paper: "#ffffff",
                },
              }
            : {
                background: {
                  default: "#0f172a",
                  paper: "#111827",
                },
              }),
        },
      }),
    [mode],
  );

  const contextValue = useMemo(() => ({ mode, toggleMode }), [mode]);

  return (
    <ThemeModeContext.Provider value={contextValue}>
      <ThemeProvider theme={theme}>
        <CssBaseline enableColorScheme />
        {children}
      </ThemeProvider>
    </ThemeModeContext.Provider>
  );
}

export function useThemeMode() {
  const context = useContext(ThemeModeContext);

  if (!context) {
    throw new Error("useThemeMode must be used within ThemeModeProvider.");
  }

  return context;
}
