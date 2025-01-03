import React from "react";
import { Breadcrumbs, Typography } from "@mui/material";

import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
const styleBreadCrumb = {
  fontSize: "14px",
  fontWeight: "500",
};

const BreadCrumb2 = (props) => {
  const [t] = useTranslation("global");
  const breadCrumbs = props.breadCrumbs;
  const back = props.back;
  const navigate = useNavigate();
  const handleOnClick = () => {
    if (back) {
      window.history.back();
    }
  };
  return (
    <Breadcrumbs separator="›" aria-label="breadcrumb">
      {/* Mục đầu tiên (quay lại) */}
      <Typography
        sx={{ cursor: back ? "pointer" : "default", ...styleBreadCrumb }}
        color={"inherit"}
        onClick={back ? () => navigate("/") : undefined} 
      >
        {t("breadcrumb.system")}
      </Typography>

      {/* Các mục còn lại */}
      {breadCrumbs.map((crumb, index) => (
        <Typography
          key={index}
          variant="body1"
          color="text.primary"
          sx={styleBreadCrumb}
          {...(index === 0 && back && { onClick: handleOnClick })}
        >
          {crumb}
        </Typography>
      ))}
    </Breadcrumbs>
  );
};



BreadCrumb2.defaultProps = {
  back: false,
};


export default BreadCrumb2;
