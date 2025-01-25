import React from "react";
import { Routes, Route } from "react-router-dom";
import InfoMachineScreen from "../screens/production/InfoMachineScreen";
import StatusScreen from "../screens/production/StatusScreen";
import HomeProPageScreen from "../screens/production/HomeProPageScreen";
import RelocateMachine from "../screens/production/RelocateMachine";

const RoutesProdution = () => {
    
    return (
        <Routes>
            <Route path="/" element={<HomeProPageScreen />} />
            <Route path="/info-machine" element={<InfoMachineScreen />} />
            <Route path="/relocate-machine" element={<RelocateMachine />} />



            {/* <Route path="/move_machine" element={< />} /> */}
            {/* <Route path="/" element={<InfoMachineScreen />} /> */}
            <Route path="/status" element={<StatusScreen />} />
        </Routes>
    );
};

export default RoutesProdution;