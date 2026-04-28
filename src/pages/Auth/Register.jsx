import {
  Typography,
  Stack,
  Button,
  CircularProgress,
  Divider,
  Box,
  Checkbox,
  FormControlLabel,
} from "@mui/material";

import { useForm, Controller } from "react-hook-form";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import FormInput from "../../components/common/FormInput";
import { useSnackbar } from "notistack";
import AuthLayout from "../../components/layout/AuthLayout";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

/* =============================
   VALIDATION
============================= */
const schema = yup.object({
  name: yup.string().trim().required("Name is required"),
  email: yup
    .string()
    .trim()
    .email("Invalid email")
    .required("Email is required"),
  password: yup
    .string()
    .min(6, "Minimum 6 characters")
    .matches(
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)/,
      "Must include uppercase, lowercase, number",
    )
    .required("Password required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .required("Confirm your password"),
  terms: yup.boolean().oneOf([true], "You must accept terms"),
});

export default function Register() {
  const { createProfile, login } = useContext(AuthContext);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    setFocus,
    formState: { isValid, isSubmitting, errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      terms: false,
    },
  });

  const onSubmit = async (data) => {
    if (isSubmitting) return;

    try {
      const res = await createProfile({
        name: data.name,
        email: data.email.toLowerCase(),
        password: data.password,
      });

      if (!res.success) {
        enqueueSnackbar(res.message || "Registration failed", {
          variant: "error",
        });
        return;
      }

      const loginRes = await login({
        email: data.email.toLowerCase(),
        password: data.password,
      });

      if (!loginRes.success) {
        enqueueSnackbar("Login after registration failed", {
          variant: "warning",
        });
        navigate("/login");
        return;
      }

      enqueueSnackbar("Account created 🎉", {
        variant: "success",
      });

      const kycStatus = loginRes.kycStatus;

      if (!kycStatus || kycStatus === "rejected") {
        navigate("/kyc", { replace: true });
      } else if (kycStatus === "pending") {
        navigate("/kyc-status", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    } catch {
      enqueueSnackbar("Something went wrong", {
        variant: "error",
      });
    }
  };

  const onError = (errors) => {
    const first = Object.keys(errors)[0];
    if (first) setFocus(first);
  };

  return (
    <AuthLayout>
      <Typography variant="h4" textAlign="center" fontWeight="bold">
        Create Account 🚀
      </Typography>

      <Typography
        textAlign="center"
        color="text.secondary"
        mt={0.5} // 🔥 reduced
        fontSize={13}
      >
        Join ShoesMart and start your shopping journey
      </Typography>

      <Box textAlign="center" mt={0.5} fontSize={12} color="text.secondary">
        🔒 Secure signup • Your data is protected
      </Box>

      <form onSubmit={handleSubmit(onSubmit, onError)} autoComplete="on">
        {/* 🔥 COMPACT STACK */}
        <Stack spacing={1.2} mt={2}>
          <FormInput
            name="name"
            label="Full Name"
            control={control}
            disabled={isSubmitting}
          />

          <FormInput
            name="email"
            label="Email Address"
            control={control}
            disabled={isSubmitting}
          />

          <FormInput
            name="password"
            label="Password"
            type="password"
            control={control}
            disabled={isSubmitting}
          />

          <FormInput
            name="confirmPassword"
            label="Confirm Password"
            type="password"
            control={control}
            disabled={isSubmitting}
          />

          <Typography variant="caption" color="text.secondary">
            Must include uppercase, lowercase, and number
          </Typography>

          {/* TERMS */}
          <Controller
            name="terms"
            control={control}
            render={({ field }) => (
              <FormControlLabel
                control={
                  <Checkbox
                    {...field}
                    checked={field.value || false}
                    disabled={isSubmitting}
                    size="small" // 🔥 smaller
                    onChange={(e) => field.onChange(e.target.checked)}
                  />
                }
                label={
                  <Typography fontSize={13}>
                    I agree to Terms & Conditions
                  </Typography>
                }
              />
            )}
          />

          {errors.terms && (
            <Typography variant="caption" color="error">
              {errors.terms.message}
            </Typography>
          )}

          {/* BUTTON */}
          <Button
            type="submit"
            variant="contained"
            size="medium"
            disabled={!isValid || isSubmitting}
            sx={{
              py: 1.2, // 🔥 reduced
              borderRadius: 2,
              textTransform: "none",
            }}
          >
            {isSubmitting ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              "Create Account"
            )}
          </Button>

          <Divider sx={{ my: 0.5 }} />

          <Button
            onClick={() => navigate("/login")}
            sx={{ textTransform: "none", fontSize: 13 }}
          >
            Already have an account? Login
          </Button>
        </Stack>
      </form>
    </AuthLayout>
  );
}
