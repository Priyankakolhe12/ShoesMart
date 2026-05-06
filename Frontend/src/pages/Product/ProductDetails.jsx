import {
  Box,
  Typography,
  Button,
  Stack,
  Chip,
  Rating,
  CircularProgress,
  Alert,
  Divider,
  Paper,
  Grid,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getRequest } from "../../api/baseApi";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/slices/cartSlice";
import { useSnackbar } from "notistack";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    setLoading(true);
    const data = await getRequest(`/products/${id}`);
    setProduct(data);
    setLoading(false);
  };

  const formatPrice = (price) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(price);

  const handleAdd = () => {
    setAdding(true);
    setTimeout(() => {
      dispatch(addToCart(product));
      enqueueSnackbar("Added to cart 🛒", { variant: "success" });
      setAdding(false);
    }, 300);
  };

  if (loading)
    return (
      <Box textAlign="center" mt={6}>
        <CircularProgress />
      </Box>
    );

  if (!product) return <Alert severity="error">Product not found</Alert>;

  return (
    <Box>
      {/* BACK */}
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(-1)}
        sx={{ mb: 2 }}
      >
        Back
      </Button>

      <Grid container spacing={4}>
        {/* 🔥 STICKY IMAGE SECTION */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Box
            sx={{
              position: { md: "sticky" }, // ✅ KEY
              top: { md: 100 }, // adjust based on navbar height
            }}
          >
            <Paper
              sx={{
                borderRadius: 4,
                height: { xs: 320, md: 480 },
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                overflow: "hidden",
                bgcolor: "#f9fafb",
                boxShadow: "0 10px 30px rgba(0,0,0,0.06)",

                "&:hover": {
                  boxShadow: "0 20px 50px rgba(0,0,0,0.1)",
                },
              }}
            >
              <Box
                component="img"
                src={product.image}
                alt={product.name}
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover", // 🔥 KEY CHANGE
                  objectPosition: "center",
                  transition: "0.4s",

                  "&:hover": {
                    transform: "scale(1.05)",
                  },
                }}
              />
            </Paper>
          </Box>
        </Grid>

        {/* DETAILS */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Stack spacing={2.5}>
            {/* TITLE */}
            <Typography variant="h4" fontWeight={700}>
              {product.name}
            </Typography>

            <Typography color="text.secondary">{product.brand}</Typography>

            {/* CATEGORY */}
            <Stack direction="row" spacing={1}>
              <Chip label={product.category} size="small" />
              <Chip label={product.type} color="primary" size="small" />
            </Stack>

            {/* RATING */}
            <Box display="flex" alignItems="center" gap={1}>
              <Rating value={product.rating} readOnly />
              <Typography>{product.rating}</Typography>
            </Box>

            {/* PRICE */}
            <Paper
              sx={{
                p: 2,
                borderRadius: 3,
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <Typography variant="h4" fontWeight={700}>
                {formatPrice(product.price)}
              </Typography>

              {product.originalPrice && (
                <Stack direction="row" spacing={1}>
                  <Typography
                    sx={{
                      textDecoration: "line-through",
                      color: "text.secondary",
                    }}
                  >
                    ₹{product.originalPrice}
                  </Typography>

                  <Chip
                    label={`${Math.round(
                      ((product.originalPrice - product.price) /
                        product.originalPrice) *
                        100,
                    )}% OFF`}
                    color="error"
                    size="small"
                  />
                </Stack>
              )}

              <Typography color="success.main" fontSize={13}>
                Inclusive of all taxes
              </Typography>
            </Paper>

            {/* STOCK */}
            <Chip
              label={`${product.stock} items left`}
              color="success"
              sx={{ width: "fit-content" }}
            />

            <Divider />

            {/* DESCRIPTION */}
            <Typography color="text.secondary">
              {product.description}
            </Typography>

            {/* HIGHLIGHTS */}
            <Paper
              sx={{
                p: 2,
                borderRadius: 3,
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <Typography fontWeight={600} mb={1}>
                Highlights
              </Typography>

              <Stack spacing={0.5}>
                <Typography>• Lightweight & breathable</Typography>
                <Typography>• Premium material</Typography>
                <Typography>• Comfortable fit</Typography>
                <Typography>• Durable sole</Typography>
              </Stack>
            </Paper>

            {/* DELIVERY */}
            <Paper
              sx={{
                p: 2,
                borderRadius: 3,
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <Typography fontWeight={600} mb={1}>
                Delivery & Services
              </Typography>

              <Stack direction="row" spacing={1} flexWrap="wrap">
                <Chip label="Free Delivery" />
                <Chip label="7 Days Return" />
                <Chip label="COD Available" />
                <Chip label="Secure Payment" />
              </Stack>
            </Paper>

            {/* BUTTONS */}
            <Stack spacing={1.5}>
              <Button
                variant="contained"
                size="large"
                startIcon={<ShoppingCartIcon />}
                onClick={handleAdd}
                sx={{
                  py: 1.4,
                  borderRadius: 3,
                }}
              >
                {adding ? "Adding..." : "Add to Cart"}
              </Button>
            </Stack>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
}
