import React, { useEffect, useState } from "react";
import { Box, Paper } from "@mui/material";
// import BreadCrumb from "../../components/BreadCrumb";
import Scanner from "../../components/Scanner";
import Form from "../../components/Form";
import { useDispatch, useSelector } from "react-redux";
import { get_info_machine } from "../../redux/features/machine";
import { Radio, RadioGroup, FormControlLabel } from "@mui/material";
import { useTranslation } from "react-i18next";

import { setErrorCode } from "../../redux/features/electric";
import BreadCrumb2 from "../../components/BreadCrumb2";
import FormRelocateScanner from "../../components/FormRelocateScanner";

const PaperStyle = {
  position: "relative",
  marginTop: "10px",
  padding: "10px",
};

const RelocateMachine=()=>{
    const auth = useSelector((state) => state.auth);
      const [scanOption, setScanOption] = useState("barcode");
      const [scannerLineResult, setScannerLineResult] = useState("");
      const [t] = useTranslation("global");
    
      const dispatch = useDispatch();
      useEffect(() => {
        setScannerLineResult('')
        dispatch(setErrorCode(null, ""));
      }, []);
      useEffect(() => {
        const fetchInfoMachine = async () => {
          const { factory } = auth.user;
          const id_machine = scannerLineResult;
    
          await dispatch(get_info_machine(factory, id_machine));
        };
    
        if (scannerLineResult) {
          fetchInfoMachine();
        }
      }, [dispatch, scannerLineResult, auth.user]);
    return(
        <Box component="div">
      {/* <BreadCrumb breadCrumb={'Báo lỗi'}  /> */}
      <BreadCrumb2  breadCrumbs={[ t("sidebar.relocate_the_machine")]} back={'true'} />
      <Box
        component="div"
        sx={{ display: "block", margin: "0 auto", maxWidth: "500px" }}
      >
        {scannerLineResult === "" && (
          <RadioGroup
            aria-label="scan-option"
            name="scan-option"
            value={scanOption}
            onChange={(e) => setScanOption(e.target.value)}
            sx={{ flexDirection: "row" }}
          >
            <FormControlLabel
              value="barcode"
              control={<Radio />}
              label={t("info_machine_damage.scan_qr_bar_code")}
            />
            <FormControlLabel
              value="form"
              control={<Radio />}
              label={t("info_machine_damage.form_scan")}
            />
          </RadioGroup>
        )}

        <Paper sx={PaperStyle} elevation={5}>
          {scannerLineResult !== "" ? (
            <Form
              formText={t("info_machine_damage.form_request")}
              scannerResult={scannerLineResult}
              setScannerResult={setScannerLineResult}
              user={auth.user}
            />
          ) : scanOption === "barcode" ? (
            <Scanner
              scanner={t("info_machine_damage.scan_qr_bar_code")}
              scannerResult={scannerLineResult}
              setScannerResult={setScannerLineResult}
              idMachine={"scanner-product"}
            />
          ) : (
            <FormRelocateScanner
              setScannerResult={setScannerLineResult}
              scanner={t("info_machine_damage.form_scan")}
            />
          )}
        </Paper>
      </Box>
    </Box>
    )
}
export default RelocateMachine;