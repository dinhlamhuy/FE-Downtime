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
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";

import { useTranslation } from "react-i18next";
import Scanner from "./ScannerChangeMachine";

const FinishTaskElectric = (props) => {
  const dispatch = useDispatch();
  const { infoSkill } = useSelector((state) => state.electric);
  const { isCheck, idMachine, open, setOpen, user,userRequest } = props;
  const [scannerResult, setScannerResult] = useState("");
  const [scanChangeMachine, setScanChangeMachine] = useState(false);
  const [btnScan, setBtnScan] = useState(false);
  const [t] = useTranslation("global");
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
        info_skill_en: Yup.string().required("English skill name is required"),
        info_skill_vn: Yup.string().required("Vietnamese skill name is required"),
        info_skill_mm: Yup.string().required("Myanmar skill name is required"), 
      })
    )
    .min(1, t("process_status.status_4_validate_repair_method")),
  
  otherIssue: Yup.string().test(
    "is-required-when-id-23",
    t("process_status.status_4_validate_other_method"), 
    function(value) {
      const { skill } = this.parent;
      const hasId23 = Array.isArray(skill) && skill.some(item => item.id === 999); 
      return hasId23 ? !!value : true;
    }
  ),
  
  scannerResult: Yup.string().test(
    "is-required-when-id-4",
    t("process_status.status_4_validate_machine_new_code"),
    function(value) {
      const { skill } = this.parent;
      const hasId4 = Array.isArray(skill) && skill.some(item => item.id === 4);
      return hasId4 ? !!value : true; 
    }
  ),
});

const handleAutocompleteChange = (event, values) => {
  const hasId4 = values.some((item) => item.id === 4);
  const hasId23 = values.some((item) => item.id === 999);


  setScanChangeMachine(hasId4);
  setBtnScan(!hasId4);

  formik.setFieldValue("skill", values);
  formik.setFieldValue("otherIssue", hasId23 ? formik.values.otherIssue : "");

  const newScannerResult = hasId4 ? scannerResult : '';
  // console.log('Updated Scanner Result:', newScannerResult); 
  setScannerResult(newScannerResult.trim()); 
  formik.setFieldValue("scannerResult", newScannerResult); 
};

  
  // useFormik hook
const formik = useFormik({
  initialValues: {
    skill: [],
    remark_mechanic: "",
    otherIssue: "",
    scannerResult: "", 
  },
  
  validationSchema,
  onSubmit: (data) => {
       if (data.skill.some(item => item.id === 4) && !data.scannerResult) {
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

    const { remark_mechanic, otherIssue } = data;
    const { lean, factory, user_name } = user;
    const id_machine = idMachine;
    const id_user_mechanic = user_name;
    const new_mechanic = data.scannerResult;
    const language = languages;

    dispatch(
      finish_mechanic({
        id_user_mechanic,
        skill: skillIds,
        id_machine,
        remark_mechanic,
        lean,
        factory,
        language,
        new_mechanic,
        otherIssue
      })
    );
    setOpen(false);
  },
});
  
  // const fetchAllMachines = async (factory) => {
  //   await dispatch(get_all_machine({ factory }));
  // };
  useEffect(() => {

    const fetchInfoSkill = () => {
      dispatch(get_info_skill({userRequest}));
    };


    fetchInfoSkill();
  }, [dispatch]);

  // useEffect(() => {
  //   alert(scannerResult);
  // }, [scannerResult, setScannerResult]);

  const onClose = () => {
    formik.setTouched({});
    formik.setErrors({});
    setOpen(false);
  };

  const handleButtonClick = () => {
    setBtnScan(!btnScan);
    setScannerResult('');
  };

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
                            error={!!(formik.errors.scannerResult && formik.touched.scannerResult)} 
                            helperText={formik.errors.scannerResult && formik.touched.scannerResult
                              ? formik.errors.scannerResult
                              : null}
                          />
                        )}
                      />
                      { /* <TextField
                        size="small"
                        sx={{ width: "100%" }}
                        id="outlined-read-only-input"
                        label={t("process_status.new_code_machine")}
                        defaultValue=""
                        value={scannerResult}
                        InputProps={{
                          readOnly: true,
                        }}
                      /> + */
                      }

                    </Paper>
                    {btnScan && scannerResult === '' && (
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
              <Grid item xs={12} md={12}>
              {formik.values.skill.some((item) => item.id === 999) && (
                <TextField
                  name="otherIssue"
                  variant="outlined"
                  label={t("process_status.other_method")}
                  value={formik.values.otherIssue}
                  onChange={(e) => formik.setFieldValue('otherIssue', e.target.value)}
                  fullWidth
                  size="small"
                  error={!!(formik.errors.otherIssue && formik.touched.otherIssue)}
                  helperText={formik.errors.otherIssue && formik.touched.otherIssue
                    ? formik.errors.otherIssue
                    : null}
                />
              )}
            </Grid>

              <Grid item xs={12} md={12}>
                <Autocomplete
                  name="skill"
                  multiple
                  options={infoSkill}
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
