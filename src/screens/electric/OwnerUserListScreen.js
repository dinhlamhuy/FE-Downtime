import React, { useState, useEffect, useRef } from "react";
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, Button, Grid, Select, MenuItem, FormControl, InputLabel, } from "@mui/material";
import BreadCrumb from "../../components/BreadCrumb";
import { useDispatch, useSelector } from "react-redux";
import { get_list_status_mechanic } from "../../redux/features/electric";
import socketIOClient from "socket.io-client";
import { BASE_URL } from "../../utils/env";
import { useTranslation } from "react-i18next";
import { useNavigate } from 'react-router-dom';

// Import InfoUser component
import InfoUser from "../../components/InfoUser"; 

function statusCurrent(status) {
  switch (status) {
    case 1:
      return <Chip label="Available" color="success" sx={{ backgroundColor: "#11a52c" }} />;
    case 2:
      return <Chip label="Task" color="warning" />;
    case 3:
      return <Chip label="Fixing" color="error" />;
    default:
      return "";
  }
}

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
  const { getListStatusMechanic } = useSelector((state) => state.electric);

  const [socket, setSocket] = useState("");
  const socketRef = useRef();
  const [selectedFloor, setSelectedFloor] = useState("0");
  const [filteredMechanics, setFilteredMechanics] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null); // State to store selected user for passing to InfoUser component
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const { position, factory, floor, lean } = user;
      await dispatch(get_list_status_mechanic({ position, factory, floor, lean, permission:0 }));      
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
  }, [dispatch, user, socket]);

  useEffect(() => {
    if (selectedFloor === "0") {
      setFilteredMechanics(getListStatusMechanic || []);
    } else {
      setFilteredMechanics(
        (getListStatusMechanic || []).filter((mechanic) => {
          const floors = mechanic.floor.split(',').map(floor => floor.trim());
          return floors.includes(selectedFloor);
        })
      );
    }
  }, [selectedFloor, getListStatusMechanic]);

  const handleFloorChange = (event) => {
    setSelectedFloor(event.target.value);
  };

  // Function to handle Detail button click
  const handleDetailClick = (user_name) => {
    setSelectedUser({ user_name});
    navigate(`/electric/list-user/${user_name}`);
};

  
  return (
    <Box component="div">
      {/* Render InfoUser component with selectedUser */}
      {selectedUser && <InfoUser user_name={selectedUser.user_name} factory={selectedUser.factory} />}
      <Grid container spacing={1}>
        <Grid item xs={12} md={6}>
          <BreadCrumb breadCrumb={t("employee_list.employee_list")} />
        </Grid>
        <Grid container spacing={2} justifyContent="flex-end"sx={{paddingRight:'10px'}} >
          <Grid item  sx={{ marginTop: '-20px', marginLeft: 'auto' }}>
            <Box component="div" sx={{ width: '140px' }}>
              <FormControl size='small' fullWidth>
                <InputLabel>{t("employee_list.select_floor")}</InputLabel>
                <Select value={selectedFloor} onChange={handleFloorChange} label={t("employee_list.select_floor")}>
                  <MenuItem value="0"><em>{t("employee_list.all_floors")}</em></MenuItem>
                  {Array.from(new Set((getListStatusMechanic || []).flatMap((mechanic) => mechanic.floor.split(',').map(floor => floor.trim())))).map((floor) => (
                    <MenuItem key={floor} value={floor}>{floor}</MenuItem>
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
            <Table sx={{ minWidth: 650 }} aria-label="sticky table" stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell style={{ fontWeight: "bold", whiteSpace: "nowrap", backgroundColor: "#1976d2", color: "#fff" }} align="center">
                    {t("employee_list.name")}
                  </TableCell>
                  <TableCell style={{ fontWeight: "bold", whiteSpace: "nowrap", backgroundColor: "#1976d2", color: "#fff" }} align="center">
                    {t("employee_list.lean")}
                  </TableCell>
                  <TableCell style={{ fontWeight: "bold", whiteSpace: "nowrap", backgroundColor: "#1976d2", color: "#fff" }} align="center">
                    {t("employee_list.floor")}
                  </TableCell>
                  <TableCell style={{ fontWeight: "bold", whiteSpace: "nowrap", backgroundColor: "#1976d2", color: "#fff" }} align="center">
                    {t("employee_list.active_status")}
                  </TableCell>
                  <TableCell style={{ fontWeight: "bold", whiteSpace: "nowrap", backgroundColor: "#1976d2", color: "#fff" }} align="center">
                    {t("employee_list.task_name")}
                  </TableCell>
                  <TableCell style={{ fontWeight: "bold", whiteSpace: "nowrap", backgroundColor: "#1976d2", color: "#fff" }} align="center">
                    {t("employee_list.count_time")}
                  </TableCell>
                  <TableCell style={{ fontWeight: "bold", whiteSpace: "nowrap", backgroundColor: "#1976d2", color: "#fff" }} align="center">
                    {t("employee_list.detail")}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                    {filteredMechanics?.map((row, index) => (
                    <TableRow key={index} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                      {/* style={{ width: "600px" }} */}
                    <TableCell align="center" >
                      {row.user_name} - {row.name}
                    </TableCell>
                    <TableCell align="center">
                      {row.lean}
                    </TableCell>
                    <TableCell align="center">
                      {row.floor}
                    </TableCell>
                    <TableCell align="center">
                      {statusCurrent(row.STS)}
                    </TableCell>
                    <TableCell align="center">
                      {row.TaskName}
                    </TableCell>
                    <TableCell align="center">
                      {row.CountTime}
                    </TableCell>
                    <TableCell align="center">
                      <Button 
                        variant="contained" 
                        onClick={() => handleDetailClick(row.user_name, row.factory)}
                        style={{ fontSize: '12px' }} 
                      >
                        {t("employee_list.detail")}
                      </Button>
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

export default OwnerUserListScreen;
