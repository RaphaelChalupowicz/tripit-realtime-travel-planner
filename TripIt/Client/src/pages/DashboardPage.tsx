import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  IconButton,
  Paper,
  Stack,
  SvgIcon,
  Typography,
} from "@mui/material";
import { useAuthStore } from "../features/auth/authStore";
import { useThemeMode } from "../app/ThemeModeProvider";

export default function DashboardPage() {
  const navigate = useNavigate();
  const { appUser, signOut, deleteAccount, isLoading } = useAuthStore();
  const { mode, toggleMode } = useThemeMode();

  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteAccount = async () => {
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
      window.alert("Failed to delete account.");
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
          {mode === "dark" ? (
            <SvgIcon>
              <path d="M6.76 4.84l-1.8-1.79-1.41 1.41 1.79 1.8 1.42-1.42zM1 13h3v-2H1v2zm10-9h2V1h-2v3zm7.45 1.46l-1.41-1.41-1.8 1.79 1.42 1.42 1.79-1.8zM17.24 19.16l1.8 1.79 1.41-1.41-1.79-1.8-1.42 1.42zM20 11v2h3v-2h-3zm-8 8h-2v3h2v-3zM5.34 17.66l-1.79 1.8 1.41 1.41 1.8-1.79-1.42-1.42zM12 6a6 6 0 100 12 6 6 0 000-12zm0 10a4 4 0 110-8 4 4 0 010 8z" />
            </SvgIcon>
          ) : (
            <SvgIcon>
              <path d="M9.37 5.51A7 7 0 0016.49 14 7 7 0 119.37 5.51z" />
            </SvgIcon>
          )}
        </IconButton>
      </Stack>

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
