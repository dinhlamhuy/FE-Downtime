import React, { useState } from "react";
import {
  Stepper,
  Step,
  StepLabel,
  Stack,
  Card,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Collapse,
  Chip
} from "@mui/material";

import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";

import ColorlibStepIcon from "./ColorlibStepIcon";

import DetailInfo from "./DetailInfo";
import DetailFinish from "./DetailFinish";

import { useTranslation } from "react-i18next";


export default function History({ historyListReport, user }) {
  const [historyList, setHistoryList] = useState(historyListReport || []);
  const [open, setOpen] = useState(false);
  const [activeModal, setActiveModal] = useState("");
  const [idMachine, setIdMachine] = useState("");
  const [checkDate, setCheckDate] = useState("");
  const [t] = useTranslation("global");

  const steps = [
    {
      label: t("process_status.status_1"),
      description: t("process_status.status_1_"),
      performAction: function (status, lean, id_machine, date_user_request) {
        setActiveModal("detailInfo");
        setIdMachine(id_machine);
        setCheckDate(date_user_request);
        setOpen(true);
      },
    },
    {
      label: t("process_status.status_2"),
      description: t("process_status.status_2_"),
      performAction: function (status, lean, id_machine) {
        return "";
      }
    },
    {
      label: t("process_status.status_3"),
      description: t("process_status.status_3_"),
      performAction: function (status, lean, id_machine) {
        return "";
      }
    },
    {
      label: t("process_status.status_4"),
      description: t("process_status.status_4_"),
      performAction: function (status, lean, id_machine, date_user_request) {
        setActiveModal("detailFinish");
        setIdMachine(id_machine);
        setCheckDate(date_user_request);
        setOpen(true);
      },
    },
  ];

  const handleClick = (index) => {
    const isOpen = historyList.includes(index);
    if (isOpen) {
      setHistoryList(historyList.filter((item) => item !== index));
    } else {
      setHistoryList([...historyList, index]);
    }
  };

  return (
    <Stack sx={{ width: "100%" }} spacing={2}>
      {historyListReport === null
        ? []
        : historyListReport.map((item, index) => (
          <List
            sx={{
              width: "100%",
              bgcolor: "primary.dark",
              borderRadius: "5px",
            }}
            component="nav"
            aria-labelledby="nested-list-subheader"
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
                    label={item["date_user_request"].split("T")[1].slice(0,-8) +' '+item["date_user_request"].split("T")[0]}
                    color="primary"
                  />{" "}
                  - <Chip label={item["id_machine"]} color="primary" />
                </Typography>
              </ListItemText>
              {historyList.includes(index) ? (
                <ExpandLess style={{ color: "white" }} />
              ) : (
                <ExpandMore style={{ color: "white" }} />
              )}
            </ListItemButton>
            <Collapse in={historyList.includes(index)} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItem>
                  <Card
                    variant="outlined"
                    sx={{ width: "100%", padding: "0 15px" }}
                  >
                    <Stepper activeStep={item["status"] - 1} orientation="vertical" >
                      {steps.map((step, index) => (
                        <Step key={index}
                          onClick={() =>
                            step.performAction(
                              item.status,
                              user.lean,
                              item.id_machine,
                              item.date_user_request
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
                isCheck={idMachine === item.id_machine && checkDate === item.date_user_request}
                machine={item}
                open={open}
                setOpen={setOpen}
                user={user}
              />
            )}

              {/* Trạng thái 4: Xem thông tin hoàn thành */}
              {activeModal === "detailFinish" && (
              <DetailFinish
                isCheck={idMachine === item.id_machine && checkDate === item.date_user_request}
                machine={item}
                open={open}
                setOpen={setOpen}
                user={user}
              />
            )}
          </List>
        ))}
    </Stack>
  );
}
