import {
  Autocomplete,
  Box,
  Button,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import AlertDialog from "./AlertDialog";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { finish_mechanic } from "../redux/features/electric";

const TaskDetailInfo = ({
  task,
  open,
  setOpen,
  t,
  languages,
  getListAsignMechanic,
}) => {
  const dispatch = useDispatch();
  const [selectedRepair, setSelectedRepair] = useState("");
  const { factory, floor, user_name, lean, position } = useSelector(
    (state) => state.auth.user
  );

  const statusMapping = {
    1: "Request",
    2: t("process_status.status_2_confirm"),
    3: t("employee_list.fixing"),
    4: t("info_machine_damage.alert_success"),
    6: t("info_machine_damage.alert_fail"),
  };

  const calculateTimeDifference = (start, end) => {
    if (start && end) {
      const startDate = new Date(start);
      const endDate = new Date(end);

      const diffInMs = endDate - startDate;
      const diffInSeconds = Math.floor(diffInMs / 1000);

      const hours = Math.floor(diffInSeconds / 3600);
      const minutes = Math.floor((diffInSeconds % 3600) / 60);
      const seconds = (diffInSeconds % 3600) % 60;

      return { hours, minutes, seconds };
    }
    return null;
  };

  const timeDiff = calculateTimeDifference(task.fixing, task.finish) || "";
  const formatTime = (hours, minutes, seconds) => {
    let formattedTime = "";
    if (hours > 0) {
      formattedTime += `${hours} ${t("process_status.hours")} `;
    }
    if (minutes > 0 || hours > 0) {
      formattedTime += `${minutes} ${t("process_status.minutes")} `;
    }
    formattedTime += `${seconds} ${t("process_status.seconds")}`;
    return formattedTime;
  };

  const handleClickEmplTransfer = async (row) => {
    
   console.log({
    selectedRepair, row
   })
   const {id_mechanic,id_machine,remark_mechanic} = row


   dispatch(
           finish_mechanic({
             id_user_mechanic:id_mechanic,
             skill: '998',
             id_machine,
             remark_mechanic,
             lean,
             factory,
             statusRadio:'6',
             language:languages,
             new_mechanic:'',
             otherIssue:'',
             new_id_user_mechanic:selectedRepair
           })
         );
         setOpen(false)
  };
  useEffect(() => {
    if (open) {
      setSelectedRepair("");
    }
  }, [open]);

  // Lấy danh sách unique mechanics
  const uniqueMechanics = getListAsignMechanic
    ? [...new Set(getListAsignMechanic.map((item) => item.user_name))].map(
        (userName) => {
          const mechanic = getListAsignMechanic.find(
            (item) => item.user_name === userName
          );
          return {
            label: `${userName} - ${mechanic.name}`,
            value: userName,
          };
        }
      )
    : [];

  return (
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
          {task.id_user_request && (
            <Grid item xs={6} md={6}>
              <Typography
                variant="div"
                sx={{ fontSize: "14px", fontWeight: "500" }}
              >
                {t("work_list.requester")}
                {": "}
              </Typography>
              <Typography
                variant="div"
                sx={{ fontSize: "14px", color: "gray" }}
              >
                {task.id_user_request}
              </Typography>
            </Grid>
          )}
          {task.id_user_request && (
            <Grid item xs={6} md={6}>
              <Typography
                variant="div"
                sx={{ fontSize: "14px", fontWeight: "500" }}
              >
                {t("work_list.floor")}{" "}
              </Typography>
              <Typography
                variant="div"
                sx={{ fontSize: "14px", color: "gray" }}
              >
                {task.floor_user_request + " / " + task.Line}
              </Typography>
            </Grid>
          )}
          {task.id_machine && (
            <Grid item xs={6} md={6}>
              <Typography
                variant="div"
                sx={{ fontSize: "14px", fontWeight: "500" }}
              >
                {t("process_status.status_1_id_machine")}{" "}
              </Typography>
              <Typography
                variant="div"
                sx={{ fontSize: "14px", color: "gray" }}
              >
                {task.id_machine}
              </Typography>
            </Grid>
          )}
          {task.Name_vn && (
            <Grid item xs={6} md={6}>
              <Typography
                variant="div"
                sx={{ fontSize: "14px", fontWeight: "500" }}
              >
                {t("info_machine_damage.name_machine")}
                {": "}
              </Typography>
              <Typography
                variant="div"
                sx={{ fontSize: "14px", color: "gray" }}
              >
                {task.Name_vn}
              </Typography>
            </Grid>
          )}
          {task.date_user_request && (
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
                {task.date_user_request?.split("T")[1].slice(0, -8) +
                  " " +
                  task.date_user_request?.split("T")[0]}
              </Typography>
            </Grid>
          )}
          {task.accept && (
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
                {task.accept
                  ? task.accept?.split("T")[1].slice(0, -8) +
                    " " +
                    task.accept?.split("T")[0]
                  : ""}
              </Typography>
            </Grid>
          )}

          <Grid item xs={6} md={6}>
            <Typography
              variant="div"
              sx={{ fontSize: "14px", fontWeight: "500" }}
            >
              {t("process_status.status_2_date")}{" "}
            </Typography>
            <Typography variant="div" sx={{ fontSize: "14px", color: "gray" }}>
              {task.fixing
                ? task.fixing?.split("T")[1].slice(0, -8) +
                  " " +
                  task.fixing?.split("T")[0]
                : ""}
            </Typography>
          </Grid>

          <Grid item xs={6} md={6}>
            <Typography
              variant="div"
              sx={{ fontSize: "14px", fontWeight: "500" }}
            >
              {t("process_status.status_4_date")}{" "}
            </Typography>
            <Typography variant="div" sx={{ fontSize: "14px", color: "gray" }}>
              {task.finish
                ? task.finish?.split("T")[1].slice(0, -8) +
                  " " +
                  task.finish?.split("T")[0]
                : ""}
            </Typography>
          </Grid>
          {timeDiff &&
            (timeDiff.hours || timeDiff.minutes || timeDiff.seconds) &&
            task.finish && (
              <Grid item xs={6} md={6}>
                <Typography
                  variant="div"
                  sx={{ fontSize: "14px", fontWeight: "500" }}
                >
                  {t("process_status.time_fix")}{" "}
                </Typography>
                <Typography
                  variant="div"
                  sx={{ fontSize: "14px", color: "gray" }}
                >
                  {formatTime(
                    timeDiff.hours,
                    timeDiff.minutes,
                    timeDiff.seconds
                  )}
                </Typography>
              </Grid>
            )}
          {task.id_mechanic && (
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
                {task.id_mechanic
                  ? task.id_mechanic + "-" + task.name_mechanic
                  : ""}
              </Typography>
            </Grid>
          )}

          <Grid item xs={6} md={6}>
            <Typography
              variant="div"
              sx={{ fontSize: "14px", fontWeight: "500" }}
            >
              {t("process_status.owner_mechanic")}{" "}
            </Typography>
            <Typography variant="div" sx={{ fontSize: "14px", color: "gray" }}>
              {task.id_owner ? task.id_owner + "-" + task.name_owner : ""}
            </Typography>
          </Grid>

          {task.info_skill_en && (
            <Grid item xs={6} md={6}>
              <Typography
                variant="div"
                sx={{ fontSize: "14px", fontWeight: "500" }}
              >
                {t("process_status.status_4_repair_method")}{" "}
              </Typography>
              <Typography
                variant="div"
                sx={{ fontSize: "14px", color: "gray" }}
              >
                {languages === "EN"
                  ? task.info_skill_en
                  : languages === "MM"
                  ? task.info_skill_mm
                  : task.info_skill_vn}
                {task.other_skill && "(" + task.other_skill + ")"}
              </Typography>
            </Grid>
          )}
          {task.newmachine && (
            <Grid item xs={6} md={6}>
              <Typography
                variant="div"
                sx={{ fontSize: "14px", fontWeight: "500" }}
              >
                {t("process_status.new_code_machine") + ":"}{" "}
              </Typography>
              <Typography
                variant="div"
                sx={{ fontSize: "14px", color: "gray" }}
              >
                {task.newmachine}
              </Typography>
            </Grid>
          )}
          <Grid item xs={6} md={6}>
            <Typography
              variant="div"
              sx={{ fontSize: "14px", fontWeight: "500" }}
            >
              {t("employee_list.active_status")}
              {": "}
            </Typography>
            <Typography variant="div" sx={{ fontSize: "14px", color: "gray" }}>
              {statusMapping[task.status] || ""}
            </Typography>
          </Grid>
          {task.status != 4 && task.status != 1 && task.status != 6 && (
            <Grid container item xs={12} md={12}>
              <Grid
                item
                xs={12}
                md={6}
                sx={{ display: "flex", alignItems: "center" }}
              >
                {/* <FormControl style={{ minWidth: 120, width: "100%" }}>
                  <InputLabel id="Fac" sx={{ background: "#fff" }}>
                 
                    Chọn thợ thay thế
                  </InputLabel>
                  <Select
                    value={selectedRepair}
                    onChange={(event) => {
                      setSelectedRepair(event.target.value);
                    }}
                    variant="outlined"
                    fullWidth
                    displayEmpty
                  >
                  
                    {getListAsignMechanic && getListAsignMechanic.length > 0
                      ? [
                          ...new Set(
                            getListAsignMechanic.map((item) => item.user_name)
                          ),
                        ].map((userName) => {
                          const mechanic = getListAsignMechanic.find(
                            (item) => item.user_name === userName
                          );
                          return (
                            <MenuItem key={userName} value={userName}>
                              {userName + " - " + mechanic.name}
                            </MenuItem>
                          );
                        })
                      : []}
                   
                  </Select>
                </FormControl> */}
                <FormControl style={{ minWidth: 120, width: "100%" }}>
                  <Autocomplete
                    options={uniqueMechanics} // Danh sách các options
                    getOptionLabel={(option) => option.label} // Hiển thị tên thợ trong dropdown
                    value={
                      selectedRepair
                        ? uniqueMechanics.find(
                            (item) => item.value === selectedRepair
                          )
                        : null
                    } // Gán giá trị hiện tại
                    onChange={(event, newValue) => {
                      setSelectedRepair(newValue ? newValue.value : ""); // Cập nhật giá trị khi thay đổi
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label={t('process_status.label_choose_repair')}
                        variant="outlined"
                        fullWidth
                      />
                    )}
                    isOptionEqualToValue={(option, value) =>
                      option.value === value?.value
                    } // So sánh giá trị chính xác
                    clearOnEscape // Cho phép xóa giá trị bằng phím Esc
                  />
                </FormControl>
              </Grid>
              <Grid
                item
                xs={12}
                md={6}
                sx={{
                  fontSize: "14px",
                  fontWeight: "500",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Button
                  color={"secondary"}
                  content="outline"
                  disabled={!selectedRepair ? true : false}
                  onClick={() => {
                    handleClickEmplTransfer(task);
                  }}
                >
                  {t('process_status.btn_transfer')}
                </Button>
              </Grid>
            </Grid>
          )}
        </Grid>
      </Box>
    </AlertDialog>
  );
};
export default TaskDetailInfo;
