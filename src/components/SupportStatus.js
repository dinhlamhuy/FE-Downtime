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
import Sup_FinishTaskElectric from "./Sup_FinishTaskElectric";
import { Toast } from "../utils/toast";

import { useDispatch, useSelector } from "react-redux";
import { setErrorCode } from "../redux/features/electric";

import DetailInfo from "./DetailInfo";

import { useTranslation } from "react-i18next";
import Sup_ConfirmModal from "./Sup_ConfirmModal";
import Sup_DetailInfo from "./Sup_DetailInfo";

const SupportStatus = ({ listReport, user }) => {
  const [openProgress, setOpenProgress] = useState(listReport || []);
  const [open, setOpen] = useState(false);
  const [activeModal, setActiveModal] = useState("");
  // const [scannerResult, setScannerResult] = useState("IT-PC12");

  const [t] = useTranslation("global");

  const steps = [
    {
      label: "Cán bộ",
      description: "Yêu cầu hỗ trợ",
      performAction: function () {
        setActiveModal("detailInfo");
        setOpen(true);
      },
    },
    {
      label: "Thợ sửa",
      description: "Xác nhận của thợ",
      performAction: function (status, lean) {
        if (status === 1 && (lean === "TD" || lean === "TM")) {
          setActiveModal("confirm");
          setOpen(true);
        }
      },
    },

    {
      label: "Thợ sửa",
      description: "Hoàn thành hỗ trợ",
      performAction: function (status, lean) {
        if (status === 2 && (lean === "TD" || lean === "TM")) {
          setActiveModal("finish");
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
                      fontSize: "4px",
                    }}
                  >
                    <Chip
                      // label={product["date_user_request"].split("T")[0]+' '+product["date_user_request"].split("T")[1].split(".")[0]}

                      label={
                        product["date_request"] &&
                        product["date_request"]
                          .split("T")[1]
                          .slice(0, -8) + " " +
                        product["date_request"].split("T")[0]
                      }
                      color="primary"
                    />{" "}
                   -   {" "}{product["Line"] ? (
                      <Chip label={product["Line"]} color="primary" />
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
                        activeStep={product["status"] - 1}
                        orientation="vertical"
                      >
                        {steps.map((step, index) => (
                          <Step
                            key={index}
                            onClick={() => {
                              step.performAction(
                                product.status,
                                user.lean,
                              );
                            }}
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
                <Sup_DetailInfo
                  task={product}
                  open={open}
                  setOpen={setOpen}
                  user={user}
                />
              )}

              {/* Trạng thái 2: Xác nhận form */}
              {activeModal === "confirm" && (
                <Sup_ConfirmModal
                  open={open}
                  setOpen={setOpen}
                  user={user}
                  task={product}
                />
              )}
              {/* Trạng thái 3: Nhập chi tiết công việc */}
              {activeModal === "finish" && (
                <Sup_FinishTaskElectric
                  open={open}
                  setOpen={setOpen}
                  user={user}
                  task={product}
       
                />
              )}
            </List>
          ))}
    </Stack>
  );
};

export default SupportStatus;
