import { Box, Paper, Typography, Stack, Button } from "@mui/material";
import { useForm } from "react-hook-form";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import FormInput from "../../components/common/FormInput";
import { useSnackbar } from "notistack";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

const schema = yup.object({
  email: yup.string().email().required(),
  password: yup.string().required(),
});

export default function Login() {
  const { login } = useContext(AuthContext);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const { control, handleSubmit, formState } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const onSubmit = async (data) => {
    const res = await login(data);

    if (res.success) {
      enqueueSnackbar("Login successful", { variant: "success" });

      const kyc = res.user.kycStatus;

      if (!kyc) navigate("/kyc", { replace: true });
      else if (kyc === "pending") navigate("/kyc-status", { replace: true });
      else if (kyc === "rejected") navigate("/kyc", { replace: true });
      else navigate("/", { replace: true });
    } else {
      enqueueSnackbar(res.message, { variant: "error" });
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
    >
      <Paper sx={{ p: 4, width: 350 }}>
        <Typography variant="h5" textAlign="center">
          Login
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={2} mt={2}>
            <FormInput name="email" label="Email" control={control} />
            <FormInput
              name="password"
              label="Password"
              type="password"
              control={control}
            />

            <Button
              type="submit"
              variant="contained"
              disabled={!formState.isValid}
            >
              Login
            </Button>

            <Button onClick={() => navigate("/register")}>
              Create account
            </Button>
          </Stack>
        </form>
      </Paper>
    </Box>
  );
}
