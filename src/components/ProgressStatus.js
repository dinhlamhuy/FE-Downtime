import React, { useEffect, useState } from "react";

import {
  Stepper,
  Step,
  StepLabel,
  Typography,
  Stack,
  Card,
  Chip,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Collapse,
} from "@mui/material";

import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";

import ColorlibStepIcon from "./ColorlibStepIcon";
import ScannerElectric from "./ScannerElectric";
import FinishTaskElectric from "./FinishTaskElectric";
import { Toast } from "../utils/toast";

import { useDispatch, useSelector } from "react-redux";
import { setErrorCode } from "../redux/features/electric";
// import ConfirmModal from "./ConfirmModal";
import DetailInfo from "./DetailInfo";

import { useTranslation } from "react-i18next";

const ProgressStatus = ({ listReport, user }) => {
  const [openProgress, setOpenProgress] = useState(listReport || []);
  const [open, setOpen] = useState(false);
  const [activeModal, setActiveModal] = useState("");
  const [scannerResult, setScannerResult] = useState("");
  const [idMachine, setIdMachine] = useState("");

  const [t] = useTranslation("global");

  const steps = [
    {
      label: t("process_status.status_1"),
      description: t("process_status.status_1_"),
      performAction: function (status, lean, id_machine) {
        setActiveModal("detailInfo");
        setIdMachine(id_machine);
        setOpen(true);
      },
    },
    // {
    //   label: t("process_status.status_2"),
    //   description: t("process_status.status_2_"),
    //   performAction: function (status, lean, id_machine) {
    //     if (status === 1 && (lean === "TD" || lean === "TM")) {
    //       setActiveModal("confirm");
    //       setIdMachine(id_machine);
    //       setOpen(true);
    //     }
    //   },
    // },
    {
      label: t("process_status.status_3"),
      description: t("process_status.status_3_"),
      performAction: function (status, lean, id_machine) {
        if (status === 2 && (lean === "TD" || lean === "TM")) {
          setActiveModal("scanner");
          setIdMachine(id_machine);
          setOpen(true);
        }
      },
    },
    {
      label: t("process_status.status_4"),
      description: t("process_status.status_4_"),
      performAction: function (status, lean, id_machine) {
        if (status === 3 && (lean === "TD" || lean === "TM")) {
          setActiveModal("finish");
          setIdMachine(id_machine);
          setOpen(true);
        }
      },
    },
  ];

  const handleClick = (index) => {
    const isOpen = openProgress.includes(index);
    if (isOpen) {
      setOpenProgress(openProgress.filter((item) => item !== index));
    } else {
      setOpenProgress([...openProgress, index]);
    }
  };

  const dispatch = useDispatch();
  const electric = useSelector((state) => state.electric);

  useEffect(() => {
    if (electric.errorCode === 0) {
      Toast.fire({
        icon: "success",
        title: electric.errorMessage,
      });
      setOpen(false);
    }

    if (
      electric.errorCode === 10001 ||
      electric.errorCode === 10002 ||
      electric.errorCode === 10003 ||
      electric.errorCode === 10004 ||
      electric.errorCode === 10005
    ) {
      Toast.fire({
        icon: "error",
        title: electric.errorMessage,
      });
    }

    dispatch(setErrorCode(null, ""));
  }, [electric, dispatch]);

  return (
    <Stack sx={{ width: "100%" }} spacing={2}>
      {listReport === null
        ? []
        : listReport?.map((product, index) => (
          <List
            sx={{
              width: "100%",
              bgcolor: "primary.dark",
              borderRadius: "5px",
            }}
            component="nav"
            key={index}
          >
            <ListItemButton onClick={() => handleClick(index)}>
              <ListItemText>
                <Typography
                  variant="body"
                  style={{
                    color: "white",
                    fontSize: "14px",
                  }}
                >
                  <Chip
                    label={product["date_user_request"].split("T")[0]}
                    color="primary"
                  />{" "}
                  - <Chip label={product["id_machine"]} color="primary" />
                </Typography>
              </ListItemText>
              {openProgress.includes(index) ? (
                <ExpandLess style={{ color: "white" }} />
              ) : (
                <ExpandMore style={{ color: "white" }} />
              )}
            </ListItemButton>
            <Collapse
              in={openProgress.includes(index)}
              timeout="auto"
              unmountOnExit
            >
              <List component="div" disablePadding>
                <ListItem>
                  <Card
                    variant="outlined"
                    sx={{ width: "100%", padding: "0 15px" }}
                  >
                    <Stepper
                      activeStep={product["status"] - 2}
                      orientation="vertical"
                    >
                      {steps.map((step, index) => (
                        <Step
                          key={index}
                          onClick={() =>
                            step.performAction(
                              product.status,
                              user.lean,
                              product.id_machine
                            )
                          }
                        >
                          <StepLabel StepIconComponent={ColorlibStepIcon}>
                            {step.label} - {step.description}
                          </StepLabel>
                        </Step>
                      ))}
                    </Stepper>
                  </Card>
                </ListItem>
              </List>
            </Collapse>

            {/* Trạng thái 1: Xem thông tin yêu cầu */}
            {activeModal === "detailInfo" && (
              <DetailInfo
                isCheck={idMachine === product.id_machine}
                machine={product}
                open={open}
                setOpen={setOpen}
                user={user}
              />
            )}

            {/* Trạng thái 2: Xác nhận form */}
            {/* {activeModal === "confirm" && (
              <ConfirmModal
                isCheck={idMachine === product.id_machine}
                idMachine={idMachine}
                open={open}
                setOpen={setOpen}
                user={user}
              />
            )} */}

            {/* Trạng thái 3: Quét mã scanner */}
            {activeModal === "scanner" && (
              <ScannerElectric
                isCheck={idMachine === product.id_machine}
                idMachine={idMachine}
                open={open}
                setOpen={setOpen}
                scannerResult={scannerResult}
                setScannerResult={setScannerResult}
                user={user}
              />
            )}

            {/* Trạng thái 4: Hoàn thành việc sửa chửa  */}
            {activeModal === "finish" && (
              <FinishTaskElectric
                isCheck={idMachine === product.id_machine}
                idMachine={idMachine}
                open={open}
                setOpen={setOpen}
                user={user}
              />
            )}
          </List>
        ))}
    </Stack>
  );
};

export default ProgressStatus;
