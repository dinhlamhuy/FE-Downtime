import React, {  } from "react";
import {
  Box,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";

import { useTranslation } from "react-i18next";

const TaskEmployeeStyle = {
  padding: "15px 30px 15px 30px",
  margin: "5px",
  borderRadius: "30px",
  border: "3px solid #ccc",
};

const TitleStyle = {
  fontSize: "14px",
  textTransform: "uppercase",
  fontWeight: "bold",
};

const TaskEmployee = ({ arrResult }) => {
  // const [selectedRow, setSelectedRow] = useState(null);
  const languages = localStorage.getItem('languages');

  const [t] = useTranslation("global");

  const columns = [
    { id: "date_user_request", label: t("personal_info.date"), minWidth: 110 },
    { id: "id_machine", label: t("personal_info.id_machine"), minWidth: 100 },
    { id: "skill_cfm", label: t("personal_info.method_machine"), minWidth: 100 },
    { id: "avgTime", label: t("personal_info.time_fix"), minWidth: 100 },
  ];

  return (
    <Box component="div" sx={TaskEmployeeStyle}>
      <Typography sx={TitleStyle} variant="h4" component="div">
        {t("personal_info.finished_job")}
      </Typography>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth, whiteSpace: "nowrap" }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>

          </TableHead>
          <TableBody>
          {arrResult?.map((row, index) => {
                return (
                  <TableRow key={index}>
                    <TableCell>
                      {row.date_user_request.split("T")[0]}
                    </TableCell>
                    <TableCell>
                      {row.id_machine}
                    </TableCell>
                    <TableCell sx={{ whiteSpace: "nowrap" }}>
                      {languages === "EN" ? row.skill_cfm.join(", ") : row.skill_cfm_vn.join(", ")}
                    </TableCell>
                    <TableCell>
                      {row.avgTime}
                    </TableCell>
                  </TableRow>
                );
              })}

          </TableBody>
        </Table>
      </TableContainer>
  
    </Box>
  );
};

export default TaskEmployee;
