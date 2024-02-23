import React from 'react';
import { Box, Typography, Grid } from '@mui/material';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import IconButton from '@mui/material/IconButton';

import { useTranslation } from "react-i18next";

const SkillEmployeeStyle = {
    padding: "15px 30px 15px 30px",
    margin: "5px",
    borderRadius: "30px",
    border: "3px solid #ccc",
}

const TitleStyle = {
    fontSize: "14px",
    textTransform: "uppercase",
    fontWeight: "bold",
}

const ItemSkillStyle = {
    display: "flex",
    alignItems: "self-end",
}

const SkillEmployee = () => {
    const [t] = useTranslation("global");

    return (
        <Box component="div" sx={SkillEmployeeStyle}>
            <Typography sx={TitleStyle} variant="h4" component="div">
                {t("personal_info.service_repair_machine")}
            </Typography>

            <Grid container spacing={1} style={{ fontSize: 14, padding: "10px 15px 0" }}>
                <Grid item xs={6} sx={ItemSkillStyle}>
                    <IconButton size="small">
                        <FiberManualRecordIcon sx={{ fontSize: "12px" }} />
                    </IconButton>

                    <Typography sx={{ fontSize: "14px" }}>
                        Sm. Computer
                    </Typography>
                </Grid>

                <Grid item xs={6} sx={ItemSkillStyle}>
                    <IconButton size="small">
                        <FiberManualRecordIcon sx={{ fontSize: "12px" }} />
                    </IconButton>

                    <Typography sx={{ fontSize: "14px" }}>
                        Zag Zag
                    </Typography>
                </Grid>

                <Grid item xs={6} sx={ItemSkillStyle}>
                    <IconButton size="small">
                        <FiberManualRecordIcon sx={{ fontSize: "12px" }} />
                    </IconButton>

                    <Typography sx={{ fontSize: "14px" }}>
                        Med. Computer
                    </Typography>
                </Grid>

                <Grid item xs={6} sx={ItemSkillStyle}>
                    <IconButton size="small">
                        <FiberManualRecordIcon sx={{ fontSize: "12px" }} />
                    </IconButton>

                    <Typography sx={{ fontSize: "14px" }}>
                        Hammer
                    </Typography>
                </Grid>

                <Grid item xs={6} sx={ItemSkillStyle}>
                    <IconButton size="small">
                        <FiberManualRecordIcon sx={{ fontSize: "12px" }} />
                    </IconButton>

                    <Typography sx={{ fontSize: "14px" }}>
                        SN Post
                    </Typography>
                </Grid>

                <Grid item xs={6} sx={ItemSkillStyle}>
                    <IconButton size="small">
                        <FiberManualRecordIcon sx={{ fontSize: "12px" }} />
                    </IconButton>

                    <Typography sx={{ fontSize: "14px" }}>
                        DN Post
                    </Typography>
                </Grid>
            </Grid>
        </Box>
    )
}

export default SkillEmployee;