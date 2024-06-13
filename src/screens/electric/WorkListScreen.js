import React, { useState, useEffect, useRef } from "react";
import {
    Box,
    Paper,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    // TablePagination,
    Button,
    Stack,
} from "@mui/material";
import BreadCrumb from "../../components/BreadCrumb";
import Title from "../../components/Title";
import { Toast } from "../../utils/toast";
import { useDispatch, useSelector } from "react-redux";
import {
    get_task_damage,
    get_list_asign_mechanic,
    owner_asign_task,
    setErrorCode,
} from "../../redux/features/electric";
import AlertDialog from "../../components/AlertDialog";

import socketIOClient from "socket.io-client";
import { BASE_URL } from "../../utils/env";

import { useTranslation } from "react-i18next";

const PaperStyle = {
    position: "relative",
    marginTop: "10px",
    padding: "10px",
};

const host = BASE_URL;

const TableEmployeeList = ({ open, setOpen, headerModal, getListAsignMechanic, task }) => {
    const [t] = useTranslation("global");
    const dispatch = useDispatch();
    const [selectedRow, setSelectedRow] = useState(null);

    const languages = localStorage.getItem('languages');

    const electric = useSelector((state) => state.electric);

    // const handleChangePage = (event, newPage) => {
    //     setPage(newPage);
    // };

    // const handleChangeRowsPerPage = (event) => {
    //     setRowsPerPage(+event.target.value);
    //     setPage(0);
    // };

    const handleRowClick = (rowData) => {
        setSelectedRow(rowData);
    };

    const onClose = () => {
        setSelectedRow(null);
        setOpen(false);
    }

    const onAsignTask = async () => {
        if (task && selectedRow) {
            const { id_machine, id_owner_mechanic } = task;
            const { user_name, factory, lean } = selectedRow;
            const language = languages;

            await dispatch(owner_asign_task({ user_name, id_machine, id_owner_mechanic, factory, lean, language }));
            setOpen(false);
        } else {
            Toast.fire({
                icon: 'error',
                title: t("work_list.alert_table"),
            })
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            if (electric.errorCode !== null) {
                let icon = 'error';
                if (electric.errorCode === 0) {
                    icon = 'success';
                }
                Toast.fire({
                    icon: icon,
                    title: electric.errorMessage,
                })
                await dispatch(setErrorCode(null, ""));
            }
        }
        fetchData();
    }, [electric, dispatch])

    return (
        <AlertDialog open={open} setOpen={setOpen} headerModal={headerModal}>
            <TableContainer>
                <Table stickyHeader aria-label="sticky table">
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
                                {t("work_list.name")}
                            </TableCell>
                            <TableCell
                                style={{
                                    fontWeight: "bold",
                                    whiteSpace: "nowrap",
                                    backgroundColor: "#1976d2",
                                    color: "#fff",
                                }}
                            >
                                {t("work_list.phone")}
                            </TableCell>
                            <TableCell
                                style={{
                                    fontWeight: "bold",
                                    whiteSpace: "nowrap",
                                    backgroundColor: "#1976d2",
                                    color: "#fff",
                                }}
                            >
                                {t("work_list.lean")}
                            </TableCell>
                            <TableCell
                                style={{
                                    fontWeight: "bold",
                                    whiteSpace: "nowrap",
                                    backgroundColor: "#1976d2",
                                    color: "#fff",
                                }}
                            >
                                {t("work_list.floor")}
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {getListAsignMechanic?.map((row, index) => {
                                const isSelected = selectedRow === row;
                                return (
                                    <TableRow
                                        key={index}
                                        onClick={() => handleRowClick(row)}
                                        style={{
                                            backgroundColor: isSelected ? "#83ace7" : "transparent",
                                        }}
                                    >
                                        <TableCell sx={{ whiteSpace: "nowrap" }} style={{
                                            color: isSelected ? "#fff" : "#000",
                                        }}>
                                            {row.user_name} - {row.name}
                                        </TableCell>
                                        <TableCell style={{
                                            color: isSelected ? "#fff" : "#000",
                                        }}>
                                            {row.phone_number}
                                        </TableCell>
                                        <TableCell style={{
                                            color: isSelected ? "#fff" : "#000",
                                        }}>
                                            {row.lean}
                                        </TableCell>
                                        <TableCell sx={{ whiteSpace: "nowrap" }} style={{
                                            color: isSelected ? "#fff" : "#000",
                                        }}>
                                            {row.floor}
                                            {/* {row.floors ? ("- " + row.floors) : ("")} */}
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                    </TableBody>
                </Table>
            </TableContainer>
            {/* <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={getListAsignMechanic?.length || 0}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            /> */}
            <Stack
                direction="row"
                spacing={2}
                sx={{
                    marginTop: "10px",
                    justifyContent: "center",
                }}
            >
                <Button type="button" variant="contained" color="primary" size="small" onClick={onAsignTask}>
                    {t("work_list.assign")}
                </Button>
                <Button type="button" variant="contained" color="error" size="small" onClick={onClose}>
                    {t("work_list.close")}
                </Button>
            </Stack>
        </AlertDialog>
    );
};

const WorkListScreen = () => {
    const [t] = useTranslation("global");
    const dispatch = useDispatch();
    const [open, setOpen] = useState(false);
    const [task, setTask] = useState({});
    const languages = localStorage.getItem('languages');
    // const [page, setPage] = useState(0);
    // const [rowsPerPage, setRowsPerPage] = useState(5);

    // const handleChangePage = (event, newPage) => {
    //     setPage(newPage);
    // };

    // const handleChangeRowsPerPage = (event) => {
    //     setRowsPerPage(+event.target.value);
    //     setPage(0);
    // };

    const { factory, floor, user_name, lean, position } = useSelector(
        (state) => state.auth.user
    );

    const { dataTaskReportDamageList, getListAsignMechanic } = useSelector(
        (state) => state.electric
    );

    const [socket, setSocket] = useState("");
    const socketRef = useRef();

    useEffect(() => {
        const fetchData = async () => {
            await dispatch(get_task_damage({ factory, floor, user_name, lean }));
        };
        fetchData();

        socketRef.current = socketIOClient.connect(host);
        socketRef.current.on("message", (data) => {
            console.log(data);
            
        });
        socketRef.current.on(`${user_name}`, (data) => {
            setSocket(data);
        });
        return () => {
            socketRef.current.disconnect();
        };
    }, [factory, floor, user_name, position, lean, dispatch, socket]);

    const handleClickOpen = async (row) => {
        const { id_machine } = row;
        await dispatch(
            get_list_asign_mechanic({ id_machine, floor, factory, position, lean })
        );
        setTask(row);
        setOpen(true);
    };

    return (
        <Box component="div">
            <BreadCrumb breadCrumb={t("work_list.work_list")} />
            <Box
                component="div"
                sx={{ display: "block", margin: "0 auto" }}
            >
                <Paper sx={PaperStyle} elevation={5}>
                    <Title titleText={t("work_list.work_list")} />
                    <TableContainer>
                        <Table stickyHeader aria-label="sticky table">
                            <TableHead>
                                <TableRow>
                                    <TableCell
                                        style={{
                                            fontWeight: "bold",
                                            minWidth: "120px",
                                            backgroundColor: "#1976d2",
                                            color: "#fff",
                                        }}
                                    >
                                        {t("work_list.date")}
                                    </TableCell>
                                    <TableCell
                                        style={{
                                            fontWeight: "bold",
                                            minWidth: "120px",
                                            backgroundColor: "#1976d2",
                                            color: "#fff",
                                        }}
                                    >
                                        {t("work_list.id_machine")}
                                    </TableCell>
                                    <TableCell
                                        style={{
                                            fontWeight: "bold",
                                            minWidth: "120px",
                                            backgroundColor: "#1976d2",
                                            color: "#fff",
                                        }}
                                    >
                                        {t("work_list.remark")}
                                    </TableCell>
                                    <TableCell
                                        style={{
                                            fontWeight: "bold",
                                            minWidth: "150px",
                                            backgroundColor: "#1976d2",
                                            color: "#fff",
                                        }}
                                    >
                                        {t("work_list.requester")}
                                    </TableCell>
                                    <TableCell
                                        style={{
                                            fontWeight: "bold",
                                            minWidth: "150px",
                                            backgroundColor: "#1976d2",
                                            color: "#fff",
                                        }}
                                    >
                                        {t("work_list.floor")}
                                    </TableCell>
                                    <TableCell
                                        style={{
                                            fontWeight: "bold",
                                            minWidth: "120px",
                                            backgroundColor: "#1976d2",
                                            color: "#fff",
                                        }}
                                    ></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {dataTaskReportDamageList?.map((row, index) => (
                                    <TableRow
                                        key={index}
                                        sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                                    >
                                        <TableCell component="th" scope="row">
                                        {row.date_user_request.split("T")[1].slice(0, -8)}
                                        &ensp;
                                        {row.date_user_request.split("T")[0]}
                                    
                                           
                                        </TableCell>
                                        <TableCell component="th" scope="row">
                                            {row.id_machine}
                                        </TableCell>
                                        <TableCell>{languages === "EN" ? row.info_reason_en: row.info_reason_vn}</TableCell>
                                        <TableCell>
                                            {row.name} - {row.id_user_request}
                                        </TableCell>
                                        <TableCell>
                                            {row.floor}

                                            {/* {row.floor} -  {row.floors} */}
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                sx={{
                                                    whiteSpace: "nowrap",
                                                }}
                                                onClick={() => handleClickOpen(row)}
                                            >
                                                {t("work_list.assign")}
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    {/* <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={dataTaskReportDamageList?.length || 0}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    /> */}
                </Paper>
            </Box>

            <TableEmployeeList
                open={open}
                setOpen={setOpen}
                headerModal={t("work_list.employee_list")}
                getListAsignMechanic={getListAsignMechanic}
                task={task}
            />
        </Box>
    );
};

export default WorkListScreen;
