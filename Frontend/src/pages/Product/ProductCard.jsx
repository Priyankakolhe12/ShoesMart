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
import { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { deleteProduct } from "../../api/productApi";

export default function ProductCard({ product }) {
  const id = product.id;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useContext(AuthContext);
  const isAdmin = user?.role === "admin";
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

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProduct(id);
        enqueueSnackbar("Product deleted", { variant: "success" });
        // Optionally, trigger a refresh or remove from list
        window.location.reload(); // Simple refresh for now
      } catch {
        enqueueSnackbar("Failed to delete product", { variant: "error" });
      }
    }
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    navigate(`/admin/add-product?edit=${id}`);
  };

  return (
    <Card
      onClick={() => navigate(`/product/${id}`)}
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
              navigate(`/product/${id}`);
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
          <Box>
            <Typography fontWeight={700} fontSize={18}>
              {formatPrice(product.price)}
            </Typography>
            {product.originalPrice > product.price && (
              <Typography
                color="text.secondary"
                fontSize={12}
                sx={{ textDecoration: "line-through" }}
              >
                {formatPrice(product.originalPrice)}
              </Typography>
            )}
          </Box>
        </Stack>

        {/* BUTTON */}
        {!isAdmin ? (
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
        ) : (
          <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
            <Button
              fullWidth
              variant="outlined"
              color="primary"
              onClick={handleEdit}
            >
              Edit
            </Button>
            <Button
              fullWidth
              variant="outlined"
              color="error"
              onClick={handleDelete}
            >
              Delete
            </Button>
          </Stack>
        )}
      </CardContent>
    </Card>
  );
}
