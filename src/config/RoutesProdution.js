import React from "react";
import { Routes, Route } from "react-router-dom";
import InfoMachineScreen from "../screens/production/InfoMachineScreen";
import StatusScreen from "../screens/production/StatusScreen";

const RoutesProdution = () => {
    return (
        <Routes>
            <Route path="/" element={<InfoMachineScreen />} />
            <Route path="/status" element={<StatusScreen />} />
        </Routes>
    );
};

export default RoutesProdution;