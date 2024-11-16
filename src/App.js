import { Routes, Route } from "react-router-dom";
import ProductionScreen from "./screens/production/ProductionScreen";
import ElectricScreen from "./screens/electric/ElectricScreen.js";
import LoginScreen from "./screens/LoginScreen.js";
import { useDispatch } from "react-redux";
import { updateInfo } from "./redux/features/auth.js";
import { useEffect } from "react";
import TaskScreen from "./screens/admin/TaskScreen.js";

function App() {
  const dispatch = useDispatch();
  const auth = localStorage.getItem('user');

  useEffect(() => {
    const updateUserInfo = async () => {
      try {
        const parsedUser = JSON.parse(auth);
        if (parsedUser?.user_name && parsedUser?.factory) {
          await dispatch(updateInfo({username:parsedUser.user_name, factory:parsedUser.factory}));
          // console.log("check");
        }
      } catch (error) {
        console.error("Failed to update info:", error);
      }
    };

    updateUserInfo(); // Gọi hàm async bên trong useEffect
  }, []); // Chỉ chạy lại khi `auth` hoặc `dispatch` thay đổi

  // console.log(auth);
  return (
    <Routes>
      <Route path="/" element={<LoginScreen />} />
      <Route path="/admin" element={<TaskScreen />} />
      <Route path="/electric/*" element={<ElectricScreen />} />
      <Route path="/product/*" element={<ProductionScreen />} />
    </Routes>
  );
}

export default App;
