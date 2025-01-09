/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { Box, Typography, TextField, Grid, Stack, Button } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useLocation, useNavigate } from "react-router-dom";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import Popup from "./Popup";

import { Toast } from "../utils/toast";
import { useDispatch, useSelector } from "react-redux";
import { setErrorCode, relocation_report } from "../redux/features/product";

import { useTranslation } from "react-i18next";

const FormRelocate = (props) => {
  const [t] = useTranslation("global");
  const languages = localStorage.getItem("languages");
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const product = useSelector((state) => state.product);
  const { formText, scannerResult, setScannerResult, user } = props;
  const [statusForm, setStatusForm] = useState(false);
  const [statusPopup, setstatusPopup] = useState(false);
  const [removeTask, setRemoveTask] = useState(false);

  const [loading, setLoading] = useState(false);
  // console.log(statusForm);
  const onBack = () => {
    setScannerResult("");
    dispatch(setErrorCode(null, ""));
    setStatusForm(false);
  };
  useEffect(() => {
    setStatusForm(false);
    dispatch(setErrorCode(null, ""));
  }, [location]);
  const onNextPage = async () => {
    setScannerResult("");

    setStatusForm(false);
    await dispatch(setErrorCode(null, ""));
    navigate("/product/status");
  };

  const validationSchema = Yup.object().shape({
    FullName: Yup.string().required(t("info_machine_damage.validate_fullname")),
    factory: Yup.string().required(t("info_machine_damage.validate_factory")),
    id_user_request: Yup.string().required(
      t("info_machine_damage.validate_id_user_request")
    ),
  
    DateReport: Yup.string().required(
      t("info_machine_damage.validate_date_report")
    ),
  });

  const formik = useFormik({
    initialValues: {
      FullName: user.name,
      factory: user.factory,
      id_user_request: user.user_name,
      line: user.line,
      Floor: user.floor,
      DateReport: dayjs(new Date()),
      ID_Lean: scannerResult.trim(),
      remark: "",
    },
    validationSchema,
    onSubmit: async (data) => {
      console.log("Form data:", data);
      setLoading(true);

      const { id_user_request, factory, remark, ID_Lean } = data;
      await dispatch(
        relocation_report({
          ID_lean:ID_Lean,
          id_user_request,
          remark,
          factory,languages
        })
      );
    },
  });
  console.log("Errors:", formik.errors);
  console.log("Touched fields:", formik.touched);
  useEffect(() => {
    // Khi mới vào form, kiểm tra trạng thái ban đầu
    if (product.errorCode === null || product.errorCode === undefined) {
      setStatusForm(false);
      setstatusPopup(false);
      return; // Dừng tại đây nếu chưa có errorCode
    }

    // Xử lý khi errorCode === 0
    if (product.errorCode === 0) {
      setStatusForm(true);
      setstatusPopup(true);

      if (removeTask) {
        setScannerResult("");
        setStatusForm(false);

        Toast.fire({
          icon: "success",
          title: product.errorMessage,
        });

        dispatch(setErrorCode(null));
      }
      return;
    }

    // Xử lý các trường hợp errorCode từ 1001 đến 1005
    if (
      product.errorCode === 1001 ||
      product.errorCode === 1002 ||
      product.errorCode === 1003 ||
      product.errorCode === 1004 ||
      product.errorCode === 1005
    ) {
      setStatusForm(true);
      return;
    }
  }, [product, dispatch, setScannerResult]);

  return (
    <Box component="div">
      <Typography
        sx={{ fontSize: "14px", fontWeight: "500", marginBottom: "10px" }}
      >
        {formText}
      </Typography>
      {statusForm === true ? (
        <Box component="div">
          <Popup
            statusPopup={statusPopup}
            errorMessage={product.errorMessage}
          />
          <Stack
            direction="row"
            spacing={2}
            sx={{
              marginTop: "10px",
              justifyContent: "center",
            }}
          >
            <Button
              type="button"
              variant="contained"
              color="primary"
              size="small"
              onClick={onBack}
            >
              {t("info_machine_damage.back")}
            </Button>
            <Button
              type="button"
              variant="contained"
              color="success"
              sx={{ backgroundColor: "#11a52c" }}
              size="small"
              onClick={onNextPage}
            >
              {t("info_machine_damage.process_status")}
            </Button>
            {statusPopup && (
              <Button
                type="button"
                variant="contained"
                color="error"
                size="small"
                // onClick={onCancel}
              >
                {t("info_machine_damage.cancel")}
              </Button>
            )}
          </Stack>
        </Box>
      ) : (
        <Box component="form" onSubmit={formik.handleSubmit}>
          <Grid
            container
            rowSpacing={2}
            columnSpacing={{ xs: 1, sm: 2, md: 3 }}
          >
            <Grid item xs={6} md={6}>
              <TextField
                label={t("info_machine_damage.name")}
                name="FullName"
                variant="outlined"
                size="small"
                fullWidth
                className={
                  formik.errors.FullName && formik.touched.FullName
                    ? "is-invalid"
                    : ""
                }
                error={
                  formik.errors.FullName && formik.touched.FullName === true
                }
                helperText={
                  formik.errors.FullName && formik.touched.FullName
                    ? formik.errors.FullName
                    : null
                }
                onChange={formik.handleChange}
                value={formik.values.FullName}
                inputProps={{ readOnly: true }}
              />
            </Grid>
            <Grid item xs={6} md={6}>
              <TextField
                label={t("info_machine_damage.factory")}
                name="factory"
                variant="outlined"
                size="small"
                fullWidth
                className={
                  formik.errors.factory && formik.touched.factory
                    ? "is-invalid"
                    : ""
                }
                error={formik.errors.factory && formik.touched.factory === true}
                helperText={
                  formik.errors.factory && formik.touched.factory
                    ? formik.errors.factory
                    : null
                }
                onChange={formik.handleChange}
                value={formik.values.factory}
                inputProps={{ readOnly: true }}
              />
            </Grid>
            <Grid item xs={6} md={6}>
              <TextField
                label={t("info_machine_damage.id_number")}
                name="id_user_request"
                variant="outlined"
                size="small"
                fullWidth
                className={
                  formik.errors.id_user_request &&
                  formik.touched.id_user_request
                    ? "is-invalid"
                    : ""
                }
                error={
                  formik.errors.id_user_request &&
                  formik.touched.id_user_request === true
                }
                helperText={
                  formik.errors.id_user_request &&
                  formik.touched.id_user_request
                    ? formik.errors.id_user_request
                    : null
                }
                onChange={formik.handleChange}
                value={formik.values.id_user_request}
                inputProps={{ readOnly: true }}
              />
            </Grid>
            <Grid item xs={6} md={6}>
              <TextField
                label={t("info_machine_damage.lean")}
                name="line"
                variant="outlined"
                size="small"
                fullWidth
                className={
                  formik.errors.line && formik.touched.line ? "is-invalid" : ""
                }
                error={formik.errors.line && formik.touched.line === true}
                helperText={
                  formik.errors.line && formik.touched.line
                    ? formik.errors.line
                    : null
                }
                onChange={formik.handleChange}
                value={formik.values.line}
                inputProps={{ readOnly: true }}
              />
            </Grid>
            <Grid item xs={6} md={6}>
              <TextField
                label={t("info_machine_damage.floor")}
                name="Floor"
                variant="outlined"
                size="small"
                fullWidth
                className={
                    formik.errors.Floor && formik.touched.Floor ? "is-invalid" : ""
                }
                error={formik.errors.Floor && formik.touched.Floor === true}
                helperText={
                    formik.errors.Floor && formik.touched.Floor
                        ? formik.errors.Floor
                        : null
                }
                // onChange={formik.handleChange}
                value={''}
                // value={formik.values.Floor}
                inputProps={{ readOnly: true }}
              />
            </Grid>
            <Grid item xs={6} md={6}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label={t("info_machine_damage.date")}
                  id="DateReport"
                  name="DateReport"
                  format="DD-MM-YYYY"
                  value={formik.values.DateReport}
                  readOnly={true}
                  onChange={(value) => {
                    formik.setFieldValue("DateReport", value);
                  }}
                  slotProps={{
                    textField: {
                      size: "small",
                      fullWidth: true,
                      helperText:
                        formik.touched.DateReport && formik.errors.DateReport,
                      error:
                        formik.touched.DateReport &&
                        Boolean(formik.errors.DateReport),
                    },
                  }}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={6} md={6}>
              <TextField
                label={t("work_list.floor")}
                name="ID_Lean"
                variant="outlined"
                size="small"
                fullWidth
                className={
                  formik.errors.ID_Lean && formik.touched.ID_Lean
                    ? "is-invalid"
                    : ""
                }
                error={formik.errors.ID_Lean && formik.touched.ID_Lean === true}
                helperText={
                  formik.errors.ID_Lean && formik.touched.ID_Lean
                    ? formik.errors.ID_Lean
                    : null
                }
                value={
                  formik.values.ID_Lean &&
                  formik.values.ID_Lean.substring(
                    0,
                    formik.values.ID_Lean.indexOf("/")
                  )
                }
                inputProps={{ readOnly: true }}
              />
            </Grid>
            <Grid item xs={6} md={6}>
              <TextField
                label={"Lean"}
                name="ID_Lean"
                variant="outlined"
                size="small"
                fullWidth
                className={
                  formik.errors.ID_Lean && formik.touched.ID_Lean
                    ? "is-invalid"
                    : ""
                }
                error={formik.errors.ID_Lean && formik.touched.ID_Lean === true}
                helperText={
                  formik.errors.ID_Lean && formik.touched.ID_Lean
                    ? formik.errors.ID_Lean
                    : null
                }
                value={
                  formik.values.ID_Lean &&
                  formik.values.ID_Lean.substring(
                    formik.values.ID_Lean.indexOf("/") + 1,
                    formik.values.ID_Lean.length
                  )
                }
                inputProps={{ readOnly: true }}
              />
            </Grid>
          
            <Grid item xs={12} md={12}>
              <TextField
                name="remark"
                variant="outlined"
                label={t("work_list.remark")}
                value={formik.values.remark}
                onChange={(e) => {console.log(e.target.value);formik.setFieldValue("remark", e.target.value)}}
                fullWidth
                size="small"
                error={!!(formik.errors.remark && formik.touched.remark)}
                helperText={
                  formik.errors.remark && formik.touched.remark
                    ? formik.errors.remark
                    : null
                }
              />
            </Grid>
          </Grid>
          <Stack
            direction="row"
            spacing={2}
            sx={{ marginTop: "10px", justifyContent: "center" }}
          >
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="small"

              disabled={loading}
            >
              {t("info_machine_damage.confirm")}
            </Button>
            <Button
              type="button"
              variant="contained"
              color="error"
              size="small"
              onClick={onBack}
            >
              {t("info_machine_damage.cancel")}
            </Button>
          </Stack>
        </Box>
      )}
    </Box>
  );
};

export default FormRelocate;
