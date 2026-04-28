import { Box, Paper, Typography } from "@mui/material";

export default function AuthLayout({ children }) {
  return (
    <Box
      sx={{
        height: "100vh",
        width: "100%",
        display: "flex",
      }}
    >
      {/* LEFT SIDE */}
      <Box
        sx={(theme) => ({
          width: { xs: "0%", md: "50%" },
          display: { xs: "none", md: "flex" },
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",

          background: `linear-gradient(135deg, ${theme.palette.primary.dark}, #020617)`,

          color: "#fff",
          p: 6,
          position: "relative",
          overflow: "hidden",
        })}
      >
        {/* 🔥 BIG LOGO */}
        <Box
          component="img"
          src="/logo.png"
          alt="logo"
          sx={{
            width: 350, // 🔥 increased
            height: 350,
            objectFit: "contain",
            mb: 3,

            filter: "drop-shadow(0 15px 40px rgba(0,0,0,0.6))",
          }}
        />

        {/* 🔥 BRAND NAME (BIG + STRONG) */}
        <Typography
          variant="h3" // 🔥 bigger than before
          fontWeight={800}
          letterSpacing={1}
        >
          ShoesMart
        </Typography>

        {/* 🔥 TAGLINE */}
        <Typography
          mt={3}
          maxWidth={420}
          fontSize={16} // 🔥 slightly bigger
          lineHeight={1.8}
          color="rgba(255,255,255,0.75)"
        >
          Discover premium footwear designed for comfort, performance and
          everyday confidence.
        </Typography>

        {/* 🔥 TRUST TEXT */}
        <Typography mt={4} fontSize={14} color="rgba(255,255,255,0.6)">
          🚀 Trusted by 10,000+ customers
        </Typography>

        {/* 🔥 GLOW */}
        <Box
          sx={{
            position: "absolute",
            width: 500,
            height: 500,
            background: "rgba(255,255,255,0.06)",
            filter: "blur(140px)",
            top: "-150px",
            left: "-150px",
          }}
        />
      </Box>

      {/* RIGHT SIDE */}
      <Box
        sx={{
          width: { xs: "100%", md: "50%" },
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          px: 2,
          bgcolor: "background.default",
        }}
      >
        <Box width="100%" maxWidth={420}>
          {/* MOBILE BRAND */}
          <Typography
            variant="h5"
            fontWeight={700}
            textAlign="center"
            mb={2}
            display={{ xs: "block", md: "none" }}
          >
            ShoesMart 👟
          </Typography>

          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 4,
              border: "1px solid",
              borderColor: "divider",
              boxShadow:
                "0 8px 25px rgba(0,0,0,0.05), 0 2px 8px rgba(0,0,0,0.03)",

              maxHeight: "90vh", // ✅ fits screen
              overflowY: "auto", // ✅ scroll inside card

              /* 🔥 smooth scroll (optional) */
              scrollbarWidth: "none",
              "&::-webkit-scrollbar": {
                display: "none",
              },
            }}
          >
            {children}
          </Paper>
        </Box>
      </Box>
    </Box>
  );
}
