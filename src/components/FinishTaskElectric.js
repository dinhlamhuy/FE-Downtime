import React, { useEffect, useState } from "react";
import AlertDialog from "./AlertDialog";
import Title from "./Title";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { finish_mechanic, get_info_skill } from "../redux/features/electric";
import QrCodeIcon from "@mui/icons-material/QrCode";
import {
  Typography,
  MenuItem,
  Grid,
  TextField,
  Box,
  Button,
  Stack,
  Autocomplete,
  Paper,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";

import { useTranslation } from "react-i18next";
import Scanner from "./ScannerChangeMachine";
import { get_info_reason } from "../redux/features/product";

const FinishTaskElectric = (props) => {
  const dispatch = useDispatch();
  const [otherIssue, setOtherIssue] = useState("");
  const { infoSkill } = useSelector((state) => state.electric);
  const { isCheck, idMachine, open, setOpen, user, userRequest, dept } = props;
  // console.log(userRequest)
  const [scannerResult, setScannerResult] = useState("");
  const [scanChangeMachine, setScanChangeMachine] = useState(false);
  const [statusRadio, setStatusRadio] = useState("4");

  const [btnScan, setBtnScan] = useState(false);
  const [t] = useTranslation("global");
  const { infoReason } = useSelector((state) => state.product);
  const { machineList } = useSelector((state) => state.machine);
  const languages = localStorage.getItem("languages");
  // console.log('test', props)
  // console.log('test user', user)
  // Validation schema
  const validationSchema = Yup.object().shape({
    skill: Yup.array()
      .of(
        Yup.object().shape({
          id: Yup.number().required("Status ID is required"),
          info_skill_en: Yup.string().required(
            "English skill name is required"
          ),
          info_skill_vn: Yup.string().required(
            "Vietnamese skill name is required"
          ),
          info_skill_mm: Yup.string().required(
            "Myanmar skill name is required"
          ),
        })
      )
      .min(1, t("process_status.status_4_validate_repair_method")),

    otherMethod: Yup.string().test(
      "is-required-when-id-23",
      t("process_status.status_4_validate_other_method"),
      function (value) {
        const { skill } = this.parent;
        const hasId23 =
          Array.isArray(skill) && skill.some((item) => item.id === 999);
        return hasId23 ? !!value : true;
      }
    ),

    scannerResult: Yup.string().test(
      "is-required-when-id-4",
      t("process_status.status_4_validate_machine_new_code"),
      function (value) {
        const { skill } = this.parent;
        const hasId4 =
          Array.isArray(skill) && skill.some((item) => item.id === 4);
        return hasId4 ? !!value : true;
      }
    ),
    remark_mechanic:
      statusRadio === "6"
        ? Yup.string().required(
            t("process_status.status_4_validate_remark_repair_method")
          )
        : Yup.string(),

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
  const handleAutocompleteReasonChange = (event, values) => {
    formik.setFieldValue("remark", values);

    const hasId999 = values.some((item) => item.id === 999);

    if (!hasId999) {
      setOtherIssue("");
      formik.setFieldValue("otherIssue", "");
    }
    if (hasId999) {
      setTimeout(() => {
        document.getElementById("formik-otherIssue")?.focus();
      }, 100);
    }
  };
  const handleAutocompleteChange = (event, values) => {
    const hasId4 = values.some((item) => item.id === 4);
    const hasId23 = values.some((item) => item.id === 999);

    setScanChangeMachine(hasId4);
    setBtnScan(!hasId4);

    formik.setFieldValue("skill", values);
    formik.setFieldValue(
      "otherMethod",
      hasId23 ? formik.values.otherMethod : ""
    );

    const newScannerResult = hasId4 ? scannerResult : "";
    // console.log('Updated Scanner Result:', newScannerResult);
    setScannerResult(newScannerResult.trim());
    formik.setFieldValue("scannerResult", newScannerResult);
    if (hasId23) {
      setTimeout(() => {
        document.getElementById("formik-otherMethod")?.focus();
      }, 100);
    }
  };

  const handleChangeStatus = (event) => {
    setStatusRadio(event.target.value);
  };
  // useFormik hook
  const formik = useFormik({
    initialValues: {
      skill: [],
      otherMethod: "",
      remark_mechanic: "",
      otherIssue: "",
      scannerResult: scannerResult,
      remark: [],
    },

    validationSchema,
    onSubmit: (data) => {
      if (data.skill.some((item) => item.id === 4) && !data.scannerResult) {
        alert(t("process_status.status_4_validate_machine_new_code"));
        return;
      }
      if (!formik.isValid) {
        alert("Vui lòng kiểm tra lại thông tin trước khi gửi!");
        return;
      }

      // console.log('check: ', data);
      // console.log('Scanner Result:', data.scannerResult);
      const skillIds = data.skill.map((item) => item.id).join(",");

      const { remark_mechanic, otherMethod, otherIssue } = data;
      const { lean, factory, user_name } = user;
      const id_machine = idMachine;
      const id_user_mechanic = user_name;
      const new_mechanic = data.scannerResult;
      const language = languages;
      const arrayRemark = data.remark;
      const idArray = arrayRemark.map((item) => item.id);
      let remark = idArray.join(",");

      // console.log("check :", {

      //     id_user_mechanic,
      //     skill: skillIds,
      //     id_machine,
      //     remark_mechanic,
      //     lean,
      //     factory,
      //     statusRadio,
      //     language,
      //     new_mechanic,
      //     otherMethod,
      //     reason:remark,
      //     otherIssue,
      // });
      // dispatch(
      //   finish_mechanic({
      //     id_user_mechanic,
      //     skill: skillIds,
      //     id_machine,
      //     remark_mechanic,
      //     lean,
      //     factory,
      //     statusRadio,
      //     language,
      //     new_mechanic,
      //     otherMethod,
      //     reason: remark,
      //     otherIssue,
      //   })
      // );
      alert(
        JSON.stringify(
          {
            id_user_mechanic,
            skill: skillIds,
            id_machine,
            remark_mechanic,
            lean,
            factory,
            statusRadio,
            language,
            new_mechanic,
            otherMethod,
            reason: remark,
            otherIssue,
          },
          null,
          2
        )
      );

      setOpen(false);
    },
  });

  // const fetchAllMachines = async (factory) => {
  //   await dispatch(get_all_machine({ factory }));
  // };
  useEffect(() => {
    const fetchInfoSkill = async () => {
      await dispatch(get_info_skill({ userRequest }));
      await dispatch(get_info_reason(dept));
    };
    fetchInfoSkill();
  }, [dispatch]);

  useEffect(() => {
    if (scannerResult) {
      formik.setFieldValue("scannerResult", scannerResult);
    }
  }, [scannerResult, setScannerResult]);

  const onClose = () => {
    formik.setTouched({});
    formik.setErrors({});
    setOpen(false);
  };

  const handleButtonClick = () => {
    setBtnScan(!btnScan);
    setScannerResult("");
  };

  const sortedInfoReason = (infoReason || []).slice().sort((a, b) => {
    // Nếu id = 999 thì đưa lên đầu
    if (a.id === 999) return -1;
    if (b.id === 999) return 1;

    // Sắp xếp theo thứ tự chữ cái dựa trên ngôn ngữ đang chọn
    const reasonA = a[`info_reason_${languages.toLowerCase()}`] || "";
    const reasonB = b[`info_reason_${languages.toLowerCase()}`] || "";
    return reasonA.localeCompare(reasonB);
  });
  const sortedinfoSkill = (infoSkill || []).slice().sort((a, b) => {
    // Nếu id = 999 thì đưa lên đầu
    if (a.id === 999) return -1;
    if (b.id === 999) return 1;

    // Sắp xếp theo thứ tự chữ cái dựa trên ngôn ngữ đang chọn
    const skillA = a[`info_skill_${languages.toLowerCase()}`] || "";
    const skillB = b[`info_skill_${languages.toLowerCase()}`] || "";
    return skillA.localeCompare(skillB);
  });

  return (
    <>
      {isCheck && (
        <AlertDialog
          open={open}
          setOpen={setOpen}
          headerModal={t("process_status.status_4_header")}
          formik={formik}
        >
          <Box component="div" sx={{ textAlign: "center" }}>
            <Title
              color="#1565c0"
              titleText={t("process_status.status_4_alert")}
            />
          </Box>
          <FormControl>
            <RadioGroup
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="row-radio-buttons-group"
              defaultValue="4"
              value={statusRadio}
              onChange={handleChangeStatus}
            >
              <FormControlLabel
                value="4"
                control={<Radio color="error" />}
                label={t("info_machine_damage.alert_finish")}
                sx={{ color: "blue" }}
              />
              <FormControlLabel
                value="6"
                control={<Radio color="error" />}
                label={t("info_machine_damage.alert_fail")}
                sx={{ color: "red" }}
              />
            </RadioGroup>
          </FormControl>

          <Grid
            container
            rowSpacing={2}
            columnSpacing={{ xs: 1, sm: 2, md: 3 }}
            sx={{ marginBottom: "10px" }}
          >
            <Grid item xs={12} md={12}>
              <Typography
                sx={{
                  fontWeight: "500",
                }}
              >
                {t("process_status.status_4_info")}
              </Typography>
              <Typography
                variant="div"
                sx={{ fontWeight: "500", fontSize: "14px" }}
              >
                {t("process_status.status_4_id_machine")} &nbsp;
              </Typography>
              <Typography
                variant="div"
                sx={{ fontSize: "14px", wordWrap: "break-word" }}
              >
                {idMachine} <br />
              </Typography>
            </Grid>
          </Grid>
          <Box component="form" onSubmit={formik.handleSubmit}>
            <Grid
              container
              rowSpacing={2}
              columnSpacing={{ xs: 1, sm: 2, md: 3 }}
            >
              <Grid item xs={12} md={12}>
                {/* <FormControlLabel control={<Switch defaultChecked />} label="Chọn " /> */}
                {/* {scannerResult} */}
                {scanChangeMachine && (
                  <>
                    <Paper
                      elevation={0}
                      component="form"
                      sx={{
                        border: "none",
                        display: "flex",
                        alignItems: "center",
                        width: "100%",
                      }}
                    >
                      <Button
                        variant="contained"
                        sx={{ marginRight: "10px" }}
                        onClick={handleButtonClick}
                      >
                        <QrCodeIcon />
                      </Button>{" "}
                      <Autocomplete
                        sx={{ width: "100%" }}
                        freeSolo
                        options={machineList.map((machine) => machine.ID_Code)}
                        inputValue={scannerResult}
                        onInputChange={(event, newInputValue) => {
                          setScannerResult(newInputValue);
                          formik.setFieldValue("scannerResult", newInputValue);
                          setBtnScan(false);
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            size="small"
                            sx={{ width: "100%" }}
                            id="outlined-read-only-input"
                            label={t("process_status.new_code_machine")}
                            InputProps={{
                              ...params.InputProps,
                              readOnly: btnScan,
                            }}
                            error={
                              !!(
                                formik.errors.scannerResult &&
                                formik.touched.scannerResult
                              )
                            }
                            helperText={
                              formik.errors.scannerResult &&
                              formik.touched.scannerResult
                                ? formik.errors.scannerResult
                                : null
                            }
                          />
                        )}
                      />
                      {/* <TextField
                        size="small"
                        sx={{ width: "100%" }}
                        id="outlined-read-only-input"
                        label={t("process_status.new_code_machine")}
                        defaultValue=""
                        value={scannerResult}
                        InputProps={{
                          readOnly: true,
                        }}
                      /> + */}
                    </Paper>
                    {btnScan && scannerResult === "" && (
                      <Scanner
                        idMachine={"new_mechanic"}
                        scanner={t("process_status.status_3_scanner")}
                        scannerResult={scannerResult}
                        setScannerResult={setScannerResult}
                      />
                    )}
                  </>
                )}
              </Grid>

              {/* lý do hư máy*/}
              <Grid item xs={12} md={12}>
                <Autocomplete
                  name="skill"
                  multiple
                  options={sortedInfoReason || []}
                  getOptionLabel={(option) =>
                    languages === "EN"
                      ? option.info_reason_en
                      : languages === "MM"
                      ? option.info_reason_mm
                      : option.info_reason_vn
                  }
                  disableCloseOnSelect
                  onChange={handleAutocompleteReasonChange}
                  value={formik.values.remark}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      label={t("info_machine_damage.remark")}
                      fullWidth
                      sx={{ fontSize: "14px" }}
                      size="small"
                      error={!!(formik.errors.remark && formik.touched.remark)}
                      className={
                        formik.errors.remark && formik.touched.remark
                          ? "is-invalid"
                          : ""
                      }
                      helperText={
                        formik.errors.remark && formik.touched.remark
                          ? formik.errors.remark
                          : null
                      }
                    />
                  )}
                  renderOption={(props, option, { selected }) => (
                    <MenuItem {...props} key={option.id} value={option}>
                      {option[`info_reason_${languages.toLowerCase()}`]}
                      {selected && <CheckIcon color="info" />}
                    </MenuItem>
                  )}
                />
              </Grid>
              {formik.values.remark.some((item) => item.id === 999) && (
                <Grid item xs={12} md={12}>
                  <TextField
                    id="formik-otherIssue"
                    name="otherIssue"
                    variant="outlined"
                    label={t("info_machine_damage.other_issue")}
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
              )}

              <Grid item xs={12} md={12}>
                <Autocomplete
                  name="skill"
                  multiple
                  options={sortedinfoSkill}
                  getOptionLabel={(option) =>
                    languages === "EN"
                      ? option.info_skill_en
                      : languages === "MM"
                      ? option.info_skill_mm
                      : option.info_skill_vn
                  }
                  disableCloseOnSelect
                  onChange={handleAutocompleteChange}
                  value={formik.values.skill}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      label={t("process_status.status_4_repair_method")}
                      fullWidth
                      sx={{ fontSize: "14px" }}
                      size="small"
                      error={!!(formik.errors.skill && formik.touched.skill)}
                      className={
                        formik.errors.skill && formik.touched.skill
                          ? "is-invalid"
                          : ""
                      }
                      helperText={
                        formik.errors.skill && formik.touched.skill
                          ? formik.errors.skill
                          : null
                      }
                    />
                  )}
                  renderOption={(props, option, { selected }) => (
                    <MenuItem {...props} key={option.id} value={option}>
                      {languages === "EN"
                        ? option.info_skill_en
                        : languages === "MM"
                        ? option.info_skill_mm
                        : option.info_skill_vn}
                      {selected ? <CheckIcon color="info" /> : null}
                    </MenuItem>
                  )}
                />
              </Grid>
              {formik.values.skill.some((item) => item.id === 999) && (
                <Grid item xs={12} md={12}>
                  <TextField
                    id="formik-otherMethod"
                    name="otherMethod"
                    variant="outlined"
                    label={t("process_status.other_method")}
                    value={formik.values.otherMethod}
                    onChange={(e) =>
                      formik.setFieldValue("otherMethod", e.target.value)
                    }
                    fullWidth
                    size="small"
                    error={
                      !!(
                        formik.errors.otherMethod && formik.touched.otherMethod
                      )
                    }
                    helperText={
                      formik.errors.otherMethod && formik.touched.otherMethod
                        ? formik.errors.otherMethod
                        : null
                    }
                  />
                </Grid>
              )}

              <Grid item xs={12} md={12}>
                <TextField
                  name="remark_mechanic"
                  label={t("process_status.status_4_remark")}
                  multiline
                  rows={4}
                  fullWidth
                  variant="outlined"
                  className={
                    formik.errors.remark_mechanic &&
                    formik.touched.remark_mechanic
                      ? "is-invalid"
                      : ""
                  }
                  error={
                    formik.errors.remark_mechanic &&
                    formik.touched.remark_mechanic === true
                  }
                  helperText={
                    formik.errors.remark_mechanic &&
                    formik.touched.remark_mechanic
                      ? formik.errors.remark_mechanic
                      : null
                  }
                  onChange={formik.handleChange}
                  value={formik.values.remark_mechanic}
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
              >
                {t("process_status.status_4_confirm")}
              </Button>
              <Button
                type="button"
                variant="contained"
                color="error"
                size="small"
                onClick={onClose}
              >
                {t("process_status.status_4_close")}
              </Button>
            </Stack>
          </Box>
        </AlertDialog>
      )}
    </>
  );
};

export default FinishTaskElectric;
