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
  const [selectedProduct, setSelectedProduct] = useState(null); // State mới để lưu trữ product được chọn

  const [t] = useTranslation("global");

  const steps = [
    {
      label: t('banner.owner_mechanic'),
      description: t('process_status.supportReq'),
      performAction: function (product) {
        setActiveModal("detailInfo");
        setOpen(true);
        setSelectedProduct(product); // Lưu product vào state
      },
    },
    {
      label: t('process_status.status_2'),
      description:  t('process_status.status_2_confirm'),
      performAction: function (product, status, lean) {
        if (status === 1 && (lean === "TD" || lean === "TM")) {
          setActiveModal("confirm");
          setOpen(true);
          setSelectedProduct(product);
        }
      },
    },
    {
      label: t('process_status.status_2'),
      description:  t('process_status.supportFin'),
      performAction: function (product, status, lean) {
        if (status === 2 && (lean === "TD" || lean === "TM")) {
          setActiveModal("finish");
          setOpen(true);
          setSelectedProduct(product);
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

  return (
    <Stack sx={{ width: "100%" }} spacing={2}>
      {listReport?.map((product, index) => (
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
              <Typography variant="body" style={{ color: "white", fontSize: "4px" }}>
                <Chip
                  label={
                    product["date_request"] &&
                    product["date_request"].split("T")[1].slice(0, -8) +
                    " " + product["date_request"].split("T")[0]
                  }
                  color="primary"
                />{" "}
                - {" "}{product["Line"] && <Chip label={product["Line"]} color="primary" />}
              </Typography>
            </ListItemText>
            {openProgress.includes(index) ? (
              <ExpandLess style={{ color: "white" }} />
            ) : (
              <ExpandMore style={{ color: "white" }} />
            )}
          </ListItemButton>
          <Collapse in={openProgress.includes(index)} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItem>
                <Card variant="outlined" sx={{ width: "100%", padding: "0 15px" }}>
                  <Stepper activeStep={product["status"] - 1} orientation="vertical">
                    {steps.map((step, stepIndex) => (
                      <Step
                        key={stepIndex}
                        onClick={() => {
                          step.performAction(product, product.status, user.lean);
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

          {/* Render các modal */}
          {activeModal === "detailInfo" && selectedProduct && (
            <Sup_DetailInfo
              task={selectedProduct} // Truyền product đã chọn
              open={open}
              setOpen={setOpen}
              user={user}
            />
          )}
          {activeModal === "confirm" && selectedProduct && (
            <Sup_ConfirmModal
              open={open}
              setOpen={setOpen}
              user={user}
              task={selectedProduct}
            />
          )}
          {activeModal === "finish" && selectedProduct && (
            <Sup_FinishTaskElectric
              open={open}
              setOpen={setOpen}
              user={user}
              task={selectedProduct}
            />
          )}
        </List>
      ))}
    </Stack>
  );
};
export default SupportStatus; 