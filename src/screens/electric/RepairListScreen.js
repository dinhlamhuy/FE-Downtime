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
  const [selectedTime, setSelectedTime] = useState("MONTH");
  const [filteredRepairMechanics, setFilteredRepairMechanics] = useState([]);
  const [rowSpan, setRowSpan] = useState({});
  const [socket, setSocket] = useState("");
  const socketRef = useRef();
  let oldName = '';
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
    setSelectedFloor("0");
  }, [selectedTime]);

  useEffect(() => {
    if (getListRepairMechanic && getListRepairMechanic.length > 0) {
      if (selectedFloor === "0") {
        setRowSpan(countOccurrences(getListRepairMechanic, 'Name_en'));
        setFilteredRepairMechanics(getListRepairMechanic);
      } else {
        const filteredMechanics = getListRepairMechanic.filter((mechanic) => {
          const floors = mechanic.floor.split(',').map(floor => floor.trim());
          return floors.includes(selectedFloor);
        });
  
        setFilteredRepairMechanics(filteredMechanics);
        setRowSpan(countOccurrences(filteredMechanics, 'Name_en'));
      }
    }else{
      setFilteredRepairMechanics(getListRepairMechanic);
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

  return (
    <Box component="div" sx={{width:'100%'}}>
      <Grid container spacing={1}>
        <Grid item xs={9} md={9} sx={{ }}>
          <BreadCrumb breadCrumb={t("repair_list.repair_list")} />
        </Grid>
          <Grid item xs={3} md={3} sx={{  display:"flex", justifyContent:'flex-end', paddingRight:'10px' }}>
            <Box component="div"  sx={{ display:"flex", justifyContent:'center', alignItems:'center' }}>
            <FormControl size='small' sx={{ minWidth: 100 }} fullWidth>
              <InputLabel>{t("employee_list.select_floor")}</InputLabel>
              <Select
                value={selectedFloor}
                onChange={handleFloorChange}
                label={t("employee_list.select_floor")}
               
              >
                <MenuItem value="0"><em>{t("employee_list.all_floors")}</em></MenuItem>
                {getListRepairMechanic && getListRepairMechanic.length > 0 && Array.from(new Set(getListRepairMechanic.flatMap((mechanic) => mechanic.floor.split(',').map(floor => floor.trim())))).map((floor) => (
                  <MenuItem key={floor} value={floor}>{floor}</MenuItem>
                ))}
              </Select>
            </FormControl>
            </Box>
          </Grid>


        <Grid item xs={12} md={12} container  wrap="nowrap" sx={{ padding:'10px',
           display:"flex", justifyContent:'center', alignItems:'center'
        }}>
          {/* <Grid item sx={{  marginLeft: 'auto',  }}> */}
            <Box component="div" sx={{ width: '240px', }}>
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
                  borderRadius:'24px',
                  border:'1px solid black',
                  // margin: '10px',
                  paddingLeft:'1.2rem',
                  paddingRight:'1.2rem',
                  backgroundColor: '#f0f0f0',
                  '&.Mui-selected': {
                    backgroundColor: '#190e9b',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: '#190e9b',
                      border:'1px solid black'
                    },
                  },
                }}
              >
                Daily
              </ToggleButton>
              <ToggleButton
                value="WEEK"
                sx={{
                  borderRadius:'24px',
                  border:'1px solid black',
                  // margin: '10px',
                  paddingLeft:'1.2rem',
                  paddingRight:'1.2rem',
                  backgroundColor: '#f0f0f0',
                  '&.Mui-selected': {
                    backgroundColor: '#190e9b',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: '#190e9b',
                      border:'1px solid black'
                    },
                  },
                }}
              >
                Weekly
              </ToggleButton>
              <ToggleButton
                value="MONTH"
                sx={{
                  borderRadius:'24px',
                  border:'1px solid black',
                  // margin: '10px',
                  paddingLeft:'1.2rem',
                  paddingRight:'1.2rem',
                  backgroundColor: '#f0f0f0',
                  '&.Mui-selected': {
                    backgroundColor: '#190e9b',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: '#190e9b',
                      border:'1px solid black'
                    },
                  },
                }}
              >
                Monthly
              </ToggleButton>
           </ToggleButtonGroup>
            </Box>
          {/* </Grid> */}
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
                  <TableCell style={{ fontWeight: "bold", whiteSpace: "nowrap", backgroundColor: "#1976d2", color: "#fff" }} align="center">
                    {t("repair_list.workshop")}
                  </TableCell>
                  <TableCell style={{ fontWeight: "bold", whiteSpace: "nowrap", backgroundColor: "#1976d2", color: "#fff" }} align="center">
                    {t("repair_list.conveyor")}
                  </TableCell>
                  <TableCell style={{ fontWeight: "bold", whiteSpace: "nowrap", backgroundColor: "#1976d2", color: "#fff" }} align="center">
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
             {filteredRepairMechanics && filteredRepairMechanics.length > 0 ? (
                  filteredRepairMechanics.map((row, index) => {
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
                          {row
                          .id_machine}
                          </TableCell>
                          <TableCell align="center">
                            {row.floor}
                          </TableCell>
                          <TableCell align="center">
                            {row.line}
                          </TableCell>
                           <TableCell align="center">
                            {row.Alltimes}
                          </TableCell> 
                          <TableCell align="center">
                            {row.SumMinute}
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
  