import {
  Box,
  Typography,
  Paper,
  Stack,
  Button,
  Chip,
  Divider,
  Tabs,
  Tab,
  TextField,
  CircularProgress,
  Grid,
} from "@mui/material";
import { useEffect, useState } from "react";
import { getRequest } from "../../api/baseApi";
import { updateUser } from "../../api/userApi";
import { useSnackbar } from "notistack";

export default function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [tab, setTab] = useState("pending");
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [rejectionReasons, setRejectionReasons] = useState({});

  const { enqueueSnackbar } = useSnackbar();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getRequest("/users");
      setUsers(data);
    } catch {
      enqueueSnackbar("Failed to load users", { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAction = async (user, status) => {
    try {
      await updateUser(user.id, {
        kyc: {
          ...user.kyc,
          status,
          reason:
            status === "rejected"
              ? rejectionReasons[user.id] || "Invalid details"
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

  const filteredUsers = users
    .filter((u) => (u.kyc?.status || "none") === tab)
    .filter(
      (u) =>
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase()),
    );

  const stats = {
    pending: users.filter((u) => u.kyc?.status === "pending").length,
    approved: users.filter((u) => u.kyc?.status === "approved").length,
    rejected: users.filter((u) => u.kyc?.status === "rejected").length,
  };

  return (
    <Box p={{ xs: 2, md: 4 }}>
      {/* HEADER */}
      <Typography variant="h4" fontWeight={700} mb={1}>
        Admin Dashboard
      </Typography>

      <Typography color="text.secondary" mb={3}>
        Manage KYC approvals and user verification
      </Typography>

      {/* STATS */}
      <Stack direction="row" spacing={2} mb={3} flexWrap="wrap">
        <Chip label={`Pending: ${stats.pending}`} color="warning" />
        <Chip label={`Approved: ${stats.approved}`} color="success" />
        <Chip label={`Rejected: ${stats.rejected}`} color="error" />
      </Stack>

      {/* SEARCH */}
      <TextField
        placeholder="Search users..."
        size="small"
        fullWidth
        sx={{ mb: 3, maxWidth: 400 }}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* TABS */}
      <Tabs value={tab} onChange={(e, val) => setTab(val)} sx={{ mb: 3 }}>
        <Tab label="Pending" value="pending" />
        <Tab label="Approved" value="approved" />
        <Tab label="Rejected" value="rejected" />
      </Tabs>

      {/* LOADING */}
      {loading ? (
        <Box textAlign="center" mt={6}>
          <CircularProgress />
        </Box>
      ) : filteredUsers.length === 0 ? (
        <Typography textAlign="center" mt={5} color="text.secondary">
          No users found
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {filteredUsers.map((user) => {
            const kyc = user.kyc || {};

            return (
              <Grid key={user.id} size={{ xs: 12, md: 6 }}>
                <Paper
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    border: "1px solid",
                    borderColor: "divider",
                    transition: "0.25s",

                    "&:hover": {
                      boxShadow: 3,
                    },
                  }}
                >
                  <Stack spacing={2}>
                    {/* USER INFO */}
                    <Box>
                      <Typography fontWeight={600}>{user.name}</Typography>

                      <Typography variant="body2" color="text.secondary">
                        {user.email}
                      </Typography>
                    </Box>

                    {/* STATUS */}
                    <Chip
                      label={kyc.status || "Not Submitted"}
                      color={
                        kyc.status === "approved"
                          ? "success"
                          : kyc.status === "rejected"
                            ? "error"
                            : "warning"
                      }
                    />

                    <Divider />

                    {/* DOCUMENT PREVIEW */}
                    {kyc.documentPreview && (
                      <Box>
                        <Typography fontSize={13} mb={1}>
                          Document
                        </Typography>

                        {kyc.documentPreview.includes("pdf") ? (
                          <iframe
                            src={kyc.documentPreview}
                            style={{
                              width: "100%",
                              height: 180,
                              borderRadius: 8,
                            }}
                          />
                        ) : (
                          <Box
                            component="img"
                            src={kyc.documentPreview}
                            sx={{
                              width: "100%",
                              borderRadius: 2,
                            }}
                          />
                        )}
                      </Box>
                    )}

                    {/* REJECTION INPUT */}
                    {kyc.status === "pending" && (
                      <TextField
                        label="Rejection Reason"
                        size="small"
                        fullWidth
                        value={rejectionReasons[user.id] || ""}
                        onChange={(e) =>
                          setRejectionReasons({
                            ...rejectionReasons,
                            [user.id]: e.target.value,
                          })
                        }
                      />
                    )}

                    {/* ACTIONS */}
                    {kyc.status === "pending" && (
                      <Box display="flex" gap={2}>
                        <Button
                          variant="contained"
                          color="success"
                          fullWidth
                          onClick={() => handleAction(user, "approved")}
                        >
                          Approve
                        </Button>

                        <Button
                          variant="contained"
                          color="error"
                          fullWidth
                          onClick={() => handleAction(user, "rejected")}
                        >
                          Reject
                        </Button>
                      </Box>
                    )}
                  </Stack>
                </Paper>
              </Grid>
            );
          })}
        </Grid>
      )}
    </Box>
  );
}
