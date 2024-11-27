import React from "react";
import { Routes, Route } from "react-router-dom";
import WorkListScreen from "../screens/electric/WorkListScreen";
import UserlistScreen from "../screens/electric/UserListScreen";
import InfoUserScreen from "../screens/electric/InfoUserScreen";
import StatusScreen from "../screens/electric/StatusScreen";
import { useSelector } from "react-redux";
import InfoUser from "../components/InfoUser";
import RepairScreen from "../screens/electric/RepairListScreen";

import OwnerUserListScreen from "../screens/electric/OwnerUserListScreen";
import OwnerWorkListScreen from "../screens/electric/OwnerWorkListScreen";
import SupportScreen from "../screens/electric/SupportScreen";
import TaskScreen from "../screens/admin/TaskScreen";
import TokenUserScreen from "../screens/admin/TokenUserScreen";

function RoutesElectric() {
  const auth = useSelector((state) => state.auth);

  return (
    <Routes>
      {auth.user?.permission === 0 ? (
        <>
          {auth.user?.user_name !== "Huii" ? (
            <>
              <Route path="/" element={<OwnerWorkListScreen />} />
              <Route path="/list-user" element={<OwnerUserListScreen />} />
              <Route path="/list-user/:user_name" element={<InfoUser />} />
              <Route path="/list-repair" element={<RepairScreen />} />
            </>
          ) : (
            <>
              <Route path="/" element={<TaskScreen />} />
              <Route path="/list-user" element={<TokenUserScreen />} />
            </>
          )}
        </>
      ) : auth.user?.permission === 1 ? (
        <>
          <Route path="/" element={<WorkListScreen />} />{" "}
          {/* copy lại code cũ */}
          <Route path="/list-user" element={<UserlistScreen />} />{" "}
          {/* copy lại code cũ */}
          <Route path="/user" element={<InfoUserScreen />} />
          <Route path="/status" element={<StatusScreen />} />
        </>
      ) : (
        <>
          <Route path="/user" element={<InfoUserScreen />} />
          <Route path="/status" element={<StatusScreen />} />
          <Route path="/support" element={<SupportScreen />} />
        </>
      )}
    </Routes>
  );
}

export default RoutesElectric;
