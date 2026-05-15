import {
  Box,
  Typography,
  Paper,
  TextField,
  Stack,
  Button,
  InputAdornment,
  CircularProgress,
  Grid,
  MenuItem,
  Chip,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSnackbar } from "notistack";
import {
  createProduct,
  updateProduct,
  getProductById,
} from "../../api/productApi";

const initialProduct = {
  name: "",
  brand: "",
  category: "men",
  type: "sports",
  originalPrice: "",
  discount: "0",
  stock: "",
  rating: "4.5",
  tag: "new",
  description: "",
  size: "8,9,10",
};

const categoryOptions = [
  { value: "men", label: "Men" },
  { value: "women", label: "Women" },
  { value: "kids", label: "Kids" },
];

const typeOptions = [
  { value: "sports", label: "Sports" },
  { value: "casual", label: "Casual" },
  { value: "formal", label: "Formal" },
];

const tagOptions = [
  { value: "new", label: "New" },
  { value: "popular", label: "Popular" },
  { value: "sale", label: "Sale" },
];

export default function AddProduct() {
  const [product, setProduct] = useState(initialProduct);
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editProductId, setEditProductId] = useState(null);
  const [loadingProduct, setLoadingProduct] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const calculateFinalPrice = (originalPrice, discount) => {
    const original = Number(originalPrice);
    const percent = Number(discount);
    if (!original || Number.isNaN(original)) return 0;
    if (!percent || Number.isNaN(percent)) return original;
    const final = original - (original * percent) / 100;
    return Number(final.toFixed(2));
  };

  useEffect(() => {
    const editId = searchParams.get("edit");

    if (!editId) {
      setEditMode(false);
      setEditProductId(null);
      setProduct(initialProduct);
      setPreview(null);
      return;
    }

    const loadProduct = async () => {
      try {
        setLoadingProduct(true);
        const response = await getProductById(editId);
        const item = response.product || response;

        setProduct({
          name: item.name || "",
          brand: item.brand || "",
          category: item.category || "men",
          type: item.type || "sports",
          originalPrice: item.originalPrice || "",
          discount: item.discount ? String(item.discount) : "0",
          stock: item.stock || "",
          rating: item.rating ? String(item.rating) : "4.5",
          tag: item.tag || "new",
          description: item.description || "",
          size: Array.isArray(item.size)
            ? item.size.join(",")
            : item.size || "8,9,10",
        });
        setPreview(item.image || null);
        setEditProductId(editId);
        setEditMode(true);
      } catch (error) {
        enqueueSnackbar("Unable to load product for edit", {
          variant: "error",
        });
        navigate("/admin", { replace: true });
      } finally {
        setLoadingProduct(false);
      }
    };

    loadProduct();
  }, [searchParams, navigate, enqueueSnackbar]);

  const formatPrice = (value) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(Number(value) || 0);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);
    setPreview(file ? URL.createObjectURL(file) : null);
  };

  const stockStatus = () => {
    const amount = Number(product.stock);
    if (!amount || amount <= 0)
      return { label: "Out of Stock", color: "error" };
    if (amount <= 10) return { label: "Low Stock", color: "warning" };
    return { label: "In Stock", color: "success" };
  };

  const handleSubmit = async () => {
    if (
      !product.name ||
      !product.brand ||
      !product.originalPrice ||
      !product.stock
    ) {
      enqueueSnackbar("Please fill all required fields", {
        variant: "warning",
      });
      return;
    }

    if (!editMode && !imageFile) {
      enqueueSnackbar("Please upload an image", { variant: "warning" });
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("name", product.name);
      formData.append("brand", product.brand);
      formData.append("category", product.category);
      formData.append("type", product.type);
      formData.append(
        "price",
        calculateFinalPrice(product.originalPrice, product.discount),
      );
      formData.append("originalPrice", product.originalPrice);
      formData.append("stock", product.stock);
      formData.append("rating", product.rating);
      formData.append("tag", product.tag);
      formData.append("description", product.description);

      product.size
        .split(",")
        .map((value) => value.trim())
        .filter(Boolean)
        .forEach((value) => formData.append("size", value));

      if (imageFile) {
        formData.append("image", imageFile);
      }

      if (editMode && editProductId) {
        await updateProduct(editProductId, formData, true);
        enqueueSnackbar("Product updated successfully", { variant: "success" });
      } else {
        await createProduct(formData);
        enqueueSnackbar("Product created successfully", { variant: "success" });
      }

      navigate("/admin", { replace: true });
    } catch (error) {
      enqueueSnackbar(error?.message || "Failed to submit product", {
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box p={{ xs: 2, md: 4 }}>
      <Paper
        sx={{
          p: { xs: 2, md: 4 },
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
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
              {editMode ? "Edit Product" : "Add a Product"}
            </Typography>
            <Typography color="text.secondary" sx={{ maxWidth: 560 }}>
              Build a stronger catalog with a clean product form and live
              preview.
            </Typography>
          </Box>
          <Button variant="outlined" onClick={() => navigate("/admin")}>
            Back to Dashboard
          </Button>
        </Stack>

        <Grid container spacing={3}>
          <Grid item xs={12} md={7}>
            <Paper sx={{ p: 3, borderRadius: 3, bgcolor: "background.paper" }}>
              <Stack spacing={3}>
                <TextField
                  label="Product name"
                  value={product.name}
                  onChange={(e) =>
                    setProduct({ ...product, name: e.target.value })
                  }
                  fullWidth
                  required
                  size="small"
                />

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Brand"
                      value={product.brand}
                      onChange={(e) =>
                        setProduct({ ...product, brand: e.target.value })
                      }
                      fullWidth
                      required
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      select
                      label="Category"
                      value={product.category}
                      onChange={(e) =>
                        setProduct({ ...product, category: e.target.value })
                      }
                      fullWidth
                      size="small"
                    >
                      {categoryOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                </Grid>

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      select
                      label="Type"
                      value={product.type}
                      onChange={(e) =>
                        setProduct({ ...product, type: e.target.value })
                      }
                      fullWidth
                      size="small"
                    >
                      {typeOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      select
                      label="Tag"
                      value={product.tag}
                      onChange={(e) =>
                        setProduct({ ...product, tag: e.target.value })
                      }
                      fullWidth
                      size="small"
                    >
                      {tagOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                </Grid>

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Original Price"
                      type="number"
                      value={product.originalPrice}
                      onChange={(e) =>
                        setProduct({
                          ...product,
                          originalPrice: e.target.value,
                        })
                      }
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">₹</InputAdornment>
                        ),
                      }}
                      fullWidth
                      required
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Discount (%)"
                      type="number"
                      value={product.discount}
                      onChange={(e) =>
                        setProduct({ ...product, discount: e.target.value })
                      }
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">%</InputAdornment>
                        ),
                      }}
                      fullWidth
                      size="small"
                    />
                  </Grid>
                </Grid>

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      label="Stock"
                      type="number"
                      value={product.stock}
                      onChange={(e) =>
                        setProduct({ ...product, stock: e.target.value })
                      }
                      fullWidth
                      required
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      label="Rating"
                      type="number"
                      step="0.1"
                      value={product.rating}
                      onChange={(e) =>
                        setProduct({ ...product, rating: e.target.value })
                      }
                      fullWidth
                      required
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      label="Sizes"
                      value={product.size}
                      onChange={(e) =>
                        setProduct({ ...product, size: e.target.value })
                      }
                      placeholder="e.g. 7,8,9"
                      fullWidth
                      required
                      size="small"
                    />
                  </Grid>
                </Grid>

                <TextField
                  label="Description"
                  value={product.description}
                  onChange={(e) =>
                    setProduct({ ...product, description: e.target.value })
                  }
                  fullWidth
                  multiline
                  minRows={4}
                  size="small"
                />

                <Button variant="outlined" component="label" fullWidth>
                  Upload Product Image
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={handleFileChange}
                  />
                </Button>

                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  flexWrap="wrap"
                  gap={2}
                >
                  <Typography color="text.secondary">Final price</Typography>
                  <Typography variant="h6" fontWeight={700}>
                    {formatPrice(
                      calculateFinalPrice(
                        product.originalPrice,
                        product.discount,
                      ),
                    )}
                  </Typography>
                </Box>

                <Box display="flex" gap={2} flexWrap="wrap">
                  <Button variant="outlined" onClick={() => navigate("/admin")}>
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={loading || loadingProduct}
                  >
                    {loading || loadingProduct ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : editMode ? (
                      "Update Product"
                    ) : (
                      "Create Product"
                    )}
                  </Button>
                </Box>
              </Stack>
            </Paper>
          </Grid>

          <Grid item xs={12} md={5}>
            <Paper sx={{ p: 3, borderRadius: 3, bgcolor: "background.paper" }}>
              <Stack spacing={2}>
                <Typography variant="h6" fontWeight={700}>
                  Product preview
                </Typography>
                {preview ? (
                  <Box
                    component="img"
                    src={preview}
                    alt="Product preview"
                    sx={{
                      width: "100%",
                      borderRadius: 3,
                      maxHeight: 320,
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <Box
                    sx={{
                      height: 320,
                      borderRadius: 3,
                      border: "1px dashed",
                      borderColor: "divider",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "text.secondary",
                      bgcolor: "background.default",
                    }}
                  >
                    Image preview will appear here.
                  </Box>
                )}

                <Paper sx={{ p: 2, borderRadius: 3, bgcolor: "grey.50" }}>
                  <Typography variant="subtitle2" color="text.secondary" mb={1}>
                    Quick product summary
                  </Typography>
                  <Typography variant="h6" fontWeight={700} gutterBottom>
                    {product.name || "Product name"}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    {product.brand || "Brand"} • {product.category} •{" "}
                    {product.type}
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap" mb={2}>
                    <Chip label={`Tag: ${product.tag}`} size="small" />
                    <Chip
                      label={stockStatus().label}
                      color={stockStatus().color}
                      size="small"
                    />
                  </Stack>
                  <Stack
                    direction="row"
                    spacing={1}
                    justifyContent="space-between"
                  >
                    <Typography color="text.secondary">Price</Typography>
                    <Typography fontWeight={700}>
                      {formatPrice(
                        calculateFinalPrice(
                          product.originalPrice,
                          product.discount,
                        ),
                      )}
                    </Typography>
                  </Stack>
                  <Stack
                    direction="row"
                    spacing={1}
                    justifyContent="space-between"
                    mt={1}
                  >
                    <Typography color="text.secondary">Original</Typography>
                    <Typography>
                      {formatPrice(product.originalPrice)}
                    </Typography>
                  </Stack>
                </Paper>
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}
