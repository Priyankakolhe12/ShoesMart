import { createSlice, createSelector } from "@reduxjs/toolkit";

/* =============================
   SAFE LOAD WITH VERSION
============================= */
const loadCart = () => {
  try {
    const data = localStorage.getItem("cart");
    const parsed = data ? JSON.parse(data) : null;

    if (!parsed || parsed.version !== 1) return [];

    return (parsed.items || []).map((item) => ({
      id: item.id,
      name: item.name || "",
      price: Number(item.price) || 0,
      qty: Math.max(1, Number(item.qty) || 1),
      stock: item.stock ?? null,
      image: item.image || "",
    }));
  } catch {
    return [];
  }
};

const initialState = {
  items: loadCart(),
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const product = action.payload;
      if (!product?.id) return;

      const existing = state.items.find((i) => i.id === product.id);

      if (existing) {
        if (product.stock != null && existing.qty >= product.stock) return;
        existing.qty += 1;
      } else {
        state.items.push({
          id: product.id,
          name: product.name || "",
          price: Number(product.price) || 0,
          image: product.image || "",
          stock: product.stock ?? null,
          qty: 1,
        });
      }
    },

    removeFromCart: (state, action) => {
      state.items = state.items.filter((i) => i.id !== action.payload);
    },

    increaseQty: (state, action) => {
      const item = state.items.find((i) => i.id === action.payload);
      if (!item) return;

      if (item.stock != null && item.qty >= item.stock) return;
      item.qty += 1;
    },

    decreaseQty: (state, action) => {
      const item = state.items.find((i) => i.id === action.payload);
      if (!item) return;

      if (item.qty <= 1) {
        state.items = state.items.filter((i) => i.id !== action.payload);
      } else {
        item.qty -= 1;
      }
    },

    setQty: (state, action) => {
      const { id, qty } = action.payload;
      const item = state.items.find((i) => i.id === id);
      if (!item) return;

      const safeQty = Math.max(1, Number(qty) || 1);
      if (item.stock != null && safeQty > item.stock) return;

      item.qty = safeQty;
    },

    clearCart: (state) => {
      state.items = [];
    },

    replaceCart: (state, action) => {
      state.items = action.payload || [];
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  increaseQty,
  decreaseQty,
  setQty,
  clearCart,
  replaceCart,
} = cartSlice.actions;

export default cartSlice.reducer;

/* =============================
   SELECTORS (IMPROVED)
============================= */
export const selectCartItems = (state) => state.cart.items;

export const selectCartCount = createSelector([selectCartItems], (items) =>
  items.reduce((sum, item) => sum + item.qty, 0),
);

export const selectCartSubtotal = createSelector([selectCartItems], (items) =>
  items.reduce((sum, item) => sum + item.price * item.qty, 0),
);

export const selectCartSummary = createSelector(
  [selectCartSubtotal],
  (subtotal) => {
    const shipping = subtotal > 999 ? 0 : 99;
    const tax = subtotal * 0.05;

    return {
      subtotal,
      shipping,
      tax,
      total: Math.round(subtotal + shipping + tax),
    };
  },
);

/* =============================
   LISTENER
============================= */
export const setupCartListener = (store) => {
  let timeout;

  store.subscribe(() => {
    clearTimeout(timeout);

    timeout = setTimeout(() => {
      const state = store.getState();

      try {
        localStorage.setItem(
          "cart",
          JSON.stringify({
            version: 1,
            items: state.cart.items,
          }),
        );
      } catch (e) {
        console.error("Cart save failed", e);
        localStorage.removeItem("cart");
      }
    }, 300);
  });

  window.addEventListener("storage", (e) => {
    if (e.key === "cart" && e.newValue) {
      try {
        const parsed = JSON.parse(e.newValue);
        store.dispatch(replaceCart(parsed.items || []));
      } catch {}
    }
  });
};
