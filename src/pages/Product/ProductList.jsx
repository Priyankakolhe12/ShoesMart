import {
  Box,
  Typography,
  TextField,
  Paper,
  Stack,
  CircularProgress,
  InputAdornment,
  IconButton,
  Button,
  Select,
  MenuItem,
  Chip,
  Divider,
  Drawer,
  useMediaQuery,
  Grid,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";

import { useEffect, useState, useMemo } from "react";
import { useTheme } from "@mui/material/styles";

import ProductCard from "./ProductCard";
import { getRequest } from "../../api/baseApi";

export default function ProductList() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const [category, setCategory] = useState("all");
  const [type, setType] = useState("all");
  const [sort, setSort] = useState("default");

  const [openFilter, setOpenFilter] = useState(false);

  /* DEBOUNCE */
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  /* FETCH */
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    const data = await getRequest("/products");
    setProducts(data);
    setLoading(false);
  };

  /* FILTER LOGIC */
  const filtered = useMemo(() => {
    let result = [...products];
    const term = debouncedSearch.toLowerCase();

    result = result.filter((p) => {
      const matchSearch = p.name.toLowerCase().includes(term);
      const matchCategory = category === "all" || p.category === category;
      const matchType = type === "all" || p.type === type;

      return matchSearch && matchCategory && matchType;
    });

    if (sort === "priceLow") result.sort((a, b) => a.price - b.price);
    if (sort === "priceHigh") result.sort((a, b) => b.price - a.price);

    return result;
  }, [products, debouncedSearch, category, type, sort]);

  const clearFilters = () => {
    setSearch("");
    setCategory("all");
    setType("all");
    setSort("default");
  };

  const formatLabel = (text) => text?.charAt(0).toUpperCase() + text?.slice(1);

  /* FILTER COMPONENT */
  const Filters = () => (
    <Paper sx={{ p: 2, borderRadius: 3 }}>
      <Typography fontWeight={600} mb={2}>
        Filters
      </Typography>

      {/* CATEGORY */}
      <Typography fontWeight={600} mb={1}>
        Category
      </Typography>

      <Stack spacing={1} mb={2}>
        {["all", "men", "women", "kids"].map((c) => (
          <Chip
            key={c}
            label={formatLabel(c)}
            clickable
            onClick={() => setCategory(c)}
            sx={{
              justifyContent: "flex-start",
              border: "1px solid",
              borderColor: category === c ? "primary.main" : "divider",
              bgcolor: category === c ? "primary.main" : "transparent",
              color: category === c ? "common.white" : "text.primary",
            }}
          />
        ))}
      </Stack>

      <Divider sx={{ my: 2 }} />

      {/* TYPE */}
      <Typography fontWeight={600} mb={1}>
        Type
      </Typography>

      <Stack spacing={1}>
        {["all", "sports", "running", "casual", "training"].map((t) => (
          <Chip
            key={t}
            label={formatLabel(t)}
            clickable
            onClick={() => setType(t)}
            sx={{
              justifyContent: "flex-start",
              border: "1px solid",
              borderColor: type === t ? "primary.main" : "divider",
              bgcolor: type === t ? "primary.main" : "transparent",
              color: type === t ? "common.white" : "text.primary",
            }}
          />
        ))}
      </Stack>

      <Divider sx={{ my: 2 }} />

      <Button fullWidth onClick={clearFilters} color="error">
        Clear Filters
      </Button>
    </Paper>
  );

  return (
    <Box>
      <Grid container spacing={3}>
        {/* SIDEBAR */}
        {!isMobile && (
          <Grid size={{ md: 3 }}>
            <Box sx={{ position: "sticky", top: 90 }}>
              <Filters />
            </Box>
          </Grid>
        )}

        {/* RIGHT */}
        <Grid size={{ xs: 12, md: 9 }}>
          {/* TOP BAR */}
          <Paper
            sx={{
              p: 1.5,
              mb: 2,
              borderRadius: 3,
              display: "flex",
              flexWrap: "wrap",
              gap: 2,
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <TextField
              placeholder="Search shoes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              size="small"
              sx={{ flex: 1, minWidth: 220 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
                endAdornment: search && (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setSearch("")}>
                      <ClearIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Stack direction="row" spacing={1}>
              <Select
                size="small"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
              >
                <MenuItem value="default">Sort</MenuItem>
                <MenuItem value="priceLow">Price: Low → High</MenuItem>
                <MenuItem value="priceHigh">Price: High → Low</MenuItem>
              </Select>

              {isMobile && (
                <Button variant="outlined" onClick={() => setOpenFilter(true)}>
                  Filters
                </Button>
              )}
            </Stack>
          </Paper>

          {/* ACTIVE FILTERS */}
          {(category !== "all" || type !== "all") && (
            <Stack direction="row" spacing={1} mb={2} flexWrap="wrap">
              {category !== "all" && (
                <Chip
                  label={`Category: ${category}`}
                  onDelete={() => setCategory("all")}
                />
              )}

              {type !== "all" && (
                <Chip label={`Type: ${type}`} onDelete={() => setType("all")} />
              )}

              <Chip label="Clear All" color="error" onClick={clearFilters} />
            </Stack>
          )}

          {/* COUNT */}
          {!loading && (
            <Typography mb={2} color="text.secondary">
              Showing {filtered.length} products
            </Typography>
          )}

          {/* PRODUCTS */}
          {loading ? (
            <Box textAlign="center" mt={6}>
              <CircularProgress />
            </Box>
          ) : filtered.length === 0 ? (
            <Typography textAlign="center" mt={6} color="text.secondary">
              No products found 😕
            </Typography>
          ) : (
            <Grid container spacing={3}>
              {filtered.map((product) => (
                <Grid key={product.id} size={{ xs: 12, sm: 6, md: 4 }}>
                  <ProductCard product={product} />
                </Grid>
              ))}
            </Grid>
          )}
        </Grid>
      </Grid>

      {/* MOBILE FILTER */}
      <Drawer
        anchor="left"
        open={openFilter}
        onClose={() => setOpenFilter(false)}
      >
        <Box sx={{ width: 280, p: 2 }}>
          <Filters />
        </Box>
      </Drawer>
    </Box>
  );
}
