import React from "react";
import { Box, Typography } from "@mui/material";

const ScannerInfo = (props) => {
  const { scanner, scannerResult } = props;
  return (
    <Box component="div">
      <Typography
        sx={{ fontSize: "14px", fontWeight: "500", marginBottom: "10px" }}
      >
        {scanner}
      </Typography>
      <Box
        component="div"
        sx={{
          color: "#1565c0",
          fontWeight: "600",
          textAlign: "center",
          marginTop: "10px",
        }}
      >
        Quét mã thành công!
      </Box>

      <Typography
        sx={{
          fontWeight: "500",
        }}
      >
        Thông tin
      </Typography>
      <Typography variant="div" sx={{ fontWeight: "500", fontSize: "14px" }}>
        Mã máy: &nbsp;
      </Typography>
      <Typography
        variant="div"
        sx={{ fontSize: "14px", wordWrap: "break-word" }}
      >
        {scannerResult}
      </Typography>
    </Box>
  );
};

export default ScannerInfo;
