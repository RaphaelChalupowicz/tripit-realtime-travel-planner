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
import { getErrorMessage } from "../lib/errors";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { signUpWithEmail, signInWithGoogle, isLoading } = useAuthStore();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      await signUpWithEmail(email, password, firstName, lastName);
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      setErrorMessage(getErrorMessage(error, "Failed to register."));
    }
  };

  const handleGoogleRegister = async () => {
    setErrorMessage("");

    try {
      await signInWithGoogle();
    } catch (error) {
      console.error(error);
      setErrorMessage("Failed to continue with Google.");
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
          Already have an account?{" "}
          <Link component={RouterLink} to="/login" underline="hover">
            Login
          </Link>
        </Typography>
      </Box>
    </Container>
  );
}
