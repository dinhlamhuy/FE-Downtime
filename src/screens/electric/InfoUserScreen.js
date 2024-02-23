import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Grid,
  Stack,
} from "@mui/material";
import CalculateJob from "../../components/CalculateJob";
import SkillEmployee from "../../components/SkillEmployee";
import ChartEmployee from "../../components/ChartEmployee";
import Title from "../../components/Title";
import FilterListIcon from "@mui/icons-material/FilterList";

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
  padding: "15px 30px 15px 30px",
  borderRadius: "30px",
  border: "3px solid #ccc",
};

const Active = {
  // position: "absolute",
  width: "100%",
  height: "150px",
  opacity: "1",
  transform: `translate(0%, 0%)`,
  transition: "ease 0.5s",
  zIndex: '1'
}

const ActiveNone = {
  // position: "absolute",
  width: "100%",
  height: "180px",
  opacity: "1",
  transform: `translate(0%, -300%)`,
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

  const [open, setOpen] = useState(false);
  const onShowFilter = () => {
    setOpen(!open);
  };

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
      <Box sx={{ textAlign: "right", marginTop: "-15px" }}>
        <Button onClick={onShowFilter}>
          <FilterListIcon />
          {t("personal_info.filter")}
        </Button>
      </Box>

      <Box component="div" sx={FilterStyle} style={open ? Active : ActiveNone}>
        <Title titleText={t("personal_info.search_info")} />
        <Box component="form" onSubmit={formik.handleSubmit}>
          <Grid
            container
            rowSpacing={2}
            columnSpacing={{ xs: 1, sm: 2, md: 3 }}
          >
            <Grid item xs={5} md={5}>
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
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={2} md={2}>
              <Box sx={{ textAlign: "center", lineHeight: "35px" }}>~</Box>
            </Grid>
            <Grid item xs={5} md={5}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label={t("personal_info.date_from")}
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
                      helperText:
                        formik.touched.DateTo && formik.errors.DateTo,
                      error:
                        formik.touched.DateTo &&
                        Boolean(formik.errors.DateTo),
                    },
                  }}
                />
              </LocalizationProvider>
            </Grid>
          </Grid>

          <Box sx={{ position: "absolute", top: "90px", left: "50%", transform: "translate(-50%, 0)" }}>
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
                {t("personal_info.btn_search")}
              </Button>
            </Stack>
          </Box>
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
