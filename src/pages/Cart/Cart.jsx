import {
  Box,
  Typography,
  Paper,
  Stack,
  IconButton,
  Button,
  Divider,
  Chip,
  Grid,
} from "@mui/material";

import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";

import { useSelector, useDispatch } from "react-redux";
import {
  selectCartItems,
  selectCartSummary,
  removeFromCart,
  increaseQty,
  decreaseQty,
} from "../../redux/slices/cartSlice";

import { useNavigate } from "react-router-dom";

export default function Cart() {
  const items = useSelector(selectCartItems);
  const { total, subtotal, shipping, tax } = useSelector(selectCartSummary);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const formatPrice = (price) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(price);

  /* EMPTY */
  if (items.length === 0) {
    return (
      <Box textAlign="center" mt={10}>
        <Typography variant="h5" fontWeight={600}>
          Your cart is empty 🛒
        </Typography>

        <Typography color="text.secondary" mt={1}>
          Start adding your favorite shoes
        </Typography>

        <Button
          variant="contained"
          sx={{ mt: 3, px: 4 }}
          onClick={() => navigate("/")}
        >
          Explore Products
        </Button>
      </Box>
    );
  }

  return (
    <Grid container spacing={4}>
      {/* LEFT */}
      <Grid size={{ xs: 12, md: 8 }}>
        <Stack spacing={3}>
          {items.map((item) => (
            <Paper
              key={item.id}
              sx={{
                p: 2,
                borderRadius: 3,
                border: "1px solid",
                borderColor: "divider",
                display: "flex",
                gap: 2,
                alignItems: "center",
                transition: "0.25s",

                "&:hover": {
                  boxShadow: 2,
                },
              }}
            >
              {/* IMAGE */}
              <Box
                component="img"
                src={item.image || "/placeholder.png"}
                alt={item.name}
                sx={{
                  width: 110,
                  height: 110,
                  objectFit: "cover",
                  borderRadius: 2,
                  bgcolor: "grey.100",
                }}
              />

              {/* DETAILS */}
              <Box flex={1}>
                <Typography fontWeight={600}>{item.name}</Typography>

                <Typography color="text.secondary" fontSize={14} mt={0.5}>
                  {formatPrice(item.price)}
                </Typography>

                {/* QTY */}
                <Box
                  mt={1.5}
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Box
                    display="flex"
                    alignItems="center"
                    sx={{
                      border: "1px solid",
                      borderColor: "divider",
                      borderRadius: 2,
                      px: 1,
                    }}
                  >
                    <IconButton
                      size="small"
                      onClick={() => dispatch(decreaseQty(item.id))}
                    >
                      <RemoveIcon fontSize="small" />
                    </IconButton>

                    <Typography mx={1} fontWeight={600}>
                      {item.qty}
                    </Typography>

                    <IconButton
                      size="small"
                      onClick={() => dispatch(increaseQty(item.id))}
                      disabled={item.stock != null && item.qty >= item.stock}
                    >
                      <AddIcon fontSize="small" />
                    </IconButton>
                  </Box>

                  {/* REMOVE */}
                  <IconButton
                    color="error"
                    onClick={() => dispatch(removeFromCart(item.id))}
                  >
                    <DeleteOutlineIcon />
                  </IconButton>
                </Box>

                {/* STOCK WARNING */}
                {item.stock != null && item.qty >= item.stock && (
                  <Typography fontSize={12} color="error.main" mt={0.5}>
                    Max stock reached
                  </Typography>
                )}
              </Box>

              {/* TOTAL */}
              <Typography fontWeight={600}>
                {formatPrice(item.price * item.qty)}
              </Typography>
            </Paper>
          ))}
        </Stack>
      </Grid>

      {/* RIGHT */}
      <Grid size={{ xs: 12, md: 4 }}>
        <Paper
          sx={{
            p: 3,
            borderRadius: 3,
            position: "sticky",
            top: 90,
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <Typography variant="h6" fontWeight={600} mb={2}>
            Order Summary
          </Typography>

          <Stack spacing={2}>
            <Box display="flex" justifyContent="space-between">
              <Typography>Subtotal</Typography>
              <Typography>{formatPrice(total)}</Typography>
            </Box>

            <Box display="flex" justifyContent="space-between">
              <Typography>Shipping</Typography>
              <Typography color="success.main">Free</Typography>
            </Box>

            <Chip
              icon={<LocalShippingIcon />}
              label="Free Delivery Available"
              variant="outlined"
            />

            <Divider />

            <Box display="flex" justifyContent="space-between">
              <Typography fontWeight={600}>Total</Typography>
              <Typography fontWeight={600}>{formatPrice(total)}</Typography>
            </Box>

            <Button
              variant="contained"
              size="large"
              fullWidth
              sx={{ py: 1.5, mt: 2 }}
              onClick={() => navigate("/checkout")}
            >
              Proceed to Checkout
            </Button>

            <Button variant="text" fullWidth onClick={() => navigate("/")}>
              Continue Shopping
            </Button>
          </Stack>
        </Paper>
      </Grid>
    </Grid>
  );
}
