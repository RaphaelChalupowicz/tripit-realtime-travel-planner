import { Box, Container, Typography } from "@mui/material";
import { useThemeMode } from "../app/ThemeModeProvider";

export default function DashboardPage() {
  const { mode } = useThemeMode();
  const isDarkMode = mode === "dark";

  const background = isDarkMode
    ? "radial-gradient(circle at top left, rgba(28, 100, 242, 0.16), transparent 32%), radial-gradient(circle at top right, rgba(15, 118, 110, 0.18), transparent 28%), linear-gradient(180deg, rgba(15, 23, 42, 0.96), rgba(2, 6, 23, 0.98))"
    : "radial-gradient(circle at top left, rgba(59, 130, 246, 0.16), transparent 28%), radial-gradient(circle at top right, rgba(14, 165, 233, 0.14), transparent 30%), linear-gradient(180deg, #f8fafc 0%, #eef2ff 100%)";
  const textColor = isDarkMode ? "#f8fafc" : "#0f172a";

  return (
    <Box
      sx={{
        minHeight: "100vh",
        py: { xs: 2, md: 5 },
        background,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Container maxWidth="md">
        <Typography
          variant="h2"
          sx={{
            fontWeight: 800,
            textAlign: "center",
            color: textColor,
          }}
        >
          Hello World
        </Typography>
      </Container>
    </Box>
  );
}
