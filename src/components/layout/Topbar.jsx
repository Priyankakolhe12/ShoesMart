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
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";

export default function Topbar() {
  const navigate = useNavigate();
  const { items } = useSelector((state) => state.cart);
  const { user, logout } = useContext(AuthContext);

  const [anchorEl, setAnchorEl] = useState(null);

  return (
    <AppBar position="static">
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Typography
          variant="h6"
          sx={{ cursor: "pointer" }}
          onClick={() => navigate("/")}
        >
          ShoesMart
        </Typography>

        <Box display="flex" alignItems="center" gap={2}>
          <IconButton color="inherit" onClick={() => navigate("/cart")}>
            <Badge badgeContent={items.length} color="error">
              <ShoppingCartIcon />
            </Badge>
          </IconButton>

          {user ? (
            <>
              <Avatar
                sx={{ cursor: "pointer" }}
                onClick={(e) => setAnchorEl(e.currentTarget)}
              >
                {user.name?.[0]}
              </Avatar>

              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={() => setAnchorEl(null)}
              >
                <MenuItem disabled>{user.name}</MenuItem>
                <MenuItem
                  onClick={() => {
                    logout();
                    navigate("/login");
                  }}
                >
                  Logout
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Typography
              sx={{ cursor: "pointer" }}
              onClick={() => navigate("/login")}
            >
              Login
            </Typography>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
