import React, { useState, useEffect, useRef } from "react";
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip } from "@mui/material";
import BreadCrumb from "../../components/BreadCrumb";
import { useDispatch, useSelector } from "react-redux";
import { get_list_status_mechanic } from "../../redux/features/electric";

import socketIOClient from "socket.io-client";
import { BASE_URL } from "../../utils/env";

import { useTranslation } from "react-i18next";

const PaperStyle = {
  position: "relative",
  marginTop: "10px",
  padding: "10px",
};

const host = BASE_URL;

const UserlistScreen = () => {
  const { t, i18n } = useTranslation("global");  // Di chuyển useTranslation vào trong component
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { getListStatusMechanic } = useSelector((state) => state.electric);

  const [socket, setSocket] = useState("");
  const socketRef = useRef();

  useEffect(() => {
    const fetchData = async () => {
      const { user_name,position, factory, floor, lean } = user;
      await dispatch(get_list_status_mechanic({user_name, position, factory, floor, lean }));
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
  }, [dispatch, user, socket]);

  // const availableMechanics = getListStatusMechanic?.filter(row => row.STS === 1);
  const availableMechanics = getListStatusMechanic;

  function statusCurrent(status) {
    switch (status) {
      case 1:
        return <Chip label={t("employee_list.available")} color="success" sx={{ backgroundColor: "#11a52c" }} />;
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
      <BreadCrumb breadCrumb={t("employee_list.employee_list")} />
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
                  <TableCell style={{ width:'80px', fontWeight: "bold", whiteSpace: "nowrap", backgroundColor: "#1976d2", color: "#fff" }} align="center">
                    {t("employee_list.name")}
                  </TableCell>
                  <TableCell style={{ width:'60px', fontWeight: "bold", whiteSpace: "nowrap", backgroundColor: "#1976d2", color: "#fff" }} align="center">
                    {t("employee_list.active_status")}
                  </TableCell>
                  {/* <TableCell style={{ fontWeight: "bold", whiteSpace: "nowrap", backgroundColor: "#1976d2", color: "#fff" }} align="center">
                    {t("employee_list.lean")}
                  </TableCell> */}
                  <TableCell style={{ width:'80px', fontWeight: "bold", whiteSpace: "nowrap", backgroundColor: "#1976d2", color: "#fff" }} align="center">
                    {t("employee_list.floor")}
                  </TableCell>
                
                </TableRow>
              </TableHead>
              <TableBody>
                {availableMechanics?.map((row, index) => (
                  <TableRow
                    key={index}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell align="center">
                      {row.user_name} - {row.name}
                    </TableCell>
                    <TableCell align="center">
                      {statusCurrent(row.STS)}
                    </TableCell>
                    {/* <TableCell align="center">
                      {row.lean}
                    </TableCell> */}
                    <TableCell align="center">
                      {row.floor}
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

export default UserlistScreen;
