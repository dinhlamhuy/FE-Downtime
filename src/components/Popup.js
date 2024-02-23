import React from 'react';
import { Box, Avatar, Typography } from "@mui/material";
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';

import { useTranslation } from "react-i18next";

const Popup = (props) => {
    const { statusPopup, errorMessage } = props;

    return (
        <Box component="div"
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                color: "#00860d",
                marginTop: "25px"
            }}>
            {
                statusPopup ? (
                    <PopupSuccess errorMessage={errorMessage} />
                ) : (
                    <PopupFail errorMessage={errorMessage} />
                )
            }
        </Box>
    )
}

export default Popup;

const avatarStyle = {
    backgroundColor: "transparent",
    boxShadow: "none",
    width: "60px",
    height: "60px",
};

const contentStyle = {
    color: "#aeaeae",
    textAlign: "center",
    fontSize: "14px",
    fontWeight: 400,
    boxSizing: "border-box",
    padding: "0 75px"
}


const PopupSuccess = (props) => {
    const [t] = useTranslation("global");
    const { errorMessage } = props;
    return (
        <>
            <Avatar sx={avatarStyle}> <CheckCircleOutlineRoundedIcon sx={{ color: "#00860d", fontSize: "80px" }} /></Avatar>
            <Typography variant="h6">{t("info_machine_damage.alert_success")}</Typography>
            <Typography variant="div" style={contentStyle}>{errorMessage}</Typography>
        </>
    )
}

const PopupFail = (props) => {
    const [t] = useTranslation("global");
    const { errorMessage } = props;
    return (
        <>
            <Avatar sx={avatarStyle}> <CancelOutlinedIcon sx={{ color: "#d32f2f", fontSize: "80px" }} /></Avatar>
            <Typography variant="h6" sx={{ color: "#d32f2f" }}>{t("info_machine_damage.alert_error")}</Typography>
            <Typography variant="div" style={contentStyle}>{errorMessage}</Typography>
        </>
    )
}