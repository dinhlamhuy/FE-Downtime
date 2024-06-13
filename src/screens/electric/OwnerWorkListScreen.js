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
    TablePagination,
    Button,
    Stack,
    Tabs, Tab
} from "@mui/material";
import BreadCrumb from "../../components/BreadCrumb";
import { Toast } from "../../utils/toast";
import { Grid } from '@mui/material';
import { useDispatch, useSelector } from "react-redux";
import {
    get_owner_task_damage,
    // get_list_asign_mechanic,
    owner_asign_task,
    setErrorCode,
    get_list_status_task_detail, get_count_status_task
} from "../../redux/features/electric";
import AlertDialog from "../../components/AlertDialog";
import dayjs from "dayjs";
import { format } from "date-fns";


import socketIOClient from "socket.io-client";
import { BASE_URL } from "../../utils/env";
import { useTranslation } from "react-i18next";
import RepairStatus from "../../components/RepairStatus";
import { useFormik } from "formik";
import * as Yup from 'yup';
import CustomSearchForm from "../../components/CustomSearchForm"
const PaperStyle = {
    position: "relative",
    marginTop: "10px",
    padding: "10px",
};

const host = BASE_URL;
function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        "aria-controls": `simple-tabpanel-${index}`,
    };
}

function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 1 }} textAlign="center">
                    <Box>{children}</Box>
                </Box>
            )}
        </div>
    );
}

const TableEmployeeList = ({ open, setOpen, headerModal, getListAsignMechanic, task }) => {
    const [t] = useTranslation("global");
    const dispatch = useDispatch();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [selectedRow, setSelectedRow] = useState(null);

    const languages = localStorage.getItem('languages');

    const electric = useSelector((state) => state.electric);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

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
                        {getListAsignMechanic
                            ?.map((row, index) => {
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
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={getListAsignMechanic?.length || 0}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
            <Stack
                direction="row"
                spacing={2}
                sx={{
                    marginTop: "10px",
                    justifyContent: "center",
                }}
            >
                <Button type="button" variant="contained" color="primary" size="small" onClick={onAsignTask}>
                    {t("work_list.call")}
                </Button>
                <Button type="button" variant="contained" color="error" size="small" onClick={onClose}>
                    {t("work_list.close")}
                </Button>
            </Stack>
        </AlertDialog>
    );
};

const OwnerWorkListScreen = () => {
    const [t] = useTranslation("global");
    const dispatch = useDispatch();
    const [open, setOpen] = useState(false);
    // const [task, setTask] = useState({});
    const [task] = useState({});
    const languages = localStorage.getItem('languages');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [value, setValue] = useState(0);
    const [alertCount, setAlertCount] = useState(0);
    const [alertValidate, setAlertValidate] = useState(false);
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const { factory, floor, user_name, lean, position } = useSelector(
        (state) => state.auth.user
    );

    const { dataOwnerTaskReportDamageList, getListAsignMechanic } = useSelector(
        (state) => state.electric
    );

    const [socket, setSocket] = useState("");
    const socketRef = useRef();
    const validationSchema = Yup.object().shape({
        DateFrom: Yup.string().required("Vui lòng nhập ngày!"),
        DateTo: Yup.string().required("Vui lòng nhập đến ngày!"),
    });
    const validate = (values) => {
        const error = {};
        const { DateFrom, DateTo } = values;

        if (new Date(format(DateTo.$d, "yyyy-MM-dd")) < new Date(format(DateFrom.$d, "yyyy-MM-dd"))) {
            error.DateFrom = " ";
            error.DateTo = " ";

            setAlertValidate(true);
            setAlertCount(alertCount + 1);
        }

        return error;
    }
    useEffect(() => {
        if (alertValidate && alertCount >= 2) {
            Toast.fire({
                icon: "error",
                title:
                    t("personal_info.validate_date_from"),
            })
        }
        setAlertValidate(false);
    }, [alertValidate, alertCount, t])
    const formik = useFormik({
        initialValues: {
            DateFrom: dayjs(new Date()),
            DateTo: dayjs(new Date()),
        },
        validationSchema,
        validate,
        onSubmit: async (data) => {
            const fromdate = format(data.DateFrom.$d, "yyyy-MM-dd");
            const todate = format(data.DateTo.$d, "yyyy-MM-dd");
            await dispatch(get_list_status_task_detail({ fromdate, todate, factory, floor, lean }));
            await dispatch(get_count_status_task({ fromdate, todate, factory, floor, lean }));
            await dispatch(get_owner_task_damage({ factory, floor, user_name, lean, fromdate, todate }));
        }
    })

    const DateFrom = dayjs(new Date());
    const DateTo = dayjs(new Date());

    useEffect(() => {

        const fetchData = async () => {
            const fromdate = format(DateFrom.toDate(), "yyyy-MM-dd");
            const todate = format(DateTo.toDate(), "yyyy-MM-dd");
            await dispatch(get_owner_task_damage({ factory, floor, user_name, lean, fromdate, todate }));
            await dispatch(get_list_status_task_detail({ fromdate, todate, factory, floor, lean }));
            await dispatch(get_count_status_task({ fromdate, todate, factory, floor, lean }));
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
        }; // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [factory, floor, user_name, position, lean, dispatch, socket]);

    // const handleClickOpen = async (row) => {
    //     const { id_machine } = row;
    //     await dispatch(
    //         get_list_asign_mechanic({ id_machine, floor, factory, position, lean })
    //     );
    //     setTask(row);
    //     setOpen(true);
    // };
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const breadCrumbText = value === 0 ? t("work_list.work_list") : t("repair_status.repair_status");



    return (
        <Box component="div">
            <Grid container spacing={1}>
                <Grid item xs={12} md={6}>
                    <BreadCrumb breadCrumb={breadCrumbText} />
                </Grid>
                <Grid item xs={12} md={6} sx={{ marginLeft: '-10px !important' }}>
                    <CustomSearchForm formik={formik} />
                </Grid>
            </Grid>
            <Box
                component="div"
                sx={{ display: "block", margin: "0 auto" }}
            >
                <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                    <Tabs
                        value={value}
                        variant="fullWidth"
                        onChange={handleChange}
                        aria-label="basic tabs example"
                        centered
                    >
                        <Tab
                            label={t("work_list.work_list")}
                            {...a11yProps(0)}
                            sx={{ fontSize: "14px", textTransform: "capitalize" }}
                        />
                        <Tab
                            label={t("repair_status.repair_status")}
                            {...a11yProps(1)}
                            sx={{ fontSize: "14px", textTransform: "capitalize" }}
                        />
                    </Tabs>
                </Box>
                <CustomTabPanel value={value} index={0}  >
                    <Paper sx={PaperStyle} elevation={5}>
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
                                    {/* .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) */}
                                    {dataOwnerTaskReportDamageList?.map((row, index) => (
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
                                            <TableCell>{languages === "EN" ? row.info_reason_en : row.info_reason_vn}</TableCell>
                                            <TableCell>
                                                {row.name} - {row.id_user_request}
                                            </TableCell>
                                            <TableCell>
                                                {row.floor}

                                                {/* {row.floor} -  {row.floors} */}
                                            </TableCell>
                                            <TableCell>
                                                <a href={row.phone_number ? 'tel:+' + row.phone_number:'tel:+19008198' }>
                                                    <Button
                                                        variant="contained"
                                                        color="primary"
                                                        sx={{
                                                            whiteSpace: "nowrap",
                                                        }}
                                                    // Using href directly on the Button with curly braces
                                                    >  {t("work_list.call")}
                                                    </Button>
                                                </a>
                                            </TableCell>

                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <TablePagination
                            rowsPerPageOptions={[1000]}
                            component="div"
                            count={dataOwnerTaskReportDamageList?.length || 0}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </Paper>
                </CustomTabPanel>

                <CustomTabPanel value={value} index={1}>
                    <RepairStatus fromDate={formik.values.DateFrom} toDate={formik.values.DateTo} />
                </CustomTabPanel>

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

export default OwnerWorkListScreen;