import React, { useEffect, useState } from 'react';
import Scanner from "./Scanner";
import AlertDialog from "./AlertDialog";
import { Box, Radio, RadioGroup, FormControlLabel, Paper } from "@mui/material";
import { useDispatch } from "react-redux";
import { scanner_fix_mechanic, setErrorCode } from "../redux/features/electric";
import { useTranslation } from "react-i18next";
import FormScanner from './FormScanner';
const PaperStyle = {
    position: "relative",
    marginTop: "10px",
    padding: "10px",
};

const ScannerElectric = (props) => {
    const dispatch = useDispatch();
    const { isCheck, idMachine, open, setOpen, scannerResult, setScannerResult, user } = props;

    const [t] = useTranslation("global");
    const [scanOption, setScanOption] = useState("barcode");

    const languages = localStorage.getItem('languages');

    useEffect(() => {
        const { user_name, factory, lean } = user;
        const id_user_mechanic = user_name;
        const status = 3;
        const language = languages;

        if (idMachine === scannerResult) {
            dispatch(
                scanner_fix_mechanic({ id_user_mechanic, id_machine: idMachine, factory, lean, status, language })
            );

            setScannerResult("");
            setOpen(false);
        }

        if (scannerResult !== "" && idMachine !== scannerResult) {
            dispatch(setErrorCode(10001, t("process_status.status_3_alert")));
            setScannerResult("");
        }

    }, [idMachine, dispatch, setScannerResult, scannerResult, setOpen, user, t, languages])

    return (
        <>
            {
                isCheck && scannerResult === "" &&
                <AlertDialog
                    open={open}
                    setOpen={setOpen}
                    headerModal={t("process_status.status_3_header")}
                >
                    <Box
                        component="div"
                        sx={{ display: "block", margin: "0 auto", maxWidth: "500px" }}
                    >
                        {/* Radio button group */}
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
                                label={t("process_status.status_3_scanner")}
                            />
                            <FormControlLabel
                                value="form"
                                control={<Radio />}
                                label={t("process_status.status_3_form_input")}
                            />
                        </RadioGroup>
                        <Paper sx={PaperStyle} elevation={5}>
                        {/* Render Scanner or Form based on the selected option */}
                        {scanOption === "barcode" &&
                            <Scanner
                                idMachine={'scanner-product'}
                                scanner={t("process_status.status_3_scanner")}
                                scannerResult={scannerResult}
                                setScannerResult={setScannerResult}
                            />
                        }
                        {scanOption === "form" &&
                            <FormScanner
                            setScannerResult={setScannerResult}
                            scanner={t("info_machine_damage.form_scan")}
                             /> 
                        }
                        </Paper>
                    </Box>
                </AlertDialog>
            }
        </>
    );
}

export default ScannerElectric;
