import React, { useEffect, useRef } from "react";
import { Html5QrcodeScanner, Html5QrcodeScanType } from "html5-qrcode";
import { Box, Typography } from "@mui/material";

import { useTranslation } from "react-i18next";

const Scanner = (props) => {
  const { scanner, idMachine, scannerResult, setScannerResult } = props;
  const scannerRef = useRef(null);
  const [t] = useTranslation("global");

  useEffect(() => {
    // localStorage.removeItem("ML5_QRCODE_DATA");

    const startScanning = async () => {
      let cameraFailTimer;
      let cameraStarting = true;
      let cameraView = document.getElementById(`render-${idMachine}`); // Assuming you have an element with the ID 'cameraView'

      const constraints = {
        audio: false,
        video: {
          facingMode: 'environment'
        }
      };

      navigator.mediaDevices.getUserMedia(constraints)
        .then((mediaStream) => {
          cameraView.srcObject = mediaStream;
          clearTimeout(cameraFailTimer);
          cameraFailTimer = setTimeout(function () {
            // Camera isn't working - do something on screen
            cameraStarting = false;
          }, 5000);
          cameraView.onloadedmetadata = () => {
            cameraView.play().then(function () {
              // Camera is working - continue as normal
              clearTimeout(cameraFailTimer);
              cameraStarting = false;
              // callback(true);
            });
          };
        })
        .catch((err) => {
          // Camera isn't working - do something on screen
          cameraStarting = false;
          // callback(false);
        });
      // try {
      //   const devices = await navigator.mediaDevices.enumerateDevices();
      //   const videoDevices = devices.filter(
      //     (device) => device.kind === "videoinput"
      //   );

      //   let rearCameraId = null;
      //   for (const device of videoDevices) {
      //     if (device.label.toLowerCase().includes("back")) {
      //       rearCameraId = device.deviceId;
      //       break;
      //     }
      //   }

      //   const selectedCameraId = rearCameraId || videoDevices[0]?.deviceId;

      //   if (selectedCameraId) {
      //     scannerRef.current?.start(selectedCameraId, {
      //       facingMode: "environment",
      //     }, (result) => {
      //       scannerRef.current?.clear();
      //       setScannerResult(result);
      //     });
      //   }
      // } catch (error) {
      //   console.log(error);
      // }
    };

    const scanner = new Html5QrcodeScanner(`render-${idMachine}`, {
      qrbox: {
        width: 250,
        height: 250,
      },
      fps: 10,
      videoConstraints: {
        facingMode: { exact: "environment" },
      },
      rememberLastUsedCamera: true,
      supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA],
    });

    scannerRef.current = scanner;

    scanner.render(success, error);

    function success(result) {
      scanner.clear();
      setScannerResult(result);
    }

    function error(err) {
      console.log(err);
    }

    startScanning();

    const buttonElement = document.getElementById("html5-qrcode-button-camera-permission");

    if (buttonElement) {
      buttonElement.textContent = t("scanner.btn_req_camera_permission");
      buttonElement.addEventListener("click", handleCameraPermission);
    }

    // Clean up function
    return () => {
      scannerRef.current?.clear();
      scanner.clear();

      if (buttonElement) {
        buttonElement.removeEventListener("click", handleCameraPermission);
      }
    };
  }, [scannerResult, setScannerResult, idMachine, t]);

  function handleCameraPermission() {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(() => {
        console.log("Camera permission granted");
      })
      .catch((error) => {
        const alertNotFound = document.getElementById(`render-${idMachine}__header_message`);
        alertNotFound.textContent = t("scanner.alert_not_found");
      });
  }

  return (
    <>
      <Typography
        sx={{ fontSize: "14px", fontWeight: "500", marginBottom: "10px" }}
      >
        {scanner}
      </Typography>
      <Box component="div">
        {scannerResult ? (
          <></>
        ) : (
          <Box component="div" id={`render-${idMachine}`}></Box>
        )}
      </Box>
    </>
  );
};

export default Scanner;