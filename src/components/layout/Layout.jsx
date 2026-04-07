import Topbar from "./Topbar";
import { Box } from "@mui/material";

export default function Layout({ children }) {
  return (
    <Box>
      <Topbar />
      <Box>{children}</Box>
    </Box>
  );
}
