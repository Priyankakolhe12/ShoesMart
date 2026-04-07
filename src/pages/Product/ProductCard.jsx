import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Box,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/slices/cartSlice";

export default function ProductCard({ product }) {
  const dispatch = useDispatch();

  return (
    <Card
      sx={{
        borderRadius: 3,
        transition: "0.3s",
        "&:hover": { transform: "scale(1.03)" },
      }}
    >
      <CardMedia component="img" height="180" image={product.image} />
      <CardContent>
        <Typography fontWeight="bold">{product.name}</Typography>₹
        {product.price}
        <Typography color="text.secondary"></Typography>
        <Box mt={2} display="flex" gap={1}>
          <Button
            fullWidth
            variant="contained"
            onClick={() => dispatch(addToCart(product))}
          >
            Add To Cart
          </Button>

          <Button fullWidth variant="outlined">
            Details
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}
