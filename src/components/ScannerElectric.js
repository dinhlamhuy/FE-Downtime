import React, { useEffect } from 'react';
import Scanner from "./Scanner";
import AlertDialog from "./AlertDialog";
import { Box } from "@mui/material";
import { useDispatch } from "react-redux";
import { scanner_fix_mechanic, setErrorCode } from "../redux/features/electric";
import { useTranslation } from "react-i18next";


const ScannerElectric = (props) => {
    const dispatch = useDispatch();
    const { isCheck, idMachine, open, setOpen, scannerResult, setScannerResult, user } =
        props;

    const [t] = useTranslation("global");

    const languages = localStorage.getItem('languages');

    useEffect(() => {
        const id_machine = idMachine;
        const { user_name, factory, lean } = user;
        const id_user_mechanic = user_name;
        const status = 3;
        const language = languages;

        if (id_machine === scannerResult) {
            dispatch(
                scanner_fix_mechanic({ id_user_mechanic, id_machine, factory, lean, status, language })
            );

            setScannerResult("");
            setOpen(false);
        }

        if (scannerResult !== "" && id_machine !== scannerResult) {
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
                        <Scanner
                            idMachine={idMachine}
                            scanner={t("process_status.status_3_scanner")}
                            scannerResult={scannerResult}
                            setScannerResult={setScannerResult}
                        />
                    </Box>
                </AlertDialog>
            }
        </>

    );
}

export default ScannerElectric;