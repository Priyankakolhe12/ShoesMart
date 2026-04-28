import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Badge,
  Menu,
  MenuItem,
  Avatar,
  Divider,
  Button,
  Chip,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";

import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";

import { useSelector } from "react-redux";
import { selectCartCount } from "../../redux/slices/cartSlice";
import { useNavigate, useLocation } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useSnackbar } from "notistack";

export default function Topbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { enqueueSnackbar } = useSnackbar();

  const cartCount = useSelector(selectCartCount);
  const { user, logout } = useContext(AuthContext);

  const [anchorEl, setAnchorEl] = useState(null);
  const [openDrawer, setOpenDrawer] = useState(false);

  const handleLogout = async () => {
    await logout();
    enqueueSnackbar("Logged out successfully", { variant: "info" });
    navigate("/login");
  };

  const kycStatus = user?.kyc?.status;

  const navItems = [
    { label: "Home", path: "/", icon: <HomeIcon /> },
    { label: "Orders", path: "/orders", icon: <ShoppingBagIcon /> },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* NAVBAR */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          /* 🔥 PREMIUM BG (HIGHLIGHTED BUT CLEAN) */
          background:
            "linear-gradient(to right, rgba(255,255,255,0.9), rgba(249,250,251,0.9))",

          backdropFilter: "blur(12px)",
          borderBottom: "1px solid #e5e7eb",
          color: "#111827",
        }}
      >
        <Toolbar
          sx={{
            justifyContent: "space-between",
            minHeight: "64px !important",
            px: { xs: 1.5, md: 3 },
          }}
        >
          {/* LEFT */}
          <Box display="flex" alignItems="center" gap={1}>
            <IconButton
              sx={{ display: { xs: "block", md: "none" } }}
              onClick={() => setOpenDrawer(true)}
            >
              <MenuIcon />
            </IconButton>

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
          </Box>

          {/* DESKTOP NAV */}
          <Box sx={{ display: { xs: "none", md: "flex" }, gap: 3 }}>
            {navItems.map((item) => (
              <Button
                key={item.label}
                onClick={() => navigate(item.path)}
                sx={{
                  fontWeight: 600,
                  fontSize: 14,
                  color: isActive(item.path)
                    ? "primary.main"
                    : "text.secondary",

                  position: "relative",
                  borderRadius: 0,
                  pb: 0.5,

                  "&::after": {
                    content: '""',
                    position: "absolute",
                    left: 0,
                    bottom: 0,
                    width: isActive(item.path) ? "100%" : "0%",
                    height: "2px",
                    backgroundColor: "primary.main",
                    transition: "0.3s",
                  },

                  "&:hover::after": {
                    width: "100%",
                  },

                  "&:hover": {
                    color: "primary.main",
                    bgcolor: "transparent",
                  },
                }}
              >
                {item.label}
              </Button>
            ))}
          </Box>

          {/* RIGHT */}
          <Box display="flex" alignItems="center" gap={1.5}>
            {/* KYC */}
            {user && (
              <Chip
                label={
                  kycStatus === "approved"
                    ? "Verified"
                    : kycStatus === "pending"
                      ? "Pending"
                      : "KYC"
                }
                size="small"
                color={
                  kycStatus === "approved"
                    ? "success"
                    : kycStatus === "pending"
                      ? "warning"
                      : "default"
                }
                sx={{ display: { xs: "none", sm: "flex" } }}
                onClick={() => navigate(kycStatus ? "/kyc-status" : "/kyc")}
              />
            )}

            {/* CART */}
            <IconButton onClick={() => navigate("/cart")}>
              <Badge badgeContent={cartCount || 0} color="error">
                <ShoppingCartIcon />
              </Badge>
            </IconButton>

            {/* USER */}
            {user ? (
              <>
                <Avatar
                  onClick={(e) => setAnchorEl(e.currentTarget)}
                  sx={{
                    cursor: "pointer",
                    bgcolor: "primary.main",
                    width: 36,
                    height: 36,
                  }}
                >
                  {user?.name?.[0]?.toUpperCase()}
                </Avatar>

                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={() => setAnchorEl(null)}
                  PaperProps={{
                    sx: {
                      borderRadius: 2,
                      minWidth: 200,
                      mt: 1,
                    },
                  }}
                >
                  <MenuItem disabled>
                    <Box>
                      <Typography fontWeight={600}>{user.name}</Typography>
                      <Typography variant="caption">{user.email}</Typography>
                    </Box>
                  </MenuItem>

                  <Divider />

                  <MenuItem onClick={() => navigate("/orders")}>
                    My Orders
                  </MenuItem>

                  <MenuItem onClick={() => navigate("/kyc-status")}>
                    KYC Status
                  </MenuItem>

                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>
              </>
            ) : (
              <Button
                variant="contained"
                onClick={() => navigate("/login")}
                sx={{
                  borderRadius: 2,
                  px: 2,
                  fontWeight: 600,
                }}
              >
                Login
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* DRAWER (UNCHANGED) */}
      <Drawer
        anchor="left"
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
      >
        <Box width={260} p={2}>
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

          <Divider />

          <List>
            {navItems.map((item) => (
              <ListItemButton
                key={item.label}
                onClick={() => {
                  navigate(item.path);
                  setOpenDrawer(false);
                }}
                sx={{
                  borderRadius: 2,
                  mb: 1,
                  bgcolor: isActive(item.path)
                    ? "primary.light"
                    : "transparent",
                }}
              >
                <ListItemIcon
                  sx={{
                    color: isActive(item.path)
                      ? "primary.main"
                      : "text.secondary",
                  }}
                >
                  {item.icon}
                </ListItemIcon>

                <ListItemText primary={item.label} />
              </ListItemButton>
            ))}

            {user && (
              <ListItemButton
                onClick={() => navigate("/kyc-status")}
                sx={{ borderRadius: 2 }}
              >
                <ListItemIcon>
                  <VerifiedUserIcon />
                </ListItemIcon>
                <ListItemText primary="KYC Status" />
              </ListItemButton>
            )}
          </List>
        </Box>
      </Drawer>
    </>
  );
}
