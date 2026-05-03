import { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
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
import Google from "@mui/icons-material/Google";
import { useAuthStore } from "../features/auth/authStore";
import { getErrorMessage } from "../lib/errors";

export default function LoginPage() {
  const navigate = useNavigate();
  const { signInWithEmail, signInWithGoogle, isLoading } = useAuthStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await signInWithEmail(email, password);
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      const errorMsg = getErrorMessage(error, "Failed to sign in.");
      await Swal.fire({
        icon: "error",
        title: "Sign in failed",
        text: errorMsg,
      });
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error(error);
      await Swal.fire({
        icon: "error",
        title: "Google sign in failed",
        text: "Failed to sign in with Google.",
      });
    }
  };

  return (
    <Container
      maxWidth="sm"
      sx={{ minHeight: "100vh", display: "flex", alignItems: "center" }}
    >
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
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                      onClick={() => setShowPassword((value) => !value)}
                    >
                      {showPassword ? (
                        <VisibilityOff fontSize="small" />
                      ) : (
                        <Visibility fontSize="small" />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />

          <Button
            type="submit"
            variant="contained"
            disabled={isLoading}
            fullWidth
          >
            Sign in
          </Button>
        </Stack>

        <Button
          onClick={handleGoogleLogin}
          variant="outlined"
          disabled={isLoading}
          fullWidth
          aria-label="Continue with Google"
          title="Continue with Google"
          sx={{
            mt: 2,
            minHeight: 48,
            borderColor: "rgba(148, 163, 184, 0.45)",
            color: "text.primary",
          }}
        >
          <Google fontSize="small" />
        </Button>

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
