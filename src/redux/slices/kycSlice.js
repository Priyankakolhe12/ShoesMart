import { createSlice, createSelector } from "@reduxjs/toolkit";

/* =============================
   CONFIG
============================= */
const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
const MAX_SIZE = 2 * 1024 * 1024;

/* =============================
   LOAD
============================= */
const loadKyc = () => {
  try {
    const data = localStorage.getItem("kyc");
    const parsed = data ? JSON.parse(data) : null;

    if (!parsed || parsed.version !== 1) return {};

    // ❌ DO NOT RESTORE PREVIEW (important)
    const docs = parsed.documents || {};

    Object.keys(docs).forEach((key) => {
      docs[key].preview = null;
    });

    return docs;
  } catch {
    return {};
  }
};

/* =============================
   INITIAL STATE
============================= */
const initialState = {
  documents: loadKyc(),
  error: null,
  status: "idle", // 🔥 NEW (idle | uploading | success)
};

/* =============================
   SLICE
============================= */
const kycSlice = createSlice({
  name: "kyc",
  initialState,
  reducers: {
    /* =============================
       SET FILE
    ============================= */
    setFile: (state, action) => {
      const { key, file } = action.payload;

      state.error = null;
      state.status = "uploading";

      /* ❌ VALIDATION */
      if (!file) {
        state.error = "No file selected";
        state.status = "idle";
        return;
      }

      if (!allowedTypes.includes(file.type)) {
        state.error = "Only JPG, PNG or PDF allowed";
        state.status = "idle";
        return;
      }

      if (file.size > MAX_SIZE) {
        state.error = "File must be less than 2MB";
        state.status = "idle";
        return;
      }

      /* 🔥 REMOVE OLD PREVIEW */
      if (state.documents[key]?.preview) {
        URL.revokeObjectURL(state.documents[key].preview);
      }

      /* ✅ CREATE PREVIEW */
      let preview = file.preview;

      if (file instanceof File) {
        preview = URL.createObjectURL(file);
      }

      state.documents[key] = {
        name: file.name,
        type: file.type,
        size: file.size,
        sizeLabel: (file.size / 1024).toFixed(1) + " KB", // 🔥 UX
        preview,
        uploadedAt: new Date().toISOString(),
      };

      state.status = "success";
    },

    /* =============================
       REMOVE FILE
    ============================= */
    removeFile: (state, action) => {
      const key = action.payload;

      if (state.documents[key]?.preview) {
        URL.revokeObjectURL(state.documents[key].preview);
      }

      delete state.documents[key];
      state.status = "idle";
    },

    /* =============================
       CLEAR ALL
    ============================= */
    clearKyc: (state) => {
      Object.values(state.documents).forEach((doc) => {
        if (doc.preview) URL.revokeObjectURL(doc.preview);
      });

      state.documents = {};
      state.error = null;
      state.status = "idle";
    },

    /* =============================
       CLEAR ERROR
    ============================= */
    clearError: (state) => {
      state.error = null;
    },

    /* =============================
       RESET (LOGOUT SAFE)
    ============================= */
    resetKyc: () => initialState,
  },
});

/* =============================
   EXPORTS
============================= */
export const { setFile, removeFile, clearKyc, clearError, resetKyc } =
  kycSlice.actions;

export default kycSlice.reducer;

/* =============================
   SELECTORS
============================= */
export const selectKycDocs = (state) => state.kyc.documents;

export const selectKycError = (state) => state.kyc.error;

export const selectKycStatus = (state) => state.kyc.status;

export const selectKycDocList = createSelector([selectKycDocs], (docs) =>
  Object.entries(docs).map(([key, value]) => ({
    key,
    ...value,
  })),
);

/* =============================
   LISTENER (PERSISTENCE)
============================= */
export const setupKycListener = (store) => {
  let timeout;

  store.subscribe(() => {
    clearTimeout(timeout);

    timeout = setTimeout(() => {
      const state = store.getState();

      try {
        localStorage.setItem(
          "kyc",
          JSON.stringify({
            version: 1,
            documents: state.kyc.documents,
          }),
        );
      } catch (e) {
        console.error("KYC save failed", e);
        localStorage.removeItem("kyc");
      }
    }, 300);
  });
};
