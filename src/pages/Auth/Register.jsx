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
  name: yup.string().required("Name is required"),
  email: yup.string().email().required("Email required"),
  password: yup
    .string()
    .min(6)
    .matches(
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)/,
      "Must include uppercase, lowercase, number",
    )
    .required(),
});

export default function Register() {
  const { createProfile } = useContext(AuthContext);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const { control, handleSubmit, formState } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const onSubmit = async (data) => {
    const res = await createProfile(data);

    if (res.success) {
      enqueueSnackbar("Account created", { variant: "success" });
      navigate("/login", { replace: true });
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
          Register
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={2} mt={2}>
            <FormInput name="name" label="Name" control={control} />
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
              Register
            </Button>

            <Button onClick={() => navigate("/login")}>
              Already have account?
            </Button>
          </Stack>
        </form>
      </Paper>
    </Box>
  );
}
