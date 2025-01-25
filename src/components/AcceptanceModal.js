import React from "react";
import AlertDialog from "./AlertDialog";
import { Box, Stack, Button, Typography } from "@mui/material";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import {
  finish_Relocate_Machine,
  get_Relocate_Machine,
} from "../redux/features/product";

const AcceptanceModal = ({ isCheck, open, setOpen, task, user }) => {
  const dispatch = useDispatch();
  const [t] = useTranslation("global");
  const languages = localStorage.getItem("languages");

  const fetchData = async () => {
    const { user_name, factory } = user;
    const id_user_request = user_name;
    // await dispatch(get_all_machine({ factory }));
    // await dispatch(get_work_list_report_employee({ id_user_mechanic, factory, lean }));
    // await dispatch(get_report_damage({ id_user_request, factory }));
    await dispatch(get_Relocate_Machine({ id_user_request, factory }));
  };

  const onSubmit = async () => {
    const { user_name, factory, lean, floor } = user;
    const id_task = task?.id || "";
    const ID_Lean = task?.ID_lean || "";
    const ID_Floor = task?.ID_Floor || "";
    const id_user_mechanic = user_name;
    const language = languages;
    await dispatch(
      finish_Relocate_Machine({
        id_user_mechanic,
        floor,
        id_task,
        ID_Lean,
        ID_Floor,
        factory,
        language,
      })
    );
    await fetchData();
    setOpen(false);
  };

  const onCancel = async () => {
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
              <Typography variant="h6" textAlign="center">
                {t("process_status.Cfm_Request_for_Machine_Relocation")}
              </Typography>
              <Typography
                textAlign="center"
                sx={{ fontSize: "14px", color: "#aeaeae" }}
              >
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

export default AcceptanceModal;
