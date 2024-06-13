import React from 'react';
import AlertDialog from "./AlertDialog";
import { Grid, Typography, Box } from "@mui/material";

import { useTranslation } from "react-i18next";

const DetailFinish = ({ isCheck, open, setOpen, machine, user }) => {

    const [t] = useTranslation("global");
    const languages = localStorage.getItem('languages');
    const calculateTimeDifference = (start, end) => {
            const startDate = new Date(start);
            const endDate = new Date(end);
    
            const diffInMs = endDate - startDate;
            const diffInSeconds = Math.floor(diffInMs / 1000);
    
            const hours = Math.floor(diffInSeconds / 3600);
            const minutes = Math.floor((diffInSeconds % 3600) / 60);
            const seconds = diffInSeconds % 3600 % 60;
    
            return { hours, minutes, seconds };
        };
    
    const timeDiff = calculateTimeDifference(machine.date_mechanic_cfm_onsite, machine.date_mechanic_cfm_finished);
    const formatTimeInEnglish = (hours, minutes, seconds) => {
        let formattedTime = '';
        if (hours > 0) {
            formattedTime += `${hours} hour${hours > 1 ? 's' : ''} `;
        }
        if (minutes > 0) {
            formattedTime += `${minutes} minute${minutes > 1 ? 's' : ''} `;
        }
        if (seconds > 0) {
            formattedTime += `${seconds} second${seconds > 1 ? 's' : ''}`;
        }
        return formattedTime;
    };
    
    return (
        <>
            {isCheck && (<AlertDialog
                open={open}
                setOpen={setOpen}
                headerModal={t("process_status.status_4_header")}
            >
            <Box component="div" sx={{ margin: "10px" }}>
                <Grid container rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 3 }} sx={{ marginBottom: "10px" }}>
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
                            {t("process_status.status_1_date")} {" "}
                        </Typography>
                        <Typography variant="div" sx={{ fontSize: "14px", color: "gray" }}>
                            {machine.date_user_request.split("T")[1].slice(0, -8) + ' ' + machine.date_user_request.split("T")[0]}
                        </Typography>
                    </Grid>
                    <Grid item xs={6} md={6}>
                        <Typography variant="div" sx={{ fontSize: "14px", fontWeight: "500" }}>
                            {t("process_status.status_2_date")} {" "}
                        </Typography>
                        <Typography variant="div" sx={{ fontSize: "14px", color: "gray" }}>
                            {machine.date_mechanic_cfm_onsite.split("T")[1].slice(0, -8) + ' ' + machine.date_mechanic_cfm_onsite.split("T")[0]}
                        </Typography>
                    </Grid>
                    <Grid item xs={6} md={6}>
                        <Typography variant="div" sx={{ fontSize: "14px", fontWeight: "500" }}>
                            {t("process_status.status_4_date")} {" "}
                        </Typography>
                        <Typography variant="div" sx={{ fontSize: "14px", color: "gray" }}>
                            {machine.date_mechanic_cfm_finished.split("T")[1].slice(0, -8) + ' ' + machine.date_mechanic_cfm_finished.split("T")[0]}
                        </Typography>
                    </Grid>
                    <Grid item xs={6} md={6}>
                        <Typography variant="div" sx={{ fontSize: "14px", fontWeight: "500" }}>
                            {t("process_status.time_fix")} {" "}
                        </Typography>
                        <Typography variant="div" sx={{ fontSize: "14px", color: "gray" }}>
                        {languages === "EN" 
                            ? formatTimeInEnglish(timeDiff.hours, timeDiff.minutes, timeDiff.seconds) 
                            : (timeDiff.hours > 0 
                                ? `${timeDiff.hours} giờ ${timeDiff.minutes} phút ${timeDiff.seconds} giây` 
                                : `${timeDiff.minutes} phút ${timeDiff.seconds} giây`
                            )
                        }
                        </Typography>
                    </Grid>
                    <Grid item xs={6} md={6}>
                        <Typography variant="div" sx={{ fontSize: "14px", fontWeight: "500" }}>
                            {t("process_status.status_1_mechanic")} {" "}
                        </Typography>
                        <Typography variant="div" sx={{ fontSize: "14px", color: "gray" }}>
                            {machine?.name_mechanic}
                        </Typography>
                    </Grid>
                    <Grid item xs={6} md={6}>
                        <Typography variant="div" sx={{ fontSize: "14px", fontWeight: "500" }}>
                            {t("process_status.owner_mechanic")} {" "}
                        </Typography>
                        <Typography variant="div" sx={{ fontSize: "14px", color: "gray" }}>
                            {machine.id_owner_mechanic}
                        </Typography>
                    </Grid>
                    <Grid item xs={6} md={6}>
                        <Typography variant="div" sx={{ fontSize: "14px", fontWeight: "500" }}>
                            {t("process_status.status_4_repair_method")} {" "}
                        </Typography>
                        <Typography variant="div" sx={{ fontSize: "14px", color: "gray" }}>
                                {/* {machine.remark} */}
                                {languages === "EN"
                        ? machine.info_skill_en
                        : machine.info_skill_vn}
                            </Typography>
                    </Grid>
                    <Grid item xs={6} md={6}>
                        <Typography variant="div" sx={{ fontSize: "14px", fontWeight: "500" }}>
                        {t("process_status.new_code_machine")+':'} {" "}
                        </Typography>
                        <Typography variant="div" sx={{ fontSize: "14px", color: "gray" }}>
                                {/* {machine.remark} */}
                                {machine?.newmachine}
                            </Typography>
                    </Grid>
                    
                </Grid>
            </Box>
            </AlertDialog>)}
        </>
    )
}

export default DetailFinish;