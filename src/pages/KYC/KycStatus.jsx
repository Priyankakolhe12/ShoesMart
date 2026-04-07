import { Box, Typography, Paper } from "@mui/material";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

export default function kycStatus() {
  const { user } = useContext(AuthContext);

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
    >
      <Paper sx={{ p: 4 }}>
        <Typography variant="h5">KYC status</Typography>
        <Typography mt={2}>
          Status: <b>{user?.kycStatus}</b>
        </Typography>

        {user?.kycStatus === "pending" && (
          <Typography color="warning.man">Your KYC is under review</Typography>
        )}
      </Paper>
    </Box>
  );
}
