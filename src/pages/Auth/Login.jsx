import {
  Typography,
  Stack,
  Button,
  CircularProgress,
  Divider,
  Checkbox,
  FormControlLabel,
} from "@mui/material";

import { useForm, Controller } from "react-hook-form";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import FormInput from "../../components/common/FormInput";
import { useSnackbar } from "notistack";
import AuthLayout from "../../components/layout/AuthLayout";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

/* =============================
   VALIDATION
============================= */
const schema = yup.object({
  email: yup.string().trim().email("Invalid email").required("Email required"),
  password: yup.string().required("Password required"),
  remember: yup.boolean(),
});

export default function Login() {
  const { login } = useContext(AuthContext);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const location = useLocation();

  const from =
    typeof location.state?.from === "string" ? location.state.from : "/";

  const {
    control,
    handleSubmit,
    setFocus,
    formState: { isValid, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
      remember: true,
    },
  });

  const onSubmit = async (data) => {
    if (isSubmitting) return;

    const res = await login({
      email: data.email.toLowerCase(),
      password: data.password,
    });

    if (!res.success) {
      enqueueSnackbar(res.message || "Invalid credentials", {
        variant: "error",
      });
      return;
    }

    const kycStatus = res.kycStatus;

    enqueueSnackbar("Login successful 🎉", {
      variant: "success",
    });

    if (!kycStatus || kycStatus === "rejected") {
      navigate("/kyc", { replace: true });
    } else if (kycStatus === "pending") {
      navigate("/kyc-status", { replace: true });
    } else {
      navigate(from, { replace: true });
    }
  };

  const onError = (errors) => {
    const first = Object.keys(errors)[0];
    if (first) setFocus(first);
  };

  return (
    <AuthLayout>
      {/* 🔥 HEADER */}
      <Typography variant="h4" textAlign="center" fontWeight="bold">
        Welcome Back 👋
      </Typography>

      <Typography
        textAlign="center"
        color="text.secondary"
        mt={0.5} // 🔥 reduced
        fontSize={13}
      >
        Login to continue your shopping journey
      </Typography>

      {/* 🔥 FORM */}
      <form onSubmit={handleSubmit(onSubmit, onError)} autoComplete="on">
        <Stack spacing={1.2} mt={2}>
          {" "}
          {/* 🔥 reduced spacing */}
          <FormInput
            name="email"
            label="Email Address"
            control={control}
            autoFocus
            autoComplete="email"
            disabled={isSubmitting}
          />
          <FormInput
            name="password"
            label="Password"
            type="password"
            control={control}
            autoComplete="current-password"
            disabled={isSubmitting}
          />
          {/* 🔥 REMEMBER */}
          <Controller
            name="remember"
            control={control}
            render={({ field }) => (
              <FormControlLabel
                control={
                  <Checkbox
                    {...field}
                    checked={field.value}
                    size="small" // 🔥 compact
                    disabled={isSubmitting}
                    onChange={(e) => field.onChange(e.target.checked)}
                  />
                }
                label={<Typography fontSize={13}>Remember me</Typography>}
              />
            )}
          />
          {/* 🔥 BUTTON */}
          <Button
            type="submit"
            variant="contained"
            size="medium"
            disabled={!isValid || isSubmitting}
            sx={{
              py: 1.2, // 🔥 reduced
              fontSize: 14,
              borderRadius: 2,
              textTransform: "none",
            }}
          >
            {isSubmitting ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              "Login to Account"
            )}
          </Button>
          {/* 🔥 LINKS */}
          <Stack spacing={0.5} alignItems="center">
            <Button
              size="small"
              onClick={() => navigate("/forgot-password")}
              sx={{ textTransform: "none", fontSize: 13 }}
            >
              Forgot Password?
            </Button>

            <Divider sx={{ width: "100%", my: 0.5 }} />

            <Button
              onClick={() => navigate("/register")}
              sx={{ textTransform: "none", fontSize: 13 }}
            >
              Don’t have an account? Register
            </Button>
          </Stack>
        </Stack>
      </form>
    </AuthLayout>
  );
}
