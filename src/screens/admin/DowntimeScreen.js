import React, { useState, useEffect, useRef } from "react";
import {
  Typography,
  Box,
  Cancel,
  IconButton,
  TextField,
  Table,
  FormHelperText,
  Autocomplete,
  TableBody,
  TableCell,
  DialogActions,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Button,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import BreadCrumb from "../../components/BreadCrumb";
import { useDispatch, useSelector } from "react-redux";

import "./style.css";

import { BASE_URL } from "../../utils/env";
import { useTranslation } from "react-i18next";
import InfoUser from "../../components/InfoUser";

import { Language } from "@mui/icons-material";
import axios from "axios";
const PaperStyle = {
  position: "relative",
  marginTop: "10px",
  // padding: "10px",
};

const host = BASE_URL;

const DowntimeScreen = () => {
  const [t] = useTranslation("global");
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { getListStatusMechanic, getAllFloor, changeFloor } = useSelector(
    (state) => state.electric
  );
  const [socket, setSocket] = useState("");
  const [isChecked, setIsChecked] = useState("1");
  const [data, setData] = useState("");
  const socketRef = useRef();
  const [selectedFac, setSelectedFac] = useState("LHG");

  const [selectedUser, setSelectedUser] = useState(null); // State to store selected user for passing to InfoUser component

  const languages = localStorage.getItem("languages");
  const electric = useSelector((state) => state.electric);
  const [error, setError] = useState(false);
  const [searchTerms, setSearchTerms] = useState({
    Line: "",
    Factory: "",
    IP: "",
    status: "",
    seg: "",
    UpdateTime: "",
  });
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const HandleResetFiltered = () => {
    setSearchTerms({
      Line: "",
      Factory: "",
      IP: "",
      status: "",
      deg: "",
      UpdateTime: "",
    });
  };

  useEffect(() => {
    //  dispatch(get_all_floor({ factory: selectedFac }));

    setData(getListStatusMechanic);
  }, [getListStatusMechanic]);

  const handleOnClick = async () => {
    await fetchData();
  };
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

  const fetchData = async () => {
    try {
      const response = await axios.get(BASE_URL + `/task/getdeviceDowntime`, {
        params: {
          factory: selectedFac,
          isip:isChecked
        },
      });
      // setActiveRow(null);

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

  return (
    <Box component="div">
      {/* Render InfoUser component with selectedUser */}
      {selectedUser && (
        <InfoUser
          user_name={selectedUser.user_name}
          factory={selectedUser.factory}
        />
      )}
      <Grid container spacing={1}>
        <Grid item xs={12} md={6}>
          <BreadCrumb breadCrumb='Devices Downtime' />
        </Grid>
        <Grid
          container
          spacing={4}
          justifyContent="flex-end"
          sx={{ paddingRight: "10px" }}
        >
          <Grid
            item
            xs={7}
            md={4}
            sx={{ marginTop: "-20px", marginLeft: "auto" }}
          >
            <Box component="div" sx={{ display: "flex", width: "100%" }}>
              <FormControl size="small" fullWidth>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={isChecked =='1' ? true: false}
                      onChange={(event) =>
                        setIsChecked(event.target.checked ? '1' : '0')
                      }
                    />
                  }
                  // label={t("Check this option")}
                />
              </FormControl>

              <FormControl size="small" fullWidth>
                <InputLabel>{t("login.factory")}</InputLabel>
                <Select
                  value={selectedFac}
                  onChange={(event) => {
                    setSelectedFac(event.target.value);
                  }}
                  label={t("login.factory")}
                >
                  <MenuItem key="LHG" value="LHG">
                    LHG
                  </MenuItem>
                  <MenuItem key="LVL" value="LVL">
                    LVL
                  </MenuItem>
                  <MenuItem key="LYV" value="LYV">
                    LYV
                  </MenuItem>
                  <MenuItem key="LYM" value="LYM">
                    LYM
                  </MenuItem>
                </Select>
              </FormControl>

              <FormControl size="small" fullWidth>
                <Button variant="contained" onClick={handleOnClick}>
                  Search
                </Button>
              </FormControl>
              <FormControl size="small" fullWidth>
                <Button variant="outline" onClick={HandleResetFiltered}>
                  Reset
                </Button>
              </FormControl>
            </Box>
          </Grid>
        </Grid>
      </Grid>

      <Box component="div" sx={{ margin: "0 auto" }}>
        <Paper sx={PaperStyle}>
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
              // aria-label="sticky table"
            >
              <TableHead>
                <TableRow>
                  <TableCell
                    className="thStyle"
                    style={{
                      fontWeight: "bold",
                      whiteSpace: "nowrap",
                      backgroundColor: "#1976d2",
                      color: "#fff",
                      width: "30px",
                    }}
                    align="center"
                  >
                    No.
                  </TableCell>
                  <TableCell
                    className="thStyle"
                    style={{
                      fontWeight: "bold",
                      whiteSpace: "nowrap",
                      backgroundColor: "#1976d2",
                      color: "#fff",
                      width: "100px",
                    }}
                    align="center"
                  >
                    <Typography onClick={() => handleSort("Line")}>
                      Line
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
                        setSearchTerms({
                          ...searchTerms,
                          Line: e.target.value,
                        })
                      }
                    />
                  </TableCell>
                  <TableCell
                    className="thStyle"
                    style={{
                      fontWeight: "bold",
                      whiteSpace: "nowrap",
                      backgroundColor: "#1976d2",
                      color: "#fff",
                      width: "200px",
                    }}
                    align="center"
                  >
                    <Typography onClick={() => handleSort("IP")}>
                      IP
                      {sortConfig.key === "IP" &&
                        (sortConfig.direction === "asc" ? "▲" : "▼")}
                    </Typography>
                    <TextField
                      size="small"
                      variant="standard"
                      placeholder="IP"
                      sx={{ background: "white" }}
                      value={searchTerms.IP}
                      onChange={(e) =>
                        setSearchTerms({
                          ...searchTerms,
                          IP: e.target.value,
                        })
                      }
                    />
                  </TableCell>
                  <TableCell
                    className="thStyle"
                    style={{
                      fontWeight: "bold",
                      whiteSpace: "nowrap",
                      backgroundColor: "#1976d2",
                      color: "#fff",
                      width: "60px",
                    }}
                    align="center"
                  >
                    <Typography onClick={() => handleSort("status")}>
                      Status
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
                        <MenuItem value="on">on</MenuItem>
                        <MenuItem value="off">off</MenuItem>
                      </Select>
                    </FormControl>
                  </TableCell>
                  <TableCell
                    className="thStyle"
                    style={{
                      fontWeight: "bold",
                      whiteSpace: "nowrap",
                      backgroundColor: "#1976d2",
                      color: "#fff",
                      width: "60px",
                    }}
                    align="center"
                  >
                    <Typography onClick={() => handleSort("seg")}>
                      SEG
                      {sortConfig.key === "seg" &&
                        (sortConfig.direction === "asc" ? "▲" : "▼")}
                    </Typography>
                    <FormControl size="small" fullWidth>
                      <Select
                        sx={{ background: "white", height: "2rem" }}
                        value={searchTerms.seg}
                        placeholder="SEG"
                        onChange={(e) =>
                          setSearchTerms({
                            ...searchTerms,
                            seg: e.target.value,
                          })
                        }
                      >
                        <MenuItem value="">ALL</MenuItem>
                        <MenuItem value="0">0</MenuItem>
                        <MenuItem value="1">1</MenuItem>
                      </Select>
                    </FormControl>
                  </TableCell>

                  <TableCell
                    className="thStyle"
                    style={{
                      fontWeight: "bold",
                      whiteSpace: "nowrap",
                      backgroundColor: "#1976d2",
                      color: "#fff",
                      width: "120px",
                    }}
                    align="center"
                  >
                    <Typography onClick={() => handleSort("UpdateTime")}>
                      TIME
                      {sortConfig.key === "UpdateTime" &&
                        (sortConfig.direction === "asc" ? "▲" : "▼")}
                    </Typography>
                    <TextField
                      size="small"
                      variant="standard"
                      placeholder="UpdateTime"
                      sx={{ background: "white" }}
                      value={searchTerms.UpdateTime}
                      onChange={(e) =>
                        setSearchTerms({
                          ...searchTerms,
                          UpdateTime: e.target.value,
                        })
                      }
                    />
                  </TableCell>

                  {/* <TableCell style={{ fontWeight: "bold", whiteSpace: "nowrap", backgroundColor: "#1976d2", color: "#fff" }} align="center">
                    {t("employee_list.change_floor")}
                  </TableCell> */}
                </TableRow>
              </TableHead>
              <TableBody>
                {getProcessedData().map((row, index) => (
                  <TableRow
                    key={index}
                    sx={{
                      "&:last-child td, &:last-child th": {
                        border: 0,
                        paddingRight: "2px",
                        paddingLeft: "2px",
                      },
                    }}
                  >
                    <TableCell align="center">{index + 1}</TableCell>
                    <TableCell align="center">{row.Line}</TableCell>
                    <TableCell align="center">{row.IP}</TableCell>
                    <TableCell align="center">{row.status}</TableCell>
                    <TableCell align="center">{row.seg}</TableCell>
                    <TableCell align="center" sx={{ wordBreak: "break-all" }}>
                      {/* {row.UpdateTime.replace('T',' ').replace('Z',' ')} */}
                      {row.UpdateTime &&  row.UpdateTime.substring(11, 19) + "  "}
                      {row.UpdateTime && row.UpdateTime.substring(0, 10)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
    </Box>
  );
};

export default DowntimeScreen;
