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
  Typography,
} from "@mui/material";
import axios from "axios";
import { BASE_URL } from "../../utils/env";
import ProgressHistoryDetailTask from "../../components/ProgressHistoryDetailTask";

export default function TaskScreen() {
  const [data, setData] = useState([]);
  const today = new Date().toISOString().split("T")[0];
  const [factory, setFactory] = useState("LHG");
  const [fromDate, setFromDate] = useState(today);
  const [activeModal, setActiveModal] = useState("");
  const [toDate, setToDate] = useState(today);
  const [open, setOpen] = useState(false);
  const [idMachine, setIdMachine] = useState("");

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

  const HandleResetFiltered=()=>{
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
  }
  return (
    <div style={{ width: "99vw", padding: "7px" }}>
      {/* Search Fields */}
      <div style={{ marginBottom: "20px" }}>
        <FormControl style={{ minWidth: 120 }}>
          <InputLabel>Factory</InputLabel>
          <Select
            size="small"
            value={factory}
            onChange={(e) => setFactory(e.target.value)}
          >
            <MenuItem value="LHG">LHG</MenuItem>
            <MenuItem value="LVL">LVL</MenuItem>
            <MenuItem value="LYV">LYV</MenuItem>
            <MenuItem value="LYM">LYM</MenuItem>
          </Select>
        </FormControl>{" "}
        &emsp;
        <TextField
          size="small"
          label="Từ Ngày"
          type="date"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
          style={{ marginRight: "10px" }}
        />
        <TextField
          size="small"
          label="Đến Ngày"
          type="date"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
          style={{ marginRight: "10px" }}
        />
        <Button variant="contained" color="primary" onClick={fetchData}>
          Tìm kiếm
        </Button>&emsp;
        <Button variant="outlined" color="secondary" onClick={HandleResetFiltered}>
         Reset
        </Button>
      </div>
      <div sx={{ padding: "5px" }}>
        {/* Data Table */}
        <TableContainer
          component={Paper}
          sx={{
            maxHeight: "90vh", // Giới hạn chiều cao bảng
            overflowY: "auto", // Cuộn dọc
          }}
        >
          <Table
            stickyHeader
            sx={{
              tableLayout: "fixed",
              minWidth: "100vw",
              border: "1px solid black",
            }}
          >
            <TableHead sx={{ background: "blue", color: "#fff" }}>
              <TableRow sx={{ "& th": { border: "1px solid black" } }}>
                <TableCell
                  onClick={() => handleSort("id")}
                  sx={{
                    width: "45px",
                    color: "#fff",
                    textAlign: "center",
                    resize: "horizontal",
                    overflow: "auto",
                    background: "blue",
                    color: "#fff",
                  }}
                >
                  ID task{" "}
                  {sortConfig.key === "id" &&
                    (sortConfig.direction === "asc" ? "▲" : "▼")}
                </TableCell>
                <TableCell
                  sx={{
                    width: "100px",
                    color: "#fff",
                    textAlign: "center",
                    resize: "horizontal",
                    overflow: "auto",
                    background: "blue",
                    color: "#fff",
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
                  sx={{
                    width: "220px",
                    color: "#fff",
                    textAlign: "center",
                    resize: "horizontal",
                    overflow: "auto",
                    background: "blue",
                    color: "#fff",
                  }}
                >
                  Tên Máy(VN){" "}
                  {sortConfig.key === "Name_vn" &&
                    (sortConfig.direction === "asc" ? "▲" : "▼")}
                </TableCell>
                <TableCell
                  sx={{
                    width: "70px",
                    color: "#fff",
                    textAlign: "center",
                    resize: "horizontal",
                    overflow: "auto",
                    background: "blue",
                    color: "#fff",
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
                  sx={{
                    width: "70px",
                    color: "#fff",
                    textAlign: "center",
                    resize: "horizontal",
                    overflow: "auto",
                    background: "blue",
                    color: "#fff",
                  }}
                >
                  <Typography onClick={() => handleSort("Line")}>
                    {" "}
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
                  sx={{
                    width: "70px",
                    color: "#fff",
                    textAlign: "center",
                    resize: "horizontal",
                    overflow: "auto",
                    background: "blue",
                    color: "#fff",
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
                  sx={{
                    width: "60px",
                    color: "#fff",
                    textAlign: "center",
                    resize: "horizontal",
                    overflow: "auto",
                    background: "blue",
                    color: "#fff",
                  }}
                >
                  <Typography onClick={() => handleSort("fixer")}>
                    {" "}
                    Fixer{" "}
                    {sortConfig.key === "fixer" &&
                      (sortConfig.direction === "asc" ? "▲" : "▼")}
                  </Typography>
                  <FormControl size="small" fullWidth>
                    <InputLabel>ALL</InputLabel>
                    <Select
                      size="small"
                      sx={{ background: "white" }}
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
                  sx={{
                    width: "180px",
                    color: "#fff",
                    textAlign: "center",
                    resize: "horizontal",
                    overflow: "auto",
                    background: "blue",
                    color: "#fff",
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
                  sx={{
                    width: "115px",
                    color: "#fff",
                    textAlign: "center",
                    resize: "horizontal",
                    overflow: "auto",
                    background: "blue",
                  }}
                >
                  Ngày Yêu Cầu{" "}
                  {sortConfig.key === "date_user_request" &&
                    (sortConfig.direction === "asc" ? "▲" : "▼")}
                </TableCell>
                <TableCell
                  onClick={() => handleSort("accept")}
                  sx={{
                    width: "115px",
                    color: "#fff",
                    textAlign: "center",
                    resize: "horizontal",
                    overflow: "auto",
                    background: "blue",
                  }}
                >
                  Ngày Xác Nhận{" "}
                  {sortConfig.key === "accept" &&
                    (sortConfig.direction === "asc" ? "▲" : "▼")}
                </TableCell>
                <TableCell
                  onClick={() => handleSort("fixing")}
                  sx={{
                    width: "115px",

                    textAlign: "center",
                    resize: "horizontal",
                    overflow: "auto",
                    background: "blue",
                    color: "#fff",
                  }}
                >
                  Ngày Sửa Chữa{" "}
                  {sortConfig.key === "fixing" &&
                    (sortConfig.direction === "asc" ? "▲" : "▼")}
                </TableCell>
                <TableCell
                  onClick={() => handleSort("finish")}
                  sx={{
                    width: "115px",

                    textAlign: "center",
                    resize: "horizontal",
                    overflow: "auto",
                    background: "blue",
                    color: "#fff",
                  }}
                >
                  Ngày Hoàn Thành{" "}
                  {sortConfig.key === "finish" &&
                    (sortConfig.direction === "asc" ? "▲" : "▼")}
                </TableCell>
                <TableCell
                  sx={{
                    width: "100px",

                    textAlign: "center",
                    resize: "horizontal",
                    overflow: "auto",
                    background: "blue",
                    color: "#fff",
                  }}
                >
                  <Typography onClick={() => handleSort("status")}>
                    Trạng Thái{" "}
                    {sortConfig.key === "status" &&
                      (sortConfig.direction === "asc" ? "▲" : "▼")}
                  </Typography>
                  <FormControl size="small" fullWidth>
                    <InputLabel>ALL</InputLabel>
                    <Select
                      size="small"
                      sx={{ background: "white" }}
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
                  sx={{
                    width: "200px",

                    textAlign: "center",
                    resize: "horizontal",
                    overflow: "auto",
                    background: "blue",
                    color: "#fff",
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
                  sx={{ width: "80px",background: "blue", color: "#fff" , textAlign: "center" }}
                >
                  Lịch sử
                </TableCell>
              </TableRow>
              {/* <TableRow>
    {Object.keys(searchTerms).map((key, index) => (
      <TableCell key={index} sx={{ color: '#fff', textAlign: 'center' }}>
        {key.toUpperCase()}
        <TextField
          size="small"
          variant="outlined"
          value={searchTerms[key]}
          onChange={(e) =>
            setSearchTerms((prev) => ({ ...prev, [key]: e.target.value }))
          }
          placeholder={`Tìm ${key}`}
          style={{ marginTop: '8px', background: '#fff' }}
        />
      </TableCell>
    ))}
  </TableRow> */}
            </TableHead>
            <TableBody>
              {getProcessedData().map((row, index) => (
                <TableRow
                  key={index}
                  sx={{
                    "& td": {
                      border: "1px solid black",
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
                  <TableCell sx={{ wordBreak: "break-all", overflow: "auto" }}>
                    {row.id}
                  </TableCell>
                  <TableCell sx={{ wordBreak: "break-all", overflow: "auto" }}>
                    {row.id_machine}
                  </TableCell>
                  <TableCell sx={{ wordBreak: "break-all", overflow: "auto" }}>
                    {row.Name_vn}
                  </TableCell>
                  <TableCell sx={{ wordBreak: "break-all", overflow: "auto" }}>
                    {row.floor_user_request}
                  </TableCell>
                  <TableCell sx={{ wordBreak: "break-all", overflow: "auto" }}>
                    {row.Line}
                  </TableCell>
                  <TableCell sx={{ wordBreak: "break-all", overflow: "auto" }}>
                    {row.id_user_request}
                  </TableCell>
                  <TableCell sx={{ wordBreak: "break-all", overflow: "auto" }}>
                    {row.fixer}
                  </TableCell>

                  <TableCell sx={{ wordBreak: "break-all", overflow: "auto" }}>
                    {row.id_mechanic &&
                      row.id_mechanic + " - " + row.name_mechanic}
                  </TableCell>
                  <TableCell sx={{ wordBreak: "break-all", overflow: "auto" }}>
                    {row.date_user_request && formatDate(row.date_user_request)}
                  </TableCell>
                  <TableCell sx={{ wordBreak: "break-all", overflow: "auto" }}>
                    {row.accept && formatDate(row.accept)}
                  </TableCell>
                  <TableCell sx={{ wordBreak: "break-all", overflow: "auto" }}>
                    {row.fixing && formatDate(row.fixing)}
                  </TableCell>
                  <TableCell sx={{ wordBreak: "break-all", overflow: "auto" }}>
                    {row.finish && formatDate(row.finish)}
                  </TableCell>
                  <TableCell
                    sx={{ wordBreak: "break-all", overflow: "auto" }}
                    style={{
                      fontWeight: "bold",
                      textAlign: "center",
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
                  <TableCell sx={{ wordBreak: "break-all", overflow: "auto" }}>
                    {row.id_owner && row.id_owner + " - " + row.name_owner}
                  </TableCell>
                  <TableCell sx={{ wordBreak: "break-all", overflow: "auto" }}>
                    {row.info_reason_vn}{" "}
                    {row.other_reason && "(" + row.other_reason + ")"}
                  </TableCell>

                  <TableCell sx={{ wordBreak: "break-all", overflow: "auto" }}>
                    {row.info_skill_vn}
                    {row.other_skill && "(" + row.other_skill + ")"}
                  </TableCell>
                  <TableCell sx={{ wordBreak: "break-all", overflow: "auto" }}>
                    {row.remark_mechanic}
                  </TableCell>

                  <TableCell>
                    <Button onClick={() => HandleViewHistory(row.id)}>
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
