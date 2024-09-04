
import React, { useState } from "react";
import LoginScreen from "../LoginScreen";
import SideBar from "../../components/SideBar";
import RoutesElectric from "../../config/RoutesElectric";
import WorkOutlineOutlinedIcon from "@mui/icons-material/WorkOutlineOutlined";
import RecentActorsOutlinedIcon from "@mui/icons-material/RecentActorsOutlined";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import { useSelector } from "react-redux";
import Notification from "../../firebaseNotifications/Notification";
import SettingsTwoToneIcon from '@mui/icons-material/SettingsTwoTone';
import { useTranslation } from "react-i18next";

const ElectricScreen = () => {
    const auth = useSelector((state) => state.auth);
    const [t] = useTranslation("global");

    // State to control the sidebar open/close
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    const handleSidebarToggle = () => {
        setSidebarOpen(!isSidebarOpen);
    };

    const handleSidebarClose = () => {
        setSidebarOpen(false);
    };

    let sideBarMenu = [];
    if (auth.user?.permission === 1) {
        sideBarMenu = [
            {
                icon: <WorkOutlineOutlinedIcon />,
                text: t("sidebar.work_list"),
                path: "/electric",
            },
            {
                icon: <RecentActorsOutlinedIcon />,
                text: t("sidebar.employee_list"),
                path: "/electric/list-user",
            },
            {
                icon: <BadgeOutlinedIcon />,
                text: t("sidebar.info_user"),
                path: "/electric/user",
            },
            {
                icon: <AutorenewIcon />,
                text: t("sidebar.process_status"),
                path: "/electric/status",
            }
        ];
    } else if (auth.user?.permission === 0) {
        sideBarMenu = [
            {
                icon: <WorkOutlineOutlinedIcon />,
                text: t("sidebar.work_list"),
                path: "/electric",
            },
            {
                icon: <RecentActorsOutlinedIcon />,
                text: t("sidebar.employee_list"),
                path: "/electric/list-user",
            },
            {
                icon: <SettingsTwoToneIcon />,
                text: t("sidebar.machinery_maintenance"),
                path: "/electric/list-repair",
            }
        ];
    } else if (auth.user?.permission === 2) {
        sideBarMenu = [
            {
                icon: <AutorenewIcon />,
                text: t("sidebar.process_status"),
                path: "/electric/status",
            },
            {
                icon: <BadgeOutlinedIcon />,
                text: t("sidebar.info_user"),
                path: "/electric/user",
            },
        ];
    }

    return (
        <React.Fragment>
            {auth.user !== null &&
                (auth.user?.permission === 1 || auth.user?.permission === 2 || auth.user?.permission === 0) ? (
                <SideBar
                    sideBarMenu={sideBarMenu}
                    user={auth.user}
                    open={isSidebarOpen}
                    onToggle={handleSidebarToggle}
                    onClose={handleSidebarClose}
                >
                    <RoutesElectric />
                </SideBar>
            ) : (
                <LoginScreen />
            )}
            <Notification />
        </React.Fragment>
    );
};

export default ElectricScreen;