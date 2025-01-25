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
  padding: "10px",
};

const host = BASE_URL;

const OwnerUserListScreen = () => {
  const [t] = useTranslation("global");
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { getListStatusMechanic, getAllFloor, changeFloor } = useSelector(
    (state) => state.electric
  );
  const [socket, setSocket] = useState("");
  const socketRef = useRef();
  const [selectedFloor, setSelectedFloor] = useState("0");
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
    const { user_name,position, factory, floor, lean } = user;
    await dispatch(
      get_list_status_mechanic({
        user_name,
        position,
        factory,
        floor,
        lean,
        permission: 0,
      })
    );
  };
  useEffect(() => {
    const fetchFloors = async () => {
      const { position, factory, floor, lean } = user;
      const response = await dispatch(get_all_floor({ factory }));

      if (response?.payload?.data) {
        const floorList = response.payload.data.map((item) => item.floor);
        setFloors(floorList);
      } else {
        console.error("Failed to fetch floors");
      }
    };
    fetchFloors();
    fetchData();

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

  useEffect(() => {
    const mechanicsCopy = [...(getListStatusMechanic || [])];

    if (selectedFloor === "0") {
      setFilteredMechanics(
        mechanicsCopy.sort((a, b) => a.CountTime - b.CountTime)
      );
    } else {
      setFilteredMechanics(
        mechanicsCopy
          .filter((mechanic) => {
            const floors = mechanic?.floor
              ?.split(",")
              .map((floor) => floor.trim());
            return floors.includes(selectedFloor);
          })
          .sort((a, b) => a.CountTime - b.CountTime)
      );
    }
  }, [selectedFloor, getListStatusMechanic]);

  const handleFloorChange = (event) => {
    setSelectedFloor(event.target.value);
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

  // Function to handle Detail button click
  const handleDetailClick = (user_name) => {
    setSelectedUser({ user_name });
    navigate(`/electric/list-user/${user_name}`);
  };

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
          spacing={2}
          justifyContent="flex-end"
          sx={{ paddingRight: "10px" }}
        >
          <Grid item sx={{ marginTop: "-20px", marginLeft: "auto" }}>
            <Box component="div" sx={{ width: "140px" }}>
              <FormControl size="small" fullWidth>
                <InputLabel>{t("employee_list.select_floor")}</InputLabel>
                <Select
                  value={selectedFloor}
                  onChange={handleFloorChange}
                  label={t("employee_list.select_floor")}
                >
                  <MenuItem value="0">
                    <em>{t("employee_list.all_floors")}</em>
                  </MenuItem>
                  {Array.from(
                    new Set(
                      (getListStatusMechanic || []).flatMap((mechanic) =>
                        mechanic.floor.split(",").map((floor) => floor.trim())
                      )
                    )
                  ).map((floor) => (
                    <MenuItem key={floor} value={floor}>
                      {floor}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Grid>
        </Grid>
      </Grid>

      <Box component="div" sx={{ display: "block", margin: "0 auto" }}>
        <Paper sx={PaperStyle} elevation={5}>
          <TableContainer>
            <Table
              sx={{ minWidth: 650 }}
              aria-label="sticky table"
              stickyHeader
            >
              <TableHead>
                <TableRow>
                <TableCell
                    style={{
                      fontWeight: "bold",
                      whiteSpace: "nowrap",
                      backgroundColor: "#1976d2",
                      color: "#fff",
                      width: "120px",
                    }}
                    align="center"
                  >
                    {t("employee_list.detail")}
                  </TableCell>
                  <TableCell
                    style={{
                      fontWeight: "bold",
                      whiteSpace: "nowrap",
                      backgroundColor: "#1976d2",
                      color: "#fff",
                      width: "270px",

                    }}
                    align="center"
                  >
                    {t("employee_list.name")}
                  </TableCell>
                  <TableCell
                    style={{
                      fontWeight: "bold",
                      whiteSpace: "nowrap",
                      backgroundColor: "#1976d2",
                      color: "#fff",
                    }}
                    align="center"
                  >
                    {t("employee_list.lean")}
                  </TableCell>
                  <TableCell
                    style={{
                      fontWeight: "bold",
                      whiteSpace: "nowrap",
                      backgroundColor: "#1976d2",
                      color: "#fff",
                    }}
                    align="center"
                  >
                    {t("employee_list.floor")}
                  </TableCell>
                  <TableCell
                    style={{
                      fontWeight: "bold",
                      whiteSpace: "nowrap",
                      backgroundColor: "#1976d2",
                      color: "#fff",
                      width: "20px",
                    }}
                    align="center"
                  >
                    {t("employee_list.active_status")}
                  </TableCell>
                  <TableCell
                    style={{
                      fontWeight: "bold",
                      whiteSpace: "nowrap",
                      backgroundColor: "#1976d2",
                      color: "#fff",
                    }}
                    align="center"
                  >
                    {t("employee_list.task_name")}
                  </TableCell>
                
                  <TableCell
                    style={{
                      fontWeight: "bold",
                      whiteSpace: "nowrap",
                      backgroundColor: "#1976d2",
                      color: "#fff",
                    }}
                    align="center"
                  >
                    {t("employee_list.count_time")}
                  </TableCell>
                 
               
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredMechanics?.map((row, index) => (
                  <TableRow
                    key={index}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                     <TableCell align="center">
                      <Button
                        variant="contained"
                        onClick={() =>
                          handleDetailClick(row.user_name, row.factory)
                        }
                        style={{ fontSize: "12px", marginRight: "8px" }}
                      >
                        {t("employee_list.detail")}
                      </Button>
                    </TableCell>
                    {/* style={{ width: "600px" }} */}
                    <TableCell align="center">
                      {row.user_name} - {row.name}
                    </TableCell>
                    <TableCell align="center">
                      {row.permission === 1 ? `CB${row.lean} ` : row.lean}
                    </TableCell>

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
                          // Mỗi 2-3 chip sẽ tạo một dòng mới
                          const isStartOfRow = index % 3 === 0; // 3 chip mỗi dòng
                          return (
                            <>
                              {isStartOfRow && index !== 0 && <br />}{" "}
                              {/* Xuống dòng cho các chip sau mỗi 3 chip */}
                              <Chip
                                key={index}
                                sx={{ margin: "2px" }}
                                label={itemFloor.trim()} // Loại bỏ khoảng trắng
                              />
                            </>
                          );
                        })}
                    </TableCell>
                    <TableCell align="center">
                      {statusCurrent(row.STS)}
                    </TableCell>
                    <TableCell align="center">{row.TaskName}</TableCell>
                    {/* <TableCell align="center">
                      {row.token_devices ? (
                        <CheckIcon
                          style={{ color: green[500], fontSize: 30 }}
                        />
                      ) : (
                        <CloseIcon style={{ color: red[500], fontSize: 30 }} />
                      )}
                    </TableCell> */}
                    <TableCell align="center">{row.CountTime}</TableCell>
                   
                    {/*  <TableCell align="center">
                   <Button
                        variant="outlined"
                        onClick={() => handleOpenAlertDialog(row.floor, row.user_name, row.name)}
                        style={{ fontSize: '12px' }}
                      >
                  <BorderColorOutlinedIcon />
                      </Button> 
                    </TableCell>*/}
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

export default OwnerUserListScreen;
