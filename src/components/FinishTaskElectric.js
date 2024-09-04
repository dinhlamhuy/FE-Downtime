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
  const { isCheck, idMachine, open, setOpen, user } = props;
  const [scannerResult, setScannerResult] = useState("");
  const [scanChangeMachine, setScanChangeMachine] = useState(false);
  const [btnScan, setBtnScan] = useState(false);
  const [t] = useTranslation("global");
  const { machineList } = useSelector((state) => state.machine);
  const languages = localStorage.getItem("languages");

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
        })
      )
      .min(1, t("process_status.status_4_validate_repair_method")),
    // remark_mechanic: Yup.string().required(t("process_status.status_4_validate_remark_repair_method")).matches(/^[^\s]+(\s+[^\s]+)*$/, t("process_status.status_4_validate_space"))
    // remark_mechanic: Yup.string().required(
    //   t("process_status.status_4_validate_remark_repair_method")
    // ),
  });

  const handleAutocompleteChange = (event, values) => {
    if (values.find((item) => item.id === 4)) {
     // const userFactory = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).factory : '';
      // fetchAllMachines(userFactory);
      setScanChangeMachine(true);
      setBtnScan(false);
    } else {
      setScanChangeMachine(false);
      setBtnScan(false);
      setScannerResult('')
    }
    formik.setFieldValue("skill", values);
  };

  const formik = useFormik({
    initialValues: {
      skill: [],
      remark_mechanic: "",

    },
    validationSchema,
    onSubmit: (data) => {
      // console.log('check: ',data);
      const arraySkill = data.skill;
      const idArray = arraySkill.map((item) => item.id);
      const skill = idArray.join(",");

      const { remark_mechanic } = data;
      const { lean, factory, user_name } = user;
      const id_machine = idMachine;
      const id_user_mechanic = user_name;
      const new_mechanic = scannerResult;
      const language = languages;

      //  alert('check'+new_mechanic);
      dispatch(
        finish_mechanic({
          id_user_mechanic,
          skill,
          id_machine,
          remark_mechanic,
          lean,
          factory,
          language,
          new_mechanic
        })
      );
      // console.log( dispatch(
      //   finish_mechanic({
      //     id_user_mechanic,
      //     skill,
      //     id_machine,
      //     remark_mechanic,
      //     lean,
      //     factory,
      //     language,
      //     new_mechanic
      //   })
      // ));
      setOpen(false);
    },
  });

  // const fetchAllMachines = async (factory) => {
  //   await dispatch(get_all_machine({ factory }));
  // };
  useEffect(() => {

    const fetchInfoSkill = () => {
      dispatch(get_info_skill());
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
                      <Autocomplete sx={{ width: "100%" }}
                        freeSolo
                        options={machineList.map((machine) => machine.ID_Code)}
                        inputValue={scannerResult}
                        onInputChange={(event, newInputValue) => {
                          setScannerResult(newInputValue);
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
                <Autocomplete
                  name="skill"
                  multiple
                  options={infoSkill}
                  getOptionLabel={(option) =>
                    languages === "EN"
                      ? option.info_skill_en
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
