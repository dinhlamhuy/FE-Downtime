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

    const timeDiff = calculateTimeDifference(machine?.date_mechanic_cfm_onsite, machine?.date_mechanic_cfm_finished);
    const formatTime = (hours, minutes, seconds) => {
        let formattedTime = '';
        if (hours > 0) {
            formattedTime += `${hours} ${t('process_status.hours')} `;
        }
        if (minutes > 0 || hours > 0) { 
            formattedTime += `${minutes} ${t('process_status.minutes')} `;
        }
        formattedTime += `${seconds} ${t('process_status.seconds')}`;
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
                    {machine?.id_machine && (
                        <Grid item xs={6} md={6}>
                            <Typography variant="div" sx={{ fontSize: "14px", fontWeight: "500" }}>
                                {t("process_status.status_1_id_machine")}{" "}
                            </Typography>
                            <Typography variant="div" sx={{ fontSize: "14px", color: "gray" }}>
                                {machine.id_machine}
                            </Typography>
                        </Grid>
                    )}
                    {machine?.date_user_request && (
                        <Grid item xs={6} md={6}>
                            <Typography variant="div" sx={{ fontSize: "14px", fontWeight: "500" }}>
                                {t("process_status.status_1_date")}{" "}
                            </Typography>
                            <Typography variant="div" sx={{ fontSize: "14px", color: "gray" }}>
                                {machine?.date_user_request?.split("T")[1].slice(0, -8) + ' ' + machine?.date_user_request?.split("T")[0]}
                            </Typography>
                        </Grid>
                    )}
                    {machine?.date_mechanic_cfm_onsite && (
                        <Grid item xs={6} md={6}>
                            <Typography variant="div" sx={{ fontSize: "14px", fontWeight: "500" }}>
                                {t("process_status.status_2_date")}{" "}
                            </Typography>
                            <Typography variant="div" sx={{ fontSize: "14px", color: "gray" }}>
                                {machine?.date_mechanic_cfm_onsite?.split("T")[1].slice(0, -8) + ' ' + machine?.date_mechanic_cfm_onsite?.split("T")[0]}
                            </Typography>
                        </Grid>
                    )}
                    {machine?.date_mechanic_cfm_finished && (
                        <Grid item xs={6} md={6}>
                            <Typography variant="div" sx={{ fontSize: "14px", fontWeight: "500" }}>
                                {t("process_status.status_4_date")}{" "}
                            </Typography>
                            <Typography variant="div" sx={{ fontSize: "14px", color: "gray" }}>
                                {machine?.date_mechanic_cfm_finished?.split("T")[1].slice(0, -8) + ' ' + machine?.date_mechanic_cfm_finished?.split("T")[0]}
                            </Typography>
                        </Grid>
                    )}
                    {(timeDiff.hours || timeDiff.minutes || timeDiff.seconds) && (
                        <Grid item xs={6} md={6}>
                            <Typography variant="div" sx={{ fontSize: "14px", fontWeight: "500" }}>
                                {t("process_status.time_fix")}{" "}
                            </Typography>
                            <Typography variant="div" sx={{ fontSize: "14px", color: "gray" }}>
                                {formatTime(timeDiff.hours, timeDiff.minutes, timeDiff.seconds)}
                            </Typography>
                        </Grid>
                    )}
                    {machine?.name_mechanic && (
                        <Grid item xs={6} md={6}>
                            <Typography variant="div" sx={{ fontSize: "14px", fontWeight: "500" }}>
                                {t("process_status.status_1_mechanic")}{" "}
                            </Typography>
                            <Typography variant="div" sx={{ fontSize: "14px", color: "gray" }}>
                                {machine?.name_mechanic}
                            </Typography>
                        </Grid>
                    )}
                    {machine?.id_owner_mechanic && (
                        <Grid item xs={6} md={6}>
                            <Typography variant="div" sx={{ fontSize: "14px", fontWeight: "500" }}>
                                {t("process_status.owner_mechanic")}{" "}
                            </Typography>
                            <Typography variant="div" sx={{ fontSize: "14px", color: "gray" }}>
                                {machine.id_owner_mechanic}
                            </Typography>
                        </Grid>
                    )}
                    {machine?.info_skill_en && (
                        <Grid item xs={6} md={6}>
                            <Typography variant="div" sx={{ fontSize: "14px", fontWeight: "500" }}>
                                {t("process_status.status_4_repair_method")}{" "}
                            </Typography>
                            <Typography variant="div" sx={{ fontSize: "14px", color: "gray" }}>
                                {languages === "EN"
                                    ? machine.info_skill_en
                                    : languages === "MM"
                                    ? machine.info_skill_mm
                                    : machine.info_skill_vn}{machine.other_skill && '('+machine.other_skill + ')'}
                            </Typography>
                        </Grid>
                    )}
                    {machine?.newmachine && (
                        <Grid item xs={6} md={6}>
                            <Typography variant="div" sx={{ fontSize: "14px", fontWeight: "500" }}>
                                {t("process_status.new_code_machine") + ':'}{" "}
                            </Typography>
                            <Typography variant="div" sx={{ fontSize: "14px", color: "gray" }}>
                                {machine?.newmachine}
                            </Typography>
                        </Grid>
                    )}
                </Grid>
            </Box>
            </AlertDialog>)}
        </>
    );
};

export default DetailFinish;
