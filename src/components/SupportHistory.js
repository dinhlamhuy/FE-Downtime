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
  Chip,
} from "@mui/material";

import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";

import ColorlibStepIcon from "./ColorlibStepIcon";

import Sup_DetailInfo from "./Sup_DetailInfo";
import Sup_DetailFinish from "./Sup_DetailFinish";

import { useTranslation } from "react-i18next";

export default function SupportHistory({ historyListReport, user }) {
  const [historyList, setHistoryList] = useState(historyListReport || []);
  const [open, setOpen] = useState(false);
  const [activeModal, setActiveModal] = useState("");
  const [checkDate, setCheckDate] = useState("");
  const [t] = useTranslation("global");

  const steps = [
    {
        label: 'Cán bộ',
        description: 'Yêu cầu hỗ trợ',
      performAction: function (date_user_request) {
        setActiveModal("detailInfo");
        setCheckDate(date_user_request);
        setOpen(true);
      },
    },
    {
        label: 'Thợ sửa',
        description: 'Xác nhận của thợ',
      performAction: function (status, lean, ) {
        return "";
      },
    },
  
    {
        label:'Thợ sửa',
        description: 'Hoàn thành hỗ trợ',
      performAction: function (status, lean, date_user_request) {
        setActiveModal("detailFinish");
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
  if (
    !historyListReport ||
    !Array.isArray(historyListReport) ||
    historyListReport.length === 0
  ) {
    return null;
  }
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
                      label={
                        item["date_request"]?.split("T")[1].slice(0, -8) +
                        " " +
                        item["date_request"]?.split("T")[0]
                      }
                      color="primary"
                    />{" "}
                    - {" "}{item["Line"]
                      ?( <Chip label={item["Line"]} color="primary" />)
                      : ""}
                  </Typography>
                </ListItemText>
                {historyList.includes(index) ? (
                  <ExpandLess style={{ color: "white" }} />
                ) : (
                  <ExpandMore style={{ color: "white" }} />
                )}
              </ListItemButton>
              <Collapse
                in={historyList.includes(index)}
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
                        activeStep={item["status"] - 1}
                        orientation="vertical"
                      >
                        {steps.map((step, index) => (
                          <Step
                            key={index}
                            onClick={() =>
                              step.performAction(
                                item.status,
                                user.lean,
                                item.date_request
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
                <Sup_DetailInfo
                  task={item}
                  open={open}
                  setOpen={setOpen}
                  user={user}
                />
              )}

              {/* Trạng thái 3: Xem thông tin hoàn thành */}
              {activeModal === "detailFinish" && (
                <Sup_DetailFinish
                  task={item}
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
