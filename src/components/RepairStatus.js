import React, { } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Grid, Typography, Box } from "@mui/material";
import { useTranslation } from "react-i18next";
import {  useSelector } from "react-redux";


const PaperStyle = {
  position: "relative",
  marginTop: "10px",
  padding: "10px",
};
function RepairStatus() {
  const { t } = useTranslation("global");
  const { getListStatusTaskDetail, countStatusTask } = useSelector((state) => state.electric);
  const languages = localStorage.getItem('languages');
  // useEffect(() => {
  //   const fetchData = async () => {
  //     await dispatch(get_list_status_task_detail({ fromdate: fromDate, todate: toDate, factory, floor, lean }));
  //     await dispatch(get_count_status_task({ fromdate: fromDate, todate:toDate, factory, floor, lean }));
  //   };
  //   fetchData();
  // },  [ factory, floor, lean, dispatch]);


  const repairStatusLabels = {
    conveyor: t("repair_status.conveyor"),
    machine_type: t("repair_status.machine_code"),
    machine_name: t("repair_status.machine_name"),
    problem_faced: t("repair_status.problem_faced"),
    waiting_time: t("repair_status.waiting_time"),
    fixing_time: t("repair_status.fixing_time"),
    fixed: t("repair_status.fixed"),
  };

  return (
 
    <Box sx={{ marginTop: "10px", padding: "10px" }}>
      
      <Grid container alignItems={'stretch'} justifyContent="space-around"  sx={{ marginBottom:'10px', width:'98%',height:'100%' }}>
          <Grid item  alignItems={'stretch'} direction="column" justifyContent="center"   xs={4} sm={3} md={3} sx={{ }}>
            <Paper elevation={3} sx={{ height:'100%', border: "1px solid #000",padding: 1.5,  borderRadius:'12px'  }}>
              <Typography variant="h6" component="div" sx={{ fontSize: "1rem", fontWeight: "bold", lineHeight: "1.5" }}>
                {t("repair_status.waiting")}:
                <br />
                <span style={{ fontSize: "2rem" }}>{countStatusTask?.waiting ?? 0}</span>
              </Typography>
            </Paper>
          </Grid>
          <Grid item  alignItems={'stretch'} direction="column" justifyContent="center"  xs={4} sm={3} md={3} sx={{ }}>
            <Paper elevation={3} sx={{height:'100%', border: "1px solid #000",padding: 1.5,  borderRadius:'12px'  }}>
              <Typography variant="h6" component="div" sx={{ fontSize: "1rem", fontWeight: "bold", lineHeight: "1.5" }}>
                {t("repair_status.fixing")}:
                <br />
                <span style={{ fontSize: "2rem" }}>{countStatusTask?.doing ?? 0}</span>
              </Typography>
            </Paper>
          </Grid>
          <Grid item  alignItems={'stretch'} direction="column" justifyContent="center"  xs={4} sm={3} md={3} sx={{ }}>
            <Paper elevation={3} sx={{height:'100%', border: "1px solid #000",padding: 1.5,  borderRadius:'12px'  }}>
              <Typography variant="h6" component="div" sx={{ fontSize: "1rem", fontWeight: "bold", lineHeight: "1.5" }}>
                {t("repair_status.fixed")}:
                <br />
                <span style={{ fontSize: "2rem" }}>{countStatusTask?.finish ?? 0}</span>
              </Typography>
            </Paper>
          </Grid>
        </Grid>
        <Paper sx={PaperStyle} elevation={5}>
        <TableContainer>
          <Table sx={{ minWidth: 650 }} aria-label="sticky table" stickyHeader>
            <TableHead>
              <TableRow>
                {Object.values(repairStatusLabels).map((label, index) => (
                  <TableCell
                    key={index}
                    style={{
                      fontWeight: "bold",
                      whiteSpace: "nowrap",
                      backgroundColor: "#1976d2",
                      color: "#fff",
                    }}
                  >
                    {label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
  {Array.isArray(getListStatusTaskDetail) && getListStatusTaskDetail.length > 0 ? (
    getListStatusTaskDetail
      .slice() // Create a shallow copy to avoid mutating the original array
      .sort((a, b) => {
        if (a.status === 2 && b.status !== 2) return -1;
        if (a.status !== 2 && b.status === 2) return 1;
        return 0;
      })
      .map((row, index) => (
        <TableRow key={index} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
          {['line', 'id_machine', languages === "EN" ? 'Name_en' : 'Name_vn', languages === "EN" ? 'info_reason_en' : 'info_reason_vn', 'date_cfm_mechanic', 'date_mechanic_cfm_onsite', 'date_mechanic_cfm_finished'].map((field, idx) => (
            <TableCell key={idx} sx={{ color: row.status === 4 ? 'green' : 'red' }}>
              {field.includes('date') && row[field]
                ? `${row[field].split("T")[1].slice(0, -8)} ${row[field].split("T")[0]}`
                : row[field]
              }
            </TableCell>
          ))}
        </TableRow>
      ))
  ) : (
    <TableRow>
      {/* You may want to add some content here, like a message indicating no data */}
    </TableRow>
  )}
</TableBody>

          </Table>
        </TableContainer>
       
      </Paper>
    </Box>
  );
}

export default RepairStatus;
