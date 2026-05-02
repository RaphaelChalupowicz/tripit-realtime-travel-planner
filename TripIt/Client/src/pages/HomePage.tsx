import { Navigate, Link } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { useAuthStore } from "../features/auth/authStore";
import { useThemeMode } from "../app/ThemeModeProvider";

export default function HomePage() {
  const { isLoading, isAuthenticated, appUser } = useAuthStore();
  const { mode } = useThemeMode();
  const isDarkMode = mode === "dark";

  const background = isDarkMode
    ? "radial-gradient(circle at top left, rgba(28, 100, 242, 0.16), transparent 32%), radial-gradient(circle at top right, rgba(15, 118, 110, 0.18), transparent 28%), linear-gradient(180deg, rgba(15, 23, 42, 0.96), rgba(2, 6, 23, 0.98))"
    : "radial-gradient(circle at top left, rgba(59, 130, 246, 0.16), transparent 28%), radial-gradient(circle at top right, rgba(14, 165, 233, 0.14), transparent 30%), linear-gradient(180deg, #f8fafc 0%, #eef2ff 100%)";
  const headingColor = isDarkMode ? "#f8fafc" : "#0f172a";
  const mutedColor = isDarkMode ? "rgba(248,250,252,0.72)" : "#475569";

  if (isLoading) {
    return (
      <Container sx={{ py: 6 }}>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  if (isAuthenticated && appUser) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <Box sx={{ minHeight: "100vh", background }}>
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        <Grid container spacing={5} sx={{ alignItems: "center" }}>
          <Grid size={{ xs: 12, md: 7 }}>
            <Typography
              variant="h2"
              sx={{
                fontWeight: 800,
                fontSize: { xs: "2.4rem", md: "3.5rem" },
                color: headingColor,
              }}
            >
              TripIt - making trips should be easy!
            </Typography>
            <Typography
              variant="h6"
              sx={{
                mt: 3,
                color: mutedColor,
              }}
            >
              Plan trips visually, organize your itinerary, manage your budget,
              and collaborate with friends or family in real time.
            </Typography>

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              sx={{ mt: 4 }}
            >
              <Button
                component={Link}
                to="/register"
                variant="contained"
                size="large"
              >
                Start Planning
              </Button>
              <Button
                component={Link}
                to="/login"
                variant="outlined"
                size="large"
              >
                Login
              </Button>
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, md: 5 }}>
            <Paper variant="outlined" sx={{ p: 3 }}>
              <Stack spacing={1.5}>
                <Paper variant="outlined" sx={{ p: 2, color: headingColor }}>
                  📍 Visual trip map with destinations
                </Paper>
                <Paper variant="outlined" sx={{ p: 2, color: headingColor }}>
                  🗓️ Day-by-day itinerary builder
                </Paper>
                <Paper variant="outlined" sx={{ p: 2, color: headingColor }}>
                  💸 Budget and expense tracking
                </Paper>
                <Paper variant="outlined" sx={{ p: 2, color: headingColor }}>
                  👥 Share trips with editors or viewers
                </Paper>
              </Stack>
            </Paper>
          </Grid>
        </Grid>

        <Box sx={{ mt: 10 }}>
          <Typography
            variant="h4"
            sx={{ fontWeight: 700, color: headingColor }}
          >
            Why TripIt?
          </Typography>

          <Grid container spacing={2.5} sx={{ mt: 1 }}>
            <Grid size={{ xs: 12, md: 4 }}>
              <Paper variant="outlined" sx={{ p: 3, height: "100%" }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    color: headingColor,
                  }}
                >
                  Collaborative
                </Typography>
                <Typography
                  sx={{
                    mt: 1.5,
                    color: mutedColor,
                  }}
                >
                  Plan trips with friends and family in one shared workspace.
                </Typography>
              </Paper>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <Paper variant="outlined" sx={{ p: 3, height: "100%" }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    color: headingColor,
                  }}
                >
                  Organized
                </Typography>
                <Typography
                  sx={{
                    mt: 1.5,
                    color: mutedColor,
                  }}
                >
                  Keep maps, notes, itinerary, and budget together.
                </Typography>
              </Paper>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <Paper variant="outlined" sx={{ p: 3, height: "100%" }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    color: headingColor,
                  }}
                >
                  Responsive
                </Typography>
                <Typography
                  sx={{
                    mt: 1.5,
                    color: mutedColor,
                  }}
                >
                  Use it comfortably on desktop, tablet, or phone.
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Box>

        <Paper
          variant="outlined"
          sx={{ mt: 10, p: { xs: 3, md: 5 }, textAlign: "center" }}
        >
          <Typography
            variant="h4"
            sx={{ fontWeight: 700, color: headingColor }}
          >
            Start your next trip today
          </Typography>
          <Typography
            sx={{
              mt: 2,
              color: mutedColor,
            }}
          >
            Create a trip, invite collaborators, and keep everything in one
            place.
          </Typography>
          <Button
            component={Link}
            to="/register"
            variant="contained"
            sx={{ mt: 3 }}
          >
            Create Free Account
          </Button>
        </Paper>
      </Container>
    </Box>
  );
}
