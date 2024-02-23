import React from "react";
import { styled } from "@mui/material/styles";
// import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import ArticleIcon from "@mui/icons-material/Article";
// import SystemSecurityUpdateGoodIcon from "@mui/icons-material/SystemSecurityUpdateGood";
import QrCodeIcon from "@mui/icons-material/QrCode";
import NoteAltIcon from "@mui/icons-material/NoteAlt";

const ColorlibStepIconRoot = styled("div")(({ theme, ownerState }) => ({
  backgroundColor:
    theme.palette.mode === "dark" ? theme.palette.grey[700] : "#ccc",
  zIndex: 1,
  color: "#fff",
  width: 40,
  height: 40,
  display: "flex",
  borderRadius: "50%",
  justifyContent: "center",
  alignItems: "center",
  ...(ownerState.active && {
    backgroundColor: "#1565c0",
    boxShadow: "0 4px 10px 0 rgba(0,0,0,.25)",
  }),
  ...(ownerState.completed && {
    backgroundColor: "#1565c0",
  }),
}));

const ColorlibStepIcon = (props) => {
  const { active, completed, className } = props;

  const icons = {
    1: <ArticleIcon />,
    // 2: <SystemSecurityUpdateGoodIcon />,
    2: <QrCodeIcon />,
    3: <NoteAltIcon />,
    // 4: <AssignmentTurnedInIcon />,
  };

  return (
    <ColorlibStepIconRoot
      ownerState={{ completed, active }}
      className={className}
    >
      {icons[String(props.icon)]}
    </ColorlibStepIconRoot>
  );
};

export default ColorlibStepIcon;
