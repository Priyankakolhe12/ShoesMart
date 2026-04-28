import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Stack,
  Divider,
  Checkbox,
  FormControlLabel,
  Alert,
  MenuItem,
  Grid,
} from "@mui/material";

import { useState, useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setFile,
  removeFile,
  clearKyc,
  selectKycDocs,
  selectKycError,
} from "../../redux/slices/kycSlice";

import { AuthContext } from "../../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { useSnackbar } from "notistack";
import { updateUser } from "../../api/userApi";
import { useForm, Controller } from "react-hook-form";

export default function KycForm() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const { state } = useLocation();
  const { enqueueSnackbar } = useSnackbar();

  const dispatch = useDispatch();
  const documents = useSelector(selectKycDocs);
  const fileError = useSelector(selectKycError);

  const { control, watch } = useForm({
    defaultValues: {
      declaration: false,
    },
  });

  const declaration = watch("declaration");

  const [form, setForm] = useState(
    state?.form || {
      fullName: "",
      phone: "",
      dob: "",
      gender: "",
      occupation: "",
      address1: "",
      address2: "",
      city: "",
      state: "",
      zip: "",
      country: "",
      docType: "",
      docNumber: "",
    },
  );

  useEffect(() => {
    if (state?.document) {
      dispatch(
        setFile({
          key: "idProof",
          file: {
            name: state.document.name,
            preview: state.document.preview,
            type: state.document.type,
          },
        }),
      );
    } else {
      dispatch(clearKyc());
    }
  }, [state, dispatch]);
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    dispatch(setFile({ key: "idProof", file }));
  };

  const handleRemoveFile = () => {
    dispatch(removeFile("idProof"));
  };

  /* 🔥 VALIDATIONS */
  const isValidPhone = /^[6-9]\d{9}$/.test(form.phone);
  const isValidZip = /^[1-9][0-9]{5}$/.test(form.zip);

  const validateDocNumber = () => {
    if (form.docType === "pan")
      return /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(form.docNumber);
    if (form.docType === "aadhaar") return /^\d{12}$/.test(form.docNumber);
    if (form.docType === "passport")
      return /^[A-Z0-9]{6,9}$/.test(form.docNumber);
    return false;
  };

  const isFormValid =
    form.fullName &&
    isValidPhone &&
    form.dob &&
    form.gender &&
    form.address1 &&
    form.city &&
    form.state &&
    isValidZip &&
    form.country &&
    form.docType &&
    validateDocNumber() &&
    documents?.idProof?.preview &&
    declaration;

  const handleSubmit = () => {
    if (!isFormValid) {
      enqueueSnackbar("Please fill all fields correctly", {
        variant: "warning",
      });
      return;
    }

    navigate("/kyc-review", {
      state: {
        form,
        document: documents.idProof,
      },
    });
  };

  return (
    <Box display="flex" justifyContent="center" py={4} px={2}>
      <Box width="100%" maxWidth="950px">
        <Paper
          sx={{
            borderRadius: 3,
            p: { xs: 2, md: 4 },
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <Typography variant="h5" fontWeight={600}>
            Complete Your KYC
          </Typography>

          <Stack spacing={4} mt={3}>
            {/* PERSONAL */}
            <Box>
              <Typography fontWeight={600} mb={2}>
                Personal Details
              </Typography>

              <Grid container spacing={2}>
                {/* FULL NAME */}
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    name="fullName"
                    label="Full Name"
                    fullWidth
                    size="small"
                    value={form.fullName || ""}
                    sx={{ maxWidth: 400 }} // 🔥 LIMIT WIDTH
                    onChange={handleChange}
                  />
                </Grid>

                {/* EMAIL */}
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    value={user?.email}
                    label="Email"
                    fullWidth
                    size="small"
                    sx={{ maxWidth: 400 }}
                    disabled
                  />
                </Grid>

                {/* PHONE */}
                <Grid size={{ xs: 12, md: 4 }}>
                  <TextField
                    name="phone"
                    label="Phone"
                    fullWidth
                    size="small"
                    sx={{ maxWidth: 260 }}
                    value={form.phone}
                    onChange={handleChange}
                    error={!!form.phone && !isValidPhone}
                    helperText={
                      form.phone && !isValidPhone
                        ? "Enter valid 10-digit phone number"
                        : ""
                    }
                  />
                </Grid>

                {/* DOB */}
                <Grid size={{ xs: 12, md: 4 }}>
                  <TextField
                    type="date"
                    name="dob"
                    fullWidth
                    size="small"
                    value={form.dob}
                    sx={{ maxWidth: 220 }}
                    InputLabelProps={{ shrink: true }}
                    onChange={handleChange}
                  />
                </Grid>

                {/* GENDER */}
                <Grid size={{ xs: 12, md: 4 }}>
                  <TextField
                    select
                    name="gender"
                    label="Gender"
                    fullWidth
                    size="small"
                    sx={{ maxWidth: 220 }}
                    value={form.gender || ""} // 🔥 IMPORTANT
                    onChange={handleChange}
                  >
                    <MenuItem value="">Select</MenuItem>
                    <MenuItem value="male">Male</MenuItem>
                    <MenuItem value="female">Female</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                  </TextField>
                </Grid>

                {/* OCCUPATION */}
                <Grid size={{ xs: 12 }}>
                  <TextField
                    name="occupation"
                    label="Occupation"
                    fullWidth
                    size="small"
                    sx={{ maxWidth: 400 }}
                    value={form.occupation}
                    onChange={handleChange}
                  />
                </Grid>
              </Grid>
            </Box>

            <Divider />

            {/* ADDRESS */}
            <Box>
              <Typography fontWeight={600} mb={2}>
                Address Details
              </Typography>

              <Grid container spacing={2}>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    name="address1"
                    label="Address Line 1"
                    fullWidth
                    value={form.address1}
                    onChange={handleChange}
                  />
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <TextField
                    name="address2"
                    label="Address Line 2"
                    fullWidth
                    value={form.address2}
                    onChange={handleChange}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    name="city"
                    label="City"
                    fullWidth
                    value={form.city}
                    onChange={handleChange}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    name="state"
                    label="State"
                    fullWidth
                    value={form.state}
                    onChange={handleChange}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    name="zip"
                    label="ZIP"
                    fullWidth
                    value={form.zip}
                    onChange={handleChange}
                    error={!!(form.zip && !isValidZip)}
                    helperText={
                      form.zip && !isValidZip ? "Invalid ZIP code" : ""
                    }
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    name="country"
                    label="Country"
                    fullWidth
                    value={form.country}
                    onChange={handleChange}
                  />
                </Grid>
              </Grid>
            </Box>

            <Divider />

            {/* DOCUMENT */}
            <Box>
              <Typography fontWeight={600} mb={2}>
                Document Verification
              </Typography>

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    select
                    name="docType"
                    label="Document Type"
                    fullWidth
                    value={form.docType || ""} // 🔥 IMPORTANT
                    onChange={handleChange}
                  >
                    <MenuItem value="">Select Document</MenuItem>
                    <MenuItem value="aadhaar">Aadhaar</MenuItem>
                    <MenuItem value="pan">PAN</MenuItem>
                    <MenuItem value="passport">Passport</MenuItem>
                  </TextField>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    name="docNumber"
                    label="Document Number"
                    fullWidth
                    value={form.docNumber}
                    onChange={handleChange}
                    error={!!(form.docNumber && !validateDocNumber())}
                    helperText={
                      form.docNumber && !validateDocNumber()
                        ? "Invalid document number"
                        : ""
                    }
                  />
                </Grid>
              </Grid>

              {/* 🔥 FILE UPLOAD */}
              <Box
                mt={2}
                p={3}
                sx={{
                  border: "2px dashed",
                  borderColor: "divider",
                  borderRadius: 2,
                  textAlign: "center",
                  bgcolor: "grey.50",
                }}
              >
                <Typography variant="body2" mb={1}>
                  Upload ID Proof (JPG, PNG, PDF)
                </Typography>

                <Button variant="outlined" component="label">
                  Choose File
                  <input
                    hidden
                    type="file"
                    accept="image/png, image/jpeg, application/pdf"
                    onChange={handleFile}
                  />
                </Button>

                {documents?.idProof?.name && (
                  <Typography mt={1}>📄 {documents.idProof.name}</Typography>
                )}

                {/* PREVIEW */}
                {documents?.idProof?.preview && (
                  <Box mt={2}>
                    {documents.idProof.type === "application/pdf" ? (
                      <iframe
                        src={documents.idProof.preview}
                        title="PDF Preview"
                        style={{
                          width: "100%",
                          height: 250,
                          borderRadius: 8,
                        }}
                      />
                    ) : (
                      <img
                        src={documents.idProof.preview}
                        alt="preview"
                        style={{
                          width: "100%",
                          maxHeight: 250,
                          objectFit: "contain",
                          borderRadius: 8,
                        }}
                      />
                    )}
                  </Box>
                )}

                {documents?.idProof?.preview && (
                  <Button
                    color="error"
                    size="small"
                    sx={{ mt: 1 }}
                    onClick={handleRemoveFile}
                  >
                    Remove File
                  </Button>
                )}
              </Box>

              {fileError && <Alert severity="error">{fileError}</Alert>}
            </Box>

            <Divider />

            <Controller
              name="declaration"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                    />
                  }
                  label="I confirm details are correct"
                />
              )}
            />

            <Button
              variant="contained"
              disabled={!isFormValid}
              onClick={handleSubmit}
              size="large"
              sx={{ py: 1.3 }}
            >
              Review KYC
            </Button>
          </Stack>
        </Paper>
      </Box>
    </Box>
  );
}
