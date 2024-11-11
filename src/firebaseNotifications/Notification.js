import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { requestForToken, onMessageListener } from "./firebase";

const Notification = () => {
  const [notification, setNotification] = useState({ title: "", body: "" });

  const notify = () => toast(<ToastDisplay />,{
  
    style: {
      maxWidth: "90%", // Tăng chiều rộng thông báo
      whiteSpace: "pre-wrap", // Đảm bảo xuống dòng nếu nội dung dài
    },
  });

  function ToastDisplay() {
    return (
      // <div>

      //     <b>{notification?.title}</b>
      //     <p>{notification?.body}</p>
      // </div>

      <div >
        {/* <a href="https://lyv.lacty.com.vn"> */}
          <b style={{fontSize:'1.45rem'}}>{notification?.title}</b>
          <p style={{fontSize:'1.1rem'}}>{notification?.body}</p>
        {/* </a> */}
      </div>
    );
  }

  useEffect(() => {
    if (notification?.title) {
      notify();
    }
  }, [notification]);

  requestForToken();

  onMessageListener()
    .then((payload) => {
      setNotification({
        title: payload?.notification?.title,
        body: payload?.notification?.body,
      });
    })
    .catch((err) => console.log("failed: ", err));

  return <Toaster />;
};

export default Notification;
