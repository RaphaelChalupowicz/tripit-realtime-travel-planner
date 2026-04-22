import { Navigate, Link } from "react-router-dom";
import { Box, Button, Container, Grid, Paper, Stack, Typography } from "@mui/material";
import { useAuthStore } from "../features/auth/authStore";

export default function HomePage() {
  const { isLoading, isAuthenticated, appUser } = useAuthStore();

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
    <Box sx={{ minHeight: "100vh" }}>
      <Box
        component="header"
        sx={{
          px: { xs: 2, md: 4 },
          py: 2,
          borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
        }}
      >
        <Container maxWidth="lg" sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            TripIt
          </Typography>

          <Stack direction="row" spacing={1.5}>
            <Button component={Link} to="/login" variant="outlined">
              Login
            </Button>
            <Button component={Link} to="/register" variant="contained">
              Get Started
            </Button>
          </Stack>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        <Grid container spacing={5} sx={{ alignItems: "center" }}>
          <Grid size={{ xs: 12, md: 7 }}>
            <Typography variant="h2" sx={{ fontWeight: 800, fontSize: { xs: "2.4rem", md: "3.5rem" } }}>
              TripIt - making trips should be easy!
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mt: 3 }}>
              Plan trips visually, organize your itinerary, manage your budget,
              and collaborate with friends or family in real time.
            </Typography>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mt: 4 }}>
              <Button component={Link} to="/register" variant="contained" size="large">
                Start Planning
              </Button>
              <Button component={Link} to="/login" variant="outlined" size="large">
                Login
              </Button>
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, md: 5 }}>
            <Paper variant="outlined" sx={{ p: 3 }}>
              <Stack spacing={1.5}>
                <Paper variant="outlined" sx={{ p: 2 }}>📍 Visual trip map with destinations</Paper>
                <Paper variant="outlined" sx={{ p: 2 }}>🗓️ Day-by-day itinerary builder</Paper>
                <Paper variant="outlined" sx={{ p: 2 }}>💸 Budget and expense tracking</Paper>
                <Paper variant="outlined" sx={{ p: 2 }}>👥 Share trips with editors or viewers</Paper>
              </Stack>
            </Paper>
          </Grid>
        </Grid>

        <Box sx={{ mt: 10 }}>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Why TripIt?
          </Typography>

          <Grid container spacing={2.5} sx={{ mt: 1 }}>
            <Grid size={{ xs: 12, md: 4 }}>
              <Paper variant="outlined" sx={{ p: 3, height: "100%" }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Collaborative
                </Typography>
                <Typography color="text.secondary" sx={{ mt: 1.5 }}>
                  Plan trips with friends and family in one shared workspace.
                </Typography>
              </Paper>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <Paper variant="outlined" sx={{ p: 3, height: "100%" }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Organized
                </Typography>
                <Typography color="text.secondary" sx={{ mt: 1.5 }}>
                  Keep maps, notes, itinerary, and budget together.
                </Typography>
              </Paper>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <Paper variant="outlined" sx={{ p: 3, height: "100%" }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Responsive
                </Typography>
                <Typography color="text.secondary" sx={{ mt: 1.5 }}>
                  Use it comfortably on desktop, tablet, or phone.
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Box>

        <Paper variant="outlined" sx={{ mt: 10, p: { xs: 3, md: 5 }, textAlign: "center" }}>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Start your next trip today
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 2 }}>
            Create a trip, invite collaborators, and keep everything in one
            place.
          </Typography>
          <Button component={Link} to="/register" variant="contained" sx={{ mt: 3 }}>
            Create Free Account
          </Button>
        </Paper>
      </Container>
    </Box>
  );
}
