import {
  Box,
  Typography,
  Paper,
  Stack,
  Button,
  Chip,
  Divider,
  Alert,
} from "@mui/material";

import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import HourglassTopIcon from "@mui/icons-material/HourglassTop";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";

export default function KycStatus() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const kyc = user?.kyc || {};
  const status = kyc?.status ?? null;

  const formatDate = (date) => (date ? new Date(date).toLocaleString() : "-");

  const isPdf =
    kyc.documentName?.toLowerCase().endsWith(".pdf") ||
    kyc.documentPreview?.startsWith("data:application/pdf");

  const STATUS = {
    approved: {
      label: "Approved",
      color: "success",
      icon: <CheckCircleIcon sx={{ fontSize: 60 }} />,
      message: "Your identity has been verified successfully.",
    },
    rejected: {
      label: "Rejected",
      color: "error",
      icon: <CancelIcon sx={{ fontSize: 60 }} />,
      message: "KYC rejected. Please review and resubmit.",
    },
    pending: {
      label: "Under Review",
      color: "warning",
      icon: <HourglassTopIcon sx={{ fontSize: 60 }} />,
      message: "Your documents are under verification.",
    },
    default: {
      label: "Not Submitted",
      color: "default",
      icon: <RadioButtonUncheckedIcon sx={{ fontSize: 60 }} />,
      message: "Complete your KYC to continue.",
    },
  };

  const config = STATUS[status] || STATUS.default;

  const Step = ({ title, active, done }) => (
    <Box display="flex" alignItems="center" gap={2}>
      <Box
        sx={{
          width: 14,
          height: 14,
          borderRadius: "50%",
          bgcolor: done ? "success.main" : active ? "warning.main" : "grey.300",
        }}
      />
      <Typography
        fontWeight={active || done ? 600 : 400}
        color={active || done ? "text.primary" : "text.secondary"}
      >
        {title}
      </Typography>
    </Box>
  );

  return (
    <Box display="flex" justifyContent="center" py={5} px={2}>
      <Box width="100%" maxWidth="760px">
        <Paper
          sx={{
            borderRadius: 4,
            p: { xs: 3, md: 4 },
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <Stack spacing={2} alignItems="center">
            <Box
              sx={{
                p: 2,
                borderRadius: "50%",
                bgcolor: `${config.color}.light`,
              }}
            >
              {config.icon}
            </Box>

            <Chip label={config.label} color={config.color} />

            <Typography textAlign="center" color="text.secondary">
              {config.message}
            </Typography>
          </Stack>

          {status === "rejected" && (
            <Alert severity="error" sx={{ mt: 2 }}>
              <b>Reason:</b>{" "}
              {kyc.reason ||
                "Your KYC was rejected. Please check your details and resubmit."}
            </Alert>
          )}

          <Divider sx={{ my: 3 }} />

          <Box>
            <Typography fontWeight={600} mb={2}>
              Verification Progress
            </Typography>

            <Stack spacing={2}>
              <Step title="KYC Submitted" done={!!kyc.submittedAt} />
              <Step
                title="Under Review"
                active={status === "pending"}
                done={status === "approved"}
              />
              <Step title="Approved" done={status === "approved"} />
              {status === "rejected" && <Step title="Rejected" done />}
            </Stack>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Paper
            variant="outlined"
            sx={{
              p: 2,
              borderRadius: 2,
              bgcolor: "grey.50",
            }}
          >
            <Typography fontWeight={600} mb={1.5}>
              Submitted Details
            </Typography>

            <Stack spacing={1}>
              <Typography>
                <b>Name:</b> {kyc.fullName || user?.name || "-"}
              </Typography>
              <Typography>
                <b>Email:</b> {user?.email || "-"}
              </Typography>
              <Typography>
                <b>Phone:</b> {kyc.phone || "-"}
              </Typography>
              <Typography>
                <b>Date of Birth:</b> {kyc.dob || "-"}
              </Typography>
              <Typography>
                <b>Gender:</b> {kyc.gender || "-"}
              </Typography>
              <Typography>
                <b>Occupation:</b> {kyc.occupation || "-"}
              </Typography>

              <Divider sx={{ my: 1 }} />

              <Typography>
                <b>Address Line 1:</b> {kyc.address1 || "-"}
              </Typography>
              <Typography>
                <b>Address Line 2:</b> {kyc.address2 || "-"}
              </Typography>
              <Typography>
                <b>City:</b> {kyc.city || "-"}
              </Typography>
              <Typography>
                <b>State:</b> {kyc.state || "-"}
              </Typography>
              <Typography>
                <b>ZIP:</b> {kyc.zip || "-"}
              </Typography>
              <Typography>
                <b>Country:</b> {kyc.country || "-"}
              </Typography>

              <Divider sx={{ my: 1 }} />

              <Typography>
                <b>Document Type:</b> {kyc.docType || "-"}
              </Typography>
              <Typography>
                <b>Document Number:</b> {kyc.docNumber || "-"}
              </Typography>

              <Divider sx={{ my: 1 }} />

              <Typography>
                <b>Submitted:</b> {formatDate(kyc.submittedAt)}
              </Typography>
              <Typography>
                <b>Reviewed:</b> {formatDate(kyc.reviewedAt)}
              </Typography>

              {status === "rejected" && (
                <Typography color="error">
                  <b>Rejection Reason:</b> {kyc.reason || "-"}
                </Typography>
              )}
            </Stack>
          </Paper>

          {kyc.documentPreview && (
            <Box mt={3}>
              <Typography fontWeight={600} mb={1}>
                Document Preview
              </Typography>

              {isPdf ? (
                <iframe
                  src={kyc.documentPreview}
                  title="Document Preview"
                  style={{
                    width: "100%",
                    height: 320,
                    borderRadius: 8,
                    border: "1px solid #ddd",
                    background: "#fff",
                  }}
                />
              ) : (
                <Box
                  component="img"
                  src={kyc.documentPreview}
                  alt="document preview"
                  sx={{
                    width: "100%",
                    maxHeight: 420,
                    objectFit: "contain",
                    borderRadius: 2,
                    border: "1px solid",
                    borderColor: "divider",
                    bgcolor: "#fff",
                  }}
                />
              )}
            </Box>
          )}

          <Divider sx={{ my: 3 }} />

          <Stack spacing={1}>
            {(status === "pending" || status === "rejected") && (
              <Button
                variant="outlined"
                onClick={() =>
                  navigate("/kyc", {
                    state: {
                      form: kyc,
                      document: {
                        name: kyc.documentName,
                        preview: kyc.documentPreview,
                        type: isPdf ? "application/pdf" : "image",
                      },
                    },
                  })
                }
              >
                Edit KYC
              </Button>
            )}

            {status === "approved" && (
              <Button
                variant="contained"
                color="success"
                onClick={() => navigate("/", { replace: true })}
              >
                Continue Shopping
              </Button>
            )}

            {status === "rejected" && (
              <Button
                variant="contained"
                color="error"
                onClick={() =>
                  navigate("/kyc", {
                    state: {
                      form: kyc,
                      document: {
                        name: kyc.documentName,
                        preview: kyc.documentPreview,
                        type: isPdf ? "application/pdf" : "image",
                      },
                    },
                  })
                }
              >
                Re-submit KYC
              </Button>
            )}

            {status === "pending" && (
              <Button disabled>Verification in progress...</Button>
            )}

            {!status && (
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
            )}
          </Stack>
        </Paper>
      </Box>
    </Box>
  );
}
