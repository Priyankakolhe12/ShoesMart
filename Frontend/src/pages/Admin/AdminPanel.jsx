import {
  Box,
  Typography,
  Paper,
  Stack,
  Button,
  Chip,
  Tabs,
  Tab,
  TextField,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllProducts, deleteProduct } from "../../api/productApi";
import { getAllUsers, updateUser } from "../../api/userApi";
import { useSnackbar } from "notistack";

export default function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [tab, setTab] = useState("users");
  const [loading, setLoading] = useState(false);
  const [productLoading, setProductLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [rejectionReasons, setRejectionReasons] = useState({});

  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getAllUsers();
      setUsers(data);
    } catch {
      enqueueSnackbar("Failed to load users", { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      setProductLoading(true);
      const data = await getAllProducts();
      setProducts(data);
    } catch {
      enqueueSnackbar("Failed to load products", { variant: "error" });
    } finally {
      setProductLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchProducts();
  }, []);

  const calculateFinalPrice = (originalPrice, discount) => {
    const original = Number(originalPrice);
    const percent = Number(discount);
    if (!original || Number.isNaN(original)) return 0;
    if (!percent || Number.isNaN(percent)) return original;
    const final = original - (original * percent) / 100;
    return Number(final.toFixed(2));
  };

  const formatPrice = (value) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(Number(value) || 0);

  const handleAction = async (user, status) => {
    const userId = user.id || user._id;
    try {
      await updateUser(userId, {
        kyc: {
          ...user.kyc,
          status,
          reason:
            status === "rejected"
              ? rejectionReasons[userId] || "Invalid details"
              : "",
          reviewedAt: new Date().toISOString(),
        },
      });

      enqueueSnackbar(`KYC ${status}`, { variant: "success" });
      fetchUsers();
    } catch {
      enqueueSnackbar("Action failed", { variant: "error" });
    }
  };

  const handleVerifyUser = async (user) => {
    const userId = user.id || user._id;
    try {
      await updateUser(userId, { verified: true });
      enqueueSnackbar("User email verified", { variant: "success" });
      fetchUsers();
    } catch {
      enqueueSnackbar("Verification failed", { variant: "error" });
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      await deleteProduct(id);
      enqueueSnackbar("Product deleted", { variant: "success" });
      fetchProducts();
    } catch {
      enqueueSnackbar("Unable to delete product", { variant: "error" });
    }
  };

  const customerUsers = users.filter((u) => u.role !== "admin");

  const filteredUsers = customerUsers.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()),
  );

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase()),
  );

  const stats = {
    pending: customerUsers.filter((u) => u.kyc?.status === "pending").length,
    approved: customerUsers.filter((u) => u.kyc?.status === "approved").length,
    rejected: customerUsers.filter((u) => u.kyc?.status === "rejected").length,
    verified: customerUsers.filter((u) => u.verified).length,
    totalProducts: products.length,
  };

  return (
    <Box p={{ xs: 2, md: 4 }}>
      <Paper
        sx={{
          p: { xs: 3, md: 4 },
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
          mb: 3,
          bgcolor: "background.default",
        }}
      >
        <Stack
          direction={{ xs: "column", md: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", md: "center" }}
          spacing={2}
          mb={3}
        >
          <Box>
            <Typography variant="h4" fontWeight={700} mb={1}>
              Admin Control Center
            </Typography>
            <Typography color="text.secondary" sx={{ maxWidth: 560 }}>
              A polished overview for user verification, product status, and
              inventory management.
            </Typography>
          </Box>
          <Button
            variant="contained"
            onClick={() => navigate("/admin/add-product")}
            sx={{ textTransform: "none", whiteSpace: "nowrap" }}
          >
            Add Product
          </Button>
        </Stack>

        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <Paper
            sx={{
              p: 2,
              width: "100%",
              borderRadius: 3,
              bgcolor: "background.paper",
            }}
          >
            <Typography variant="subtitle2" color="text.secondary" mb={1}>
              Pending KYC
            </Typography>
            <Typography variant="h5" fontWeight={700}>
              {stats.pending}
            </Typography>
          </Paper>
          <Paper
            sx={{
              p: 2,
              width: "100%",
              borderRadius: 3,
              bgcolor: "background.paper",
            }}
          >
            <Typography variant="subtitle2" color="text.secondary" mb={1}>
              Approved KYC
            </Typography>
            <Typography variant="h5" fontWeight={700}>
              {stats.approved}
            </Typography>
          </Paper>
          <Paper
            sx={{
              p: 2,
              width: "100%",
              borderRadius: 3,
              bgcolor: "background.paper",
            }}
          >
            <Typography variant="subtitle2" color="text.secondary" mb={1}>
              Total Products
            </Typography>
            <Typography variant="h5" fontWeight={700}>
              {stats.totalProducts}
            </Typography>
          </Paper>
        </Stack>
      </Paper>

      <Paper
        sx={{
          p: 3,
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Tabs
          value={tab}
          onChange={(e, val) => setTab(val)}
          textColor="primary"
          indicatorColor="primary"
          sx={{ mb: 3 }}
        >
          <Tab label="Users" value="users" />
          <Tab label="Products" value="products" />
        </Tabs>

        <Box display="flex" gap={2} flexWrap="wrap" alignItems="center" mb={3}>
          <TextField
            placeholder={
              tab === "products" ? "Search products..." : "Search users..."
            }
            size="small"
            fullWidth
            sx={{ maxWidth: 420 }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {tab === "products" && (
            <Button
              variant="outlined"
              onClick={() => navigate("/admin/add-product")}
            >
              Add Product
            </Button>
          )}
        </Box>

        {tab === "users" ? (
          loading ? (
            <Box textAlign="center" mt={6}>
              <CircularProgress />
            </Box>
          ) : filteredUsers.length === 0 ? (
            <Typography textAlign="center" mt={5} color="text.secondary">
              No users found
            </Typography>
          ) : (
            <TableContainer component={Paper} sx={{ boxShadow: "none" }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>KYC</TableCell>
                    <TableCell>Verified</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredUsers.map((user) => {
                    const status = user.kyc?.status || "pending";
                    return (
                      <TableRow key={user.id || user._1d} hover>
                        <TableCell>
                          <Typography fontWeight={600}>{user.name}</Typography>
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Chip
                            label={status.toUpperCase()}
                            color={
                              status === "approved"
                                ? "success"
                                : status === "rejected"
                                  ? "error"
                                  : "warning"
                            }
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={user.verified ? "YES" : "NO"}
                            color={user.verified ? "success" : "default"}
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Stack
                            direction="row"
                            spacing={1}
                            justifyContent="flex-end"
                            flexWrap="wrap"
                          >
                            {!user.verified && (
                              <Button
                                size="small"
                                variant="contained"
                                onClick={() => handleVerifyUser(user)}
                              >
                                Verify
                              </Button>
                            )}
                            {status === "pending" && (
                              <Button
                                size="small"
                                variant="outlined"
                                color="success"
                                onClick={() => handleAction(user, "approved")}
                              >
                                Approve
                              </Button>
                            )}
                            {status === "pending" && (
                              <Button
                                size="small"
                                variant="outlined"
                                color="error"
                                onClick={() => handleAction(user, "rejected")}
                              >
                                Reject
                              </Button>
                            )}
                          </Stack>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          )
        ) : productLoading ? (
          <Box textAlign="center" mt={6}>
            <CircularProgress />
          </Box>
        ) : filteredProducts.length === 0 ? (
          <Typography textAlign="center" mt={5} color="text.secondary">
            No products found
          </Typography>
        ) : (
          <TableContainer component={Paper} sx={{ boxShadow: "none", mt: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Product</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Stock</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredProducts.map((product) => {
                  const stock = Number(product.stock) || 0;
                  const statusLabel =
                    stock > 10
                      ? "In Stock"
                      : stock > 0
                        ? "Low Stock"
                        : "Out of Stock";
                  const statusColor =
                    stock > 10 ? "success" : stock > 0 ? "warning" : "error";
                  return (
                    <TableRow key={product.id || product._id} hover>
                      <TableCell sx={{ py: 2 }}>
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Box
                            component="img"
                            src={product.image || "/placeholder.png"}
                            alt={product.name}
                            sx={{
                              width: 60,
                              height: 60,
                              objectFit: "cover",
                              borderRadius: 1,
                              border: "1px solid",
                              borderColor: "divider",
                            }}
                          />
                          <Box>
                            <Typography fontWeight={700}>
                              {product.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {product.brand}
                            </Typography>
                          </Box>
                        </Stack>
                      </TableCell>
                      <TableCell>{product.category || "-"}</TableCell>
                      <TableCell>{product.type || "-"}</TableCell>
                      <TableCell>{product.stock ?? "-"}</TableCell>
                      <TableCell>
                        {formatPrice(
                          calculateFinalPrice(
                            product.originalPrice,
                            product.discount,
                          ),
                        )}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={statusLabel}
                          color={statusColor}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Stack
                          direction="row"
                          spacing={1}
                          justifyContent="flex-end"
                          flexWrap="wrap"
                        >
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() =>
                              navigate(
                                `/admin/add-product?edit=${product.id || product._id}`,
                              )
                            }
                          >
                            Edit
                          </Button>
                          <Button
                            size="small"
                            variant="contained"
                            color="error"
                            onClick={() =>
                              handleDeleteProduct(product.id || product._id)
                            }
                          >
                            Delete
                          </Button>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Box>
  );
}
