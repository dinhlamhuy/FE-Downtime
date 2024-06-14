import React, { useState } from "react";
import LoginScreen from "../LoginScreen";
import SideBar from "../../components/SideBar";
import RoutesProdution from "../../config/RoutesProdution";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import { useSelector } from "react-redux";

import { useTranslation } from "react-i18next";

const ProductionScreen = () => {
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
    const sideBarMenu = [
        {
            icon: <NotificationsNoneIcon />,
            text: t("sidebar.info_machine_damage"),
            path: "/product",
        },
        {
            icon: <AutorenewIcon />,
            text: t("sidebar.process_status"),
            path: "/product/status",
        },
    ];

    return (
        <React.Fragment>
            {auth.user !== null && auth.user?.permission === 3 ? (
                <SideBar   
                sideBarMenu={sideBarMenu}
                user={auth.user}
                open={isSidebarOpen}
                onToggle={handleSidebarToggle}
                onClose={handleSidebarClose}>
                    <RoutesProdution />
                </SideBar>
            ) : (
                <LoginScreen />
            )}
        </React.Fragment>
    );
};

export default ProductionScreen;
