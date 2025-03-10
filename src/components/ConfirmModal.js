import React from "react";
import AlertDialog from "./AlertDialog";
import { Box, Stack, Button, Typography } from "@mui/material";
import { useDispatch } from "react-redux";
import { scanner_fix_mechanic,get_work_list_report_employee } from "../redux/features/electric";
import { get_all_machine } from "../redux/features/machine";
import { useTranslation } from "react-i18next";



const ConfirmModal = ({ isCheck, open, setOpen, idMachine, user }) => {
  const dispatch = useDispatch();
  const [t] = useTranslation("global");
  const languages = localStorage.getItem('languages');

  const fetchData = async () => {
    const { user_name, factory, lean } = user;
    const id_user_mechanic = user_name;
    // await dispatch(get_all_machine({ factory }));
    await dispatch(get_work_list_report_employee({ id_user_mechanic, factory, lean }));
  };

  const onSubmit = async () => {
    const { user_name, factory, lean } = user;
    const id_machine = idMachine;
    const id_user_mechanic = user_name;
    const status = 2;
    const language = languages;
    await dispatch(scanner_fix_mechanic({ id_user_mechanic, id_machine, factory, lean, status, language }));
    await fetchData();
    setOpen(false);
  };

  
  const onCancel = async () => {
    const { user_name, factory, lean } = user;
    const id_machine = idMachine;
    const id_user_mechanic = user_name;
    const status = 5;
    const language = languages;
  
    await dispatch(scanner_fix_mechanic({ id_user_mechanic, id_machine, factory, lean, status, language }));
    await fetchData();
    setOpen(false);
  };
  
  return (
    <>
      {isCheck && (
        <AlertDialog
          open={open}
          setOpen={setOpen}
          headerModal={t("process_status.status_2_header")}
        >
          <Box
            component="div"
            sx={{ display: "block", margin: "0 auto", maxWidth: "500px" }}
          >
            <Box component="div" sx={{ marginTop: "10px" }}>
              <Typography variant="h6" textAlign="center" >
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
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  onClick={onSubmit}
                >
                  {t("process_status.status_2_accept")}
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  size="small"
                  onClick={onCancel}
                >
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

export default ConfirmModal;
