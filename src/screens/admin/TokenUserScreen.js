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
} from "@mui/material";
import BreadCrumb from "../../components/BreadCrumb";
import { useDispatch, useSelector } from "react-redux";
import {
  get_list_status_mechanic,
  get_all_floor,
  change_floor,
  setErrorCode,
} from "../../redux/features/electric";
import "./style.css";
import socketIOClient from "socket.io-client";
import { BASE_URL } from "../../utils/env";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Toast } from "../../utils/toast";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import InfoUser from "../../components/InfoUser";
import { green, red } from "@mui/material/colors";
import AlertDialog from "../../components/AlertDialog";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import BorderColorOutlinedIcon from "@mui/icons-material/BorderColorOutlined";

import { Language } from "@mui/icons-material";
const PaperStyle = {
  position: "relative",
  marginTop: "10px",
  // padding: "10px",
};

const host = BASE_URL;

const TokenUserScreen = () => {
  const [t] = useTranslation("global");
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { getListStatusMechanic, getAllFloor, changeFloor } = useSelector(
    (state) => state.electric
  );
  const [socket, setSocket] = useState("");
  const [data, setData] = useState("");
  const socketRef = useRef();
  const [selectedFac, setSelectedFac] = useState("LHG");
  const [selectedLean, setSelectedLean] = useState("0");
  const [selectedFloors, setSelectedFloors] = useState([]);
  const [filteredMechanics, setFilteredMechanics] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null); // State to store selected user for passing to InfoUser component
  const navigate = useNavigate();
  const [currentFloor, setCurrentFloor] = useState(null);
  const [open, setOpen] = useState(false);
  const [floors, setFloors] = useState([]);
  const [selectedUsername, setSelectedUsername] = useState(null);
  const [name, setName] = useState(null);
  const languages = localStorage.getItem("languages");
  const electric = useSelector((state) => state.electric);
  const [error, setError] = useState(false);
  const [searchTerms, setSearchTerms] = useState({
    id: "",
    factory: "",
    user_name: "",
    name: "",
    lean: "",
    phone_number: "",
    floor: "",
    floors: "",
    status: "",
    STS: "",
  });
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const HandleResetFiltered = () => {
    setSearchTerms({
      id: "",
      factory: "",
      user_name: "",
      name: "",
      lean: "",
      phone_number: "",
      floor: "",
      floors: "",
      status: "",
      STS: "",
    });
  };

  const fetchFloors = async () => {
    const { position, floor, lean } = user;
    const response = await dispatch(get_all_floor({ factory: selectedFac }));

    if (response?.payload?.data) {
      const floorList = response.payload.data.map((item) => item.floor);
      setFloors(floorList);
    } else {
      console.error("Failed to fetch floors");
    }
  };

  useEffect(() => {
    //  dispatch(get_all_floor({ factory: selectedFac }));

    setData(getListStatusMechanic);
  }, [getListStatusMechanic]);

  const handleOnClick = async () => {
    await fetchFloors();
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
  const handleOpenAlertDialog = (floor, username, name) => {
    setCurrentFloor(floor);

    const result = floor.split(",").map((item) => item && item.trim());
    // console.log(result);
    setSelectedFloors(result);
    setSelectedUsername(username);
    setName(name);
    setOpen(true);
  };
  const fetchData = async () => {
    const { user_name, position, floor, lean } = user;
    await dispatch(
      get_list_status_mechanic({
        user_name,
        position,
        factory: selectedFac,
        floor,
        lean: selectedLean !== "0" ? selectedLean : "",
        permission: 0,
      })
    );
  };
  useEffect(() => {
    const fetchFloors = async () => {
      const { position, floor, lean } = user;
      const response = await dispatch(get_all_floor({ factory: selectedFac }));

      if (response?.payload?.data) {
        const floorList = response.payload.data.map((item) => item.floor);
        setFloors(floorList);
      } else {
        console.error("Failed to fetch floors");
      }
    };
    fetchFloors();
    // fetchData();

    socketRef.current = socketIOClient.connect(host);

    socketRef.current.on("message", (data) => {
      console.log(data);
    });

    socketRef.current.on(`${user.user_name}`, (data) => {
      setSocket(data);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [dispatch, user, socket]);

  const handleLeanChange = (event) => {
    setSelectedLean(event.target.value);
  };
  const handleFloorChanges = (event, newValue) => {
    setSelectedFloors(newValue);
    if (newValue.length > 0) {
      setError(false);
    }
  };

  const handleDelete = (value) => {
    setSelectedFloors((prev) => prev.filter((item) => item !== value));
  };

  const handleSubmitChangeFloor = async () => {
    // console.log("Selected Floors:", selectedFloors);
    // console.log("Selected Username:", selectedUsername);
    // console.log("User Factory:", user.factory);
    // console.log("Language:", languages);
    if (selectedFloors.length === 0) {
      setError(true);
      return;
    }
    await dispatch(
      change_floor({
        floor: selectedFloors,
        factory: user.factory,
        user_name: selectedUsername,
        lang: languages,
      })
    );
    await fetchData();
    setOpen(false);
  };
  const onClose = () => {
    setError(false);
    setOpen(false);
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

  function statusCurrent(status) {
    switch (status) {
      case 1:
        return (
          <Chip
            label={t("employee_list.available")}
            color="success"
            sx={{ backgroundColor: "#11a52c" }}
          />
        );
      case 2:
        return <Chip label={t("employee_list.task")} color="warning" />;
      case 3:
        return <Chip label={t("employee_list.fixing")} color="error" />;
      default:
        return "";
    }
  }

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
          <BreadCrumb breadCrumb={t("employee_list.employee_list")} />
        </Grid>
        <Grid
          container
          spacing={4}
          justifyContent="flex-end"
          sx={{ paddingRight: "10px" }}
        >
          <Grid item  xs={7} md={4} sx={{ marginTop: "-20px", marginLeft: "auto" }}>
            <Box component="div" sx={{ display: "flex", width:'100%' }}>
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
                <InputLabel>{t("employee_list.lean")}</InputLabel>
                <Select
                  value={selectedLean}
                  onChange={handleLeanChange}
                  label={t("employee_list.lean")}
                >
                  <MenuItem value="0">
                    <em>All</em>
                  </MenuItem>

                  <MenuItem key="TM" value="TM">
                    TM
                  </MenuItem>
                  <MenuItem key="TD" value="TD">
                    TD
                  </MenuItem>
                </Select>
              </FormControl>
              {/* <FormControl size="small" fullWidth>
                <TextField
                  size="small"
                  variant="outlined"
                  placeholder="UserID"
                  sx={{ background: "white" }}
                />
              </FormControl> */}
              <FormControl size="small" fullWidth>
                <Button variant="contained" onClick={handleOnClick}>
                  Search
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
                    <Typography onClick={() => handleSort("user_name")}>
                      UserID
                      {sortConfig.key === "user_name" &&
                        (sortConfig.direction === "asc" ? "▲" : "▼")}
                    </Typography>
                    <TextField
                      size="small"
                      variant="standard"
                      placeholder="UserID"
                      sx={{ background: "white" }}
                      value={searchTerms.user_name}
                      onChange={(e) =>
                        setSearchTerms({
                          ...searchTerms,
                          user_name: e.target.value,
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
                    <Typography onClick={() => handleSort("name")}>
                      {t("employee_list.name")}
                      {sortConfig.key === "name" &&
                        (sortConfig.direction === "asc" ? "▲" : "▼")}
                    </Typography>
                    <TextField
                      size="small"
                      variant="standard"
                      placeholder="UserID"
                      sx={{ background: "white" }}
                      value={searchTerms.name}
                      onChange={(e) =>
                        setSearchTerms({
                          ...searchTerms,
                          name: e.target.value,
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
                    <Typography onClick={() => handleSort("lean")}>
                      {t("employee_list.lean")}{" "}
                      {sortConfig.key === "lean" &&
                        (sortConfig.direction === "asc" ? "▲" : "▼")}
                    </Typography>
                    <FormControl size="small" fullWidth>
                      <Select
                        sx={{ background: "white", height: "2rem" }}
                        value={searchTerms.lean + "-" + searchTerms.permission}
                        onChange={(e) =>
                          setSearchTerms({
                            ...searchTerms,
                            lean: e.target.value.substring(0, 2),
                            permission: e.target.value.substring(3, 4),
                          })
                        }
                      >
                        <MenuItem value="">ALL</MenuItem>
                        <MenuItem value="TM-1">CBTM</MenuItem>
                        <MenuItem value="TM-2">TM</MenuItem>
                        <MenuItem value="TD-1">CBTD</MenuItem>
                        <MenuItem value="TD-2">TD</MenuItem>
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
                      width: "100px",
                    }}
                    align="center"
                  >
                    <Typography onClick={() => handleSort("phone_number")}>
                      {t("work_list.phone")}
                      {sortConfig.key === "phone_number" &&
                        (sortConfig.direction === "asc" ? "▲" : "▼")}
                    </Typography>
                    <TextField
                      size="small"
                      variant="standard"
                      placeholder="Phone"
                      sx={{ background: "white" }}
                      value={searchTerms.phone_number}
                      onChange={(e) =>
                        setSearchTerms({
                          ...searchTerms,
                          phone_number: e.target.value,
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
                      width: "120px",
                    }}
                    align="center"
                  >
                    <Typography onClick={() => handleSort("floor")}>
                      {t("employee_list.floor")}
                      {sortConfig.key === "floor" &&
                        (sortConfig.direction === "asc" ? "▲" : "▼")}
                    </Typography>
                    <TextField
                      size="small"
                      variant="standard"
                      placeholder="floor"
                      sx={{ background: "white" }}
                      value={searchTerms.floor}
                      onChange={(e) =>
                        setSearchTerms({
                          ...searchTerms,
                          floor: e.target.value,
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
                      width: "120px",
                    }}
                    align="center"
                  >
                    <Typography onClick={() => handleSort("floors")}>
                      Floors
                      {sortConfig.key === "floors" &&
                        (sortConfig.direction === "asc" ? "▲" : "▼")}
                    </Typography>
                    <TextField
                      size="small"
                      variant="standard"
                      placeholder="floors"
                      sx={{ background: "white" }}
                      value={searchTerms.floors}
                      onChange={(e) =>
                        setSearchTerms({
                          ...searchTerms,
                          floors: e.target.value,
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
                      width: "80px",
                    }}
                    align="center"
                  >
                    <Typography onClick={() => handleSort("STS")}>
                      {t("employee_list.active_status")}
                      {sortConfig.key === "STS" &&
                        (sortConfig.direction === "asc" ? "▲" : "▼")}
                    </Typography>
                    <FormControl size="small" fullWidth>
                      <Select
                        sx={{ background: "white", height: "2rem" }}
                        value={searchTerms.STS}
                        onChange={(e) =>
                          setSearchTerms({
                            ...searchTerms,
                            STS: e.target.value,
                          })
                        }
                      >
                        <MenuItem value="">ALL</MenuItem>
                        <MenuItem value="1">AVAILABLE</MenuItem>
                        <MenuItem value="2">TASK</MenuItem>
                        <MenuItem value="3">FIXING</MenuItem>
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
                      width: "70px",
                    }}
                    align="center"
                  >
                    {t("employee_list.task_name")}
                  </TableCell>
                  <TableCell
                    className="thStyle"
                    onClick={() => handleSort("token_devices")}
                    style={{
                      fontWeight: "bold",
                      whiteSpace: "nowrap",
                      backgroundColor: "#1976d2",
                      color: "#fff",
                      width: "80px",
                    }}
                    align="center"
                  >
                    Token
                    {sortConfig.key === "token_devices" &&
                      (sortConfig.direction === "asc" ? "▲" : "▼")}
                  </TableCell>
                  <TableCell
                    className="thStyle"
                    onClick={() => handleSort("CountTime")}
                    style={{
                      fontWeight: "bold",
                      whiteSpace: "nowrap",
                      backgroundColor: "#1976d2",
                      color: "#fff",
                      width: "70px",
                    }}
                    align="center"
                  >
                    {t("employee_list.count_time")}
                    {sortConfig.key === "CountTime" &&
                      (sortConfig.direction === "asc" ? "▲" : "▼")}
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
                    <TableCell align="center">
                      {index + 1}
                      {/* -({row.id}) */}
                    </TableCell>
                    <TableCell align="center">{row.user_name}</TableCell>
                    <TableCell align="center">{row.name}</TableCell>
                    <TableCell align="center">
                      {row.permission === 1 ? `CB${row.lean} ` : row.lean}
                    </TableCell>
                    <TableCell align="center">{row.phone_number}</TableCell>
                    <TableCell
                      align="center"
                      onClick={() =>
                        handleOpenAlertDialog(
                          row.floor,
                          row.user_name,
                          row.name
                        )
                      }
                    >
                      {row?.floor &&
                        row?.floor?.split(",").map((itemFloor, index) => {
                          const isStartOfRow = index % 3 === 0;
                          return (
                            <>
                              {isStartOfRow && index !== 0 && <br />}{" "}
                              <Chip
                                key={index}
                                sx={{ margin: "2px" }}
                                label={itemFloor.trim()}
                              />
                            </>
                          );
                        })}
                    </TableCell>
                    <TableCell align="center" sx={{ wordBreak: "break-all" }}>
                      {row.floors}
                    </TableCell>
                    <TableCell align="center">
                      {statusCurrent(row.STS)}
                    </TableCell>
                    <TableCell align="center">{row.TaskName}</TableCell>
                    <TableCell align="center" sx={{ wordBreak: "break-all" }}>
                      {row.token_devices && row.token_devices.substring(0, 15)}
                    </TableCell>
                    <TableCell align="center">{row.CountTime}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
      <AlertDialog
        open={open}
        setOpen={setOpen}
        headerModal={t("employee_list.change_floor")}
      >
        <Grid item xs={12}>
          <Typography
            variant="caption"
            sx={{
              fontWeight: "600",
              color: "text.secondary",
              textAlign: "left",
              fontSize: "0.875rem",
              letterSpacing: "0.5px",
            }}
          >
            {selectedUsername} - {name}
          </Typography>
        </Grid>

        <Grid container sx={{ marginTop: 2 }} alignItems="center">
          {/* Hiện thị tầng hiện tại */}
          <Grid item xs={12} sm={5} display="flex" justifyContent="center">
            <Box
              sx={{
                padding: 1,
                backgroundColor: "#f5f5f5",
                borderRadius: 1,
                textAlign: "center",
                fontWeight: "bold",
                color: "#666",
                gap: 1,
                maxWidth: "100%",
                overflow: "hidden",
                wordBreak: "break-word",
              }}
            >
              {currentFloor &&
                currentFloor
                  .split(",")
                  .map((itemFloor, index) => (
                    <Chip
                      sx={{ margin: "2px" }}
                      label={itemFloor}
                      key={index}
                    ></Chip>
                  ))}
            </Box>
          </Grid>

          {/* Icon - Full width on mobile */}
          <Grid item xs={12} sm={1} display="flex" justifyContent="center">
            <SwapHorizIcon
              sx={{
                fontSize: { xs: 30, sm: 40 },
                color: "#1976d2",
                transform: { xs: "rotate(90deg)", sm: "none" },
              }}
            />
          </Grid>

          {/* Chọn tầng - Full width on mobile */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth variant="outlined">
              <Autocomplete
                multiple
                options={floors} // Danh sách các tầng
                value={selectedFloors}
                disableCloseOnSelect
                onChange={handleFloorChanges}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      key={option}
                      label={option}
                      {...getTagProps({ index })}
                      onDelete={(event) => {
                        event.stopPropagation();
                        handleDelete(option);
                      }}
                      sx={{
                        backgroundColor: "#e3f2fd",
                        color: "#1976d2",
                        margin: "2px",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        "& .MuiChip-deleteIcon": {
                          color: "red",
                        },
                      }}
                    />
                  ))
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={t("employee_list.choose_floor")}
                    sx={{ marginBottom: 1 }}
                  />
                )}
                renderOption={(props, option, { selected }) => (
                  <MenuItem {...props} key={option} value={option}>
                    {option}
                    {selected ? (
                      <CheckIcon color="info" sx={{ marginLeft: 1 }} />
                    ) : null}
                  </MenuItem>
                )}
                sx={{ display: "flex" }}
              />
              {error && (
                <FormHelperText error>
                  {t("employee_list.error_choose_floor")}
                </FormHelperText>
              )}
            </FormControl>
          </Grid>
        </Grid>

        <DialogActions sx={{ justifyContent: "center", mt: 3 }}>
          <Button
            onClick={handleSubmitChangeFloor}
            variant="contained"
            color="primary"
            size="small"
          >
            {t("employee_list.confirm")}
          </Button>
          <Button
            onClick={onClose}
            type="button"
            variant="contained"
            color="error"
            size="small"
          >
            {t("employee_list.cancel")}
          </Button>
        </DialogActions>
      </AlertDialog>
    </Box>
  );
};

export default TokenUserScreen;
