import React from 'react';
import {
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
} from "@mui/material";
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

const AlertDialog = (props) => {
    const { open, setOpen, headerModal, children, formik } = props;

    const handleClose = () => {
        setOpen(false);
        if (formik) {
            formik.setTouched({});
            formik.setErrors({});
        }
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            fullWidth
            maxWidth="sm"
        >
            <DialogTitle sx={{ padding: "16px 10px" }}>
                <Typography sx={{ fontWeight: "600", fontSize: "14px" }}>
                    {headerModal}
                </Typography>
            </DialogTitle>
            <IconButton
                aria-label="close"
                onClick={handleClose}
                sx={{
                    position: 'absolute',
                    right: 8,
                    top: 8,
                    color: (theme) => theme.palette.grey[500],
                }}
            >
                <CloseIcon />
            </IconButton>
            <DialogContent dividers sx={{ padding: "10px 10px 20px" }}>
                {children}
            </DialogContent>
        </Dialog>
    )
}

export default AlertDialog;