import Topbar from "./Topbar";
import { Box, Toolbar, Container, Typography, Grid } from "@mui/material";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        bgcolor: "background.default",
      }}
    >
      {/* HEADER */}
      <Topbar />
      <Toolbar />

      {/* MAIN */}
      <Box sx={{ flex: 1 }}>
        <Container maxWidth="xl">
          <Box
            sx={{
              py: { xs: 2, sm: 3, md: 4 },
              px: { xs: 1.5, sm: 2, md: 3 },
              maxWidth: "1400px",
              mx: "auto",
            }}
          >
            <Outlet />
          </Box>
        </Container>
      </Box>

      {/* FOOTER */}
      <Box
        sx={{
          bgcolor: "grey.900",
          color: "grey.400",
          mt: 4,
          pt: { xs: 4, sm: 5, md: 6 },
          pb: { xs: 3, sm: 4 },
        }}
      >
        <Container maxWidth="xl">
          <Grid container spacing={{ xs: 3, md: 4 }}>
            {/* BRAND */}
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Box display="flex" alignItems="center" gap={1} mb={2}>
                <Box
                  component="img"
                  src="/logo.png"
                  sx={{ width: 32, height: 32 }}
                />
                <Typography variant="h6" fontWeight={700}>
                  ShoesMart
                </Typography>
              </Box>

              <Typography
                variant="body2"
                sx={{
                  maxWidth: 320,
                  lineHeight: 1.6,
                }}
              >
                Premium footwear for every step of your journey.
              </Typography>
            </Grid>

            {/* SHOP */}
            <Grid size={{ xs: 6, sm: 3, md: 2 }}>
              <Typography fontWeight={600} color="common.white" mb={1.5}>
                Shop
              </Typography>

              {["Men", "Women", "Sports", "Kids"].map((item) => (
                <Typography
                  key={item}
                  variant="body2"
                  sx={{
                    mb: 0.8,
                    cursor: "pointer",
                    transition: "0.2s",
                    "&:hover": {
                      color: "common.white",
                      transform: "translateX(4px)",
                    },
                  }}
                >
                  {item}
                </Typography>
              ))}
            </Grid>

            {/* SUPPORT */}
            <Grid size={{ xs: 6, sm: 3, md: 2 }}>
              <Typography fontWeight={600} color="common.white" mb={1.5}>
                Support
              </Typography>

              {["Contact", "FAQs", "Returns"].map((item) => (
                <Typography
                  key={item}
                  variant="body2"
                  sx={{
                    mb: 0.8,
                    cursor: "pointer",
                    transition: "0.2s",
                    "&:hover": {
                      color: "common.white",
                      transform: "translateX(4px)",
                    },
                  }}
                >
                  {item}
                </Typography>
              ))}
            </Grid>

            {/* COMPANY */}
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Typography fontWeight={600} color="common.white" mb={1.5}>
                Company
              </Typography>

              <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                © 2026 ShoesMart. All rights reserved.
              </Typography>
            </Grid>
          </Grid>

          {/* BOTTOM */}
          <Box
            mt={{ xs: 3, md: 4 }}
            pt={2}
            sx={{
              borderTop: "1px solid",
              borderColor: "divider",
              textAlign: "center",
            }}
          ></Box>
        </Container>
      </Box>
    </Box>
  );
}
