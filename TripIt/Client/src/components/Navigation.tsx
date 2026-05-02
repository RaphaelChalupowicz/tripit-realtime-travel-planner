import { useState } from "react";
import { Link as RouterLink, useLocation } from "react-router-dom";
import {
  AppBar,
  Box,
  Button,
  Container,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DashboardIcon from "@mui/icons-material/Dashboard";
import DarkMode from "@mui/icons-material/DarkMode";
import LightMode from "@mui/icons-material/LightMode";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import PersonIcon from "@mui/icons-material/Person";
import { useThemeMode } from "../app/ThemeModeProvider";
import { useAuthStore } from "../features/auth/authStore";

type NavItem = {
  label: string;
  href: string;
  icon: React.ReactNode;
};

const AUTHENTICATED_NAV_ITEMS: NavItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: <DashboardIcon fontSize="small" />,
  },
  { label: "Profile", href: "/profile", icon: <PersonIcon fontSize="small" /> },
];

export default function Navigation() {
  const { isAuthenticated, signOut } = useAuthStore();
  const { mode, toggleMode } = useThemeMode();
  const location = useLocation();
  const isDarkMode = mode === "dark";

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (href: string) => location.pathname === href;
  const closeMobileMenu = () => setMobileMenuOpen(false);

  const handleLogout = async () => {
    try {
      await signOut();
      closeMobileMenu();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const shellSx = {
    bgcolor: isDarkMode
      ? "rgba(15, 23, 42, 0.95)"
      : "rgba(255, 255, 255, 0.98)",
    borderBottom: `1px solid ${isDarkMode ? "rgba(255,255,255,0.08)" : "rgba(148, 163, 184, 0.2)"}`,
    backdropFilter: "blur(10px)",
  } as const;

  const themeButtonSx = {
    border: "1px solid",
    borderColor: isDarkMode
      ? "rgba(255,255,255,0.08)"
      : "rgba(148, 163, 184, 0.35)",
    bgcolor: isDarkMode ? "background.paper" : "rgba(255,255,255,0.95)",
  } as const;

  return (
    <>
      <AppBar position="sticky" elevation={0} sx={shellSx}>
        <Container maxWidth="lg">
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              py: 1.5,
            }}
          >
            <Button
              component={RouterLink}
              to="/"
              sx={{
                textTransform: "none",
                fontSize: "1.4rem",
                fontWeight: 800,
                minWidth: 0,
                px: 0,
                color: isDarkMode ? "#f8fafc" : "#0f172a",
                "&:hover": { bgcolor: "transparent", opacity: 0.84 },
              }}
            >
              TripIt
            </Button>

            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                alignItems: "center",
                gap: 1,
              }}
            >
              {isAuthenticated && (
                <Stack direction="row" spacing={0.5}>
                  {AUTHENTICATED_NAV_ITEMS.map((item) => {
                    const active = isActive(item.href);

                    return (
                      <Button
                        key={item.href}
                        component={RouterLink}
                        to={item.href}
                        sx={{
                          textTransform: "none",
                          px: 1.5,
                          py: 0.75,
                          borderRadius: 1,
                          fontSize: "0.95rem",
                          fontWeight: active ? 600 : 500,
                          color: active
                            ? "primary.main"
                            : isDarkMode
                              ? "rgba(255,255,255,0.7)"
                              : "#475569",
                          bgcolor: active
                            ? isDarkMode
                              ? "rgba(59, 130, 246, 0.1)"
                              : "rgba(59, 130, 246, 0.06)"
                            : "transparent",
                          "&:hover": {
                            bgcolor: isDarkMode
                              ? "rgba(255,255,255,0.05)"
                              : "rgba(15, 23, 42, 0.04)",
                          },
                        }}
                      >
                        {item.label}
                      </Button>
                    );
                  })}
                </Stack>
              )}

              <Divider
                orientation="vertical"
                flexItem
                sx={{ height: 50, mx: 1 }}
              />

              <IconButton
                onClick={toggleMode}
                aria-label={
                  mode === "dark"
                    ? "Switch to light mode"
                    : "Switch to dark mode"
                }
                title={
                  mode === "dark"
                    ? "Switch to light mode"
                    : "Switch to dark mode"
                }
                sx={themeButtonSx}
              >
                {mode === "dark" ? <LightMode /> : <DarkMode />}
              </IconButton>

              {!isAuthenticated ? (
                <Stack direction="row" spacing={1}>
                  <Button component={RouterLink} to="/login" variant="outlined">
                    Login
                  </Button>
                  <Button
                    component={RouterLink}
                    to="/register"
                    variant="contained"
                  >
                    Get Started
                  </Button>
                </Stack>
              ) : (
                <Button
                  onClick={handleLogout}
                  variant="outlined"
                  color="error"
                  startIcon={<LogoutIcon />}
                >
                  Sign out
                </Button>
              )}
            </Box>

            <Box
              sx={{
                display: { xs: "flex", md: "none" },
                alignItems: "center",
                gap: 1,
              }}
            >
              <IconButton
                onClick={toggleMode}
                aria-label={
                  mode === "dark"
                    ? "Switch to light mode"
                    : "Switch to dark mode"
                }
                title={
                  mode === "dark"
                    ? "Switch to light mode"
                    : "Switch to dark mode"
                }
                sx={themeButtonSx}
              >
                {mode === "dark" ? <LightMode /> : <DarkMode />}
              </IconButton>

              <IconButton
                onClick={() => setMobileMenuOpen((value) => !value)}
                aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                sx={{ color: isDarkMode ? "#f8fafc" : "#0f172a" }}
              >
                {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
              </IconButton>
            </Box>
          </Box>
        </Container>
      </AppBar>

      <Drawer
        anchor="top"
        open={mobileMenuOpen}
        onClose={closeMobileMenu}
        sx={{
          "& .MuiDrawer-paper": {
            mt: "64px",
            bgcolor: isDarkMode
              ? "rgba(15, 23, 42, 0.95)"
              : "rgba(255, 255, 255, 0.98)",
            borderBottom: `1px solid ${isDarkMode ? "rgba(255,255,255,0.08)" : "rgba(148, 163, 184, 0.2)"}`,
            backdropFilter: "blur(10px)",
          },
        }}
      >
        <List sx={{ py: 1 }}>
          {isAuthenticated ? (
            <>
              {AUTHENTICATED_NAV_ITEMS.map((item) => {
                const active = isActive(item.href);

                return (
                  <ListItemButton
                    key={item.href}
                    component={RouterLink}
                    to={item.href}
                    onClick={closeMobileMenu}
                    selected={active}
                    sx={{
                      borderLeft: active
                        ? "4px solid"
                        : "4px solid transparent",
                      borderLeftColor: active ? "primary.main" : "transparent",
                      bgcolor: active
                        ? isDarkMode
                          ? "rgba(59, 130, 246, 0.1)"
                          : "rgba(59, 130, 246, 0.05)"
                        : "transparent",
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 36,
                        color: active ? "primary.main" : "inherit",
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.label}
                      sx={{
                        "& .MuiTypography-root": {
                          color: isDarkMode ? "#f8fafc" : "#0f172a",
                          fontWeight: active ? 600 : 500,
                        },
                      }}
                    />
                  </ListItemButton>
                );
              })}
              <Divider sx={{ my: 1 }} />
              <ListItemButton
                onClick={handleLogout}
                sx={{ color: "error.main" }}
              >
                <ListItemIcon sx={{ minWidth: 36, color: "error.main" }}>
                  <LogoutIcon />
                </ListItemIcon>
                <ListItemText primary="Sign out" />
              </ListItemButton>
            </>
          ) : (
            <>
              <ListItemButton
                component={RouterLink}
                to="/login"
                onClick={closeMobileMenu}
              >
                <ListItemText
                  primary="Login"
                  sx={{
                    "& .MuiTypography-root": {
                      color: isDarkMode ? "#f8fafc" : "#0f172a",
                    },
                  }}
                />
              </ListItemButton>
              <ListItemButton
                component={RouterLink}
                to="/register"
                onClick={closeMobileMenu}
              >
                <ListItemText
                  primary="Get Started"
                  sx={{
                    "& .MuiTypography-root": {
                      color: "primary.main",
                      fontWeight: 600,
                    },
                  }}
                />
              </ListItemButton>
            </>
          )}
        </List>
      </Drawer>
    </>
  );
}
