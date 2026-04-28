import {
  Typography,
  Stack,
  Button,
  CircularProgress,
  Alert,
  TextField,
  Box,
} from "@mui/material";
import { useState } from "react";
import { useSnackbar } from "notistack";
import AuthLayout from "../../components/layout/AuthLayout";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async () => {
    if (!email) {
      enqueueSnackbar("Please enter your email", { variant: "warning" });
      return;
    }

    if (!isValidEmail(email)) {
      enqueueSnackbar("Please enter a valid email", {
        variant: "error",
      });
      return;
    }

    try {
      setLoading(true);

      // 🔥 Simulated API
      await new Promise((res) => setTimeout(res, 1200));

      setSent(true);

      enqueueSnackbar("Reset link sent successfully", {
        variant: "success",
      });
    } catch {
      enqueueSnackbar("Something went wrong", {
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <Box textAlign="center">
        <Typography variant="h4" fontWeight="bold">
          Forgot Password
        </Typography>

        <Typography color="text.secondary" mt={1}>
          Enter your email and we’ll send you a reset link
        </Typography>
      </Box>

      <Stack spacing={3} mt={4}>
        {sent && (
          <Alert severity="success">
            A password reset link has been sent to <b>{email}</b>.
            <br />
            Please check your inbox.
          </Alert>
        )}

        <TextField
          label="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          disabled={sent}
        />

        <Button
          variant="contained"
          size="large"
          onClick={handleSubmit}
          disabled={loading || sent}
          sx={{
            py: 1.5,
            borderRadius: 2,
            textTransform: "none",
          }}
        >
          {loading ? (
            <CircularProgress size={22} color="inherit" />
          ) : sent ? (
            "Email Sent"
          ) : (
            "Send Reset Link"
          )}
        </Button>

        {sent && (
          <Button
            size="small"
            onClick={() => {
              setSent(false);
              setEmail("");
            }}
            sx={{ textTransform: "none" }}
          >
            Try another email
          </Button>
        )}

        <Button
          onClick={() => navigate("/login")}
          sx={{ textTransform: "none" }}
        >
          Back to Login
        </Button>
      </Stack>
    </AuthLayout>
  );
}
