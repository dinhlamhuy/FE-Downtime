import React from "react";
import AlertDialog from "./AlertDialog";
import { Grid, Typography, Box } from "@mui/material";
import { useTranslation } from "react-i18next";

const DetailFinish = ({ open, setOpen, task, user }) => {
  const [t] = useTranslation("global");
  const languages = localStorage.getItem("languages");

  return (
    <>
      <AlertDialog
        open={open}
        setOpen={setOpen}
        headerModal={t("process_status.status_4_header")}
      >
        <Box component="div" sx={{ margin: "10px" }}>
          <Grid
            container
            rowSpacing={2}
            columnSpacing={{ xs: 1, sm: 2, md: 3 }}
            sx={{ marginBottom: "10px" }}
          >
            {task?.id_user_machine && (
              <Grid item xs={6} md={6}>
                <Typography
                  variant="div"
                  sx={{ fontSize: "14px", fontWeight: "500" }}
                >
                  {t("process_status.status_1_mechanic")}{" "}
                </Typography>
                <Typography
                  variant="div"
                  sx={{ fontSize: "14px", color: "gray" }}
                >
                  {task.id_user_machine}
                </Typography>
              </Grid>
            )}
            {task?.Line && (
              <Grid item xs={6} md={6}>
                <Typography
                  variant="div"
                  sx={{ fontSize: "14px", fontWeight: "500" }}
                >
                  {/* {t("process_status.status_1_lean")}{" "} */}
                  {" Line: "}
                </Typography>
                <Typography
                  variant="div"
                  sx={{ fontSize: "14px", color: "gray" }}
                >
                  {task.Line}
                </Typography>
              </Grid>
            )}

            {task?.Remark && (
              <Grid item xs={6} md={6}>
                <Typography
                  variant="div"
                  sx={{ fontSize: "14px", fontWeight: "500" }}
                >
                  {t("process_status.status_1_remark")}{" "}
                </Typography>
                <Typography
                  variant="div"
                  sx={{ fontSize: "14px", color: "gray" }}
                >
                  {task.Remark}
                </Typography>
              </Grid>
            )}
            {task?.date_request && (
              <Grid item xs={6} md={6}>
                <Typography
                  variant="div"
                  sx={{ fontSize: "14px", fontWeight: "500" }}
                >
                  {t("process_status.status_1_date")}{" "}
                </Typography>
                <Typography
                  variant="div"
                  sx={{ fontSize: "14px", color: "gray" }}
                >
                  {task.date_request.split("T")[1].slice(0, -8) +
                    " " +
                    task.date_request.split("T")[0]}
                </Typography>
              </Grid>
            )}
            {task?.date_cfm && (
              <Grid item xs={6} md={6}>
                <Typography
                  variant="div"
                  sx={{ fontSize: "14px", fontWeight: "500" }}
                >
                  {t("process_status.status_2_date")}{" "}
                </Typography>
                <Typography
                  variant="div"
                  sx={{ fontSize: "14px", color: "gray" }}
                >
                  {task.date_cfm.split("T")[1].slice(0, -8) +
                    " " +
                    task.date_cfm.split("T")[0]}
                </Typography>
              </Grid>
            )}
            {task?.date_finish && (
              <Grid item xs={6} md={6}>
                <Typography
                  variant="div"
                  sx={{ fontSize: "14px", fontWeight: "500" }}
                >
                  {t("process_status.status_4_date")}{" "}
                </Typography>
                <Typography
                  variant="div"
                  sx={{ fontSize: "14px", color: "gray" }}
                >
                  {task.date_finish.split("T")[1].slice(0, -8) +
                    " " +
                    task.date_finish.split("T")[0]}
                </Typography>
              </Grid>
            )}
            {task?.support_detail && (
              <Grid item xs={12} md={12}>
                <Typography
                  variant="div"
                  sx={{ fontSize: "14px", fontWeight: "500" }}
                >
                  {t("process_status.enter_details")}:{" "}
                </Typography>
                <Typography
                  variant="div"
                  sx={{ fontSize: "14px", color: "gray" }}
                >
                  {task.support_detail}
                </Typography>
              </Grid>
            )}
            
          </Grid>
        </Box>
      </AlertDialog>
    </>
  );
};

export default DetailFinish;
