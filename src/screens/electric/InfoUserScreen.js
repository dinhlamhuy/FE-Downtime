import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Grid
} from "@mui/material";
import CalculateJob from "../../components/CalculateJob";
import SkillEmployee from "../../components/SkillEmployee";
import ChartEmployee from "../../components/ChartEmployee";

import dayjs from "dayjs";
import { format } from "date-fns";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { get_info_calculate, get_info_task } from "../../redux/features/electric";
import TaskEmployee from "../../components/TaskEmployee";

import { useTranslation } from "react-i18next";

import { Toast } from "../../utils/toast";

const FilterStyle = {
  padding: "20px 5px 20px 5px",
  borderRadius: "30px",
  border: "3px solid #ccc",
  
};

const Active = {
  // position: "absolute",
  width: "100%",
  // height: "150px",
  opacity: "1",
  transform: `translate(0%, 0%)`,
  transition: "ease 0.5s",
  zIndex: '1'
}

export default function InfoUserScreen() {
  const dispatch = useDispatch();
  const { user_name, factory } = useSelector((state) => state.auth.user);
  const { infoCalculate, infoTask } = useSelector((state) => state.electric);
  const { totalFix, avgTime } = infoCalculate;
  const { arrPercentfn, arrResult } = infoTask;
  const [alertValidate, setAlertValidate] = useState(false);
  const [alertCount, setAlertCount] = useState(0);

  const [t] = useTranslation("global");

  const [open] = useState(true);

  const validationSchema = Yup.object().shape({
    DateFrom: Yup.string().required("Vui lòng nhập ngày!"),
    DateTo: Yup.string().required("Vui lòng nhập đến ngày!"),
  });

  const validate = (values) => {
    const error = {};
    const { DateFrom, DateTo } = values;

    if (new Date(format(DateTo.$d, "yyyy-MM-dd")) < new Date(format(DateFrom.$d, "yyyy-MM-dd"))) {
      error.DateFrom = " ";
      error.DateTo = " ";

      setAlertValidate(true);
      setAlertCount(alertCount + 1);
    }

    return error;
  }

  useEffect(() => {
    const date_from = format(dayjs(new Date()).$d, "yyyy-MM-dd");
    const date_to = format(dayjs(new Date()).$d, "yyyy-MM-dd");

    const fetchData = async () => {
      await dispatch(get_info_calculate({ date_from, date_to, user_name, factory }));
      await dispatch(get_info_task({ date_from, date_to, user_name, factory }));
    }

    fetchData();


  }, [dispatch, user_name, factory])

  useEffect(() => {
    if (alertValidate && alertCount >= 2) {
      Toast.fire({
        icon: "error",
        title:
          t("personal_info.validate_date_from"),
      })
    }
    setAlertValidate(false);
  }, [alertValidate, alertCount, t])

  const formik = useFormik({
    initialValues: {
      DateFrom: dayjs(new Date()),
      DateTo: dayjs(new Date()),
    },
    validationSchema,
    validate,
    onSubmit: async (data) => {
      const date_from = format(data.DateFrom.$d, "yyyy-MM-dd");
      const date_to = format(data.DateTo.$d, "yyyy-MM-dd");
      await dispatch(get_info_calculate({ date_from, date_to, user_name, factory }));
      await dispatch(get_info_task({ date_from, date_to, user_name, factory }));
    }
  })

  return (
  <Box marginTop={1} sx={{ position: "relative", width: "100%" }}>
      <Box component="div" sx={FilterStyle} style={Active}>
          <Box component="form" onSubmit={formik.handleSubmit} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Date From"
                id="DateFrom"
                name="DateFrom"
                format="DD-MM-YYYY"
                value={formik.values.DateFrom}
                onChange={(value) => {
                  formik.setFieldValue("DateFrom", value);
                }}
                slotProps={{
                  textField: {
                    size: "small",
                    fullWidth: true,
                    helperText: formik.touched.DateFrom && formik.errors.DateFrom,
                    error: formik.touched.DateFrom && Boolean(formik.errors.DateFrom),
                  },
                }}
                sx={{ flex: 1, marginLeft: 1 }}
              />
            </LocalizationProvider>
            <Grid item xs={1} md={1}>
                  <Box sx={{ textAlign: "center", lineHeight: "35px" }}>~</Box>
            </Grid>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Date To"
                id="DateTo"
                name="DateTo"
                format="DD-MM-YYYY"
                value={formik.values.DateTo}
                onChange={(value) => {
                  formik.setFieldValue("DateTo", value);
                }}
                slotProps={{
                  textField: {
                    size: "small",
                    fullWidth: true,
                    helperText: formik.touched.DateTo && formik.errors.DateTo,
                    error: formik.touched.DateTo && Boolean(formik.errors.DateTo),
                  },
                }}
                sx={{ flex: 1, marginLeft: 1 }}
              />
            </LocalizationProvider>
            <Button type="submit" variant="contained" color="primary"  sx={{ marginLeft: 1, fontSize:'0.9rem' }}>
            {t("personal_info.btn_search")}
            </Button>
          </Box>
        </Box>

      {/* Content  */}
      <Box component="div" sx={open ? {
        transition: "ease 0.5s", transform: `translate(0%, 0%)`, margin: "0 -5px",
      } : {
        transition: "ease 0.5s", transform: `translate(0%, -170px)`, margin: "0 -5px",
      }}>
        <CalculateJob totalFix={totalFix} avgTime={avgTime} />

        <TaskEmployee arrResult={arrResult} />

        <SkillEmployee />

        <ChartEmployee arrPercentfn={arrPercentfn} />
      </Box>
    </Box >
  );
}
