import React, { useState, useEffect, useRef, useCallback } from "react";
import { Box, Tabs, Tab } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  get_work_list_report_employee,
  get_history_mechanic,
  get_work_list_change_over,
} from "../../redux/features/electric";
import BreadCrumb from "../../components/BreadCrumb";
import ProgressStatus from "../../components/ProgressStatus";
import History from "../../components/History";
import socketIOClient from "socket.io-client";
import { BASE_URL } from "../../utils/env";

import { useTranslation } from "react-i18next";
// import { get_all_machine } from "../../redux/features/machine";

const host = BASE_URL;

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 1 }} textAlign="center">
          <Box>{children}</Box>
        </Box>
      )}
    </div>
  );
}

const StatusScreen = () => {
  const [socket, setSocket] = useState("");
  const socketRef = useRef();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const {
    workListReportEmployee,
    historyListReportMechanic,
    workListChangeOverEmployee,
  } = useSelector((state) => state.electric);

  const [value, setValue] = useState(0);

  const [t] = useTranslation("global");

  useEffect(() => {
    const fetchData = async () => {
      const { user_name, factory, lean, permission } = user;
      const id_user_mechanic = user_name;

      if (value === 1) {
        await dispatch(get_history_mechanic({ id_user_mechanic, factory }));
      } else {
        // permission == "3" && (await dispatch(get_all_machine({ factory })));

        await Promise.all([
          await dispatch(
            get_work_list_report_employee({ id_user_mechanic, factory, lean })
          ),
          dispatch(
            get_work_list_change_over({ id_user_mechanic, factory, lean })
          ),
        ]);
      }
    };

    fetchData();

    socketRef.current = socketIOClient.connect(host);

    socketRef.current.on("message", (data) => {
      console.log(data);
    });

    socketRef.current.on(`${user.user_name}`, (data) => {
      setSocket(data);
    });

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        console.log("Trang đã trở lại, load lại...");
        fetchData();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    // return () => {
    //   document.removeEventListener('visibilitychange', handleVisibilityChange);
    // };
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [user, dispatch, socket, value]);
  // useEffect(() => {

  // }, []);

  // const fetchData = useCallback(async () => {
  //   const { user_name, factory, lean } = user;
  //   const id_user_mechanic = user_name;

  //   if (value === 1) {
  //     await dispatch(get_history_mechanic({ id_user_mechanic, factory }));
  //   } else {
  //     await dispatch(get_all_machine({ factory }));
  //     await dispatch(get_work_list_report_employee({ id_user_mechanic, factory, lean }));
  //   }
  // }, [dispatch, user, value]);
  // useEffect(() => {
  //   fetchData(); // Gọi hàm fetch khi `value` hoặc `user` thay đổi

  //   // Khởi tạo socket chỉ một lần
  //   if (!socketRef.current) {
  //     socketRef.current = socketIOClient.connect(host);

  //     socketRef.current.on("message", (data) => {
  //       console.log(data);
  //     });

  //     socketRef.current.on(user.user_name, (data) => {
  //       // setSocketData(data); // Lưu dữ liệu từ socket

  //     });

  //     socketRef.current.on("disconnect", () => {
  //       console.log("Socket disconnected. Reconnecting...");
  //       socketRef.current.connect(); // Tự động kết nối lại khi mất kết nối
  //     });
  //   }

  //   // Xử lý khi quay lại từ nền
  //   const handleVisibilityChange = () => {
  //     if (document.visibilityState === "visible" && socketRef.current?.disconnected) {
  //       console.log("App resumed. Reconnecting socket...");
  //       socketRef.current.connect(); // Kết nối lại khi quay lại từ nền
  //     }
  //   };

  //   document.addEventListener("visibilitychange", handleVisibilityChange);

  //   return () => {
  //     document.removeEventListener("visibilitychange", handleVisibilityChange);
  //     socketRef.current?.disconnect(); // Ngắt kết nối khi component unmount
  //   };
  // }, [fetchData, user]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const breadCrumbText =
    value === 0
      ? t("process_status.process_status")
      : t("process_status.history");
  return (
    <Box component="div">
      <BreadCrumb breadCrumb={breadCrumbText} />
      <Box sx={{ width: "100%" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={value}
            variant="fullWidth"
            onChange={handleChange}
            aria-label="basic tabs example"
            centered
          >
            <Tab
              label={t("process_status.process_status")}
              {...a11yProps(0)}
              sx={{ fontSize: "14px", textTransform: "capitalize" }}
            />
            <Tab
              label={t("process_status.history")}
              {...a11yProps(1)}
              sx={{ fontSize: "14px", textTransform: "capitalize" }}
            />
          </Tabs>
        </Box>
        <CustomTabPanel value={value} index={0}>
          <ProgressStatus
            listReport={workListReportEmployee}
            listRelocate={workListChangeOverEmployee}
            // listRelocate={[]}
            user={user}
          />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          <History historyListReport={historyListReportMechanic} user={user} />
        </CustomTabPanel>
      </Box>
    </Box>
  );
};

export default StatusScreen;
