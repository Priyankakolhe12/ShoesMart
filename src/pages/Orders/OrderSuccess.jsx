import {
  Box,
  Typography,
  Paper,
  Stack,
  Button,
  Divider,
  Chip,
  Avatar,
  Fade,
} from "@mui/material";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import HomeIcon from "@mui/icons-material/Home";
import ReceiptIcon from "@mui/icons-material/Receipt";

import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function OrderSuccess() {
  const navigate = useNavigate();
  const location = useLocation();

  let order = location.state?.order;

  useEffect(() => {
    if (order) {
      localStorage.setItem("lastOrder", JSON.stringify(order));
    }
  }, [order]);

  if (!order) {
    const saved = localStorage.getItem("lastOrder");
    if (saved) order = JSON.parse(saved);
  }

  if (!order) {
    return (
      <Box textAlign="center" mt={10}>
        <Typography>No order found</Typography>
        <Button sx={{ mt: 2 }} onClick={() => navigate("/")}>
          Go Home
        </Button>
      </Box>
    );
  }

  const formatPrice = (price) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(price);

  return (
    <Fade in timeout={400}>
      <Box display="flex" justifyContent="center" py={6} px={2}>
        <Box width="100%" maxWidth="720px">
          {/* ✅ SUCCESS HEADER */}
          <Paper
            sx={{
              p: 4,
              borderRadius: 4,
              textAlign: "center",
              mb: 3,
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <CheckCircleIcon sx={{ fontSize: 80, color: "success.main" }} />

            <Typography variant="h4" fontWeight={600} mt={2}>
              Order Confirmed 🎉
            </Typography>

            <Typography color="text.secondary" mt={1}>
              Your order has been placed successfully
            </Typography>

            <Chip
              icon={<LocalShippingIcon />}
              label="Delivery in 3–5 days"
              color="primary"
              sx={{ mt: 2 }}
            />
          </Paper>

          {/* ✅ ORDER META */}
          <Paper
            sx={{
              p: 3,
              borderRadius: 3,
              mb: 3,
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <Stack direction="row" justifyContent="space-between">
              <Box>
                <Typography fontSize={12} color="text.secondary">
                  Order ID
                </Typography>
                <Typography fontWeight={600}>#{order.id}</Typography>
              </Box>

              <Box textAlign="right">
                <Typography fontSize={12} color="text.secondary">
                  Date
                </Typography>
                <Typography fontWeight={600}>
                  {new Date(order.createdAt).toLocaleDateString()}
                </Typography>
              </Box>
            </Stack>
          </Paper>

          {/* ✅ TIMELINE */}
          <Paper
            sx={{
              p: 3,
              borderRadius: 3,
              mb: 3,
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <Stack
              direction="row"
              justifyContent="space-between"
              flexWrap="wrap"
              gap={1}
            >
              <Chip label="Placed" color="primary" />
              <Chip label="Shipped" />
              <Chip label="Delivered" />
            </Stack>
          </Paper>

          {/* ✅ ORDER SUMMARY */}
          <Paper
            sx={{
              p: 3,
              borderRadius: 3,
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <Typography fontWeight={600} mb={2}>
              Order Summary
            </Typography>

            <Stack spacing={2}>
              {order.items.map((item, index) => (
                <Box
                  key={index}
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Box display="flex" gap={2} alignItems="center">
                    <Avatar
                      src={item.image}
                      variant="rounded"
                      sx={{ width: 48, height: 48 }}
                    />

                    <Box>
                      <Typography fontWeight={600}>{item.name}</Typography>

                      <Typography fontSize={12} color="text.secondary">
                        {formatPrice(item.price)} × {item.qty}
                      </Typography>
                    </Box>
                  </Box>

                  <Typography fontWeight={600}>
                    {formatPrice(item.price * item.qty)}
                  </Typography>
                </Box>
              ))}
            </Stack>

            <Divider sx={{ my: 2 }} />

            <Box display="flex" justifyContent="space-between">
              <Typography fontWeight={700} fontSize={18}>
                Total
              </Typography>

              <Typography fontWeight={700} fontSize={18}>
                {formatPrice(order.total)}
              </Typography>
            </Box>
          </Paper>

          {/* ✅ ACTIONS */}
          <Stack spacing={2} mt={3}>
            <Button
              variant="contained"
              size="large"
              startIcon={<ReceiptIcon />}
              sx={{ py: 1.5 }}
              onClick={() => navigate("/orders")}
            >
              View Orders
            </Button>

            <Button
              variant="outlined"
              size="large"
              startIcon={<HomeIcon />}
              onClick={() => navigate("/")}
            >
              Continue Shopping
            </Button>
          </Stack>
        </Box>
      </Box>
    </Fade>
  );
}
