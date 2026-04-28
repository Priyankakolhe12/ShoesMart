import {
  Box,
  Typography,
  Paper,
  Stack,
  Divider,
  CircularProgress,
  Chip,
  Button,
  Collapse,
  Alert,
  Avatar,
} from "@mui/material";

import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import ReplayIcon from "@mui/icons-material/Replay";

import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { getRequest } from "../../api/baseApi";
import { useNavigate } from "react-router-dom";
import { addToCart } from "../../redux/slices/cartSlice";
import { useDispatch } from "react-redux";

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openId, setOpenId] = useState(null);

  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.id) fetchOrders();
  }, [user]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await getRequest("/orders", {
        params: { userId: user.id },
      });

      setOrders(
        data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
      );
    } catch {
      setError("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };
  const dispatch = useDispatch();

  const handleReorder = (order) => {
    let hasError = false;

    order.items.forEach((item) => {
      const qty = item.qty || 1;
      const stock = item.stock ?? 10;

      if (qty > stock) {
        hasError = true;
        alert(`${item.name} has only ${stock} items available`);
        return;
      }

      for (let i = 0; i < qty; i++) {
        dispatch(
          addToCart({
            id: item.productId || item.id,
            name: item.name,
            price: item.price,
            image: item.image,
            stock: stock,
          }),
        );
      }
    });

    if (!hasError) {
      navigate("/cart");
    }
  };
  const formatPrice = (price) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(price);

  const getStatusColor = (status) => {
    if (status === "delivered") return "success";
    if (status === "placed") return "primary";
    if (status === "cancelled") return "error";
    return "default";
  };

  /* 🔥 TIMELINE */
  const Timeline = ({ status }) => (
    <Box display="flex" alignItems="center" gap={1} mt={2} flexWrap="wrap">
      <Chip size="small" label="Placed" color="primary" />
      <Typography>→</Typography>
      <Chip
        size="small"
        label="Shipped"
        color={status === "delivered" ? "primary" : "default"}
      />
      <Typography>→</Typography>
      <Chip
        size="small"
        label="Delivered"
        color={status === "delivered" ? "success" : "default"}
      />
    </Box>
  );

  if (loading) {
    return (
      <Box textAlign="center" mt={10}>
        <CircularProgress />
        <Typography mt={2}>Loading your orders...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* HEADER */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
        flexWrap="wrap"
        gap={2}
      >
        <Typography variant="h5" fontWeight={600}>
          My Orders
        </Typography>

        <Button variant="outlined" onClick={() => navigate("/")}>
          Continue Shopping
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {orders.length === 0 ? (
        <Box textAlign="center" mt={8}>
          <Typography variant="h6">No orders yet</Typography>
          <Typography color="text.secondary" mt={1}>
            Start shopping to see your orders here
          </Typography>

          <Button
            variant="contained"
            sx={{ mt: 2 }}
            onClick={() => navigate("/")}
          >
            Start Shopping
          </Button>
        </Box>
      ) : (
        <Stack spacing={3}>
          {orders.map((order) => {
            const isOpen = openId === order.id;

            return (
              <Paper
                key={order.id}
                sx={{
                  p: 2.5,
                  borderRadius: 3,
                  border: "1px solid",
                  borderColor: "divider",
                  transition: "0.25s",

                  "&:hover": {
                    boxShadow: 3,
                  },
                }}
              >
                {/* HEADER */}
                <Box display="flex" justifyContent="space-between">
                  <Box>
                    <Typography fontWeight={600}>Order #{order.id}</Typography>

                    <Typography fontSize={12} color="text.secondary">
                      {new Date(order.createdAt).toLocaleString()}
                    </Typography>
                  </Box>

                  <Chip
                    label={order.status.toUpperCase()}
                    color={getStatusColor(order.status)}
                  />
                </Box>

                {/* PREVIEW */}
                {order.items?.[0] && (
                  <Box display="flex" gap={2} mt={2}>
                    <Avatar
                      src={order.items[0].image}
                      variant="rounded"
                      sx={{ width: 64, height: 64 }}
                    />

                    <Box>
                      <Typography fontWeight={600}>
                        {order.items[0].name}
                      </Typography>

                      {order.items.length > 1 && (
                        <Typography fontSize={12} color="text.secondary">
                          +{order.items.length - 1} more items
                        </Typography>
                      )}
                    </Box>
                  </Box>
                )}

                <Timeline status={order.status} />

                {/* TOTAL */}
                <Box
                  mt={2}
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography fontWeight={600}>
                    Total: {formatPrice(order.total)}
                  </Typography>

                  <Button
                    size="small"
                    onClick={() => setOpenId(isOpen ? null : order.id)}
                  >
                    {isOpen ? "Hide Details" : "View Details"}
                  </Button>
                </Box>

                {/* DETAILS */}
                <Collapse in={isOpen}>
                  <Divider sx={{ my: 2 }} />

                  <Stack spacing={2}>
                    {order.items.map((item) => (
                      <Box
                        key={`${order.id}-${item.productId || item.name}`}
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <Box display="flex" gap={2}>
                          <Avatar
                            src={item.image}
                            variant="rounded"
                            sx={{ width: 48, height: 48 }}
                          />

                          <Typography>
                            {item.name} × {item.qty}
                          </Typography>
                        </Box>

                        <Typography fontWeight={500}>
                          {formatPrice(item.price * item.qty)}
                        </Typography>
                      </Box>
                    ))}

                    {/* ACTIONS */}
                    <Box display="flex" gap={2} flexWrap="wrap">
                      <Button
                        variant="outlined"
                        startIcon={<ReplayIcon />}
                        onClick={() => handleReorder(order)}
                      >
                        Reorder
                      </Button>

                      <Button
                        variant="contained"
                        startIcon={<LocalShippingIcon />}
                      >
                        Track Order
                      </Button>
                    </Box>
                  </Stack>
                </Collapse>
              </Paper>
            );
          })}
        </Stack>
      )}
    </Box>
  );
}
