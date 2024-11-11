import React, { useState } from "react";
import AlertDialog from "./AlertDialog";
import { useDispatch } from "react-redux";
import { accept_support } from "../redux/features/electric";
import { TextField, Box, Button, Stack } from "@mui/material";
import { useTranslation } from "react-i18next";

const Sup_FinishTaskElectric = (props) => {
  const dispatch = useDispatch();
  const { open, setOpen, user, task } = props;
  const [t] = useTranslation("global");
  const [inputValue, setInputValue] = useState("");
  const languages = localStorage.getItem("languages");

  const handleSubmit = async () => {
    const { user_name, factory } = user;
    const { id, Line } = task;
    const status = 3;
    const language = languages;

    await dispatch(accept_support({
        id: id,
        factory: factory,
        line: Line,
        status: status,
        user_machine: user_name,
        support_detail: inputValue, 
        lang: language
    }));
    
    setOpen(false);
  };

  const onClose = () => {
    setOpen(false);
  };

  return (
    <AlertDialog open={open} setOpen={setOpen} headerModal={t("process_status.status_4_header")}>
      <Box component="div" sx={{ textAlign: "center", marginBottom: "20px" }}>
        <TextField
          name="support_detail"
          label={t("process_status.enter_details")}
          variant="outlined"
          fullWidth
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          size="small"
        />
      </Box>
      <Stack direction="row" spacing={2} sx={{ justifyContent: "center" }}>
        <Button variant="contained" color="primary" size="small" onClick={handleSubmit}>
          {t("process_status.status_4_confirm")}
        </Button>
        <Button variant="contained" color="error" size="small" onClick={onClose}>
          {t("process_status.status_4_close")}
        </Button>
      </Stack>
    </AlertDialog>
  );
};

export default Sup_FinishTaskElectric;
