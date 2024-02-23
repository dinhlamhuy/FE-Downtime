import React from "react";
import { Breadcrumbs, Typography } from "@mui/material";

import { useTranslation } from "react-i18next";

const styleBreadCrumb = {
  fontSize: "14px",
  fontWeight: "500",
};

const BreadCrumb = (props) => {
  const [t] = useTranslation("global");
  const breadCrumb = props.breadCrumb;

  return (
    <Breadcrumbs separator="›" aria-label="breadcrumb">
      <Typography underline="hover" color="inherit" sx={styleBreadCrumb}>
        {t("breadcrumb.system")}
      </Typography>
      
      <Typography variant="div" color="text.primary" sx={styleBreadCrumb}>
        {breadCrumb}
      </Typography>
    </Breadcrumbs>
  );
};

export default BreadCrumb;
