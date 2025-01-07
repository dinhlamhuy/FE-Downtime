/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Grid,
  Stack,
  Button,

} from "@mui/material";
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
import { setErrorCode, get_info_reason } from "../redux/features/product";

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
  const [infoMachine, setInfoMachine] = useState(null);
  const [otherIssue, setAdditionalInput] = useState("");
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
    Lean: Yup.string().required(t("info_machine_damage.validate_lean")),
    DateReport: Yup.string().required(
      t("info_machine_damage.validate_date_report")
    ),
    ID_Lean: Yup.string().required(t("info_machine_damage.validate_ID_Lean")),
    fixer: Yup.string().required(t("info_machine_damage.validate_fixer")),

    // Validation for remark
    remark: Yup.array()
      .of(
        Yup.object().shape({
          id: Yup.number().required("Status ID is required"),
          info_reason_en: Yup.string().required(
            "English skill name is required"
          ),
          info_reason_vn: Yup.string().required(
            "Vietnamese skill name is required"
          ),
          info_reason_mm: Yup.string().required(
            "Myanmar skill name is required"
          ),
        })
      )
      .min(1, t("info_machine_damage.validate_remark")),
    otherIssue: Yup.string().test(
      "is-required-when-id-999",
      t("info_machine_damage.validate_other_issue"),
      function (value) {
        const { remark } = this.parent;
        const hasId999 =
          Array.isArray(remark) && remark.some((item) => item.id === 999);
        if (hasId999) {
          return !!value;
        }
        return true;
      }
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
      name_machine: "",
      fixer: "",
      remark: [],
      otherIssue: "",
    },
    validationSchema,
    onSubmit: async (data) => {
      setLoading(true);
      // console.log("Form data:", data);

      const { ID_Lean, id_user_request, factory, fixer, otherIssue } = data;
      const language = languages;
      // await dispatch(
      //   report_damage({
      //     ID_Lean: ID_Lean.trim(),
      //     id_user_request,
      //     remark,
      //     factory,
      //     fixer,
      //     otherIssue: otherIssue.trim(),
      //     language,
      //   })
      // );
    },
  });

  // useEffect(() => {
  //   const ID_Lean = scannerResult.trim();
  //   const { factory } = user;
  //   const getInfoMachine = (factory, ID_Lean) => {
  //     return axios
  //       .post(
  //         BASE_URL + "/damage_report/getMachine",
  //         {
  //           factory,
  //           ID_Lean,
  //         },
  //         {
  //           headers: {
  //             "Content-Type": "application/json",
  //             ...authHeader(),
  //           },
  //         }
  //       )
  //       .then((response) => {
  //         setInfoMachine(response.data.data);
  //         return response.data.data;
  //       })
  //       .catch((error) => {
  //         return error.response.data;
  //       });
  //   };

  //   getInfoMachine(factory, ID_Lean);
  // }, [scannerResult, user]);

  useEffect(() => {
    if (infoMachine) {
      formik.setFieldValue(
        "name_machine",
        languages === "EN" ? infoMachine.Name_en : infoMachine.Name_vn
      );
    }
  }, [infoMachine, languages]);

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
  }, [product, removeTask, dispatch, setScannerResult]);

  useEffect(() => {
    const { dept } = user;
    const fetchData = () => {
      dispatch(get_info_reason(dept));
    };
    fetchData();
  }, [dispatch]);

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
                // className={
                //     formik.errors.Floor && formik.touched.Floor ? "is-invalid" : ""
                // }
                // error={formik.errors.Floor && formik.touched.Floor === true}
                // helperText={
                //     formik.errors.Floor && formik.touched.Floor
                //         ? formik.errors.Floor
                //         : null
                // }
                onChange={formik.handleChange}
                value={formik.values.Floor}
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
                label={"ID_Lean"}
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
                onChange={formik.handleChange}
                value={formik.values.ID_Lean}
                inputProps={{ readOnly: true }}
              />
            </Grid>

            {/* <Grid item xs={6} md={6}>
              <TextField
                select
                name="fixer"
                fullWidth
                label={t("info_machine_damage.fixer")}
                size="small"
                className={
                  formik.errors.fixer && formik.touched.fixer
                    ? "is-invalid"
                    : ""
                }
                error={formik.errors.fixer && formik.touched.fixer === true}
                helperText={
                  formik.errors.fixer && formik.touched.fixer
                    ? formik.errors.fixer
                    : null
                }
                onChange={formik.handleChange}
                value={formik.values.fixer}
              >
                <MenuItem value="TD">
                  {t("info_machine_damage.electrician")}
                </MenuItem>
                <MenuItem value="TM">
                  {t("info_machine_damage.mechanic")}
                </MenuItem>
              </TextField>
            </Grid> */}
            <Grid item xs={12} md={12}>
              <TextField
                name="otherIssue"
                variant="outlined"
                label={t("work_list.remark")}
                value={formik.values.otherIssue}
                onChange={(e) =>
                  formik.setFieldValue("otherIssue", e.target.value)
                }
                fullWidth
                size="small"
                error={
                  !!(formik.errors.otherIssue && formik.touched.otherIssue)
                }
                helperText={
                  formik.errors.otherIssue && formik.touched.otherIssue
                    ? formik.errors.otherIssue
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
