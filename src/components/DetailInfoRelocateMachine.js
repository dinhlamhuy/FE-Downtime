import React, { useEffect } from "react";
import AlertDialog from "./AlertDialog";
import { Grid, Typography, Box, Button, Divider } from "@mui/material";

import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { cancel_report_damage } from "../redux/features/product";
import { setErrorCode } from "../redux/features/electric";
import { Toast } from "../utils/toast";

const DetailInfoRelocateMachine = ({ isCheck, open, setOpen, user, task }) => {
  const dispatch = useDispatch();
  const product = useSelector((state) => state.product);
  const [t] = useTranslation("global");
  const languages = localStorage.getItem("languages");

  const onCancel = async (id_machine, user_name, factory) => {
    const language = languages;

    // await dispatch(
    //   cancel_report_damage({ user_name, id_machine, factory, language })
    // );

    // await dispatch(setErrorCode(null, ""));
    // await fetchData();
    // handleOpenConfirm();
  };
  useEffect(() => {
    // Xử lý khi errorCode === 0
    if (product.errorCode === 0) {
      Toast.fire({
        icon: "success",
        title: product.errorMessage,
      });

      dispatch(setErrorCode(null));

      return;
    }
  }, [product, dispatch]);
  return (
    <>
      {isCheck && (
        <AlertDialog
          open={open}
          setOpen={setOpen}
          headerModal={t("process_status.status_1_header")}
        >
          <Box component="div" sx={{ margin: "10px" }}>
            <Grid
              container
              rowSpacing={2}
              columnSpacing={{ xs: 1, sm: 2, md: 3 }}
              sx={{ marginBottom: "10px" }}
            >
              <Grid item xs={6} md={6}>
                <Typography
                  variant="div"
                  sx={{ fontSize: "14px", fontWeight: "500" }}
                >
                  {t("process_status.status_1_user_request")}{" "}
                </Typography>
                <Typography
                  variant="div"
                  sx={{ fontSize: "14px", color: "gray" }}
                >
                  {task.id_user_req ? task.id_user_req : user.name}
                </Typography>
              </Grid>
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
                  {task?.request_time?.split("T")[1].slice(0, -8) +
                    " " +
                    task?.request_time?.split("T")[0]}
                </Typography>
              </Grid>
              <Grid item xs={6} md={6}>
                <Typography
                  variant="div"
                  sx={{ fontSize: "14px", fontWeight: "500" }}
                >
                  {"Floor: "}
                </Typography>
                <Typography
                  variant="span"
                  sx={{ fontSize: "14px", color: "gray" }}
                >
                  {task?.req_floor}
                </Typography>
              </Grid>
              <Grid item xs={6} md={6}>
                <Typography
                  variant="div"
                  sx={{ fontSize: "14px", fontWeight: "500" }}
                >
                  {"Line: "}
                </Typography>
                <Typography
                  variant="div"
                  sx={{ fontSize: "14px", color: "gray" }}
                >
                  {task?.req_line}
                </Typography>
              </Grid>
              <Grid item xs={12} md={12}>
                <Divider />
              </Grid>
              <Grid item xs={6} md={6}>
                <Typography
                  variant="div"
                  sx={{ fontSize: "14px", fontWeight: "500" }}
                >
                  {t("process_status.Floor_to_transfer") + ": "}
                </Typography>
                <Typography
                  variant="span"
                  sx={{ fontSize: "14px", color: "gray" }}
                >
                  {task?.ID_Floor}
                </Typography>
              </Grid>

              <Grid item xs={6} md={6}>
                <Typography
                  variant="div"
                  sx={{ fontSize: "14px", fontWeight: "500" }}
                >
                  {t("process_status.Line_to_transfer") + ": "}
                </Typography>
                <Typography
                  variant="div"
                  sx={{ fontSize: "14px", color: "gray" }}
                >
                  {task?.ID_lean}
                </Typography>
              </Grid>
              <Grid item xs={6} md={6}>
                <Typography
                  variant="div"
                  sx={{ fontSize: "14px", fontWeight: "500" }}
                >
                  {t("process_status.status_1_lean")}{" "}
                </Typography>
                <Typography
                  variant="span"
                  sx={{ fontSize: "14px", color: "gray" }}
                >
                  {task.lean_req ? task.lean_req : user.lean}
                </Typography>
              </Grid>

              <Grid item xs={6} md={6}>
                <Typography
                  variant="div"
                  sx={{ fontSize: "14px", fontWeight: "500" }}
                ></Typography>
                <Typography
                  variant="div"
                  sx={{ fontSize: "14px", color: "gray" }}
                >
                  {/* {task?.name_machanic ? task?.name_machanic : task?.name} */}
                  {task?.name_mechanic}
                </Typography>
              </Grid>
              <Grid item xs={12} md={12}>
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
                  {task.remark}
                </Typography>
              </Grid>
              <Grid item xs={12} md={12}>
                <Divider />
              </Grid>
              <Grid item xs={6} md={6}>
                <Typography
                  variant="div"
                  sx={{ fontSize: "14px", fontWeight: "500" }}
                >
                  {t("process_status.Lead_Mechanical") + ": "}
                </Typography>
                <Typography
                  variant="span"
                  sx={{ fontSize: "14px", color: "gray" }}
                >
                  {task?.owner_mechanic_user_name
                    ? task?.owner_mechanic_user_name +
                      "-" +
                      task?.owner_mechanic_name
                    : t("process_status.Unconfirmed")}
                </Typography>
              </Grid>

              <Grid item xs={6} md={6}>
                <Typography
                  variant="div"
                  sx={{ fontSize: "14px", fontWeight: "500" }}
                >
                  {t("process_status.status_2_confirm") + ": "}
                </Typography>
                <Typography
                  variant="div"
                  sx={{ fontSize: "14px", color: "gray" }}
                >
                  {task?.cfm_mechanic_time &&
                    task?.cfm_mechanic_time?.split("T")[1].slice(0, -8) +
                      " " +
                      task?.cfm_mechanic_time?.split("T")[0]}
                </Typography>
              </Grid>
              <Grid item xs={6} md={6}>
                <Typography
                  variant="div"
                  sx={{ fontSize: "14px", fontWeight: "500" }}
                >
                  {t("process_status.Assigned_Mechanic") + ": "}
                </Typography>
              </Grid>
              <Grid item xs={6} md={6}>
                <Typography
                  variant="span"
                  sx={{
                    fontSize: "14px",
                    color: "gray",
                    whiteSpace: "pre-line",
                  }}
                >
                  {task?.Mechanics?.split(",").join("\r\n")}
                </Typography>
              </Grid>

              <Grid item xs={12} md={12}>
                <Divider />
              </Grid>
              <Grid item xs={6} md={6}>
                <Typography
                  variant="div"
                  sx={{ fontSize: "14px", fontWeight: "500" }}
                >
                  {t("process_status.Lead_Electromechanical") + ": "}
                </Typography>
                <Typography
                  variant="span"
                  sx={{ fontSize: "14px", color: "gray" }}
                >
                  {task.owner_electrican_user_name
                    ? task?.owner_electrican_user_name +
                      "-" +
                      task?.owner_electrican_name
                    : t("process_status.Unconfirmed")}
                </Typography>
              </Grid>

              <Grid item xs={6} md={6}>
                <Typography
                  variant="div"
                  sx={{ fontSize: "14px", fontWeight: "500" }}
                >
                  {t("process_status.status_2_confirm") + ": "}
                </Typography>
                <Typography
                  variant="div"
                  sx={{ fontSize: "14px", color: "gray" }}
                >
                  {task?.cfm_electrician_time &&
                    task?.cfm_electrician_time?.split("T")[1].slice(0, -8) +
                      " " +
                      task?.cfm_electrician_time?.split("T")[0]}
                </Typography>
              </Grid>
              <Grid item xs={6} md={6}>
                <Typography
                  variant="div"
                  sx={{ fontSize: "14px", fontWeight: "500" }}
                >
                  {t("process_status.Assigned_Electromechanical") + ": "}
                </Typography>
              </Grid>
              <Grid item xs={6} md={6}>
                <Typography
                  variant="span"
                  sx={{
                    fontSize: "14px",
                    color: "gray",
                    whiteSpace: "pre-line",
                  }}
                >
                  {task?.Electricans?.split(",").join("\r\n")}
                </Typography>
              </Grid>

              {/* {task.id_user_request === user.user_name &&
                user.permission == "3" &&
                task.status == "1" &&
                !task.id_main_task && (
                  <Grid item xs={12} md={12}>
                    <Button
                      variant="contained"
                      color="error"
                      sx={{ fontSize: "14px", fontWeight: "500" }}
                      onClick={() =>
                        onCancel(
                          task.id_machine,
                          task.id_user_request,
                          task.factory
                        )
                      }
                    >
                      {t("info_machine_damage.cancelReq")}
                    </Button>
                  </Grid>
                )} */}
            </Grid>
          </Box>
        </AlertDialog>
      )}
    </>
  );
};

export default DetailInfoRelocateMachine;
