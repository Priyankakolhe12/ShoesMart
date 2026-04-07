import { Box, Typography, Button, Stack, Paper } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import {
  removeFromCart,
  increaseQty,
  decreaseQty,
} from "../../redux/slices/cartSlice";
import { useNavigate } from "react-router-dom";

export default function Cart() {
  const { items } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  return (
    <Box p={3}>
      <Typography variant="h5">Your Cart</Typography>
      {items.length === 0 ? (
        <Typography mt={2}>Cart is Empty</Typography>
      ) : (
        <Stack spacing={2} mt={2}>
          {items.map((item) => (
            <Paper key={item.id} sx={{ p: 2 }}>
              <Typography fontWeight="bold">{item.name}</Typography>
              <Typography>₹{item.price}</Typography>
              <Stack direction="row" spacing={1} mt={1}>
                <Button onClick={() => dispatch(decreaseQty(item.id))}>
                  -
                </Button>
                <Typography>{item.qty}</Typography>
                <Button onClick={() => dispatch(increaseQty(item.id))}>
                  +
                </Button>
              </Stack>
              <Button
                color="error"
                onClick={() => dispatch(removeFromCart(item.id))}
              >
                Remove
              </Button>
            </Paper>
          ))}
        </Stack>
      )}
      <Typography mt={3} fontWeight="bold">
        ₹{item.price}
      </Typography>
      <Button
        variant="contained"
        sx={{ mt: 2 }}
        disabled={items.length === 0}
        onClick={() => navigate("/checkout")}
      >
        Checkout
      </Button>
    </Box>
  );
}
