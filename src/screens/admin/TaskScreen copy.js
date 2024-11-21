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

export default function TaskScreen() {
  const [data, setData] = useState([]);
  const today = new Date().toISOString().split('T')[0];
  const [factory, setFactory] = useState("LHG");
  const [fromDate, setFromDate] = useState(today);
  
  const [toDate, setToDate] = useState(today);
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
  

  const formatDate = (datetime) => {
    const date = datetime;
    // const timePart = date.toTimeString().split(" ")[0]; // Lấy HH:mm:ss
    
    const result= date.split("T")[1].slice(0, -8) + ' ' +date?.split("T")[0]
   
    return `${result}`;
  };
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const fetchData = async () => {
    try {
      const response = await axios.get(
        BASE_URL+`/task/getAllTask`,
        {
          params: {
            factory,
            fromdate: fromDate,
            todate: toDate,
          },
        }
      );
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
      })
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
        return row[key]?.toString().toLowerCase().includes(searchTerms[key].toLowerCase());
      });
    });
  
    // Sắp xếp dữ liệu
    if (sortConfig.key) {
      filteredData.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === "asc" ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }
  
    return filteredData;
  };
  
  




  return (
    <div>
      {/* Search Fields */}
      <div style={{ marginBottom: "20px", padding:'10px' }}>
      <FormControl style={{ minWidth: 120 }}>
          <InputLabel>Factory</InputLabel>
          <Select size='small'
            value={factory}
            onChange={(e) => setFactory(e.target.value)}
          >
            <MenuItem value="LHG">LHG</MenuItem>
            <MenuItem value="LVL">LVL</MenuItem>
            <MenuItem value="LYV">LYV</MenuItem>
            <MenuItem value="LYM">LYM</MenuItem>
          </Select>
        </FormControl> &emsp;
        <TextField size='small'
          label="Từ Ngày"
          type="date"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
          style={{ marginRight: "10px" }}
        />
        <TextField size='small'
          label="Đến Ngày"
          type="date"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
          style={{ marginRight: "10px" }}
        />
        <Button variant="contained" color="primary" onClick={fetchData}>
          Tìm kiếm
        </Button>
      </div>

      {/* Data Table */}
      <TableContainer component={Paper}  >
        <Table sx={{   tableLayout: "fixed", minWidth:'100vw',
      border: "1px solid black" }} >
          <TableHead sx={{background:'blue', color:'#fff'}}>
            <TableRow  sx={{ "& th": { border: "1px solid black", }, }}>
             
              <TableCell onClick={() => handleSort("id")} sx={{width: "35px",color:'#fff', textAlign:'center'}}>ID task {sortConfig.key==="id" && (sortConfig.direction==="asc"? '▲':'▼')}</TableCell>
              <TableCell sx={{width: "100px",color:'#fff', textAlign:'center'}}>
                  <Typography onClick={() => handleSort("id_machine")} > ID Máy {sortConfig.key==="id_machine" && (sortConfig.direction==="asc"? '▲':'▼')}</Typography>
                  <TextField size="small" variant="standard" placeholder="Machine" sx={{background:'white'}} value={searchTerms.id_machine}
                    onChange={(e) => setSearchTerms({ ...searchTerms, id_machine: e.target.value }) } />
              </TableCell>
              <TableCell onClick={() => handleSort("Name_vn")} sx={{ width: "220px",color:'#fff', textAlign:'center'}}>Tên Máy(VN) {sortConfig.key==="Name_vn" && (sortConfig.direction==="asc"? '▲':'▼')}</TableCell>
              <TableCell sx={{width: "70px",color:'#fff', textAlign:'center'}}>
                  <Typography onClick={() => handleSort("floor_user_request")} > Mặt lầu {sortConfig.key==="floor_user_request" && (sortConfig.direction==="asc"? '▲':'▼')}</Typography>
                  <TextField size="small" variant="standard" placeholder="Floor" sx={{background:'white'}} value={searchTerms.floor_user_request}
                    onChange={(e) => setSearchTerms({ ...searchTerms, floor_user_request: e.target.value }) } />
             </TableCell>
              <TableCell sx={{width: "70px",color:'#fff', textAlign:'center'}}>
                  <Typography onClick={() => handleSort("Line")} > Line {sortConfig.key==="Line" && (sortConfig.direction==="asc"? '▲':'▼')}</Typography>
                  <TextField size="small" variant="standard" placeholder="Line" sx={{background:'white'}} value={searchTerms.Line}        
                  onChange={(e) => setSearchTerms({ ...searchTerms, Line: e.target.value }) } />
              </TableCell>
              <TableCell sx={{ width: "70px", color:'#fff', textAlign:'center'}}>
                <Typography onClick={() => handleSort("name_user_request")} >CBSX {sortConfig.key==="name_user_request" && (sortConfig.direction==="asc"? '▲':'▼')}</Typography>
                  <TextField size="small" variant="standard" placeholder="CBSX" sx={{background:'white'}} value={searchTerms.name_user_request}        
                  onChange={(e) => setSearchTerms({ ...searchTerms, name_user_request: e.target.value }) } />
              </TableCell>
              <TableCell sx={{width: "60px",color:'#fff', textAlign:'center'}}>
                <Typography  onClick={() => handleSort("fixer")} > Fixer {sortConfig.key==="fixer" && (sortConfig.direction==="asc"? '▲':'▼')}</Typography>
                <FormControl size="small" fullWidth>
                  <InputLabel>ALL</InputLabel>
                  <Select size="small" sx={{background:'white'}} value={searchTerms.fixer} onChange={(e) => setSearchTerms({ ...searchTerms, fixer: e.target.value }) } >
                    <MenuItem value="">ALL</MenuItem>
                    <MenuItem value="TM">TM</MenuItem>
                    <MenuItem value="TD">TD</MenuItem>
                  </Select>
                </FormControl>
              </TableCell>
              <TableCell sx={{width: "180px",color:'#fff', textAlign:'center'}}>
                <Typography onClick={() => handleSort("id_mechanic")} >Thợ sửa {sortConfig.key==="id_mechanic" && (sortConfig.direction==="asc"? '▲':'▼')}</Typography>
                <TextField size="small" variant="standard" placeholder="Thợ sửa" sx={{background:'white'}} value={searchTerms.id_mechanic}        
                  onChange={(e) => setSearchTerms({ ...searchTerms, id_mechanic: e.target.value }) } />
              </TableCell>
              <TableCell onClick={() => handleSort("date_user_request")} sx={{width: "115px",color:'#fff', textAlign:'center'}}>Ngày Yêu Cầu {sortConfig.key==="date_user_request" && (sortConfig.direction==="asc"? '▲':'▼')}</TableCell>
              <TableCell onClick={() => handleSort("accept")} sx={{width: "115px",color:'#fff', textAlign:'center'}}>Ngày Xác Nhận {sortConfig.key==="accept" && (sortConfig.direction==="asc"? '▲':'▼')}</TableCell>
              <TableCell onClick={() => handleSort("fixing")} sx={{width: "115px",color:'#fff', textAlign:'center'}}>Ngày Sửa Chữa {sortConfig.key==="fixing" && (sortConfig.direction==="asc"? '▲':'▼')}</TableCell>
              <TableCell onClick={() => handleSort("finish")} sx={{width: "115px",color:'#fff', textAlign:'center'}}>Ngày Hoàn Thành {sortConfig.key==="finish" && (sortConfig.direction==="asc"? '▲':'▼')}</TableCell>
              <TableCell sx={{width: "100px", color:'#fff', textAlign:'center'}}>
                <Typography  onClick={() => handleSort("status")} >Trạng Thái {sortConfig.key==="status" && (sortConfig.direction==="asc"? '▲':'▼')}</Typography>
                  <FormControl size="small" fullWidth>
                    <InputLabel>ALL</InputLabel>
                    <Select size="small" sx={{background:'white'}} value={searchTerms.status} onChange={(e) => setSearchTerms({ ...searchTerms, status: e.target.value }) } >
                      <MenuItem value="">ALL</MenuItem>
                      <MenuItem value="1">REQUESTED</MenuItem>
                      <MenuItem value="2">CONFIRMED</MenuItem>
                      <MenuItem value="3">FIXING</MenuItem>
                      <MenuItem value="4">FINISH</MenuItem>
                    </Select>
                </FormControl>
              </TableCell>
              <TableCell sx={{width: "200px",color:'#fff', textAlign:'center'}}>
                <Typography onClick={() => handleSort("id_owner")} >Cán bộ thợ {sortConfig.key==="id_owner" && (sortConfig.direction==="asc"? '▲':'▼')}</Typography>
                <TextField size="small" variant="standard" placeholder="Owner" sx={{background:'white'}} value={searchTerms.id_owner}        
                  onChange={(e) => setSearchTerms({ ...searchTerms, id_owner: e.target.value }) } />
              </TableCell>
              <TableCell onClick={() => handleSort("info_reason_vn")} sx={{width: "150px",color:'#fff', textAlign:'center'}}>Lỗi máy {sortConfig.key==="info_reason_vn" && (sortConfig.direction==="asc"? '▲':'▼')}</TableCell>
              <TableCell onClick={() => handleSort("info_skill_vn")} sx={{width: "110px",color:'#fff', textAlign:'center'}}>PP sửa chữa {sortConfig.key==="info_skill_vn" && (sortConfig.direction==="asc"? '▲':'▼')}</TableCell>
              <TableCell onClick={() => handleSort("remark_mechanic")} sx={{width: "110px",color:'#fff', textAlign:'center'}}>Ghi chú {sortConfig.key==="remark_mechanic" && (sortConfig.direction==="asc"? '▲':'▼')}</TableCell>

            </TableRow>


          </TableHead>
          <TableBody 
          >
            {getProcessedData().map((row, index) => (
              <TableRow key={index}  sx={{
                 
       
                "& td": {
                  border: "1px solid black",
                  color:row.status == "1"
                  ? "red"
                  : row.status == "2"
                  ? "orange"
                  : row.status == "3"
                  ? "Green"
                  : "blue", // Border cho các ô trong Body
                },
               
          
              }}>
               
                <TableCell>{row.id}</TableCell>
                <TableCell sx={{ wordBreak:'break-all' }}>{row.id_machine}</TableCell>
                <TableCell >{row.Name_vn}</TableCell>
                <TableCell>{row.floor_user_request}</TableCell>
                <TableCell>{row.Line}</TableCell>
                <TableCell>{row.id_user_request}</TableCell>
                <TableCell>{row.fixer}</TableCell>

                <TableCell>{row.id_mechanic && row.id_mechanic + ' - '+row.name_mechanic}</TableCell>
                <TableCell>
                  {row.date_user_request && formatDate(row.date_user_request)}
                </TableCell>
                <TableCell>
                  {row.accept &&  formatDate(row.accept)}
                </TableCell>
                <TableCell>
                  {row.fixing &&  formatDate(row.fixing)}
                </TableCell>
                <TableCell>
                  {row.finish &&  formatDate(row.finish)}
                </TableCell>
                <TableCell
                
                style={{
                    fontWeight:'bold', textAlign:'center',
                    color:
                      row.status == "1"
                        ? "red"
                        : row.status == "2"
                        ? "orange"
                        : row.status == "3"
                        ? "Green"
                        : "blue", 
             
                  }}
                >{
                    row.status === 1 ? "REQUESTED"
                    
                    : row.status === 2 ? "CONFIRMED"
                   
                    : row.status === 3 ? "FIXING"
                   
                    : "FINISH"
                }</TableCell>
                <TableCell>{row.id_owner && row.id_owner + ' - '+row.name_owner}</TableCell>
                <TableCell>{row.info_reason_vn} {row.other_reason && '('+row.other_reason+')' }</TableCell>

                <TableCell>{row.info_skill_vn }{ row.other_skill && '('+row.other_skill+')' }</TableCell>
                <TableCell>{row.remark_mechanic }</TableCell>

              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
