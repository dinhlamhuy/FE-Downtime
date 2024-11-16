import React from 'react';
import AlertDialog from "./AlertDialog";
import { Grid, Typography, Box } from "@mui/material";

import { useTranslation } from "react-i18next";

const Sup_DetailInfo = ({ open, setOpen, task, user }) => {

    const [t] = useTranslation("global");
    const languages = localStorage.getItem('languages');
    // console.log(task)

    return (
        <>
            {open && (<AlertDialog
                open={open}
                setOpen={setOpen}
                headerModal={t("process_status.status_1_header")}
            >
                <Box component="div" sx={{ margin: "10px" }}>
                    <Grid
                        container
                        rowSpacing={2}
                        columnSpacing={{ xs: 1, sm: 2, md: 3 }} 
                        sx={{ marginBottom: "10px" }}
                    >
                        <Grid item xs={6} md={6}>
                            <Typography variant="div" sx={{ fontSize: "14px", fontWeight: "500" }}>
                                {t("process_status.official")} {" "}
                            </Typography>
                            <Typography variant="div" sx={{ fontSize: "14px", color: "gray" }}>
                                {task?.id_user_owner}
                            </Typography>
                        </Grid>
                        <Grid item xs={6} md={6}>
                            <Typography variant="div" sx={{ fontSize: "14px", fontWeight: "500" }}>
                                {/* {t("process_status.status_1_lean")} {" "} */}
                                {" Line: "}
                            </Typography>
                            <Typography variant="div" sx={{ fontSize: "14px", color: "gray" }}>
                                {task?.Line}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={12}>
                            <Typography variant="div" sx={{ fontSize: "14px", fontWeight: "500" }}>
                                {t("process_status.status_1_date")} {" "}
                            </Typography>
                            <Typography variant="div" sx={{ fontSize: "14px", color: "gray" }}>
                                {task?.date_request?.split("T")[1].slice(0, -8) + ' ' + task?.date_request?.split("T")[0]}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={12}>
                            <Typography variant="div" sx={{ fontSize: "14px", fontWeight: "500" }}>
                                {t("process_status.status_4_remark")} {" "}
                            </Typography>
                            <Typography variant="div" sx={{ fontSize: "14px", color: "gray" }}>
                                {task?.Remark}
                            </Typography>
                        </Grid>
                    </Grid>
                </Box>
            </AlertDialog>)}
        </>
    );
}

export default Sup_DetailInfo;
