import React, { useState, useEffect, useRef } from "react";
import {
  Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, MenuItem, Grid, Select, FormControl,
  InputLabel, ToggleButtonGroup, ToggleButton
} from "@mui/material";
import BreadCrumb from "../../components/BreadCrumb";
import { useDispatch, useSelector } from "react-redux";
import { get_list_repair_mechanic } from "../../redux/features/electric";

import socketIOClient from "socket.io-client";
import { BASE_URL } from "../../utils/env";

import { useTranslation } from "react-i18next";

const PaperStyle = {
  position: "relative",
  marginTop: "10px",
  padding: "10px",
};

const host = BASE_URL;

const RepairlistScreen = () => {
  const [t] = useTranslation("global");
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { getListRepairMechanic } = useSelector((state) => state.electric);
  const [selectedFloor, setSelectedFloor] = useState("0");
  const [selectedTime, setSelectedTime] = useState("DAY");
  const [filteredRepairMechanics, setFilteredRepairMechanics] = useState([]);
  const [rowSpan, setRowSpan] = useState([]);
  const [socket, setSocket] = useState("");
  const socketRef = useRef();
  let oldName = '';
  const [page] = useState(0);
  const [rowsPerPage] = useState(1000);
  const languages = localStorage.getItem('languages');

  useEffect(() => {
    const fetchData = async () => {
      const { factory, floor, lean } = user;
      await dispatch(get_list_repair_mechanic({ factory, floor, lean, time: selectedTime }));
    }
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

    if (selectedFloor === "0") {
      setRowSpan(countOccurrences(getListRepairMechanic, 'Name_en'))
      setFilteredRepairMechanics(getListRepairMechanic);
    } else {
      setFilteredRepairMechanics(
        getListRepairMechanic.filter((mechanic) => {
          const floors = mechanic.floor.split(',').map(floor => floor.trim());
          return floors.includes(selectedFloor);
        })
      );
      setRowSpan(countOccurrences(getListRepairMechanic.filter((mechanic) => {
        const floors = mechanic.floor.split(',').map(floor => floor.trim());
        return floors.includes(selectedFloor);
      }), 'Name_en'))
    }
  }, [selectedFloor, getListRepairMechanic]);

  const handleFloorChange = (event) => {
    setSelectedFloor(event.target.value);
  };

  const countOccurrences = (array, key) => {
    return array.reduce((acc, obj) => {
      acc[obj[key]] = (acc[obj[key]] || 0) + 1;
      return acc;
    }, {});
  };

  const handleTimeChange = (event, newTime) => {
    if (newTime !== null) {
      setSelectedTime(newTime);
    }
  };

  // Slicing data for pagination
  const paginatedData = filteredRepairMechanics.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Box component="div">
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <BreadCrumb breadCrumb={t("repair_list.repair_list")} />
        </Grid>

        <Grid container spacing={2} wrap="nowrap">
          <Grid item sx={{ marginTop: '-20px', marginLeft: 'auto' }}>
            <Box component="div" sx={{ width: '240px' }}>
              <ToggleButtonGroup
                value={selectedTime}
                exclusive
                onChange={handleTimeChange}
                aria-label="text alignment"
                size="small"
              >
                <ToggleButton
                  value="DAY"
                  sx={{ marginLeft: '10px', marginRight:'10px', backgroundColor: '#f0f0f0', '&.Mui-selected': { backgroundColor: '#2196f3' }, '&.Mui-selected:hover':{backgroundColor:'#2196f3'} }}
                >
                  {t("repair_list.day")}
                </ToggleButton>
                <ToggleButton
                  value="WEEK"
                  sx={{ marginLeft: '10px', marginRight:'10px', backgroundColor: '#f0f0f0', '&.Mui-selected': { backgroundColor: '#2196f3' }, '&.Mui-selected:hover':{backgroundColor:'#2196f3'} }}
                >
                  {t("repair_list.week")}
                </ToggleButton>
                <ToggleButton
                  value="MONTH"
                  sx={{ marginLeft: '10px', marginRight:'10px', backgroundColor: '#f0f0f0', '&.Mui-selected': { backgroundColor: '#2196f3' }, '&.Mui-selected:hover':{backgroundColor:'#2196f3'} }}
                >
                  {t("repair_list.month")}
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>
          </Grid>
          <Grid item sx={{ marginTop: '-20px', marginLeft: 'auto' }}>
            <Box component="div"  sx={{ width: '140px' }}>
              <FormControl  fullWidth>
                <InputLabel>{t("employee_list.select_floor")}</InputLabel>
                <Select size="small" value={selectedFloor} onChange={handleFloorChange} label={t("employee_list.select_floor")}>
                  <MenuItem value="0"><em>{t("employee_list.all_floors")}</em></MenuItem>
                  {Array.from(new Set(getListRepairMechanic.flatMap((mechanic) => mechanic.floor.split(',').map(floor => floor.trim())))).map((floor) => (
                    <MenuItem key={floor} value={floor}>{floor}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Grid>
        </Grid>
      </Grid>
      <Box
        component="div"
        sx={{ display: "block", margin: "0 auto" }}
      >
        <Paper sx={PaperStyle} elevation={5}>
          <TableContainer>
            <Table
              sx={{ minWidth: 650 }}
              aria-label="sticky table"
              stickyHeader
            >
              <TableHead>
                <TableRow>
                  <TableCell style={{ fontWeight: "bold", whiteSpace: "nowrap", backgroundColor: "#1976d2", color: "#fff" }}>
                    {t("repair_list.name_machine")}
                  </TableCell>
                  <TableCell style={{ fontWeight: "bold", whiteSpace: "nowrap", backgroundColor: "#1976d2", color: "#fff" }}>
                    {t("repair_list.machine_code")}
                  </TableCell>
                  <TableCell style={{ fontWeight: "bold", whiteSpace: "nowrap", backgroundColor: "#1976d2", color: "#fff" }}>
                    {t("repair_list.workshop")}
                  </TableCell>
                  <TableCell style={{ fontWeight: "bold", whiteSpace: "nowrap", backgroundColor: "#1976d2", color: "#fff" }}>
                    {t("repair_list.conveyor")}
                  </TableCell>
                  <TableCell style={{ fontWeight: "bold", whiteSpace: "nowrap", backgroundColor: "#1976d2", color: "#fff" }} sx={{ verticalAlign: 'middle' }}>
                    {t("repair_list.number_of_breakdowns")}
                  </TableCell>
                  <TableCell style={{ fontWeight: "bold", whiteSpace: "nowrap", backgroundColor: "#1976d2", color: "#fff" }} align="center">
                    {t("repair_list.total_time")}
                  </TableCell>
                  <TableCell style={{ fontWeight: "bold", whiteSpace: "nowrap", backgroundColor: "#1976d2", color: "#fff" }} align="center">
                    {t("repair_list.efficiency")}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedData && paginatedData.length > 0 ? (
                  paginatedData.map((row, index) => {
                    let currentName = row.Name_en;
                    let ItemRowSpan = currentName === oldName ? 0 : rowSpan[row.Name_en];
                    oldName = currentName;
                    return (
                      <TableRow key={index}
                        sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                      >
                        {ItemRowSpan > 0 && (
                          <TableCell rowSpan={ItemRowSpan}>
                            {languages === "EN" ? row.Name_en : row.Name_vn}
                          </TableCell>
                        )}
                        {ItemRowSpan === 0 && <TableCell style={{ display: 'none' }} />}
                        <TableCell>
                          {row.ID_Code}
                        </TableCell>
                        <TableCell>
                          {row.floor}
                        </TableCell>
                        <TableCell>
                          {row.line}
                        </TableCell>
                        <TableCell align="center">
                          {row.SumMinute}
                        </TableCell>
                        <TableCell align="center">
                          {row.Alltimes}
                        </TableCell>
                        <TableCell align="center">
                          {row.Frequency}
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} align="center">

                    </TableCell>
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