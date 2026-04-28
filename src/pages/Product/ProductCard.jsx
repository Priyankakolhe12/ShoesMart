import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Box,
  Stack,
  Rating,
  Chip,
} from "@mui/material";

import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/slices/cartSlice";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { useState } from "react";

export default function ProductCard({ product }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [adding, setAdding] = useState(false);

  const formatPrice = (price) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(price);

  const formatLabel = (text) => text?.charAt(0).toUpperCase() + text?.slice(1);

  const handleAdd = (e) => {
    e.stopPropagation();

    if (product.stock === 0) {
      enqueueSnackbar("Out of stock", { variant: "warning" });
      return;
    }

    setAdding(true);

    setTimeout(() => {
      dispatch(addToCart(product));
      enqueueSnackbar("Added to cart 🛒", { variant: "success" });
      setAdding(false);
    }, 300);
  };

  return (
    <Card
      onClick={() => navigate(`/product/${product.id}`)}
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        cursor: "pointer",
        overflow: "hidden",
        border: "1px solid",
        borderColor: "divider",

        "&:hover": {
          transform: "translateY(-6px)",
          boxShadow: 4,
        },

        "&:hover .image": {
          transform: "scale(1.05)",
        },

        "&:hover .overlay": {
          opacity: 1,
        },
      }}
    >
      {/* IMAGE */}
      <Box
        sx={{
          position: "relative",
          height: 220,
          bgcolor: "grey.100",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          overflow: "hidden",
        }}
      >
        <Box
          component="img"
          src={product.image || "/placeholder.png"}
          alt={product.name}
          className="image"
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "cover", // ✅ FIX
            transition: "0.4s",
          }}
        />

        {/* OVERLAY */}
        <Box
          className="overlay"
          sx={{
            position: "absolute",
            inset: 0,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            bgcolor: "rgba(0,0,0,0.35)",
            opacity: 0,
            transition: "0.3s",
          }}
        >
          <Button
            variant="outlined"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/product/${product.id}`);
            }}
            sx={{
              bgcolor: "common.white",
              color: "text.primary",
              borderColor: "divider",

              "&:hover": {
                bgcolor: "text.primary",
                color: "common.white",
              },
            }}
          >
            View Details
          </Button>
        </Box>

        {/* CATEGORY */}
        {product.category && (
          <Chip
            label={formatLabel(product.category)}
            size="small"
            sx={{
              position: "absolute",
              top: 10,
              left: 10,
              bgcolor: "common.white",
              fontSize: 11,
            }}
          />
        )}

        {/* TYPE */}
        {product.type && (
          <Chip
            label={formatLabel(product.type)}
            size="small"
            color="primary"
            sx={{
              position: "absolute",
              top: 10,
              right: 10,
              fontSize: 11,
            }}
          />
        )}

        {/* STOCK */}
        {product.stock === 0 && (
          <Chip
            label="Out of Stock"
            color="error"
            size="small"
            sx={{
              position: "absolute",
              bottom: 10,
              left: 10,
            }}
          />
        )}
      </Box>

      {/* CONTENT */}
      <CardContent
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          p: 2,
        }}
      >
        <Stack spacing={1}>
          {/* NAME */}
          <Typography
            fontWeight={600}
            fontSize={14}
            sx={{
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              minHeight: 40,
            }}
          >
            {product.name}
          </Typography>

          {/* RATING */}
          <Box display="flex" alignItems="center" gap={1}>
            <Rating value={product.rating || 0} size="small" readOnly />
            <Typography fontSize={12} color="text.secondary">
              {product.rating?.toFixed(1) || "—"}
            </Typography>
          </Box>

          {/* PRICE */}
          <Typography fontWeight={700} fontSize={18}>
            {formatPrice(product.price)}
          </Typography>
        </Stack>

        {/* BUTTON */}
        <Button
          fullWidth
          variant="contained"
          onClick={handleAdd}
          disabled={product.stock === 0 || adding}
          startIcon={<ShoppingCartIcon />}
          sx={{ mt: 2 }}
        >
          {adding ? "Adding..." : "Add to Cart"}
        </Button>
      </CardContent>
    </Card>
  );
}
