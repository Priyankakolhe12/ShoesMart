import {
  Box,
  Typography,
  Stack,
  Button,
  CircularProgress,
  Divider,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom";
import FormInput from "../../components/common/FormInput";
import { useSnackbar } from "notistack";
import AuthLayout from "../../components/layout/AuthLayout";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { verifyEmail, resendOTP } from "../../api/authApi";
import { useState } from "react";

const schema = yup.object({
  email: yup
    .string()
    .trim()
    .email("Invalid email")
    .required("Email is required"),
  otp: yup
    .string()
    .trim()
    .matches(/^\d{6}$/, "OTP must be 6 digits")
    .required("OTP is required"),
});

export default function VerifyEmail() {
  const navigate = useNavigate();
  const location = useLocation();
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  const defaultEmail = location.state?.email || "";

  const {
    control,
    handleSubmit,
    setFocus,
    getValues,
    formState: { isValid, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      email: defaultEmail,
      otp: "",
    },
  });

  const onSubmit = async (data) => {
    if (isSubmitting) return;

    try {
      setLoading(true);
      await verifyEmail({ email: data.email.toLowerCase(), otp: data.otp });
      enqueueSnackbar("Email verified successfully. Please login.", {
        variant: "success",
      });
      navigate("/login", { replace: true });
    } catch (error) {
      enqueueSnackbar(error?.message || "OTP verification failed", {
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    const email = getValues("email").toLowerCase();
    if (!email) {
      enqueueSnackbar("Enter email to resend OTP", { variant: "warning" });
      setFocus("email");
      return;
    }

    try {
      setResendLoading(true);
      await resendOTP({ email });
      enqueueSnackbar("OTP resent successfully", { variant: "success" });
    } catch (error) {
      enqueueSnackbar(error?.message || "Failed to resend OTP", {
        variant: "error",
      });
    } finally {
      setResendLoading(false);
    }
  };

  const onError = (errors) => {
    const first = Object.keys(errors)[0];
    if (first) setFocus(first);
  };

  return (
    <AuthLayout>
      <Typography variant="h4" textAlign="center" fontWeight="bold">
        Verify Your Email
      </Typography>

      <Typography textAlign="center" color="text.secondary" mt={0.5}>
        Enter the 6-digit OTP sent to your email address.
      </Typography>

      <form onSubmit={handleSubmit(onSubmit, onError)} autoComplete="on">
        <Stack spacing={1.2} mt={2}>
          <FormInput
            name="email"
            label="Email Address"
            control={control}
            disabled={isSubmitting || loading}
          />

          <FormInput
            name="otp"
            label="OTP Code"
            control={control}
            disabled={isSubmitting || loading}
          />

          <Button
            type="submit"
            variant="contained"
            size="medium"
            disabled={!isValid || isSubmitting || loading}
            sx={{
              py: 1.2,
              fontSize: 14,
              borderRadius: 2,
              textTransform: "none",
            }}
          >
            {loading ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              "Verify OTP"
            )}
          </Button>

          <Divider sx={{ width: "100%", my: 0.5 }} />

          <Button
            type="button"
            variant="outlined"
            disabled={resendLoading}
            onClick={handleResend}
            sx={{ py: 1.2, textTransform: "none" }}
          >
            {resendLoading ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              "Resend OTP"
            )}
          </Button>

          <Box textAlign="center">
            <Button
              onClick={() => navigate("/login")}
              sx={{ textTransform: "none", fontSize: 13 }}
            >
              Back to Login
            </Button>
          </Box>
        </Stack>
      </form>
    </AuthLayout>
  );
}
