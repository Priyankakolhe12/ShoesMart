import { Box, CircularProgress, Typography, Backdrop } from "@mui/material";

export default function PageLoader({
  fullScreen = false,
  size = 40,
  text = "Loading...",
}) {
  if (fullScreen) {
    return (
      <Backdrop open sx={{ zIndex: 9999 }}>
        <Box textAlign="center">
          <CircularProgress size={size} />
          <Typography mt={2}>{text}</Typography>
        </Box>
      </Backdrop>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "60vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: 1,
      }}
    >
      <CircularProgress size={size} />
      <Typography variant="body2" color="text.secondary">
        {text}
      </Typography>
    </Box>
  );
}
