import React, { useEffect, useState } from "react";
import { Box, Paper } from "@mui/material";
import BreadCrumb from "../../components/BreadCrumb";
import Scanner from "../../components/Scanner";
import Form from "../../components/Form";
import { useDispatch, useSelector } from "react-redux";
import { get_info_machine } from "../../redux/features/machine";
import { Radio, RadioGroup, FormControlLabel } from "@mui/material";
import { useTranslation } from "react-i18next";
import FormScanner from '../../components/FormScanner';

const PaperStyle = {
    position: "relative",
    marginTop: "10px",
    padding: "10px",
};

const InfoMachineScreen = () => {
    const auth = useSelector((state) => state.auth);
    const [scanOption, setScanOption] = useState("barcode");
    const [scannerResult, setScannerResult] = useState("");
    const [t] = useTranslation("global");

    const dispatch = useDispatch();

    useEffect(() => {
        const fetchInfoMachine = async () => {
            const { factory } = auth.user;
            const id_machine = scannerResult;

            await dispatch(get_info_machine(factory, id_machine));
        }

        if (scannerResult) {
            fetchInfoMachine();
        }
    }, [dispatch, scannerResult, auth.user]);

    return (
        <Box component="div">
            <BreadCrumb breadCrumb={t("info_machine_damage.info_machine_damage")} />
            <Box
                component="div"
                sx={{ display: "block", margin: "0 auto", maxWidth: "500px" }}
            >
                {scannerResult === "" && (
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
                    {scannerResult !== "" ? (
                        <Form
                            formText={t("info_machine_damage.form_request")}
                            scannerResult={scannerResult}
                            setScannerResult={setScannerResult}
                            user={auth.user}
                        />
                    ) : (
                        scanOption === "barcode" ? (
                            <Scanner
                                scanner={t("info_machine_damage.scan_qr_bar_code")}
                                scannerResult={scannerResult}
                                setScannerResult={setScannerResult}
                                idMachine={"scanner-product"}
                            />
                        ) : (
                            <FormScanner
                                setScannerResult={setScannerResult}
                                scanner={t("info_machine_damage.form_scan")}
                            />
                        )
                    )}
                </Paper>
            </Box>
        </Box>
    );
};

export default InfoMachineScreen;
