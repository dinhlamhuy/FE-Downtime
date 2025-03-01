import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody, // TablePagination,
  Button,
  Stack,
  Grid,
  Select,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
  Autocomplete,
  Typography,
  Chip,
} from "@mui/material";
import BreadCrumb from "../../components/BreadCrumb";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";

import { Toast } from "../../utils/toast";
import { useDispatch, useSelector } from "react-redux";
import {
  get_task_damage,
  get_list_asign_mechanic,
  owner_asign_task,
  setErrorCode,
  get_all_lean,
  call_support,
  get_Machine_Under_Repair,
  get_task_relocate_machine,
  get_list_status_mechanic,
  asign_Task_Relocate_Machine,
} from "../../redux/features/electric";
import AlertDialog from "../../components/AlertDialog";

import socketIOClient from "socket.io-client";
import { BASE_URL } from "../../utils/env";

import { useTranslation } from "react-i18next";
// import { useFormik } from "formik";
// import * as Yup from "yup";
import ProgressHistoryDetailTask from "../../components/ProgressHistoryDetailTask";
const PaperStyle = {
  position: "relative",
  marginTop: "10px",
  padding: "10px",
};

const host = BASE_URL;

const TableEmployeeList = ({
  open,
  setOpen,
  headerModal,
  getListAsignMechanic,
  task,
}) => {
  const { factory, floor, user_name, lean, position } = useSelector(
    (state) => state.auth.user
  );
  const CurrentOnwer = useSelector(
    (state) => state.auth?.user?.user_name || ""
  );

  const [t] = useTranslation("global");
  const dispatch = useDispatch();
  const [selectedRow, setSelectedRow] = useState(null);

  const languages = localStorage.getItem("languages");

  const electric = useSelector((state) => state.electric);

  const handleRowClick = (rowData) => {
    setSelectedRow(rowData);
  };

  const onClose = () => {
    setSelectedRow(null);
    setOpen(false);
  };
  const [expandedRows, setExpandedRows] = useState({});

  const toggleExpandRow = (index) => {
    setExpandedRows((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };
  const fetchData = async () => {
    await dispatch(get_task_damage({ factory, floor, user_name, lean }));
  };
  const onAsignTask = async () => {
    if (task && selectedRow) {
      const { id_machine } = task;
      const { user_name, factory, lean } = selectedRow;

      const language = languages;

      await dispatch(
        owner_asign_task({
          user_name,
          id_machine,
          id_owner_mechanic: CurrentOnwer,
          factory,
          lean,
          language,
        })
      );
      fetchData();
      setSelectedRow(null);
      setOpen(false);
    } else {
      Toast.fire({
        icon: "error",
        title: t("work_list.alert_table"),
      });
    }
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

  return (
    <AlertDialog open={open} setOpen={setOpen} headerModal={headerModal}>
      <TableContainer>
        <Table
          stickyHeader
          aria-label="sticky table table-fixed"
          style={{ tableLayout: "fixed" }}
        >
          <TableHead>
            <TableRow>
              <TableCell
                style={{
                  fontWeight: "bold",
                  whiteSpace: "nowrap",
                  width: "200px",
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
                  width: "100px",
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
                  width: "150px",
                  backgroundColor: "#1976d2",
                  color: "#fff",
                }}
              >
                {t("work_list.floor")}
              </TableCell>
              <TableCell
                style={{
                  fontWeight: "bold",
                  whiteSpace: "nowrap",
                  width: "160px",
                  backgroundColor: "#1976d2",
                  color: "#fff",
                }}
              >
                {t("work_list.total_fix")}
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: "bold",
                  backgroundColor: "#1976d2",
                  color: "#fff",
                  width: "300px",
                  textAlign: "center",
                }}
              >
                {t("work_list.total_skills")}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {getListAsignMechanic?.map((row, index) => {
              const isSelected = selectedRow === row;
              const isExpanded = !!expandedRows[index];
              return (
                <TableRow
                  key={index}
                  onClick={() => handleRowClick(row)}
                  style={{
                    backgroundColor: isSelected ? "#83ace7" : "transparent",
                  }}
                >
                  <TableCell
                    sx={{ whiteSpace: "nowrap" }}
                    style={{
                      color: isSelected ? "#fff" : "#000",
                    }}
                  >
                    {row.user_name} - {row.name}
                  </TableCell>
                  <TableCell
                    style={{
                      color: isSelected ? "#fff" : "#000",
                    }}
                  >
                    {row.lean}
                  </TableCell>
                  <TableCell
                    sx={{ whiteSpace: "nowrap" }}
                    style={{
                      color: isSelected ? "#fff" : "#000",
                      width: "100%",
                      textOverflow: "ellipsis",
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {row.floor}
                    {row.floors ? ` (${row.floors})` : ""}
                  </TableCell>
                  <TableCell
                    style={{
                      color: isSelected ? "#fff" : "#000",
                      textAlign: "center",
                    }}
                  >
                    {row.totalFix}
                  </TableCell>
                  <TableCell
                    sx={{
                      color: isSelected ? "#fff" : "#000",
                      textAlign: "left",
                      width: "100%",
                      textOverflow: "ellipsis",
                      overflow: "hidden",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: row.skill !== "0" ? "center" : "",
                    }}
                  >
                    <div
                      style={{
                        maxWidth: isExpanded ? "none" : "240px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: isExpanded ? "normal" : "nowrap",
                      }}
                    >
                      {row.skill || "0"}
                    </div>
                    {row.skill && row.skill.length > 20 && (
                      <span
                        onClick={() => toggleExpandRow(index)}
                        style={{
                          marginLeft: "5px",
                          padding: "5px 10px",
                          fontSize: "14px",
                          color: "#007bff",
                          cursor: "pointer",
                          textDecoration: "underline",
                          display: "inline-block",
                          userSelect: "none",
                        }}
                      >
                        {isExpanded
                          ? t("work_list.hide")
                          : t("work_list.see_more")}
                      </span>
                    )}
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
        <Button
          type="button"
          variant="contained"
          color="primary"
          size="small"
          onClick={onAsignTask}
        >
          {t("work_list.assign")}
        </Button>
        <Button
          type="button"
          variant="contained"
          color="error"
          size="small"
          onClick={onClose}
        >
          {t("work_list.close")}
        </Button>
      </Stack>
    </AlertDialog>
  );
};
const TableEmployeeList2 = ({
  open,
  setOpen,
  headerModal,
  getListAsignMechanic,
  task,
}) => {
  const { factory, floor, user_name, lean } = useSelector(
    (state) => state.auth.user
  );
  const CurrentOnwer = useSelector(
    (state) => state.auth?.user?.user_name || ""
  );

  const [t] = useTranslation("global");
  const dispatch = useDispatch();
  const [selectedRows, setSelectedRows] = useState([]);

  const languages = localStorage.getItem("languages");
  const electric = useSelector((state) => state.electric);

  const handleRowClick = (rowData) => {
    setSelectedRows(
      (prev) =>
        prev.includes(rowData)
          ? prev.filter((row) => row !== rowData) // Remove if already selected
          : [...prev, rowData] // Add if not selected
    );
  };

  const onClose = () => {
    setSelectedRows([]);
    setOpen(false);
  };

  const fetchData2 = async () => {
    await dispatch(
      get_task_relocate_machine({ fixer: lean, id_owner: user_name, factory })
    );
  };
  const onAsignTask2 = async () => {
    if (task && selectedRows.length > 0) {
      const { id, req_floor } = task;
      const language = languages;

      const arrMechanic = selectedRows.map((row) => row.user_name);
      const arrStringRepairmen =
        selectedRows.map((row) => row.user_name).join(",") || "";
      const infoSend = {
        id_owner: user_name,
        id_task: id,
        fixer: lean,
        factory,
        repairman: arrStringRepairmen,
        arrRepairman: arrMechanic,
        req_floor,
      };

      dispatch(await asign_Task_Relocate_Machine(infoSend));

      fetchData2();
      setSelectedRows([]);
      setOpen(false);
    } else {
      Toast.fire({
        icon: "error",
        title: t("work_list.alert_table"),
      });
    }
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
        return <Chip label={t("employee_list.task")} color="warning"  sx={{ backgroundColor: "orange" }} />;
      case 3:
        return <Chip label={t("employee_list.fixing")} color="error"    sx={{ backgroundColor: "red" }} />;
      default:
        return "";
    }
  }
  return (
    <AlertDialog open={open} setOpen={setOpen} headerModal={headerModal}>
      <TableContainer>
        <Table
          stickyHeader
          aria-label="sticky table table-fixed"
          style={{ tableLayout: "fixed" }}
        >
          <TableHead>
            <TableRow>
              <TableCell
                style={{
                  fontWeight: "bold",
                  whiteSpace: "nowrap",
                  width: "200px",
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
                  width: "100px",
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
                  width: "150px",
                  backgroundColor: "#1976d2",
                  color: "#fff",
                }}
              >
                {t("work_list.floor")}
              </TableCell>

              <TableCell
                sx={{
                  fontWeight: "bold",
                  backgroundColor: "#1976d2",
                  color: "#fff",
                  width: "120px",
                  textAlign: "center",
                }}
              >
                {t("employee_list.active_status")}
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: "bold",
                  backgroundColor: "#1976d2",
                  color: "#fff",
                  width: "120px",
                  textAlign: "center",
                }}
              >
                {t("employee_list.task_name")}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {getListAsignMechanic?.map((row, index) => {
              const isSelected = selectedRows.includes(row);
              return (
                <TableRow
                  key={index}
                  onClick={() => handleRowClick(row)}
                  style={{
                    backgroundColor: isSelected ? "#83ace7" : "transparent",
                  }}
                >
                  <TableCell
                    style={{
                      color: isSelected ? "#fff" : "#000",
                    }}
                  >
                    {row.user_name} - {row.name}
                  </TableCell>
                  <TableCell
                    style={{
                      color: isSelected ? "#fff" : "#000",
                    }}
                  >
                    {row.lean}
                  </TableCell>
                  <TableCell
                    style={{
                      color: isSelected ? "#fff" : "#000",
                      textOverflow: "ellipsis",
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {row.floor}
                    {row.floors ? ` (${row.floors})` : ""}
                  </TableCell>

                  <TableCell
                    style={{
                      color: isSelected ? "#fff" : "#000",
                      textAlign: "center",
                      display: "flex",
                      alignItems: "center",
                      height:'100%'
                    }}
                  >
                    <Typography style={{width:'100%', height:'100%'}}>{statusCurrent(row.STS)}</Typography>
                  </TableCell>
                  <TableCell
                    style={{
                      color: isSelected ? "#fff" : "#000",
                      textAlign: "center",
                      // display: "flex",
                      alignItems: "center",
                    }}
                  >
                    {row.TaskName}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <Stack
        direction="row"
        spacing={2}
        sx={{
          marginTop: "10px",
          justifyContent: "center",
        }}
      >
        <Button
          type="button"
          variant="contained"
          color="primary"
          size="small"
          onClick={onAsignTask2}
        >
          {t("work_list.assign")}
        </Button>
        <Button
          type="button"
          variant="contained"
          color="error"
          size="small"
          onClick={onClose}
        >
          {t("work_list.close")}
        </Button>
      </Stack>
    </AlertDialog>
  );
};

// const TableEmployeeListline = ({ open, setOpen, headerModal, getListAsignMechanic, getAllLean }) => {
//     const { factory, floor,  user_name: authUserName, lean } = useSelector(
//         (state) => state.auth.user
//     );

//     const [t] = useTranslation("global");
//     const dispatch = useDispatch();
//     const [expandedRows, setExpandedRows] = useState({});
//     const [selectedRow, setSelectedRow] = useState(null);
//     const languages = localStorage.getItem('languages');
//     const [lines, setLines] = useState([]);
//     const electric = useSelector((state) => state.electric);
//     const validationSchema = Yup.object({
//         line: Yup.string().required(t("work_list.error_select_line")),
//         remark: Yup.string().required(t("work_list.error_enter_remark")),
//         selectedRow: Yup.mixed().required(t("work_list.error_select_mechanic"))
//     });

//     // Formik khởi tạo
//     const formik = useFormik({
//         initialValues: {
//             line: '',
//             remark: '',
//             selectedRow: null,
//         },
//         validationSchema,
//         onSubmit: (values) => {
//             console.log("Selected Line:", values.line);
//             console.log("Remark:", values.remark);
//             console.log("Selected User:", values.selectedRow);

//             const { user_name: user_machine, factory, lean } = values.selectedRow;

//             dispatch(call_support({
//                 floor,
//                 factory,
//                 line: values.line,
//                 status: 1,
//                 user_machine,
//                 user_owner: authUserName,
//                 remark: values.remark,
//                 support_detail: values.support_detail,
//                 lang: languages
//             }));

//             setSelectedRow(null);
//             setOpen(false);
//         }

//     });

//     const handleRowClick = (rowData) => {
//         formik.setFieldValue('selectedRow', rowData);
//         setSelectedRow(rowData);
//     };

//     const onClose = () => {
//         formik.resetForm();
//         setOpen(false);
//     };

//     const toggleExpandRow = (index) => {
//         setExpandedRows((prev) => ({
//             ...prev,
//             [index]: !prev[index],
//         }));
//     };

//     useEffect(() => {
//         if (Array.isArray(getAllLean) && getAllLean.length > 0) {
//             const leanData = getAllLean.map(item => item.lean);
//             setLines(leanData);
//         }
//     }, [getAllLean]);

//     useEffect(() => {
//         const fetchData = async () => {

//             if (electric.errorCode !== null) {
//                 let icon = 'error';
//                 if (electric.errorCode === 0) {
//                     icon = 'success';
//                 }
//                 Toast.fire({
//                     icon: icon,
//                     title: electric.errorMessage,
//                 });
//                 await dispatch(setErrorCode(null, ""));
//             }
//         };
//         fetchData();
//     }, [electric, dispatch]);
//     return (
//         <AlertDialog open={open} setOpen={setOpen} headerModal={headerModal}>
//          <form onSubmit={formik.handleSubmit}>
//             <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "10px", alignItems: "flex-start" }}>
//             <FormControl
//             error={formik.touched.line && Boolean(formik.errors.line)}
//             variant="outlined"
//             style={{ minWidth: "150px" }}
//              size="small"
//         >
//             <InputLabel>{t("work_list.select_line")}</InputLabel>
//             <Select
//                 name="line"
//                 value={formik.values.line}
//                 onChange={formik.handleChange}
//                 displayEmpty
//                 label={t("work_list.select_line")}
//             >
//                 <MenuItem value="" disabled>{t("work_list.select_line")}</MenuItem>
//                 {lines.length > 0 ? (
//                     lines.map((lean, index) => (
//                         <MenuItem key={index} value={lean}>{lean}</MenuItem>
//                     ))
//                 ) : (
//                     <MenuItem value="" disabled>Không có line nào</MenuItem>
//                 )}
//             </Select>

//             <FormHelperText>
//                 {formik.touched.line && formik.errors.line ? formik.errors.line : ""}
//             </FormHelperText>
//         </FormControl>
//                     <TextField
//                         label={t("work_list.remark")}
//                         name="remark"
//                         value={formik.values.remark}
//                         onChange={formik.handleChange}
//                         variant="outlined"
//                         fullWidth
//                         multiline
//                         rows={1}
//                         error={formik.touched.remark && Boolean(formik.errors.remark)}
//                         helperText={formik.touched.remark && formik.errors.remark}
//                     />
//                 </div>

//             <TableContainer>
//             <Table stickyHeader aria-label="sticky table table-fixed" style={{ tableLayout: "fixed" }}>
//             <TableHead>
//                 <TableRow>
//                     <TableCell
//                         style={{
//                             fontWeight: "bold",
//                             whiteSpace: "nowrap",
//                             width: "200px",
//                             backgroundColor: "#1976d2",
//                             color: "#fff",
//                         }}
//                     >
//                         {t("work_list.name")}
//                     </TableCell>
//                     <TableCell
//                         style={{
//                             fontWeight: "bold",
//                             whiteSpace: "nowrap",
//                             width: "100px",
//                             backgroundColor: "#1976d2",
//                             color: "#fff",
//                         }}
//                     >
//                         {t("work_list.lean")}
//                     </TableCell>
//                     <TableCell
//                         style={{
//                             fontWeight: "bold",
//                             whiteSpace: "nowrap",
//                             width: "150px",
//                             backgroundColor: "#1976d2",
//                             color: "#fff",
//                         }}
//                     >
//                         {t("work_list.floor")}
//                     </TableCell>
//                     <TableCell
//                         style={{
//                             fontWeight: "bold",
//                             whiteSpace: "nowrap",
//                             width: "160px",
//                             backgroundColor: "#1976d2",
//                             color: "#fff",
//                         }}
//                     >
//                         {t("work_list.total_fix")}
//                     </TableCell>
//                     <TableCell
//                         style={{
//                             fontWeight: "bold",
//                             whiteSpace: "nowrap",
//                             width: "160px",
//                             backgroundColor: "#1976d2",
//                             color: "#fff",
//                         }}
//                     >
//                         {/* {t("work_list.call")} */}
//                     </TableCell>

//                 </TableRow>
//             </TableHead>
//             <TableBody>
//                 {getListAsignMechanic?.map((row, index) => {
//                     const isSelected = selectedRow === row;
//                     const isExpanded = !!expandedRows[index];
//                     return (
//                         <TableRow
//                             key={index}
//                             onClick={() => handleRowClick(row)}
//                             style={{
//                                 backgroundColor: isSelected ? "#83ace7" : "transparent",
//                             }}
//                         >
//                             <TableCell
//                                 sx={{ whiteSpace: "nowrap" }}
//                                 style={{
//                                     color: isSelected ? "#fff" : "#000",
//                                 }}
//                             >
//                                 {row.user_name} - {row.name}
//                             </TableCell>
//                             <TableCell
//                                 style={{
//                                     color: isSelected ? "#fff" : "#000",
//                                 }}
//                             >
//                                 {row.lean}
//                             </TableCell>
//                             <TableCell
//                                 sx={{ whiteSpace: "nowrap" }}
//                                 style={{
//                                     color: isSelected ? "#fff" : "#000",
//                                     width: "100%",
//                                     textOverflow: "ellipsis",
//                                     overflow: "hidden",
//                                     whiteSpace: "nowrap",
//                                 }}
//                             >
//                                 {row.floor}
//                                 {row.floors ? ` (${row.floors})` : ""}
//                             </TableCell>
//                             <TableCell
//                                 style={{
//                                     color: isSelected ? "#fff" : "#000",
//                                     textAlign: "center",
//                                 }}
//                             >
//                                 {row.totalFix}
//                             </TableCell>
//                             <TableCell>
//                              <a href={row.phone_number ? 'tel:+' + row.phone_number:'tel:+19008198' }>
//                               <Button
//                                  variant="contained"
//                                  color="primary"
//                                  sx={{
//                                  whiteSpace: "nowrap",
//                                 }}>
//                                  {t("work_list.call")}
//                              </Button>
//                             </a>
//                             </TableCell>
//                         </TableRow>
//                     );
//                 })}
//             </TableBody>
//         </Table>

//             </TableContainer>
//             {formik.touched.selectedRow && formik.errors.selectedRow && (
//                 <FormHelperText error style={{ color: 'red', textAlign: 'center', marginTop: '10px' }}>
//                 {formik.errors.selectedRow}
//                 </FormHelperText>
//             )}
//             <Stack direction="row" spacing={2} sx={{ marginTop: "10px", justifyContent: "center" }}>
//             <Button type="submit" variant="contained" color="primary" size="small">
//                 {t("work_list.assign")}
//             </Button>
//             <Button type="button" variant="contained" color="error" size="small" onClick={onClose}>
//                 {t("work_list.close")}
//             </Button>
//         </Stack>
//             </form>
//         </AlertDialog>
//     );
// };

const WorkListScreen = () => {
  const [t] = useTranslation("global");
  const dispatch = useDispatch();

  const [openEmployeeList, setOpenEmployeeList] = useState(false);
  const [openEmployeeListRelocate, setOpenEmployeeListRelocate] =
    useState(false);
  const [openEmployeeListline, setOpenEmployeeListline] = useState(false);
  const [task, setTask] = useState({});
  const languages = localStorage.getItem("languages");
  const [open, setOpen] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [idMachine, setIdMachine] = useState("");
  const [activeModal, setActiveModal] = useState("");
  const HandleViewHistory = (id_task) => {
    setOpen(true);
    setIdMachine(id_task);
    setActiveModal(true);
    // console.log('hehe', id_task)
  };
  const { factory, floor, user_name, lean, position, permission } = useSelector(
    (state) => state.auth.user
  );
  const handleClickOpenRelocate = async (row) => {
    const { id_machine } = row;
    await dispatch(
      get_list_status_mechanic({
        user_name,
        position,
        factory,
        floor,
        lean,
        permission,
      })
    );

    // get_list_asign_mechanic({ id_machine, floor, factory, position, lean })
    setTask(row);
    setOpenEmployeeListRelocate(true);
  };

  const {
    dataTaskReportDamageList,
    getListAsignMechanic,
    getAllLean,
    infoMachineUnderRepair,
    getListStatusMechanic,
    getTaskRelocate,
  } = useSelector((state) => state.electric);

  const [socket, setSocket] = useState("");
  const socketRef = useRef();

  useEffect(() => {
    const fetchData = async () => {
      await dispatch(get_task_damage({ factory, floor, user_name, lean }));
      await dispatch(
        get_task_relocate_machine({ fixer: lean, id_owner: user_name, factory })
      );
    };
    fetchData();

    socketRef.current = socketIOClient.connect(host);
    socketRef.current.on("message", (data) => {
      console.log(data);
    });
    socketRef.current.on(`${user_name}`, (data) => {
      setSocket(data);
    });

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        console.log("Trang đã trở lại, load lại...");
        fetchData();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      // socketRef.current.disconnect();
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [factory, floor, user_name, position, lean, dispatch, socket]);

  const handleClickOpen = async (row) => {
    const { id_machine } = row;
    await dispatch(
      get_list_asign_mechanic({ id_machine, floor, factory, position, lean })
    );

    setTask(row);
    setOpenEmployeeList(true);
  };

  const handleClickOpenline = async () => {
    await dispatch(get_list_asign_mechanic({ floor, factory, position, lean }));
    await dispatch(get_all_lean({ floor, factory }));
    setOpenEmployeeListline(true);
  };

  return (
    <Box component="div">
      <BreadCrumb breadCrumb={t("work_list.work_list")} />
      <Box component="div" sx={{ display: "block", margin: "0 auto" }}>
        {getTaskRelocate &&
          Array.isArray(getTaskRelocate) &&
          getTaskRelocate.length > 0 && (
            <Paper sx={PaperStyle} elevation={5}>
              <Typography>{t("work_list.Machine_Relocation_List")}</Typography>
              <TableContainer>
                <Table stickyHeader aria-label="sticky table">
                  <TableHead>
                    <TableRow>
                      <TableCell
                        style={{
                          fontWeight: "bold",
                          minWidth: "110px",
                          backgroundColor: "green",
                          color: "#fff",
                        }}
                      >
                        {t("work_list.date")}
                      </TableCell>
                      <TableCell
                        style={{
                          fontWeight: "bold",
                          minWidth: "120px",
                          backgroundColor: "green",
                          color: "#fff",
                        }}
                      >
                        {t("process_status.status_1_user_request")}
                      </TableCell>
                      {/* <TableCell
                        style={{
                          fontWeight: "bold",
                          minWidth: "150px",
                          backgroundColor: "green",
                          color: "#fff",
                        }}
                      >
                                               {t("work_list.floor")}

                      </TableCell> */}
                      <TableCell
                        style={{
                          fontWeight: "bold",
                          minWidth: "120px",
                          backgroundColor: "green",
                          color: "#fff",
                        }}
                      >
                        {t("work_list.remark")}
                      </TableCell>

                      <TableCell
                        style={{
                          fontWeight: "bold",
                          minWidth: "120px",
                          backgroundColor: "green",
                          color: "#fff",
                        }}
                      ></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {getTaskRelocate?.map((relocate, index) => (
                      <TableRow
                        key={"relocate" + index}
                        sx={{
                          "&:last-child td, &:last-child th": {
                            border: 0,
                          },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          {relocate?.request_time?.split("T")[1].slice(0, -8)}
                          &ensp;
                          {relocate?.request_time?.split("T")[0]}
                        </TableCell>
                        <TableCell component="th" scope="row">
                          {relocate.req_user_name}{" "}
                          {"(" + relocate?.req_line + ")"}
                        </TableCell>
                        {/* <TableCell>
                          {relocate.ID_Floor}
                          {"(" + relocate?.ID_lean + ")"}
                        </TableCell> */}
                        <TableCell>{relocate.remark}</TableCell>

                        <TableCell>
                          <Button
                            variant="contained"
                            color="success"
                            sx={{ whiteSpace: "nowrap" }}
                            disabled={
                              !(
                                (lean === "TD" &&
                                  !relocate.id_owner_electrician) ||
                                (lean === "TM" && !relocate.id_owner_mechanic)
                              )
                            }
                            onClick={() => handleClickOpenRelocate(relocate)}
                          >
                            {(lean === "TD" &&
                              !relocate.id_owner_electrician) ||
                            (lean === "TM" && !relocate.id_owner_mechanic)
                              ? t("work_list.assign")
                              : t("work_list.assigned")}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          )}

        <Paper sx={PaperStyle} elevation={5}>
          <Typography>{t("work_list.Pending_Assignment_List")}</Typography>

          <TableContainer>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <TableCell
                    style={{
                      fontWeight: "bold",
                      minWidth: "110px",
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
                      minWidth: "20px",
                      backgroundColor: "#1976d2",
                      color: "#fff",
                    }}
                  ></TableCell>
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
                    sx={{
                      "&:last-child td, &:last-child th": {
                        border: 0,
                      },
                    }}
                  >
                    <TableCell component="th" scope="row">
                      {row?.date_user_request?.split("T")[1].slice(0, -8)}
                      &ensp;
                      {row?.date_user_request?.split("T")[0]}
                    </TableCell>
                    <TableCell
                      component="th"
                      scope="row"
                      sx={{
                        ...(row?.id_main_task && {
                          backgroundColor: "red",
                          color: "white",
                          fontWeight: "bold",
                        }),
                      }}
                    >
                      {row.id_machine}{" "}
                      {row?.id_main_task && "(" + row?.id_main_task + ")"}
                    </TableCell>
                    <TableCell>
                      {languages === "EN"
                        ? row.info_reason_en
                        : languages === "MM"
                        ? row.info_reason_mm
                        : row.info_reason_vn}{" "}
                      {row.other_reason && "(" + row.other_reason + ")"}
                    </TableCell>

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
                        onClick={() => HandleViewHistory(row.id)}
                      >
                        <RemoveRedEyeOutlinedIcon />
                      </Button>
                      {activeModal && (
                        <ProgressHistoryDetailTask
                          isCheck={idMachine === row.id}
                          machine={row}
                          open={open}
                          setOpen={setOpen}
                          user={""}
                        />
                      )}
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
        open={openEmployeeList}
        setOpen={setOpenEmployeeList}
        headerModal={t("work_list.employee_list")}
        getListAsignMechanic={getListAsignMechanic}
        task={task}
      />
      <TableEmployeeList2
        open={openEmployeeListRelocate}
        setOpen={setOpenEmployeeListRelocate}
        headerModal={t("work_list.employee_list")}
        getListAsignMechanic={getListStatusMechanic}
        task={task}
      />

      {/* <TableEmployeeListline
        open={openEmployeeListline}
        setOpen={setOpenEmployeeListline}
        headerModal={t("work_list.employee_list")}
        getListAsignMechanic={getListAsignMechanic}
        getAllLean={getAllLean}
        infoMachineUnderRepair={infoMachineUnderRepair}
        task={task}
      /> */}
    </Box>
  );
};

export default WorkListScreen;
