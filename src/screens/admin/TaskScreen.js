import React, { useState } from "react";
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
  Typography,Modal, useMediaQuery,Box
} from "@mui/material";
import axios from "axios";
import { BASE_URL } from "../../utils/env";
import ProgressHistoryDetailTask from "../../components/ProgressHistoryDetailTask";
import "./style.css";
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
export default function TaskScreen() {
  const [data, setData] = useState([]);
  const today = new Date().toISOString().split("T")[0];
  const [factory, setFactory] = useState("LHG");
  const [fromDate, setFromDate] = useState(today);
  const [activeModal, setActiveModal] = useState("");
  const [toDate, setToDate] = useState(today);
  const [open, setOpen] = useState(false);
  const [idMachine, setIdMachine] = useState("");
  // const [isSidebarOpen, setSidebarOpen] = useState(false);
  const isSmallScreen = useMediaQuery("(max-width: 600px)");
  const [openModal, setOpenModal] = useState(false);
  const [searchTerms, setSearchTerms] = useState({
    id: "",
    id_machine: "",
    Name_vn: "",
    floor_user_request: "",
    Line: "",
    name_user_request: "",
    fixer: "",
    id_mechanic: "",
    date_user_request: "",
    accept: "",
    fixing: "",
    finish: "",
    status: "",
    id_owner: "",
    info_reason_vn: "",
    info_skill_vn: "",
    remark_mechanic: "",
  });

  const filteredData = data.filter((row) => {
    return Object.keys(searchTerms).every((key) => {
      const searchTerm = searchTerms[key].toLowerCase();
      const cellValue = String(row[key] || "").toLowerCase();
      return cellValue.includes(searchTerm);
    });
  });

  const HandleViewHistory = (id_task) => {
    setOpen(true);
    setIdMachine(id_task);
    setActiveModal(true);
    // console.log('hehe', id_task)
  };

  const formatDate = (datetime) => {
    const date = datetime;
    // const timePart = date.toTimeString().split(" ")[0]; // Lấy HH:mm:ss

    const result = date.split("T")[1].slice(0, -8) + " " + date?.split("T")[0];

    return `${result}`;
  };
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const fetchData = async () => {
    try {
      const response = await axios.get(BASE_URL + `/task/getAllTask`, {
        params: {
          factory,
          fromdate: fromDate,
          todate: toDate,
        },
      });
      // setSearchTerms({
      //   id: "",
      //   id_machine: "",
      //   Name_vn: "",
      //   floor_user_request: "",
      //   Line: "",
      //   name_user_request: "",
      //   fixer: "",
      //   id_mechanic: "",
      //   date_user_request: "",
      //   accept: "",
      //   fixing: "",
      //   finish: "",
      //   status: "",
      //   id_owner: "",
      //   info_reason_vn: "",
      //   info_skill_vn: "",
      //   remark_mechanic: "",
      // });
      setData(response.data.data || []);
    } catch (error) {
      console.error("Lỗi khi gọi API:", error);
    }
  };
  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });

    const sortedData = [...data].sort((a, b) => {
      if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
      if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
      return 0;
    });
    setData(sortedData);
  };
  const getProcessedData = () => {
    let filteredData = [...data].filter((row) => {
      return Object.keys(searchTerms).every((key) => {
        if (!searchTerms[key]) return true; // Không lọc nếu không có từ khóa
        return row[key]
          ?.toString()
          .trim()
          .toLowerCase()
          .includes(searchTerms[key].toString().trim().toLowerCase());
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

  const HandleResetFiltered = () => {
    setSearchTerms({
      id: "",
      id_machine: "",
      Name_vn: "",
      floor_user_request: "",
      Line: "",
      name_user_request: "",
      fixer: "",
      id_mechanic: "",
      date_user_request: "",
      accept: "",
      fixing: "",
      finish: "",
      status: "",
      id_owner: "",
      info_reason_vn: "",
      info_skill_vn: "",
      remark_mechanic: "",
    });
  };

  const renderSearchForm = () => (
    <div style={{ padding: "10px", background: "white", borderRadius: "8px" }}>
      <FormControl style={{ minWidth: 120, marginBottom: "10px" }}>
        <InputLabel id="Fac" sx={{background:'#fff'}}>Factory</InputLabel>
        <Select
          labelId="Fac"
          size="small"
          value={factory}
          onChange={(e) => setFactory(e.target.value)}
        >
          <MenuItem value="LHG">LHG</MenuItem>
          <MenuItem value="LVL">LVL</MenuItem>
          <MenuItem value="LYV">LYV</MenuItem>
          <MenuItem value="LYM">LYM</MenuItem>
        </Select>
      </FormControl>
      <TextField
        size="small"
        label="Từ Ngày"
        type="date"
        value={fromDate}
        onChange={(e) => setFromDate(e.target.value)}
        InputLabelProps={{ shrink: true }}
        style={{ marginBottom: "10px", width: "100%" }}
      />
      <TextField
        size="small"
        label="Đến Ngày"
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
        Tìm kiếm
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
    <>
          <Button
            variant="outline"
            sx={{color:'gray'}}
            onClick={() => setOpenModal(true)}
            style={{ position: "fixed", right: "2rem", marginTop: "-4.5rem", zIndex: 999999 }}
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
     

      
      <div sx={{ padding: "5px" }}>
        {/* Data Table */}
        <TableContainer
          component={Paper}
          sx={{
            maxHeight: "75vh", // Giới hạn chiều cao bảng
            overflowY: "auto", // Cuộn dọc
          }}
        >
          <Table
            stickyHeader
            sx={{
              tableLayout: "fixed",
              // minWidth: "100vw",
              // border: "1px solid black",
            }}
          >
            <TableHead sx={{ background: "blue", color: "#fff" }}>
              <TableRow
                sx={{
                  "& th": {
                    border: "1px solid gray",
                    fontSize: "0.8rem",
                    "& .MuiTypography-root": { fontSize: "0.8rem" },
                  },
                }}
              >
                <TableCell
                  onClick={() => handleSort("id")}
                  className="thStyle"
                  sx={{
                    width: "70px",
                  
                  }}
                >
                  ID task{" "}
                  {sortConfig.key === "id" &&
                    (sortConfig.direction === "asc" ? "▲" : "▼")}
                </TableCell>
                <TableCell
                className="thStyle"
                  sx={{
                    width: "100px",
                  
                  }}
                >
                  <Typography onClick={() => handleSort("id_machine")}>
                    {" "}
                    ID Máy{" "}
                    {sortConfig.key === "id_machine" &&
                      (sortConfig.direction === "asc" ? "▲" : "▼")}
                  </Typography>
                  <TextField
                    size="small"
                    variant="standard"
                    placeholder="Machine"
                    sx={{ background: "white" }}
                    value={searchTerms.id_machine}
                    onChange={(e) =>
                      setSearchTerms({
                        ...searchTerms,
                        id_machine: e.target.value,
                      })
                    }
                  />
                </TableCell>
                <TableCell
                  onClick={() => handleSort("Name_vn")}
                  className="thStyle"
                  sx={{
                    width: "220px",
                  
                  }}
                >
                  Tên Máy(VN){" "}
                  {sortConfig.key === "Name_vn" &&
                    (sortConfig.direction === "asc" ? "▲" : "▼")}
                </TableCell>
                <TableCell
                className="thStyle"
                  sx={{
                    width: "120px",
                  
                  }}
                >
                  <Typography onClick={() => handleSort("floor_user_request")}>
                    {" "}
                    Mặt lầu{" "}
                    {sortConfig.key === "floor_user_request" &&
                      (sortConfig.direction === "asc" ? "▲" : "▼")}
                  </Typography>
                  <TextField
                    size="small"
                    variant="standard"
                    placeholder="Floor"
                    sx={{ background: "white" }}
                    value={searchTerms.floor_user_request}
                    onChange={(e) =>
                      setSearchTerms({
                        ...searchTerms,
                        floor_user_request: e.target.value,
                      })
                    }
                  />
                </TableCell>
                <TableCell
                className="thStyle"
                  sx={{
                    width: "90px",
                  
                  }}
                >
                  <Typography onClick={() => handleSort("Line")}>
                    Line{" "}
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
                    width: "100px",
                  
                  }}
                >
                  <Typography onClick={() => handleSort("id_user_request")}>
                    CBSX{" "}
                    {sortConfig.key === "id_user_request" &&
                      (sortConfig.direction === "asc" ? "▲" : "▼")}
                  </Typography>
                  <TextField
                    size="small"
                    variant="standard"
                    placeholder="CBSX"
                    sx={{ background: "white" }}
                    value={searchTerms.id_user_request}
                    onChange={(e) =>
                      setSearchTerms({
                        ...searchTerms,
                        id_user_request: e.target.value,
                      })
                    }
                  />
                </TableCell>
                <TableCell
                className="thStyle"
                  sx={{
                    width: "100px",
                  
                  }}
                >
                  <Typography onClick={() => handleSort("fixer")}>
                    Fixer{" "}
                    {sortConfig.key === "fixer" &&
                      (sortConfig.direction === "asc" ? "▲" : "▼")}
                  </Typography>
                  <FormControl size="small" fullWidth>
                    <Select
                      size="small"
                      sx={{ background: "white", height: "2rem" }}
                      value={searchTerms.fixer}
                      onChange={(e) =>
                        setSearchTerms({
                          ...searchTerms,
                          fixer: e.target.value,
                        })
                      }
                    >
                      <MenuItem value="">ALL</MenuItem>
                      <MenuItem value="TM">TM</MenuItem>
                      <MenuItem value="TD">TD</MenuItem>
                    </Select>
                  </FormControl>
                </TableCell>
                <TableCell
                className="thStyle"
                  sx={{
                    width: "200px",
                  
                  }}
                >
                  <Typography onClick={() => handleSort("id_mechanic")}>
                    Thợ sửa{" "}
                    {sortConfig.key === "id_mechanic" &&
                      (sortConfig.direction === "asc" ? "▲" : "▼")}
                  </Typography>
                  <TextField
                    size="small"
                    variant="standard"
                    placeholder="Thợ sửa"
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
                  onClick={() => handleSort("date_user_request")}
                  className="thStyle"
                  sx={{
                    width: "145px",
                  
                  }}
                >
                  Ngày Yêu Cầu{" "}
                  {sortConfig.key === "date_user_request" &&
                    (sortConfig.direction === "asc" ? "▲" : "▼")}
                </TableCell>
                <TableCell
                  onClick={() => handleSort("accept")}
                  className="thStyle"
                  sx={{
                    width: "145px",
                  
                  }}
                >
                  Ngày Xác Nhận{" "}
                  {sortConfig.key === "accept" &&
                    (sortConfig.direction === "asc" ? "▲" : "▼")}
                </TableCell>
                <TableCell
                  onClick={() => handleSort("fixing")}
                  className="thStyle"
                  sx={{
                    width: "145px",
                  
                  }}
                >
                  Ngày Sửa Chữa{" "}
                  {sortConfig.key === "fixing" &&
                    (sortConfig.direction === "asc" ? "▲" : "▼")}
                </TableCell>
                <TableCell
                  onClick={() => handleSort("finish")}
                  className="thStyle"
                  sx={{
                    width: "145px",
                  
                  }}
                >
                  Ngày Hoàn Thành{" "}
                  {sortConfig.key === "finish" &&
                    (sortConfig.direction === "asc" ? "▲" : "▼")}
                </TableCell>
                <TableCell
                className="thStyle"
                  sx={{
                    width: "140px",
                   
                  }}
                >
                  <Typography onClick={() => handleSort("status")}>
                    Trạng Thái{" "}
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
                      <MenuItem value="">ALL</MenuItem>
                      <MenuItem value="1">REQUESTED</MenuItem>
                      <MenuItem value="2">CONFIRMED</MenuItem>
                      <MenuItem value="3">FIXING</MenuItem>
                      <MenuItem value="4">FINISH</MenuItem>
                    </Select>
                  </FormControl>
                </TableCell>
                <TableCell
                className="thStyle"
                  sx={{
                    width: "200px",
                  
                  }}
                >
                  <Typography onClick={() => handleSort("id_owner")}>
                    Cán bộ thợ{" "}
                    {sortConfig.key === "id_owner" &&
                      (sortConfig.direction === "asc" ? "▲" : "▼")}
                  </Typography>
                  <TextField
                    size="small"
                    variant="standard"
                    placeholder="Owner"
                    sx={{ background: "white" }}
                    value={searchTerms.id_owner}
                    onChange={(e) =>
                      setSearchTerms({
                        ...searchTerms,
                        id_owner: e.target.value,
                      })
                    }
                  />
                </TableCell>

                <TableCell
                  onClick={() => handleSort("info_reason_vn")}
                  sx={{
                    width: "150px",
                    textAlign: "center",
                    resize: "horizontal",
                    overflow: "auto",
                    background: "blue",
                    color: "#fff",
                  }}
                >
                  Lỗi máy{" "}
                  {sortConfig.key === "info_reason_vn" &&
                    (sortConfig.direction === "asc" ? "▲" : "▼")}
                </TableCell>
                <TableCell
                  onClick={() => handleSort("info_skill_vn")}
                  sx={{
                    width: "110px",
                    textAlign: "center",
                    resize: "horizontal",
                    overflow: "auto",
                    background: "blue",
                    color: "#fff",
                  }}
                >
                  PP sửa chữa{" "}
                  {sortConfig.key === "info_skill_vn" &&
                    (sortConfig.direction === "asc" ? "▲" : "▼")}
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
                  Ghi chú{" "}
                  {sortConfig.key === "remark_mechanic" &&
                    (sortConfig.direction === "asc" ? "▲" : "▼")}
                </TableCell>

                <TableCell
                  sx={{
                    width: "110px",
                    background: "blue",
                    color: "#fff",
                    textAlign: "center",
                  }}
                >
                  Lịch sử
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody
              sx={{
                "& td": {
                  border: "1px solid gray",
                  fontSize: "0.8rem",
                  "& .MuiTypography-root": { fontSize: "0.8rem" },
                },
              }}
            >
              {getProcessedData().map((row, index) => (
                <TableRow
                  key={index}
                  sx={{
                    background: index % 2 === 0 ? "white" : "#FFE3E3",
                    "& td": {
                      // border: "1px solid black",
                      color:
                        row.status == "1"
                          ? "red"
                          : row.status == "2"
                          ? "orange"
                          : row.status == "3"
                          ? "Green"
                          : "blue", // Border cho các ô trong Body
                    },
                  }}
                >
                  <TableCell
                    sx={{
                      wordBreak: "break-all",
                      overflow: "auto",
                      textAlign: "center",
                      padding: 0,
                    }}
                  >
                    {row.id}
                  </TableCell>
                  <TableCell className="tdStyle">{row.id_machine}</TableCell>
                  <TableCell
                    sx={{
                      wordBreak: "break-all",
                      overflow: "auto",
                      padding: "3px",
                    }}
                  >
                    {row.Name_vn}
                  </TableCell>
                  <TableCell className="tdStyle">
                    {row.floor_user_request}
                  </TableCell>
                  <TableCell className="tdStyle">{row.Line}</TableCell>
                  <TableCell className="tdStyle">
                    {row.id_user_request}
                  </TableCell>
                  <TableCell className="tdStyle">{row.fixer}</TableCell>

                  <TableCell className="tdStyle">
                    {row.id_mechanic &&
                      row.id_mechanic + " - " + row.name_mechanic}
                  </TableCell>
                  <TableCell className="tdStyle">
                    {row.date_user_request && formatDate(row.date_user_request)}
                  </TableCell>
                  <TableCell className="tdStyle">
                    {row.accept && formatDate(row.accept)}
                  </TableCell>
                  <TableCell className="tdStyle">
                    {row.fixing && formatDate(row.fixing)}
                  </TableCell>
                  <TableCell className="tdStyle">
                    {row.finish && formatDate(row.finish)}
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
                          : "blue",
                    }}
                  >
                    {row.status === 1
                      ? "REQUESTED"
                      : row.status === 2
                      ? "CONFIRMED"
                      : row.status === 3
                      ? "FIXING"
                      : "FINISH"}
                  </TableCell>
                  <TableCell className="tdStyle">
                    {row.id_owner && row.id_owner + " - " + row.name_owner}
                  </TableCell>
                  <TableCell className="tdStyle">
                    {row.info_reason_vn}{" "}
                    {row.other_reason && "(" + row.other_reason + ")"}
                  </TableCell>

                  <TableCell className="tdStyle">
                    {row.info_skill_vn}
                    {row.other_skill && "(" + row.other_skill + ")"}
                  </TableCell>
                  <TableCell className="tdStyle">
                    {row.remark_mechanic}
                  </TableCell>

                  <TableCell sx={{ padding: "0", fontSize: "0.8rem" }}>
                    <Button
                      sx={{ width: "100%", fontSize: "0.8rem" }}
                      onClick={() => HandleViewHistory(row.id)}
                    >
                      Lịch sử
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
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
}