import React from 'react';
import AlertDialog from "./AlertDialog";
import { Grid, Typography, Box } from "@mui/material";

import { useTranslation } from "react-i18next";

const DetailInfo = ({ isCheck, open, setOpen, machine, user }) => {

    const [t] = useTranslation("global");
    const languages = localStorage.getItem('languages');
    // console.log(isCheck);

    return (
        <>
            {isCheck && (<AlertDialog
                open={open}
                setOpen={setOpen}
                headerModal={t("process_status.status_1_header")}
            >
                <Box component="div" sx={{ margin: "10px" }}>
                    <Grid
                        container
                        rowSpacing={2}
                        columnSpacing={{ xs: 1, sm: 2, md: 3 }} sx={{ marginBottom: "10px" }}>
                        <Grid item xs={6} md={6}>
                            <Typography variant="div" sx={{ fontSize: "14px", fontWeight: "500" }}>
                                {t("process_status.status_1_user_request")} {" "}
                            </Typography>
                            <Typography variant="div" sx={{ fontSize: "14px", color: "gray" }}>
                                {machine.name_userrq ? machine.name_userrq : user.name}
                            </Typography>
                        </Grid>
                        <Grid item xs={6} md={6}>
                            <Typography variant="div" sx={{ fontSize: "14px", fontWeight: "500" }}>
                                {t("process_status.status_1_date")} {" "}
                            </Typography>
                            <Typography variant="div" sx={{ fontSize: "14px", color: "gray" }}>
                                {machine?.date_user_request?.split("T")[1].slice(0,-8)+' '+ machine?.date_user_request?.split("T")[0]}
                            </Typography>
                        </Grid>
                        <Grid item xs={6} md={6}>
                            <Typography variant="div" sx={{ fontSize: "14px", fontWeight: "500" }}>
                                {t("process_status.status_1_id_machine")} {" "}
                            </Typography>
                            <Typography variant="div" sx={{ fontSize: "14px", color: "gray" }}>
                                {machine.id_machine}
                            </Typography>
                        </Grid>
                        <Grid item xs={6} md={6}>
                            <Typography variant="div" sx={{ fontSize: "14px", fontWeight: "500" }}>
                                {t("process_status.status_1_floor")} {" "}
                            </Typography>
                            <Typography variant="span" sx={{ fontSize: "14px", color: "gray" }}>
                                {machine.floor}
                            </Typography>
                        </Grid>
                        <Grid item xs={6} md={6}>
                            <Typography variant="div" sx={{ fontSize: "14px", fontWeight: "500" }}>
                                {t("process_status.status_1_lean")} {" "}
                            </Typography>
                            <Typography variant="span" sx={{ fontSize: "14px", color: "gray" }}>
                                {machine.lean_req ? machine.lean_req : user.lean}
                            </Typography>
                        </Grid>
                        <Grid item xs={6} md={6}>
                            <Typography variant="div" sx={{ fontSize: "14px", fontWeight: "500" }}>
                                {t("process_status.status_1_mechanic")} {" "}
                            </Typography>
                            <Typography variant="div" sx={{ fontSize: "14px", color: "gray" }}>
                                {/* {machine?.name_machanic ? machine?.name_machanic : machine?.name} */}
                                {machine?.name_mechanic}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={12}>
                            <Typography variant="div" sx={{ fontSize: "14px", fontWeight: "500" }}>
                                {t("process_status.status_1_remark")} {" "}
                            </Typography>
                            <Typography variant="div" sx={{ fontSize: "14px", color: "gray" }}>
                                {/* {machine.remark} */}
                                {languages === "EN"
                                    ? machine.info_reason_en
                                    : languages === "MM"
                                    ? machine.info_reason_mm
                                    : machine.info_reason_vn} {machine.other_reason && '('+machine.other_reason + ')'}
                            </Typography>
                        </Grid>
                    </Grid>
                </Box>
            </AlertDialog>
        
        )}
        </>
    )
}

export default DetailInfo;