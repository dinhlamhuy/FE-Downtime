import React from "react";
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
                <SideBar sideBarMenu={sideBarMenu} user={auth.user}>
                    <RoutesProdution />
                </SideBar>
            ) : (
                <LoginScreen />
            )}
        </React.Fragment>
    );
};

export default ProductionScreen;
