import { Box, Paper, Typography, Stack, Button } from "@mui/material";
import { useForm } from "react-hook-form";
import FormInput from "../../components/common/FormInput";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useSnackbar } from "notistack";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { updateData } from "../../api/userApi";
import { useNavigate } from "react-router-dom";

const schema = yup.object({
  phone: yup.string().required("Phone required"),
  address: yup.string().required("Address required"),
});

export default function KycForm() {
  const { user } = useContext(AuthContext);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const { control, handleSubmit } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      await updateData("users", user.id, {
        ...data,
        kycStatus: "pending",
      });
      enqueueSnackbar("KYC submitted successfully", {
        variant: "success",
      });

      navigate("/kyc-status", { replace: true });
    } catch {
      enqueueSnackbar("Something went wrong", {
        variant: "error",
      });
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
    >
      <Paper sx={{ p: 4, width: 400 }}>
        <Typography variant="h5" textAlign="center">
          Complete KYC
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={2} mt={2}>
            <FormInput name="phone" label="Phone" control={control} />
            <FormInput name="address" label="Address" control={control} />

            <Button type="submit" variant="contained">
              Submit KYC
            </Button>
          </Stack>
        </form>
      </Paper>
    </Box>
  );
}
