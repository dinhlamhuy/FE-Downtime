import React, { useEffect, useRef, useState } from "react";
import {
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Modal,
  useMediaQuery,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import axios from "axios";
import { BASE_URL } from "../../utils/env";
import ProgressHistoryDetailTask from "../../components/ProgressHistoryDetailTask";

import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import socketIOClient from "socket.io-client";
import {
  get_All_Task,
  get_list_asign_mechanic,
  setErrorCode,
} from "../../redux/features/electric";
import TaskDetailInfo from "../../components/TaskDetailInfo";
import { Toast } from "../../utils/toast";
export default function TaskListScreen() {
  const { getAllTaskByCB, getListAsignMechanic } = useSelector(
    (state) => state.electric
  );
    const electric = useSelector((state) => state.electric);
  const host = BASE_URL;
  const [data, setData] = useState([]);
  const today = new Date().toISOString().split("T")[0];
  const [fromDate, setFromDate] = useState(today);
  const [activeModal, setActiveModal] = useState("");
  const [activeRowForConfirm, setActiveRowForConfirm] = useState(null);
  const [toDate, setToDate] = useState(today);
  const [open, setOpen] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [idMachine, setIdMachine] = useState("");
  const [activeRow, setActiveRow] = useState(null);
  const [selectTask, setSelectTask] = useState({});
  const isSmallScreen = useMediaQuery("(max-width: 700px)");
  const [openModal, setOpenModal] = useState(false);
  
  const [openModalDetail, setOpenModalDetail] = useState(false);
  const { user_name, factory, floor, lean, position } = useSelector(
    (state) => state.auth.user
  );
  useEffect(() => {
    setData(Array.isArray(getAllTaskByCB) ? getAllTaskByCB : []);
  }, [getAllTaskByCB]);
  const [t] = useTranslation("global");
  const [socket, setSocket] = useState("");
    const socketRef = useRef();
  const dispatch = useDispatch();
  const languages = localStorage.getItem("languages");
  const [searchTerms, setSearchTerms] = useState({
    id: "",
    id_machine: "",
    Name_vn: "",
    id_user_request: "",
    floor_user_request: "",
    Line: "",
    name_user_request: "",
    fixer: "",
    id_mechanic: "",
    date_user_request: "",
    accept: "",
    fixing: "",
    finish: "",
    status: " ",
    id_owner: "",
    info_reason_vn: "",
    info_skill_vn: "",
    remark_mechanic: "",
  });

  const convertLanguage = (name, langues) => {
    const mapping = {
      REQUESTED: { VN: "Yêu Cầu", EN: "REQUESTED" },
      CONFIRMED: { VN: "Đã Xác Nhận", EN: "CONFIRMED" },
      FIXING: { VN: "Đang Sửa", EN: "FIXING" },
      FINISH: { VN: "Hoàn Thành", EN: "FINISH" },
      INCOMPLETE: { VN: "Chưa Hoàn Thành", EN: "INCOMPLETE" }
    };
  
    return mapping[name] ? mapping[name][langues] || name : name;
  };
  const fetchData = async () => {
    try {
      await dispatch(
        get_All_Task({ factory, fromDate, toDate, floor, fixer: lean })
      );
      setActiveRow(null);
      setOpenModal(false);

      //   setData(response.data.data || []);
    } catch (error) {
      console.error("Lỗi khi gọi API:", error);
    }
  };
  useEffect(() => {
 
    fetchData();

    socketRef.current = socketIOClient.connect(host);
    socketRef.current.on("message", (data) => {
      console.log(data);
    });
    socketRef.current.on(`${user_name}`, (data) => {
      setSocket(data);
    });

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        console.log("Trang đã trở lại, load lại...");
        fetchData();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      // socketRef.current.disconnect();
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [factory, floor, user_name, position, lean, dispatch, socket]);
  const HandleViewDetail = async (task) => {
    const { id_machine } = task;
    await dispatch(
      get_list_asign_mechanic({ id_machine, floor, factory, position, lean })
    );
    setOpenModalDetail(true);
    setSelectTask(task);
    // setIdMachine(id_task);
    // setActiveModal(true);
  };

  const [sortConfig, setSortConfig] = useState({
    key: "status",
    direction: "asc",
  });

  useEffect(() => {
    const fetchData = async () => {
      if (electric.errorCode !== null) {
        let icon = "error";
        if (electric.errorCode === 0) {
          icon = "success";
        }
        Toast.fire({
          icon: icon,
          title: electric.errorMessage,
        });
        await dispatch(setErrorCode(null, ""));
      }
    };
    fetchData();
  }, [electric, dispatch]);
  useEffect(() => {
    fetchData();
  }, []);
  const handleSort = (key) => {
    // let direction = "asc";
    // if (sortConfig.key === key && sortConfig.direction === "asc") {
    //   direction = "desc";
    // }
    // setSortConfig({ key, direction });
    // const sortedData = [...data].sort((a, b) => {
    //   if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
    //   if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
    //   return 0;
    // });
    // setData(sortedData);
  };

  const HandleResetFiltered = () => {
    setSearchTerms({
      id: "",
      id_machine: "",
      Name_vn: "",
      floor_user_request: "",
      Line: "",
      id_user_request: "",
      name_user_request: "",
      fixer: "",
      id_mechanic: "",
      date_user_request: "",
      accept: "",
      fixing: "",
      finish: "",
      status: " ",
      id_owner: "",
      info_reason_vn: "",
      info_skill_vn: "",
      remark_mechanic: "",
    });
    setOpenModal(false);
  };

  const handleOpenConfirm = (index) => setActiveRowForConfirm(index);
  const handleCloseConfirm = () => setActiveRowForConfirm(null);
  const getProcessedData = () => {
    const matchValue = (rowValue, searchValue) => {
      return rowValue
        ?.toString()
        .trim()
        .toLowerCase()
        .includes(searchValue.toString().trim().toLowerCase());
    };

    let filteredData = [...data].filter((row) => {
      return Object.keys(searchTerms).every((key) => {
        if (!searchTerms[key]) return true; // Không lọc nếu không có từ khóa

        const searchValue = searchTerms[key];
        // Trường hợp đặc biệt: id_mechanic hoặc name_mechanic
        if (key === "id_mechanic") {
          // console.log(searchValue)
          return (
            matchValue(row["id_mechanic"], searchValue) ||
            matchValue(row["name_mechanic"], searchValue)
          );
        }
        // Trường hợp đặc biệt: id_owner hoặc name_owner
        if (key === "id_owner") {
          return (
            matchValue(row["id_owner"], searchValue) ||
            matchValue(row["name_owner"], searchValue)
          );
        }
        // Trường hợp thông thường
        return matchValue(row[key], searchValue);
      });
    });

    // Sắp xếp dữ liệu
    if (sortConfig.key) {
      filteredData.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key])
          return sortConfig.direction === "asc" ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key])
          return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    return filteredData;
  };
  const renderSearchForm = () => (
    <div style={{ padding: "10px", background: "white", borderRadius: "8px" }}>
      <TextField
        size="small"
        label={t("personal_info.date_from")}
        type="date"
        value={fromDate}
        onChange={(e) => setFromDate(e.target.value)}
        InputLabelProps={{ shrink: true }}
        style={{ marginBottom: "10px", width: "100%" }}
      />
      <TextField
        size="small"
        label={t("personal_info.date_to")}
        type="date"
        value={toDate}
        onChange={(e) => setToDate(e.target.value)}
        InputLabelProps={{ shrink: true }}
        style={{ marginBottom: "10px", width: "100%" }}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={fetchData}
        style={{ marginBottom: "10px", width: "100%" }}
      >
        {t("personal_info.btn_search")}
      </Button>
      <Button
        variant="outlined"
        color="secondary"
        onClick={HandleResetFiltered}
        style={{ width: "100%" }}
      >
        Reset
      </Button>
    </div>
  );

  return (
    <div>
      {!isSmallScreen ? (
        <div
          style={{
            marginTop: "-4.5rem",
            zIndex: "9999999",
            position: "absolute",
            right: "2rem",
          }}
        >
          <TextField
            size="small"
            label={t("personal_info.date_from")}
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            style={{ marginRight: "10px", background: "white" }}
          />
          <TextField
            size="small"
            label={t("personal_info.date_to")}
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            style={{ marginRight: "10px", background: "white" }}
          />
          <Button variant="contained" color="primary" onClick={fetchData}>
            {t("personal_info.btn_search")}
          </Button>{" "}
          &emsp;
          <Button
            variant="outlined"
            color="secondary"
            onClick={HandleResetFiltered}
          >
            Reset
          </Button>
        </div>
      ) : (
        <>
          <Button
            variant="outline"
            sx={{ color: "gray" }}
            onClick={() => setOpenModal(true)}
            style={{
              padding: "10px",
            }}
          >
            <FilterAltOutlinedIcon />
          </Button>
          <Modal
            open={openModal}
            onClose={() => setOpenModal(false)}
            aria-labelledby="filter-modal-title"
            aria-describedby="filter-modal-description"
          >
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: !isSmallScreen ? "40%" : "90%",

                bgcolor: "background.paper",
                borderRadius: 2,
                boxShadow: 24,
                p: 4,
              }}
            >
              {renderSearchForm()}
            </Box>
          </Modal>
        </>
      )}

      <div sx={{ padding: "5px" }}>
        {/* Data Table */}
        <TableContainer
          component={Paper}
          sx={{
            maxHeight: "75vh",
            overflowY: "auto",
          }}
        >
          <Table
            stickyHeader
            sx={{
              tableLayout: "fixed",
            }}
          >
            <TableHead sx={{ background: "blue", color: "#fff" }}>
              <TableRow
                sx={{
                  "& th": {
                    fontSize: "0.8rem",
                    "& .MuiTypography-root": { fontSize: "0.8rem" },
                  },
                }}
              >
                <TableCell
                  sx={{
                    width: "70px",
                    background: "blue",
                    color: "#fff",
                    textAlign: "center",
                  }}
                >
                  {t("process_status.history")}
                </TableCell>
                <TableCell
                  className="thStyle"
                  sx={{
                    width: "190px",
                  }}
                >
                  <Typography onClick={() => handleSort("id_mechanic")}>
                    {t("process_status.status_3")}
                    {sortConfig.key === "id_mechanic" &&
                      (sortConfig.direction === "asc" ? "▲" : "▼")}
                  </Typography>
                  <TextField
                    size="small"
                    variant="standard"
                    placeholder={t("process_status.status_3")}
                    sx={{ background: "white" }}
                    value={searchTerms.id_mechanic}
                    onChange={(e) =>
                      setSearchTerms({
                        ...searchTerms,
                        id_mechanic: e.target.value,
                      })
                    }
                  />
                </TableCell>
                <TableCell
                  className="thStyle"
                  sx={{
                    width: "140px",
                  }}
                >
                  <Typography onClick={() => handleSort("status")}>
                    {t("employee_list.active_status")}

                    {sortConfig.key === "status" &&
                      (sortConfig.direction === "asc" ? "▲" : "▼")}
                  </Typography>
                  <FormControl size="small" fullWidth>
                    <Select
                      sx={{ background: "white", height: "2rem" }}
                      value={searchTerms.status}
                      onChange={(e) =>
                        setSearchTerms({
                          ...searchTerms,
                          status: e.target.value,
                        })
                      }
                    >
                      <MenuItem value=" ">ALL</MenuItem>
                      <MenuItem value="1">{convertLanguage("REQUESTED",languages)}</MenuItem>
                      <MenuItem value="2">{convertLanguage("CONFIRMED",languages)}</MenuItem>
                      <MenuItem value="3">{convertLanguage("FIXING",languages)}</MenuItem>
                      <MenuItem value="4">{convertLanguage("FINISH",languages)}</MenuItem>
                      <MenuItem value="6">{convertLanguage("INCOMPLETE",languages)}</MenuItem>
                    </Select>
                  </FormControl>
                </TableCell>
                <TableCell
                  onClick={() => handleSort("remark_mechanic")}
                  sx={{
                    width: "110px",
                    textAlign: "center",
                    resize: "horizontal",
                    overflow: "auto",
                    background: "blue",
                    color: "#fff",
                  }}
                >
                  Downtime
                  {sortConfig.key === "remark_mechanic" &&
                    (sortConfig.direction === "asc" ? "▲" : "▼")}
                </TableCell>

                <TableCell
                  className="thStyle"
                  sx={{
                    width: "90px",
                  }}
                >
                  <Typography onClick={() => handleSort("Line")}>
                    {t("repair_status.conveyor")}
                    {sortConfig.key === "Line" &&
                      (sortConfig.direction === "asc" ? "▲" : "▼")}
                  </Typography>
                  <TextField
                    size="small"
                    variant="standard"
                    placeholder="Line"
                    sx={{ background: "white" }}
                    value={searchTerms.Line}
                    onChange={(e) =>
                      setSearchTerms({ ...searchTerms, Line: e.target.value })
                    }
                  />
                </TableCell>

                <TableCell
                  className="thStyle"
                  sx={{
                    width: "120px",
                  }}
                >
                  <Typography onClick={() => handleSort("id_user_request")}>
                    {t("process_status.status_1_user_request")}
                    {sortConfig.key === "id_user_request" &&
                      (sortConfig.direction === "asc" ? "▲" : "▼")}
                  </Typography>
                  <TextField
                    size="small"
                    variant="standard"
                    placeholder={t("process_status.status_1_user_request")}
                    sx={{ background: "white" }}
                    value={searchTerms.id_user_request}
                    onChange={(e) =>
                      setSearchTerms({
                        ...searchTerms,
                        id_user_request: e.target.value,
                        // name_mechanic: e.target.value,
                      })
                    }
                  />
                </TableCell>

              
              </TableRow>
            </TableHead>
            <TableBody
              sx={{
                "& td": {
                  fontSize: "0.8rem",
                  "& .MuiTypography-root": { fontSize: "0.8rem" },
                },
              }}
            >
              {getProcessedData().map((row, index) => (
                <TableRow
                  key={index}
                  onClick={() => setActiveRow(index)}
                  sx={{
                    backgroundColor:
                      activeRow === index
                        ? "#D3E3F3"
                        : index % 2 === 0
                        ? "white"
                        : "#FFE3E3",
                    cursor: "pointer",
                    "& td": {
                      color:
                        row.status == "1"
                          ? "red"
                          : row.status == "2"
                          ? "orange"
                          : row.status == "3"
                          ? "Green"
                          : row.status == "4"
                          ? "blue"
                          : "Black",
                    },
                  }}
                >
                  <TableCell sx={{ padding: "0", fontSize: "0.8rem" }}>
                    <Button
                      sx={{ width: "100%", fontSize: "0.8rem" }}
                      onClick={() => HandleViewDetail(row)}
                    >
                      <RemoveRedEyeOutlinedIcon />
                    </Button>
                    {activeModal && (
                      <ProgressHistoryDetailTask
                        isCheck={idMachine === row.id}
                        machine={row}
                        open={open}
                        setOpen={setOpen}
                        user={""}
                      />
                    )}
                  </TableCell>
                  <TableCell
                    className="tdStyle"
                    sx={{ textAlign: "left !important" }}
                  >
                    {row.id_mechanic &&
                      row.id_mechanic + " - " + row.name_mechanic}
                  </TableCell>
                  <TableCell
                    className="tdStyle"
                    style={{
                      fontWeight: "bold",
                      textAlign: "center",
                      padding: 0,
                      color:
                        row.status == "1"
                          ? "red"
                          : row.status == "2"
                          ? "orange"
                          : row.status == "3"
                          ? "Green"
                          : row.status == "4"
                          ? "blue"
                          : "Black",
                    }}
                  >
                    {row.status === 1
                      ? convertLanguage("REQUESTED", languages)
                      : row.status === 2
                      ?  convertLanguage("CONFIRMED", languages)
                      : row.status === 3
                      ?  convertLanguage("FIXING", languages)
                      : row.status === 4
                      ?  convertLanguage("FINISH", languages)
                      :  convertLanguage("INCOMPLETE", languages)}
                  </TableCell>
                  <TableCell className="tdStyle">
                    {row.total_downtime_detail}
                  </TableCell>
                  <TableCell className="tdStyle">
                    {row.Line}
                    {row.floor_user_request != row.Line &&
                      "(" + row.floor_user_request + ")"}
                  </TableCell>
                  <TableCell className="tdStyle">
                    {row.id_user_request}
                  </TableCell>

             
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TaskDetailInfo
          task={selectTask}
          open={openModalDetail}
          setOpen={() => setOpenModalDetail(false)}
          t={t}
          getListAsignMechanic={getListAsignMechanic}
          languages={languages}
        />
      </div>
    </div>
  );
}
