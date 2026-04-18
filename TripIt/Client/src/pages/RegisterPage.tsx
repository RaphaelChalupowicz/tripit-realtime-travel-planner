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
  SvgIcon,
  TextField,
  Typography,
} from "@mui/material";
import { useAuthStore } from "../features/auth/authStore";

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
      setErrorMessage(`Failed to register. \n ${error}`);
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
                        <SvgIcon fontSize="small">
                          <path d="M12 6.5c3.79 0 7.17 2.13 8.82 5.5-.7 1.43-1.72 2.61-2.96 3.47l1.42 1.42C20.99 15.74 22.3 14.01 23 12c-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l1.65 1.65c.76-.23 1.54-.35 2.33-.35zm-1.07 1.14L13 9.71a2.5 2.5 0 012.29 2.29l2.07 2.07c.09-.34.14-.69.14-1.07A5.5 5.5 0 0010.93 7.64zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55a2.5 2.5 0 003.1 3.1L13.73 16A5.5 5.5 0 017.53 9.8zm4.31 7.65c-3.79 0-7.17-2.13-8.82-5.5.69-1.4 1.69-2.57 2.9-3.43l1.44 1.44a5.5 5.5 0 006.63 6.63l1.38 1.38c-.98.31-2 .48-3.03.48z" />
                        </SvgIcon>
                      ) : (
                        <SvgIcon fontSize="small">
                          <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zm0 13c-3.03 0-5.5-2.47-5.5-5.5S8.97 6.5 12 6.5s5.5 2.47 5.5 5.5-2.47 5.5-5.5 5.5zm0-9A3.5 3.5 0 0012 15a3.5 3.5 0 000-7z" />
                        </SvgIcon>
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
