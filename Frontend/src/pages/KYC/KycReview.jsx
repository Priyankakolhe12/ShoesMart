import {
  Box,
  Typography,
  Paper,
  Button,
  Stack,
  Divider,
  Grid,
} from "@mui/material";

import { useLocation, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { updateUser } from "../../api/userApi";
import { useSnackbar } from "notistack";
import { convertToBase64 } from "../../utils/FileConverter";

export default function KycReview() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { user, refreshUser } = useContext(AuthContext);
  const { enqueueSnackbar } = useSnackbar();

  const [loading, setLoading] = useState(false);

  if (!state) {
    return <Typography>No data found</Typography>;
  }

  const { form, document } = state;

  const handleFinalSubmit = async () => {
    try {
      setLoading(true);
      let preview = document?.preview;

      // ✅ convert blob/file → base64
      if (document?.file instanceof File) {
        preview = await convertToBase64(document.file);
      }
      const payload = {
        ...user,
        kyc: {
          fullName: form.fullName,
          phone: form.phone,
          gender: form.gender,
          dob: form.dob,
          occupation: form.occupation,

          address1: form.address1,
          address2: form.address2,
          city: form.city,
          state: form.state,
          zip: form.zip,
          country: form.country,

          docType: form.docType,
          docNumber: form.docNumber,

          documentName: document?.name,
          documentPreview: preview,

          status: "pending",
          submittedAt: new Date().toISOString(),
        },
      };
      const res = await updateUser(user.id, payload);
      if (!user?.id) {
        console.error("User ID missing before KYC submit");
        return;
      }
      // ✅ ensure refresh finishes
      await refreshUser();

      enqueueSnackbar("KYC submitted successfully 🎉", {
        variant: "success",
      });

      setTimeout(() => {
        navigate("/kyc-status", { replace: true });
      }, 50);
    } catch (err) {
      console.error("REAL ERROR:", err);

      // 🔥 Only show error if truly failed
      if (err?.message) {
        enqueueSnackbar("Failed to submit KYC", {
          variant: "error",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const Row = ({ label, value }) => (
    <Box display="flex" justifyContent="space-between">
      <Typography color="text.secondary">{label}</Typography>
      <Typography fontWeight={500}>{value || "-"}</Typography>
    </Box>
  );
  const isPdf =
    document?.type === "application/pdf" ||
    document?.name?.toLowerCase().endsWith(".pdf");
  return (
    <Box display="flex" justifyContent="center" py={4} px={2}>
      <Box width="100%" maxWidth={850}>
        <Paper sx={{ p: 4, borderRadius: 3 }}>
          <Typography variant="h5" fontWeight={600}>
            Review Your KYC
          </Typography>

          <Stack spacing={3} mt={3}>
            {/* PERSONAL */}
            <Box>
              <Typography fontWeight={600} mb={1}>
                Personal Details
              </Typography>

              <Stack spacing={1}>
                <Row label="Full Name" value={form.fullName} />
                <Row label="Phone" value={form.phone} />
                <Row label="Date of Birth" value={form.dob} />
                <Row label="Gender" value={form.gender} />
                <Row label="Occupation" value={form.occupation} />
              </Stack>
            </Box>

            <Divider />

            {/* ADDRESS */}
            <Box>
              <Typography fontWeight={600} mb={1}>
                Address Details
              </Typography>

              <Stack spacing={1}>
                <Row label="Address 1" value={form.address1} />
                <Row label="Address 2" value={form.address2} />
                <Row label="City" value={form.city} />
                <Row label="State" value={form.state} />
                <Row label="ZIP" value={form.zip} />
                <Row label="Country" value={form.country} />
              </Stack>
            </Box>

            <Divider />

            {/* DOCUMENT */}
            <Box>
              <Typography fontWeight={600} mb={1}>
                Document Details
              </Typography>

              <Stack spacing={1}>
                <Row label="Type" value={form.docType} />
                <Row label="Number" value={form.docNumber} />
              </Stack>

              {/* 🔥 PREVIEW */}
              {document?.preview && (
                <Box mt={2}>
                  <Typography fontWeight={500} mb={1}>
                    Document Preview
                  </Typography>

                  {isPdf ? (
                    <iframe
                      src={document.preview}
                      title="PDF Preview"
                      style={{
                        width: "100%",
                        height: 300,
                        borderRadius: 10,
                        border: "1px solid #ddd",
                      }}
                    />
                  ) : (
                    <Box
                      component="img"
                      src={document.preview}
                      alt="doc"
                      sx={{
                        width: "100%",
                        maxHeight: 300,
                        objectFit: "contain",
                        borderRadius: 2,
                        border: "1px solid",
                        borderColor: "divider",
                      }}
                    />
                  )}
                </Box>
              )}
            </Box>

            <Divider />

            {/* ACTIONS */}
            <Stack direction="row" spacing={2}>
              <Button
                variant="outlined"
                onClick={() =>
                  navigate("/kyc", {
                    state: {
                      form: form,
                      document: document,
                    },
                  })
                }
              >
                Edit
              </Button>

              <Button
                variant="contained"
                onClick={handleFinalSubmit}
                disabled={loading}
              >
                {loading ? "Submitting..." : "Confirm & Submit"}
              </Button>
            </Stack>
          </Stack>
        </Paper>
      </Box>
    </Box>
  );
}
