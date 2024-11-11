import React from "react";
import AlertDialog from "./AlertDialog";
import { Box, Stack, Button, Typography } from "@mui/material";
import { useDispatch } from "react-redux";
import { scanner_fix_mechanic, get_work_list_report_employee,get_task_support, accept_support } from "../redux/features/electric";
import { useTranslation } from "react-i18next";

const Sup_ConfirmModal = ({ open, setOpen, user , task }) => {
  const dispatch = useDispatch();
  const [t] = useTranslation("global");
  const languages = localStorage.getItem("languages");

  const fetchData = async () => {
    const { user_name, factory, lean } = user;
    await dispatch(get_task_support({ user_machine: user_name , factory }));
  };

  const onSubmit = async () => {
    const { user_name, factory } = user;
    const { id, Line, support_detail } = task;
    const status = 2;
    const language = languages;

    await dispatch(accept_support({
        id: id,
        factory: factory,
        line : Line,
        status: status,
        user_machine: user_name,
        support_detail:support_detail ,
        lang: language
    }));
    
    await fetchData();
    setOpen(false);
};

  const onCancel = async () => {
    const { user_name, factory } = user;
    const { id, Line, support_detail } = task;
    const status = 5;
    const language = languages;

    await dispatch(accept_support({
        id: id,
        factory: factory,
        line : Line,
        status: status,
        user_machine: user_name,
        support_detail:support_detail ,
        lang: language
    }));
    
    await fetchData();
    setOpen(false);
  };

  return (
    <>
      {open && (
        <AlertDialog
          open={open}
          setOpen={setOpen}
          headerModal={t("process_status.status_2_header")}
        >
          <Box component="div" sx={{ display: "block", margin: "0 auto", maxWidth: "500px" }}>
            <Box component="div" sx={{ marginTop: "10px" }}>
              <Typography variant="h6" textAlign="center">
                {t("process_status.status_2_confirm")}
              </Typography>
              <Typography textAlign="center" sx={{ fontSize: "14px", color: "#aeaeae" }}>
                {t("process_status.status_2_content")}
              </Typography>
            </Box>
            <Box component="div">
              <Stack
                direction="row"
                spacing={2}
                sx={{ marginTop: "25px", justifyContent: "center" }}
              >
                <Button variant="contained" color="primary" size="small" onClick={onSubmit}>
                  {t("process_status.status_2_accept")}
                </Button>
                <Button variant="contained" color="error" size="small" onClick={onCancel}>
                  {t("process_status.status_2_deny")}
                </Button>
              </Stack>
            </Box>
          </Box>
        </AlertDialog>
      )}
    </>
  );
};

export default Sup_ConfirmModal;
