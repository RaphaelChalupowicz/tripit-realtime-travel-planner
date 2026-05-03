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

export default function RegisterPage() {
  const navigate = useNavigate();
  const { signUpWithEmail, signInWithGoogle, isLoading } = useAuthStore();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await signUpWithEmail(email, password, firstName, lastName);
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      const errorMsg = getErrorMessage(error, "Failed to register.");
      await Swal.fire({
        icon: "error",
        title: "Registration failed",
        text: errorMsg,
      });
    }
  };

  const handleGoogleRegister = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error(error);
      await Swal.fire({
        icon: "error",
        title: "Google sign up failed",
        text: "Failed to continue with Google.",
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
          Register
        </Typography>

        <Stack component="form" onSubmit={handleRegister} spacing={2}>
          <TextField
            type="text"
            label="First name"
            required
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            fullWidth
          />

          <TextField
            type="text"
            label="Last name"
            required
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            fullWidth
          />

          <TextField
            type="email"
            label="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
          />

          <TextField
            type={showPassword ? "text" : "password"}
            label="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
            Create account
          </Button>
        </Stack>

        <Button
          onClick={handleGoogleRegister}
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
          Already have an account?{" "}
          <Link component={RouterLink} to="/login" underline="hover">
            Login
          </Link>
        </Typography>
      </Box>
    </Container>
  );
}
