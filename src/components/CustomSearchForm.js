import React from "react";
import { Box, Button, TextField } from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useTranslation } from "react-i18next";


const CustomSearchForm = ({ formik }) => {
  const { t } = useTranslation("global");

  return (
    <Box component="div">
      <Box
        component="form"
        onSubmit={formik.handleSubmit}
        sx={{ display: "flex", alignItems: "center" }}
      >
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label={t("personal_info.date_to")}
            id="DateFrom"
            name="DateFrom"
            format="DD-MM-YYYY"
            value={formik.values.DateFrom}
            onChange={(value) => {
              formik.setFieldValue("DateFrom", value);
            }}
            // renderInput={(params) => (
            //   <TextField
            //     {...params}
            //     size="small"
            //     helperText={
            //       formik.touched.DateFrom && formik.errors.DateFrom
            //     }
            //     error={formik.touched.DateFrom && Boolean(formik.errors.DateFrom)}
            //   />
            // )}
            slotProps={{
              textField: {
                size: "small",
                fullWidth: true,
                helperText:
                  formik.touched.DateFrom && formik.errors.DateFrom,
                error:
                  formik.touched.DateFrom &&
                  Boolean(formik.errors.DateFrom),
              },
            }}
            sx={{ flex: 1, marginRight: 1 }}
          />
        </LocalizationProvider>
        <Box sx={{ lineHeight: "35px" }}>~</Box>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label={t("personal_info.date_from")}
            //size="small"
            id="DateTo"
            name="DateTo"
            format="DD-MM-YYYY"
            value={formik.values.DateTo}
            onChange={(value) => {
              formik.setFieldValue("DateTo", value);
            }}
            // renderInput={(params) => (
            //   <TextField
            //     {...params}
            //     size="small"
            //     helperText={formik.touched.DateTo && formik.errors.DateTo}
            //     error={formik.touched.DateTo && Boolean(formik.errors.DateTo)}
            //   />
            // )}
            slotProps={{
              textField: {
                size: "small",
                fullWidth: true,
                helperText:
                  formik.touched.DateTo && formik.errors.DateTo,
                error:
                  formik.touched.DateTo &&
                  Boolean(formik.errors.DateTo),
              },
            }}
            sx={{ flex: 1, marginLeft: 1 }}
          />
        </LocalizationProvider>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          //size="small"
          sx={{ marginLeft: 1 }}
        >
          {t("personal_info.btn_search")}
        </Button>
      </Box>
    </Box>
  );
};

export default CustomSearchForm;
