import { Box, Typography, Paper, Stack, Button } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";

export default function Checkout() {
  const { items } = useSelector((state) => state.cart);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);

  const handleOrder = async () => {
    try {
      await api.post("/orders", {
        userId: user.id,
        items,
        total,
        status: "placed",
        date: new Date(),
      });

      alert("Order placed successfully");

      // clear cart (simple way)
      window.location.reload();

      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h5">Checkout</Typography>

      <Stack spacing={2} mt={2}>
        {items.map((item) => (
          <Paper key={item.id} sx={{ p: 2 }}>
            <Typography>{item.name}</Typography>
            <Typography>
              ₹{item.price} × {item.qty}
            </Typography>
          </Paper>
        ))}
      </Stack>

      <Typography mt={3} fontWeight="bold">
        Total: ₹{total}
      </Typography>

      <Button variant="contained" sx={{ mt: 2 }} onClick={handleOrder}>
        Place Order
      </Button>
    </Box>
  );
}
