/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import {
    Box,
    Typography,
    TextField,
    Grid,
    Stack,
    Button,  Autocomplete,
    MenuItem,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import Popup from "./Popup";
import { Toast } from "../utils/toast";
import { useDispatch, useSelector } from "react-redux";
import { report_damage, setErrorCode, cancel_report_damage, get_info_reason } from "../redux/features/product";

import { useTranslation } from "react-i18next";
import axios from "axios";
import { BASE_URL } from "../utils/env";
import authHeader from "../redux/services/auth_header";

const Form = (props) => {
    const [t] = useTranslation("global");
    const languages = localStorage.getItem('languages');

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { infoReason } = useSelector((state) => state.product);
    const product = useSelector((state) => state.product);
    const { formText, scannerResult, setScannerResult, user } =
        props;
    const [statusForm, setStatusForm] = useState(false);
    const [statusPopup, setstatusPopup] = useState(false);
    const [removeTask, setRemoveTask] = useState(false);
    const [infoMachine, setInfoMachine] = useState(null);

    const onBack = () => {
        setScannerResult("");
        dispatch(setErrorCode(null, ""));
        setStatusForm(false);
    };

    const onNextPage = () => {
        setScannerResult("");
        dispatch(setErrorCode(null, ""));
        setStatusForm(false);
        navigate("/product/status");
    };
    const handleAutocompleteChange = (event, values) => {
    
        formik.setFieldValue("remark", values);
      };
    const onCancel = async () => {
        const id_machine = scannerResult;
        const { user_name, factory } = user;
        const language = languages;

        await dispatch(cancel_report_damage({ user_name, id_machine, factory, language }));
        setRemoveTask(true);
    }

    const validationSchema = Yup.object().shape({
        FullName: Yup.string().required(t("info_machine_damage.validate_fullname")),
        factory: Yup.string().required(t("info_machine_damage.validate_factory")),
        id_user_request: Yup.string().required(t("info_machine_damage.validate_id_user_request")),
        Lean: Yup.string().required(t("info_machine_damage.validate_lean")),
        // Floor: Yup.string().required(t("info_machine_damage.validate_floor")),
        DateReport: Yup.string().required(t("info_machine_damage.validate_date_report")),
        id_machine: Yup.string().required(t("info_machine_damage.validate_id_machine")),
        fixer: Yup.string().required(t("info_machine_damage.validate_fixer")),
        // remark: Yup.string().required(t("info_machine_damage.validate_remark")).matches(/^[^\s]+(\s+[^\s]+)*$/, t('info_machine_damage.validate_no_spaces'))
        // remark: Yup.string().required(t("info_machine_damage.validate_remark"))
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
          })
        )
        .min(1, t("info_machine_damage.validate_remark")),
    });


    const formik = useFormik({
        initialValues: {
            FullName: user.name,
            factory: user.factory,
            id_user_request: user.user_name,
            Lean: user.lean,
            Floor: user.floor,
            DateReport: dayjs(new Date()),
            id_machine: scannerResult,
            name_machine: "",
            fixer: "",
            remark: [],
        },
        validationSchema,
        onSubmit: async (data) => {
            const arrayRemark = data.remark;
            const idArray = arrayRemark.map((item) => item.id);
            const remark = idArray.join(",");
            const { id_machine, id_user_request, factory, fixer } = data;
            const language = languages;
            console.log(remark)
            await dispatch(
                report_damage({ id_machine, id_user_request, remark, factory, fixer, language })
            );

            // await dispatch(setErrorCode(null));
        },
    });


    useEffect(() => {
        const id_machine = scannerResult;
        const { factory } = user;
        const getInfoMachine = (factory, id_machine) => {
            return axios.post(BASE_URL + "/damage_report/getMachine", {
                factory, id_machine
            }, {
                headers: {
                    "Content-Type": "application/json",
                    ...authHeader(),
                }
            }).then((response) => {
                setInfoMachine(response.data.data);
                return response.data.data;
            }).catch((error) => {
                return error.response.data;
            });
        }

        getInfoMachine(factory, id_machine);
    }, [scannerResult, user])

    useEffect(() => {
        if (infoMachine) {
            formik.setFieldValue("name_machine", languages === "EN" ? infoMachine.Name_en : infoMachine.Name_vn);
        }
    }, [infoMachine, languages]);


    useEffect(() => {
        if (product.errorCode === 0) {
            setStatusForm(true);
            setstatusPopup(true);
        }
        if (
            product.errorCode === 1001 ||
            product.errorCode === 1002 ||
            product.errorCode === 1003 ||
            product.errorCode === 1004 ||
            product.errorCode === 1005
        ) {
            setStatusForm(true);
        }

        if (product.errorCode === 0 && removeTask === true) {
            setScannerResult("");
            setStatusForm(false);

            Toast.fire({
                icon: 'success',
                title: product.errorMessage,
            })

            dispatch(setErrorCode(null));
        }
    }, [product, removeTask, dispatch, setScannerResult]);

    useEffect(() => {
        const fetchData = () => {
          dispatch(get_info_reason());
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
                        {statusPopup && <Button
                            type="button"
                            variant="contained"
                            color="error"
                            size="small"
                            onClick={onCancel}
                        >
                            {t("info_machine_damage.cancel")}
                        </Button>}
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
                                name="Lean"
                                variant="outlined"
                                size="small"
                                fullWidth
                                className={
                                    formik.errors.Lean && formik.touched.Lean ? "is-invalid" : ""
                                }
                                error={formik.errors.Lean && formik.touched.Lean === true}
                                helperText={
                                    formik.errors.Lean && formik.touched.Lean
                                        ? formik.errors.Lean
                                        : null
                                }
                                onChange={formik.handleChange}
                                value={formik.values.Lean}
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
                                label={t("info_machine_damage.id_machine")}
                                name="id_machine"
                                variant="outlined"
                                size="small"
                                fullWidth
                                className={
                                    formik.errors.id_machine && formik.touched.id_machine
                                        ? "is-invalid"
                                        : ""
                                }
                                error={
                                    formik.errors.id_machine && formik.touched.id_machine === true
                                }
                                helperText={
                                    formik.errors.id_machine && formik.touched.id_machine
                                        ? formik.errors.id_machine
                                        : null
                                }
                                onChange={formik.handleChange}
                                value={formik.values.id_machine}
                                inputProps={{ readOnly: true }}
                            />
                        </Grid>
                        <Grid item xs={6} md={6}>
                            <TextField
                                label={t("info_machine_damage.name_machine")}
                                name="name_machine"
                                variant="outlined"
                                size="small"
                                fullWidth
                                onChange={formik.handleChange}
                                value={formik.values.name_machine}
                                inputProps={{ readOnly: true }}
                            />
                        </Grid>
                        <Grid item xs={6} md={6}>
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
                                <MenuItem value="TD">{t("info_machine_damage.electrician")}</MenuItem>
                                <MenuItem value="TM">{t("info_machine_damage.mechanic")}</MenuItem>
                            </TextField>
                        </Grid>
                        <Grid item xs={12} md={12}>
                            {/* lý do hư máy phiên bản nhập tay */}
                            {/* <TextField
                                name="remark"
                                label={t("info_machine_damage.remark")}
                                multiline
                                rows={4}
                                fullWidth
                                className={
                                    formik.errors.remark && formik.touched.remark
                                        ? "is-invalid"
                                        : ""
                                }
                                error={formik.errors.remark && formik.touched.remark === true}
                                helperText={
                                    formik.errors.remark && formik.touched.remark
                                        ? formik.errors.remark
                                        : null
                                }
                                onChange={formik.handleChange}
                                value={formik.values.remark}
                            /> */}

<Autocomplete
                  name="skill"
                  multiple
                  options={infoReason}
                  getOptionLabel={(option) =>
                    languages === "EN"
                      ? option.info_reason_en
                      : option.info_reason_vn
                  }
                  disableCloseOnSelect
                  onChange={handleAutocompleteChange}
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
                      {languages === "EN"
                        ? option.info_reason_en
                        : option.info_reason_vn}
                      {selected ? <CheckIcon color="info" /> : null}
                    </MenuItem>
                  )}
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

export default Form;
