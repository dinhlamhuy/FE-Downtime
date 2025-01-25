import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Divider,
  MenuItem,
  Grid,
  Select,
  FormControl,
  InputLabel,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";
import BreadCrumb from "../../components/BreadCrumb";
import { useDispatch, useSelector } from "react-redux";
import {
  get_list_repair_mechanic,
  get_top_longest_repair_time,
  get_top3_broken_machines,
} from "../../redux/features/electric";

import socketIOClient from "socket.io-client";
import { BASE_URL } from "../../utils/env";
import ChartRepair from "../../components/ChartRepair";
import ChartPie from "../../components/ChartPie";
import { useTranslation } from "react-i18next";

const PaperStyle = {
  position: "relative",
  marginTop: "10px",
  padding: "10px",
};
const CustomDivider = {
  backgroundColor: "black",
  height: "5px",

  margin: "20px 0",
  // marginTop: "10px",
};

const host = BASE_URL;

const RepairlistScreen = () => {
  const [t] = useTranslation("global");
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const {
    getListRepairMechanic,
    getTop5LongestRepairTime,
    getTop3BrokenMachines,
  } = useSelector((state) => state.electric);
  const [selectedFloor, setSelectedFloor] = useState("0");
  const [selectedTime, setSelectedTime] = useState("MONTH");
  const [filteredRepairMechanics, setFilteredRepairMechanics] = useState([]);
  const [rowSpan, setRowSpan] = useState({});
  const [socket, setSocket] = useState("");
  const socketRef = useRef();
  let oldName = "";
  const languages = localStorage.getItem("languages");

  useEffect(() => {
    const fetchData = async () => {
      const { factory, floor, lean } = user;
      await dispatch(
        get_list_repair_mechanic({ factory, floor, lean, time: selectedTime })
      );
      await dispatch(
        get_top_longest_repair_time({
          factory,
          floor,
          lean,
          time: selectedTime,
        })
      );
      await dispatch(
        get_top3_broken_machines({ factory, floor, lean, time: selectedTime })
      );
    };
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
  }, [dispatch, user, socket, selectedTime]);

  useEffect(() => {
    setSelectedFloor("0");
  }, [selectedTime]);

  useEffect(() => {
    if (getListRepairMechanic && getListRepairMechanic.length > 0) {
      if (selectedFloor === "0") {
        setRowSpan(countOccurrences(getListRepairMechanic, "Name_en"));
        setFilteredRepairMechanics(getListRepairMechanic);
      } else {
        const filteredMechanics = getListRepairMechanic.filter((mechanic) => {
          const floors = mechanic.floor.split(",").map((floor) => floor.trim());
          return floors.includes(selectedFloor);
        });

        setFilteredRepairMechanics(filteredMechanics);
        setRowSpan(countOccurrences(filteredMechanics, "Name_en"));
      }
    } else {
      setFilteredRepairMechanics(getListRepairMechanic);
    }
  }, [selectedFloor, getListRepairMechanic, user.floor]);

  const handleFloorChange = (event) => {
    const selectedFloor = event.target.value;
    setSelectedFloor(selectedFloor);
    const { factory, lean, floor: userFloor } = user;
    dispatch(
      get_top_longest_repair_time({
        factory,
        floor: selectedFloor === "0" ? userFloor : selectedFloor,
        lean,
        time: selectedTime,
      })
    );
    dispatch(
      get_top3_broken_machines({
        factory,
        floor: selectedFloor === "0" ? userFloor : selectedFloor,
        lean,
        time: selectedTime,
      })
    );
  };

  // const countOccurrences = (array, key) => {
  //   return array.reduce((acc, obj) => {

  //     acc[obj[key]] = (acc[obj[key]] || 0) + 1;
  //     return acc;
  //   }, {});
  // };
  const countOccurrences = (array, key) => {
    return array.reduce((acc, obj) => {
      const keyValue = obj[key];
      acc[keyValue] = (acc[keyValue] || 0) + 1;

      return acc;
    }, {});
  };
  const handleTimeChange = (event, newTime) => {
    if (newTime !== null) {
      setSelectedTime(newTime);
    }
  };

  // Hàm đếm số lượng mã máy không trùng
  const countUniqueMachineCodes = (array) => {
    const uniqueCodes = array ? new Set(array.map((item) => item.id_machine)) : [];
    
    return uniqueCodes.size;
  };

  // Đếm số lượng mã máy không trùng
  const uniqueMachineCodesCount = countUniqueMachineCodes(
    filteredRepairMechanics
  );

  return (
    <Box component="div" sx={{ width: "100%" }}>
      <Grid container spacing={1}>
        <Grid item xs={9} md={9} sx={{}}>
          <BreadCrumb breadCrumb={t("repair_list.repair_list")} />
        </Grid>
        <Grid
          item
          xs={3}
          md={3}
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            paddingRight: "10px",
          }}
        >
          <Box
            component="div"
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <FormControl size="small" sx={{ minWidth: 100 }} fullWidth>
              <InputLabel>{t("employee_list.select_floor")}</InputLabel>
              <Select
                value={selectedFloor}
                onChange={handleFloorChange}
                label={t("employee_list.select_floor")}
              >
                <MenuItem value="0">
                  <em>{t("employee_list.all_floors")}</em>
                </MenuItem>
                {getListRepairMechanic &&
                  getListRepairMechanic.length > 0 &&
                  Array.from(
                    new Set(
                      getListRepairMechanic.flatMap((mechanic) =>
                        mechanic?.floor?.split(",").map((floor) => floor.trim())
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
        <Grid item xs={12} md={12} sx={{}}>
          <Paper style={{ paddingTop: "30px", paddingBottom: "30px" }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={7}>
                <ChartRepair
                  getTop5LongestRepairTime={getTop5LongestRepairTime}
                />
              </Grid>
              <Grid item xs={12} md={5}>
                <ChartPie getTop3BrokenMachines={getTop3BrokenMachines} />
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        <Grid
          item
          xs={12}
          md={12}
          container
          wrap="nowrap"
          sx={{
            padding: "10px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Box component="div" sx={{ width: "240px" }}>
            <ToggleButtonGroup
              value={selectedTime}
              exclusive
              onChange={handleTimeChange}
              aria-label="text alignment"
              size="small"
            >
              <ToggleButton
                value="DAY"
                sx={{
                  borderRadius: "24px",
                  border: "1px solid black",
                  paddingLeft: "1.2rem",
                  paddingRight: "1.2rem",
                  backgroundColor: "#f0f0f0",
                  "&.Mui-selected": {
                    backgroundColor: "#190e9b",
                    color: "white",
                    "&:hover": {
                      backgroundColor: "#190e9b",
                      border: "1px solid black",
                    },
                  },
                }}
              >
                {t("repair_list.day")}
              </ToggleButton>
              <ToggleButton
                value="WEEK"
                sx={{
                  borderRadius: "24px",
                  border: "1px solid black",
                  paddingLeft: "1.2rem",
                  paddingRight: "1.2rem",
                  backgroundColor: "#f0f0f0",
                  "&.Mui-selected": {
                    backgroundColor: "#190e9b",
                    color: "white",
                    "&:hover": {
                      backgroundColor: "#190e9b",
                      border: "1px solid black",
                    },
                  },
                }}
              >
                {t("repair_list.week")}
              </ToggleButton>
              <ToggleButton
                value="MONTH"
                sx={{
                  borderRadius: "24px",
                  border: "1px solid black",
                  paddingLeft: "1.2rem",
                  paddingRight: "1.2rem",
                  backgroundColor: "#f0f0f0",
                  "&.Mui-selected": {
                    backgroundColor: "#190e9b",
                    color: "white",
                    "&:hover": {
                      backgroundColor: "#190e9b",
                      border: "1px solid black",
                    },
                  },
                }}
              >
                {t("repair_list.month")}
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>
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
                    }}
                  >
                    {t("repair_list.name_machine")}
                  </TableCell>
                  <TableCell
                    style={{
                      fontWeight: "bold",
                      whiteSpace: "nowrap",
                      backgroundColor: "#1976d2",
                      color: "#fff",
                    }}
                  >
                    {`${t("repair_list.machine_code")} `}
                    <span style={{ fontSize: "1.2em" }}>
                      {`(${uniqueMachineCodesCount})`}
                    </span>
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
                    {t("repair_list.workshop")}
                  </TableCell>
                  <TableCell
                    style={{
                      fontWeight: "bold",
                      whiteSpace: "nowrap",
                      backgroundColor: "#1976d2",
                      color: "#fff",
                      width: "100px",
                    }}
                    align="center"
                  >
                    {t("repair_list.conveyor")}
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
                    {t("repair_list.number_of_breakdowns")}
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
                    {t("repair_list.reason")}
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
                    {t("repair_list.total_time")}
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
                    {t("repair_list.efficiency")}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredRepairMechanics && Array.isArray(filteredRepairMechanics) && 
                filteredRepairMechanics.length > 0 ? (
                  [...filteredRepairMechanics] // Create a shallow copy
                    .sort((a, b) => a?.Name_en?.localeCompare(b.Name_en))
                    .map((row, index) => {
                      let currentName = row.ID_Code
                        ? row.Name_en || "No Name"
                        : "Unknown";
                      let ItemRowSpan =
                        currentName === oldName ? 0 : rowSpan[currentName];
                      oldName = currentName;
                      return (
                        <TableRow
                          key={index}
                          sx={{
                            backgroundColor:
                              row.status == "6" ? "red" : "white",

                            "&:last-child td, &:last-child th": {
                              border: 0,
                            },
                            td: {
                              color: row.status == "6" ? "white" : "black",
                            },
                          }}
                        >
                          {ItemRowSpan > 0 && (
                            <TableCell rowSpan={ItemRowSpan}>
                              {row.ID_Code
                                ? languages === "VN"
                                  ? row.Name_vn
                                  : row.Name_en // Show Vietnamese or default to English
                                : languages === "VN"
                                ? "Không có"
                                : languages === "MM"
                                ? "မသိ"
                                : "Unknown"}{" "}
                              {/* Handle "Unknown" in different languages */}
                            </TableCell>
                          )}
                          {ItemRowSpan === 0 && (
                            <TableCell style={{ display: "none" }} />
                          )}
                          {!row.Name_en && <TableCell> </TableCell>}
                          <TableCell>{row.id_machine}</TableCell>
                          <TableCell align="center">{row.floor}</TableCell>
                          <TableCell align="center">{row.line}</TableCell>
                          <TableCell align="center">{row.Alltimes}</TableCell>
                          <TableCell align="center">
                            {languages === "EN"
                              ? row.info_reason_en
                              : languages === "MM"
                              ? row.info_reason_mm
                              : row.info_reason_vn}{" "}
                            {row.other_reason && "(" + row.other_reason + ")"}
                          </TableCell>
                          <TableCell align="center">{row.SumMinute}</TableCell>
                          <TableCell align="center">{row.Frequency}</TableCell>
                        </TableRow>
                      );
                    })
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} align="center"></TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
    </Box>
  );
};

export default RepairlistScreen;
