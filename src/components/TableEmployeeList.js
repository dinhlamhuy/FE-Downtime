import { Button, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import AlertDialog from "./AlertDialog";
import { get_task_damage, owner_asign_task, setErrorCode } from "../redux/features/electric";
import { useEffect, useState } from "react";
import { Toast } from "../utils/toast";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

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
  export default TableEmployeeList