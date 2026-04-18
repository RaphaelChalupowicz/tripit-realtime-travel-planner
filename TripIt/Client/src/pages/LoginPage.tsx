import { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Container,
  IconButton,
  InputAdornment,
  Link,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useAuthStore } from "../features/auth/authStore";

export default function LoginPage() {
  const navigate = useNavigate();
  const { signInWithEmail, signInWithGoogle, isLoading } = useAuthStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      await signInWithEmail(email, password);
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      setErrorMessage(`Failed to sign in. \n ${error}`);
    }
  };

  const handleGoogleLogin = async () => {
    setErrorMessage("");

    try {
      await signInWithGoogle();
    } catch (error) {
      console.error(error);
      setErrorMessage("Failed to sign in with Google.");
    }
  };

  return (
    <Container maxWidth="sm" sx={{ minHeight: "100vh", display: "flex", alignItems: "center" }}>
      <Box sx={{ width: "100%" }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }} gutterBottom>
          Login
        </Typography>

        <Stack component="form" onSubmit={handleEmailLogin} spacing={2}>
          <TextField
            type="email"
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            fullWidth
          />

          <TextField
            type={showPassword ? "text" : "password"}
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            fullWidth
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      type="button"
                      size="small"
                      edge="end"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      onClick={() => setShowPassword((value) => !value)}
                    >
                      {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />

          <Button type="submit" variant="contained" disabled={isLoading} fullWidth>
            Sign in
          </Button>
        </Stack>

        <Button
          onClick={handleGoogleLogin}
          variant="outlined"
          disabled={isLoading}
          fullWidth
          sx={{ mt: 2 }}
        >
          Continue with Google
        </Button>

        {errorMessage && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {errorMessage}
          </Alert>
        )}

        <Typography variant="body2" sx={{ mt: 3 }}>
          Don&apos;t have an account?{" "}
          <Link component={RouterLink} to="/register" underline="hover">
            Register
          </Link>
        </Typography>
      </Box>
    </Container>
  );
}
