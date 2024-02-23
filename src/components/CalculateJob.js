import { Box, Typography } from '@mui/material';
import React from 'react';

import { useTranslation } from "react-i18next";

const CalculateJobStyle = {
    margin: "5px",
    borderRadius: "30px",
    display: "flex",
    justifyContent: "space-between"
}

const CalculateJobsStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "10px 0",
    borderRadius: "25px",
    border: "3px solid #ccc",
    width: "49%"
}

const TitleStyle = {
    color: "#000",
    fontWeight: "bold",
    textTransform: "uppercase",
    fontSize: "19px",
    textAlign: "center",
}

const ContentStyle = {
    width: "90%",
    height: "70px",
    bgcolor: "primary.dark",
    borderRadius: "20px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
}

const CalculateJob = ({ totalFix, avgTime }) => {
    const [t] = useTranslation("global");

    return (
        <Box component="div" sx={CalculateJobStyle}>
            <Box sx={CalculateJobsStyle}>
                <Typography variant="h6" component="h6" sx={TitleStyle}>
                    {t("personal_info.total_number_of_votes_fixed")}<br />{t("personal_info.total_number_of_votes_fixed_")}
                </Typography>
                <Box sx={ContentStyle}>
                    <Typography variant="h3" component="h3" color="white">
                        {totalFix}
                    </Typography>
                </Box>
            </Box>
            <Box sx={CalculateJobsStyle}>
                <Typography variant="h6" component="h6" sx={TitleStyle}>
                    {t("personal_info.avg_repair_time")}<br />{t("personal_info.avg_repair_time_")}
                </Typography>
                <Box sx={ContentStyle}>
                    <Typography variant="h3" component="h3" color="white">
                        {avgTime}
                    </Typography>
                </Box>
            </Box>
        </Box>
    )
}

export default CalculateJob;