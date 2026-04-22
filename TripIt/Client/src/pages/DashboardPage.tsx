import { useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Container,
  IconButton,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import LightMode from "@mui/icons-material/LightMode";
import DarkMode from "@mui/icons-material/DarkMode";
import { useAuthStore } from "../features/auth/authStore";
import { useThemeMode } from "../app/ThemeModeProvider";
import { getErrorMessage } from "../lib/errors";
import { useState } from "react";

export default function DashboardPage() {
  const navigate = useNavigate();
  const { appUser, signOut, deleteAccount, isLoading } = useAuthStore();
  const { mode, toggleMode } = useThemeMode();
  const [actionError, setActionError] = useState("");

  const handleLogout = async () => {
    setActionError("");

    try {
      await signOut();
      navigate("/login");
    } catch (error) {
      console.error(error);
      setActionError(getErrorMessage(error, "Failed to sign out."));
    }
  };

  const handleDeleteAccount = async () => {
    setActionError("");

    const confirmed = window.confirm(
      "Delete your account permanently? This will remove your auth account and local profile data.",
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteAccount();
      navigate("/login");
    } catch (error) {
      console.error(error);
      setActionError(getErrorMessage(error, "Failed to delete account."));
    }
  };

  return (
    <Container sx={{ py: 4 }}>
      <Stack
        direction="row"
        sx={{ alignItems: "center", justifyContent: "space-between" }}
      >
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Dashboard
        </Typography>

        <IconButton
          onClick={toggleMode}
          aria-label={
            mode === "dark" ? "Switch to light mode" : "Switch to dark mode"
          }
          title={
            mode === "dark" ? "Switch to light mode" : "Switch to dark mode"
          }
        >
          {mode === "dark" ? <LightMode /> : <DarkMode />}
        </IconButton>
      </Stack>

      {actionError && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {actionError}
        </Alert>
      )}

      <Paper variant="outlined" sx={{ mt: 3, p: 3 }}>
        <Typography>
          <Box component="span" sx={{ fontWeight: 700 }}>
            Name:
          </Box>{" "}
          {appUser?.firstName} {appUser?.lastName}
        </Typography>
        <Typography sx={{ mt: 1 }}>
          <Box component="span" sx={{ fontWeight: 700 }}>
            Email:
          </Box>{" "}
          {appUser?.email}
        </Typography>
        <Typography sx={{ mt: 1 }}>
          <Box component="span" sx={{ fontWeight: 700 }}>
            Admin:
          </Box>{" "}
          {appUser?.isAdmin ? "Yes" : "No"}
        </Typography>
      </Paper>

      <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
        <Button
          onClick={handleLogout}
          color="warning"
          variant="contained"
          disabled={isLoading}
        >
          Sign out
        </Button>

        <Button
          onClick={handleDeleteAccount}
          color="error"
          variant="contained"
          disabled={isLoading}
        >
          Delete account
        </Button>
      </Stack>
    </Container>
  );
}
