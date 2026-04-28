import {
  Box,
  Typography,
  Paper,
  Stack,
  Button,
  Divider,
  Radio,
  RadioGroup,
  FormControlLabel,
  Fade,
  Chip,
  Grid,
} from "@mui/material";

import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import SecurityIcon from "@mui/icons-material/Security";
import { useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  selectCartItems,
  selectCartSummary,
  clearCart,
} from "../../redux/slices/cartSlice";

import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import TextField from "@mui/material/TextField";

/* =============================
   VALIDATION
============================= */
const schema = yup.object({
  name: yup.string().required("Full name is required"),
  address: yup.string().required("Address is required"),
  city: yup.string().required("City is required"),
  state: yup.string().required("State is required"),
  zip: yup.string().required("ZIP required"),
  phone: yup
    .string()
    .matches(/^[6-9]\d{9}$/, "Enter valid Indian phone")
    .required("Phone is required"),
  payment: yup.string().required(),
});

export default function Checkout() {
  const items = useSelector(selectCartItems);
  const { total, subtotal, shipping, tax } = useSelector(selectCartSummary);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      name: "",
      userId: null,
      address: "",
      city: "",
      state: "",
      zip: "",
      phone: "",
      payment: "cod",
    },
  });

  /* AUTOFILL */
  useEffect(() => {
    const saved = localStorage.getItem("checkoutAddress");
    if (saved) reset(JSON.parse(saved));
  }, [reset]);

  const formatPrice = (price) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(price);

  /* SUBMIT */
  const onSubmit = async (data) => {
    try {
      setLoading(true);

      localStorage.setItem("checkoutAddress", JSON.stringify(data));

      const order = {
        id: Date.now(),
        userId: Number(user?.id),
        items,
        total,
        address: data,
        status: "placed",
        createdAt: new Date().toISOString(),
      };

      /* ✅ SAVE TO JSON SERVER */
      await fetch("http://localhost:5000/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(order),
      });

      dispatch(clearCart());
      navigate("/order-success", { state: { order } });
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <Box textAlign="center" mt={10}>
        <Typography variant="h6">Cart is empty</Typography>
        <Button onClick={() => navigate("/")}>Go Shopping</Button>
      </Box>
    );
  }

  return (
    <Fade in timeout={400}>
      <Grid container spacing={4}>
        {/* LEFT */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Stack spacing={3}>
            {/* ADDRESS */}
            <Paper
              sx={{
                p: 3,
                borderRadius: 3,
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <Typography fontWeight={600} mb={2}>
                Shipping Address
              </Typography>

              <Grid container spacing={2}>
                {[
                  { name: "name", label: "Full Name" },
                  { name: "address", label: "Address", xs: 12 },
                  { name: "city", label: "City" },
                  { name: "state", label: "State" },
                  { name: "zip", label: "ZIP Code" },
                  { name: "phone", label: "Phone" },
                ].map((field) => (
                  <Grid key={field.name} size={{ xs: field.xs || 6 }}>
                    <Controller
                      name={field.name}
                      control={control}
                      render={({ field: f }) => (
                        <TextField
                          {...f}
                          label={field.label}
                          fullWidth
                          error={!!errors[field.name]}
                          helperText={errors[field.name]?.message}
                        />
                      )}
                    />
                  </Grid>
                ))}
              </Grid>
            </Paper>

            {/* ITEMS */}
            <Paper
              sx={{
                p: 3,
                borderRadius: 3,
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <Typography fontWeight={600} mb={2}>
                Order Items
              </Typography>

              <Stack spacing={2}>
                {items.map((item) => (
                  <Box
                    key={item.id}
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Box display="flex" gap={2} alignItems="center">
                      <Box
                        component="img"
                        src={item.image || "/placeholder.png"}
                        sx={{
                          width: 60,
                          height: 60,
                          borderRadius: 2,
                          objectFit: "cover",
                        }}
                      />

                      <Box>
                        <Typography fontWeight={500}>{item.name}</Typography>
                        <Typography fontSize={12} color="text.secondary">
                          Qty: {item.qty}
                        </Typography>
                      </Box>
                    </Box>

                    <Typography fontWeight={600}>
                      {formatPrice(item.price * item.qty)}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </Paper>

            {/* PAYMENT */}
            <Paper
              sx={{
                p: 3,
                borderRadius: 3,
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <Typography fontWeight={600} mb={2}>
                Payment Method
              </Typography>

              <Controller
                name="payment"
                control={control}
                render={({ field }) => (
                  <RadioGroup {...field}>
                    <FormControlLabel
                      value="cod"
                      control={<Radio />}
                      label="Cash on Delivery"
                    />
                    <FormControlLabel
                      value="upi"
                      control={<Radio />}
                      label="UPI (Coming Soon)"
                      disabled
                    />
                  </RadioGroup>
                )}
              />

              <Stack direction="row" spacing={1} mt={2}>
                <Chip
                  icon={<SecurityIcon />}
                  label="Secure Checkout"
                  color="success"
                  variant="outlined"
                />
                <Chip
                  icon={<LocalShippingIcon />}
                  label="Fast Delivery"
                  color="primary"
                  variant="outlined"
                />
              </Stack>
            </Paper>
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
            <Typography fontWeight={600} mb={2}>
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

              <Typography fontSize={12} color="text.secondary">
                Estimated delivery: 2–4 business days
              </Typography>

              <Divider />

              <Box display="flex" justifyContent="space-between">
                <Typography fontWeight={600}>Total</Typography>
                <Typography fontWeight={600}>{formatPrice(total)}</Typography>
              </Box>

              <Button
                variant="contained"
                size="large"
                fullWidth
                disabled={!isValid || loading}
                onClick={handleSubmit(onSubmit)}
                sx={{ py: 1.5, mt: 2 }}
              >
                {loading ? "Placing Order..." : "Place Order"}
              </Button>
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Fade>
  );
}
