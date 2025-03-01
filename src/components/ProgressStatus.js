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
  Box,
  Divider,
} from "@mui/material";

import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";

import { ColorlibStepIcon2, ColorlibStepIcon } from "./ColorlibStepIcon";
import ScannerElectric from "./ScannerElectric";
import FinishTaskElectric from "./FinishTaskElectric";
import { Toast } from "../utils/toast";

import { useDispatch, useSelector } from "react-redux";
import { setErrorCode } from "../redux/features/electric";
import { setErrorCode as ProductsetErrorCode } from "../redux/features/product";

import DetailInfo from "./DetailInfo";

import { useTranslation } from "react-i18next";
import ConfirmModal from "./ConfirmModal";
import ProgressHistoryDetailTask from "./ProgressHistoryDetailTask";
import DetailInfoRelocateMachine from "./DetailInfoRelocateMachine";
import AcceptanceModal from "./AcceptanceModal";

const ProgressStatus = ({ listReport, user, listRelocate }) => {
  console.log(listReport);
  const [openProgress, setOpenProgress] = useState(listReport || []);
  const [openProgress2, setOpenProgress2] = useState(listRelocate || []);
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [activeModal, setActiveModal] = useState("");
  const [activeRelocateModal, setActiveRelocateModal] = useState("");
  // console.log(listRelocate)
  const [scannerResult, setScannerResult] = useState("");
  // const [scannerResult, setScannerResult] = useState("IT-PC12");
  const [idMachine, setIdMachine] = useState("");
  const [idRelocate, setIdRelocate] = useState("");

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
    {
      label: t("process_status.status_1"),
      description: t("process_status.status_1_"),
      performAction: function (status, lean, id_machine) {
        setActiveModal("detailInfo2");
        setIdMachine(id_machine);
        setOpen(true);
      },
    },
    {
      label: t("process_status.status_2"),
      description: t("process_status.status_2_"),
      performAction: function (status, lean, id_machine) {
        if (status === 1 && (lean === "TD" || lean === "TM")) {
          console.log("trạng thái", status);
          setActiveModal("confirm");
          setIdMachine(id_machine);
          setOpen(true);
        }
      },
    },
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
  const stepsRelocate = [
    {
      label: t("process_status.status_1"),
      description: t("process_status.Send_Machine_Relocation_Request"),
      performAction: function (status, lean, id) {
        // console.log(id)
        setActiveRelocateModal("detailInfo");
        setIdRelocate(id);
        setOpen2(true);
      },
    },

    {
      label: t("process_status.status_1"),
      description: t("process_status.Submit_Request_for_Machine_Relocation"),
      performAction: function (status, lean, id) {
        // console.log(status, lean, id);
        if (status == '1' && lean != "TD" && lean != "TM") {
          setActiveRelocateModal("confirm");
          setIdRelocate(id);
          setOpen2(true);
          // console.log("xin chào");
          
        }
      },
    },
  ];

  // useEffect(()=>{
  // //  console.log(activeRelocateModal)
  // },[activeRelocateModal])
  const handleClick = (index) => {
    const isOpen = openProgress.includes(index);
    if (isOpen) {
      setOpenProgress(openProgress.filter((item) => item !== index));
    } else {
      setOpenProgress([...openProgress, index]);
    }
  };
  const handleClickRelocate = (index) => {
    // console.log(index)
    const isOpen2 = openProgress2.includes(index);
    if (isOpen2) {
      setOpenProgress2(openProgress2.filter((item) => item !== index));
    } else {
      setOpenProgress2([...openProgress2, index]);
    }
  };

  const dispatch = useDispatch();
  const electric = useSelector((state) => state.electric);
  const product = useSelector((state) => state.product);

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

  useEffect(() => {
    if (product.errorCode === 0) {
      Toast.fire({
        icon: "success",
        title: product.errorMessage,
      });
      setOpen(false);

    }

    if (
      product.errorCode === 1001 ||
      product.errorCode === 1002 ||
      product.errorCode === 1003 ||
      product.errorCode === 1004 ||
      product.errorCode === 1005
    ) {
      Toast.fire({
        icon: "error",
        title: product.errorMessage,
      });
    }

    dispatch(ProductsetErrorCode(null, ""));
  }, [product, dispatch]);

  return (
    <Box>
      <Stack sx={{ width: "100%", paddingBottom: "5px" }} spacing={2}>
        {listRelocate === null
          ? []
          : listRelocate?.map((relocate, index) => (
              <List
                sx={{
                  width: "100%",

                  bgcolor: "success.dark",
                  borderRadius: "5px",
                }}
                component="nav"
                key={index}
              >
                <ListItemButton onClick={() => handleClickRelocate(index)}>
                  <ListItemText>
                    <Typography
                      variant="body"
                      style={{
                        color: "white",
                        fontSize: "4px",
                      }}
                    >
                      <Chip
                        // label={product["date_user_request"].split("T")[0]+' '+product["date_user_request"].split("T")[1].split(".")[0]}
                        label={
                          relocate["request_time"] &&
                          relocate["request_time"].split("T")[1].slice(0, -8) +
                            " " +
                            relocate["request_time"].split("T")[0]
                        }
                        color="success"
                      />{" "}
                      - <Chip label={relocate["req_line"]} color="success" />{" "}
                      {"→"}
                      {relocate["ID_lean"] ? (
                        <Chip label={relocate["ID_lean"]} color="success" />
                      ) : (
                        ""
                      )}
                    </Typography>
                  </ListItemText>
                  {openProgress2.includes(index) ? (
                    <ExpandLess style={{ color: "white" }} />
                  ) : (
                    <ExpandMore style={{ color: "white" }} />
                  )}
                </ListItemButton>
                <Collapse
                  in={openProgress2.includes(index)}
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
                          activeStep={
                            relocate["status"] == '1' && 0
                            // relocate["status"]
                          }
                          orientation="vertical"
                          
                        >
                          
                          {stepsRelocate.map((step, index) => {
                            return (
                              <Step
                                key={index}
                                onClick={() => {
                                  // console.log( product.status)
                                  step.performAction(
                                    relocate.status,
                                    user.lean,
                                    relocate.id
                                  );
                                }}
                              >
                                <StepLabel
                                  StepIconComponent={ColorlibStepIcon2}
                                >
                                  {step.label} - {step.description}
                                </StepLabel>
                              </Step>
                            );
                          })}
                        </Stepper>
                      </Card>
                    </ListItem>
                  </List>
                </Collapse>
                {activeRelocateModal === "detailInfo" && (
                 
                  <DetailInfoRelocateMachine
                    task={relocate}
                    isCheck={idRelocate === relocate.id}
                    open={open2}
                    setOpen={setOpen2}
                    user={user}
                  />
                )}
                {activeRelocateModal === "confirm" && (
                   <AcceptanceModal
                   isCheck={idRelocate === relocate.id}
                   task={relocate}
                   open={open2}
                   setOpen={setOpen2}
                   user={user}
                 />
                )}
              </List>
            ))}
      </Stack>
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
                        fontSize: "4px",
                      }}
                    >
                      <Chip
                        // label={product["date_user_request"].split("T")[0]+' '+product["date_user_request"].split("T")[1].split(".")[0]}
                        label={
                          product["date_user_request"] &&
                          product["date_user_request"]
                            .split("T")[1]
                            .slice(0, -8) +
                            " " +
                            product["date_user_request"].split("T")[0]
                        }
                        color="primary"
                      />{" "}
                      - <Chip label={product["id_machine"]} color="primary" /> -
                      {product["line_req"] ? (
                        <Chip label={product["line_req"]} color="primary" />
                      ) : (
                        ""
                      )}
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
                          activeStep={
                            // product["status"] === 1 ? 1 :
                            product["status"]
                          }
                          orientation="vertical"
                        >
                          {steps.map((step, index) => {
                            if (index === 1) {
                              return (
                                <Step
                                  sx={{
                                    marginTop: "-30px",
                                    marginBottom: "-30px",
                                    marginLeft: "30px",
                                  }}
                                  key={index}
                                  onClick={() => {
                                    step.performAction(
                                      product.status,
                                      user.lean,
                                      product.id_machine
                                    );
                                  }}
                                >
                                  <StepLabel
                                    StepIconComponent={ColorlibStepIcon}
                                  >
                                    History of request
                                  </StepLabel>
                                </Step>
                              );
                            } else {
                              return (
                                <Step
                                  key={index}
                                  onClick={() => {
                                    // console.log( product.status)
                                    step.performAction(
                                      product.status,
                                      user.lean,
                                      product.id_machine
                                    );
                                  }}
                                >
                                  <StepLabel
                                    StepIconComponent={ColorlibStepIcon}
                                  >
                                    {step.label} - {step.description}
                                  </StepLabel>
                                </Step>
                              );
                            }
                          })}
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
                {activeModal === "detailInfo2" && (
                  <ProgressHistoryDetailTask
                    isCheck={idMachine === product.id_machine}
                    machine={product}
                    open={open}
                    setOpen={setOpen}
                    user={user}
                  />
                )}
                {/* Trạng thái 2: Xác nhận form */}
                {activeModal === "confirm" && (
                  <ConfirmModal
                    isCheck={idMachine === product.id_machine}
                    idMachine={idMachine}
                    open={open}
                    setOpen={setOpen}
                    user={user}
                  />
                )}

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

                {/* Trạng thái 4: Hoàn thành việc sửa chữa  */}
                {activeModal === "finish" && (
                  <FinishTaskElectric
                    isCheck={idMachine === product.id_machine}
                    idMachine={idMachine}
                    open={open}
                    userRequest={product.id_user_request}
                    dept={product.dept}
                    setOpen={setOpen}
                    user={user}
                  />
                )}
              </List>
            ))}
      </Stack>
    </Box>
  );
};

export default ProgressStatus;
