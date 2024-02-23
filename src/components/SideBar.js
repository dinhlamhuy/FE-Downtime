import React, { useState } from "react";
import {
    AppBar,
    Toolbar,
    Box,
    IconButton,
    List,
    ListItemIcon,
    CssBaseline,
    Drawer,
    Typography,
    ListItemButton,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import LanguageIcon from '@mui/icons-material/Language';
import Banner from "./Banner";
import { Link, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../redux/features/auth";

import { useTranslation } from "react-i18next";

import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";

import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';

const menuSliderContainer = {
    minWidth: 250,
    height: "100%",
    color: "#000",
};

const LanguagesListStyle = {
    padding: "0px 0px 0px 73px",
    fontSize: "14px",
    color: "gray"
}

const SideBar = (props) => {
    const dispatch = useDispatch();
    const { sideBarMenu, user, children } = props;
    const { pathname } = useLocation();

    const active = sideBarMenu.findIndex((e) => e.path === pathname);

    const [open, setOpen] = useState(false);

    const [openLanguages, setOpenLanguages] = useState(false);

    const toggleSlider = () => {
        setOpen(!open);
    };

    const onLogOut = () => {
        dispatch(logout());
    }

    const [t, i18n] = useTranslation("global");

    const languages = localStorage.getItem('languages');
    const [selectedLanguage, setSelectedLanguage] = useState(languages === null ? "EN" : languages);

    const handleChange = (event) => {
        setSelectedLanguage(event.target.value);
        i18n.changeLanguage(event.target.value);
        localStorage.setItem("languages", event.target.value);
    };

    return (
        <React.Fragment>
            <CssBaseline />
            <Banner user={user} />

            {/* Content Body */}
            <Box
                component="div"
                sx={{
                    marginTop: "60px",
                    padding: "10px",
                }}
            >
                {children}
            </Box>

            {/* Content Body */}

            <Box component="nav">
                <AppBar
                    position="static"
                    style={{
                        backgroundColor: "#1565c0",
                        boxShadow: "unset",
                        position: "fixed",
                        top: 0,
                        zIndex: "11",
                    }}
                >
                    <Toolbar>
                        <IconButton onClick={toggleSlider}>
                            <MenuIcon style={{ color: "#fff" }} />
                        </IconButton>

                        {/* SideBar */}
                        <Drawer open={open} anchor="left" onClose={toggleSlider}>
                            <Box component="div" style={menuSliderContainer}>
                                <Box
                                    sx={{
                                        display: "block",
                                        padding: "20px 10px",
                                        textAlign: "center",
                                        backgroundColor: "primary.dark",
                                        color: "#fff",
                                        boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
                                    }}
                                >
                                    <Typography variant="h5">{user?.factory} - Time Down</Typography>
                                </Box>
                                <Box
                                    sx={{
                                        padding: "10px 20px",
                                    }}
                                >
                                    <Typography
                                        variant="div"
                                        sx={{ fontSize: "14px", fontWeight: "600" }}
                                    >
                                        {t("sidebar.system")}
                                    </Typography>

                                    {/* List Menu */}
                                    <List component="nav">
                                        {
                                            sideBarMenu.map((listItem, index) => (
                                                <ListItemButton component={Link} to={listItem.path} key={index}>
                                                    <ListItemIcon style={{ color: active === index ? "#1565c0" : "" }}>
                                                        {listItem.icon}
                                                    </ListItemIcon>
                                                    <Typography
                                                        sx={{
                                                            fontSize: "14px",
                                                            color: active === index ? "#1565c0" : "#0009",
                                                            fontWeight: "600",
                                                        }}
                                                    >
                                                        {listItem.text}
                                                    </Typography>
                                                </ListItemButton>
                                            ))
                                        }
                                    </List>
                                    {/* List Menu */}

                                    <Typography
                                        variant="div"
                                        sx={{ fontSize: "14px", fontWeight: "600" }}
                                    >
                                        {t("sidebar.support")}
                                    </Typography>
                                    <List component="nav">
                                        <ListItemButton onClick={() => setOpenLanguages(!openLanguages)}>
                                            <ListItemIcon>
                                                <LanguageIcon />
                                            </ListItemIcon>
                                            <Typography
                                                sx={{
                                                    fontSize: "14px",
                                                    color: "#0009",
                                                    fontWeight: "600",
                                                    marginRight: "10px"
                                                }}
                                            >
                                                {t("sidebar.language")}
                                            </Typography>
                                            {openLanguages ? <ExpandLess style={{ color: "gray" }} /> : <ExpandMore style={{ color: "gray" }} />}
                                        </ListItemButton>
                                        {openLanguages &&
                                            (
                                                <Box component="div" sx={LanguagesListStyle}>
                                                    <RadioGroup
                                                        aria-labelledby="demo-radio-buttons-group-label"
                                                        name="radio-buttons-group"
                                                        value={selectedLanguage}
                                                        onChange={handleChange}
                                                        style={{ fontSize: 'small' }}
                                                    >
                                                        <FormControlLabel value="EN" control={<Radio size="small" />} label={<span style={{ fontSize: '14px' }}>{t("sidebar.en")}</span>} />
                                                        <FormControlLabel value="VN" control={<Radio size="small" />} label={<span style={{ fontSize: '14px' }}>{t("sidebar.vn")}</span>} />
                                                    </RadioGroup>
                                                </Box>
                                            )}
                                        <ListItemButton onClick={onLogOut}>
                                            <ListItemIcon>
                                                <LogoutIcon />
                                            </ListItemIcon>
                                            <Typography
                                                sx={{
                                                    fontSize: "14px",
                                                    color: "#0009",
                                                    fontWeight: "600",
                                                }}
                                            >
                                                {t("sidebar.logout")}
                                            </Typography>
                                        </ListItemButton>
                                    </List>
                                </Box>
                            </Box>
                        </Drawer>
                        {/* SideBar */}
                    </Toolbar>
                </AppBar>
            </Box>
        </React.Fragment>
    );
};

export default SideBar;
