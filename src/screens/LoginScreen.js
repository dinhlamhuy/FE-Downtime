import React, { useState, useEffect } from "react";
import {
    Button,
    TextField,
    Box,
    Typography,
    Paper,
    MenuItem,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login, setErrorCode } from "../redux/features/auth";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Toast } from "../utils/toast";
import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";

import { useTranslation } from "react-i18next";

const ContainerStyle = {
    position: "relative",
    width: "100%",
    height: "100vh",
};

const PaperStyle = {
    minWidth: "300px",
    maxWidth: "325px",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    padding: 20,
};

var firebaseConfig = {
    apiKey: "AIzaSyAk17G8hWfCK2y5zct66gitNEzCkT3c6i8",
    authDomain: "downtime-1a6e1.firebaseapp.com",
    projectId: "downtime-1a6e1",
    storageBucket: "downtime-1a6e1.appspot.com",
    messagingSenderId: "1092351827822",
    appId: "1:1092351827822:web:6b597128a1c52f5b396b7f",
};

initializeApp(firebaseConfig);

const messaging = getMessaging();

export default function LoginScreen() {
    const auth = useSelector((state) => state.auth);
    const [tokens, setToken] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [t, i18n] = useTranslation("global");
    const languages = localStorage.getItem('languages');

    if (languages === null) {
        localStorage.setItem("languages", "EN");
    }

    const [selectedLanguage, setSelectedLanguage] = useState(languages === null ? "EN" : languages);

    const handleChange = (event) => {
        setSelectedLanguage(event.target.value);
        i18n.changeLanguage(event.target.value);
        localStorage.setItem("languages", event.target.value);
    };

    getToken(messaging, {
        vapidKey:
            "BAiv-wc-I-R6HuZjofMN1ucA0TLItWFBIASkS2-3bR-_7c53VhujU_WGVPQqI4gGufegd4ANVKvLqzDqzOAvpGc",
    })
        .then((currentToken) => {
            if (currentToken) {
                console.log("current token for client: ", currentToken);
                // Perform any other neccessary action with the token
                // Toast.fire({
                //   icon: "success",
                //   title: "Accepted for notification",
                // });
                setToken(currentToken);
                return currentToken;
            } else {
                // Show permission request UI
                Toast.fire({
                    icon: "error",
                    title:
                        "No registration token available. Request permission to generate one.",
                });
            }
        })
        .catch((err) => {
            console.log("An error occurred while retrieving token. ", err);
        });

    const validationSchema = Yup.object().shape({
        username: Yup.string().required(t("login.validate_username")),
        password: Yup.string().required(t("login.validate_password")),
        factory: Yup.string().required(t("login.validate_factory")),
    });

    const formik = useFormik({
        initialValues: {
            username: "",
            password: "",
            factory: "",
        },
        validationSchema,
        onSubmit: (data) => {
            const { username, password, factory } = data;
            const language = selectedLanguage;
            dispatch(login({ username, password, factory, token: tokens, language }));
        },
    });



    useEffect(() => {

        if (auth.errorCode !== 0 && auth.errorCode !== null) {
            Toast.fire({
                icon: 'error',
                title: auth.errorMessage,
            })
        }

        dispatch(setErrorCode(0));

        const permission = auth.user?.permission;

        switch (permission) {
            case 0:
                navigate("/dashboard");
                break;
            case 1:
                navigate("/electric");
                break;
            case 2:
                navigate("/electric/user");
                break;
            case 3:
                navigate("/product");
                break;
            default:
                navigate("/");
                break;
        }
    }, [auth, navigate, dispatch]);

    return (
        <div style={ContainerStyle}>
            <Paper elevation={8} style={PaperStyle}>
                <Box
                    sx={{
                        marginTop: 3,
                    }}
                >
                    <Box component="form" onSubmit={formik.handleSubmit}>
                        <Typography
                            component="h1"
                            variant="h4"
                            style={{ color: "#1976d2", fontWeight: "600" }}
                            textAlign="center"
                        >
                            {t("login.header")}
                        </Typography>
                        <Typography
                            variant="div"
                            color="#aeaeae"
                            display="block"
                            textAlign="center"
                        >
                            {t("login.title")}
                        </Typography>

                        <TextField
                            type="text"
                            name="username"
                            fullWidth
                            label={t("login.account")}
                            margin="normal"
                            className={
                                formik.errors.username && formik.touched.username
                                    ? "is-invalid"
                                    : ""
                            }
                            error={formik.errors.username && formik.touched.username === true}
                            helperText={
                                formik.errors.username && formik.touched.username
                                    ? formik.errors.username
                                    : null
                            }
                            onChange={formik.handleChange}
                            value={formik.values.username}
                        />

                        <TextField
                            type="password"
                            name="password"
                            fullWidth
                            label={t("login.password")}
                            margin="normal"
                            className={
                                formik.errors.password && formik.touched.password
                                    ? "is-invalid"
                                    : ""
                            }
                            error={formik.errors.password && formik.touched.password === true}
                            helperText={
                                formik.errors.password && formik.touched.password
                                    ? formik.errors.password
                                    : null
                            }
                            onChange={formik.handleChange}
                            value={formik.values.password}
                        />

                        <TextField
                            select
                            name="factory"
                            fullWidth
                            label={t("login.factory")}
                            margin="normal"
                            className={
                                formik.errors.factory && formik.touched.factory
                                    ? "is-invalid"
                                    : ""
                            }
                            error={formik.errors.factory && formik.touched.factory === true}
                            helperText={
                                formik.errors.factory && formik.touched.factory
                                    ? formik.errors.factory
                                    : null
                            }
                            onChange={formik.handleChange}
                            value={formik.values.factory}
                        >
                            <MenuItem value="LYV">LYV</MenuItem>
                            <MenuItem value="LHG">LHG</MenuItem>
                            <MenuItem value="LVL">LVL</MenuItem>
                            <MenuItem value="LYM">LYM</MenuItem>
                        </TextField>

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 2, mb: 2 }}
                        >
                            {t("login.login")}
                        </Button>
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "10px", marginTop: "10px" }}>
                        <Typography sx={{ fontSize: "14px", color: "#aeaeae" }}> {t("login.language")}</Typography>
                        <TextField
                            select
                            name="languages"
                            size="small"
                            variant="standard"
                            sx={{ width: "20%", textAlign: "center" }}
                            InputProps={{ style: { color: '#1565c0', fontSize: "14px" } }}
                            value={selectedLanguage}
                            onChange={handleChange}
                        >
                            <MenuItem value="EN">EN</MenuItem>
                            <MenuItem value="VN">VN</MenuItem>
                        </TextField>
                    </Box>

                </Box>
            </Paper>
        </div>
    );
}
