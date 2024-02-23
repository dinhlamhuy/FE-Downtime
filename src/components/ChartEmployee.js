import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';

import { useTranslation } from "react-i18next";

ChartJS.register(ArcElement, Tooltip, Legend);

const ChartEmployeeStyle = {
    padding: "15px 30px 15px 30px",
    margin: "5px",
    borderRadius: "30px",
    border: "3px solid #ccc"
}

const TitleStyle = {
    textTransform: "uppercase",
    fontSize: "14px",
    fontWeight: "bold",
}

const ContentStyle = {
    display: "flex",
    justifyContent: "center",
    marginTop: "10px",
    maxHeight: "400px"
}

const ChartEmployee = ({ arrPercentfn }) => {
    const [t] = useTranslation("global");
    const languages = localStorage.getItem('languages');
    const [chart, setChart] = useState({
        labels: [],
        datasets: [
            {
                label: "",
                data: [],
                backgroundColor: [
                    '#0088FE', '#00C49F', '#FFBB28', '#FF8042',
                    "#25CCF7", "#FD7272", "#54a0ff", "#00d2d3",
                    "#1abc9c", "#2ecc71", "#3498db", "#9b59b6", "#34495e",
                    "#16a085", "#27ae60", "#2980b9", "#8e44ad", "#2c3e50",
                    "#f1c40f", "#e67e22", "#e74c3c", "#ecf0f1", "#95a5a6",
                    "#f39c12", "#d35400", "#c0392b", "#bdc3c7", "#7f8c8d",
                    "#55efc4", "#81ecec", "#74b9ff", "#a29bfe", "#dfe6e9",
                    "#00b894", "#00cec9", "#0984e3", "#6c5ce7", "#ffeaa7",
                    "#fab1a0", "#ff7675", "#fd79a8", "#fdcb6e", "#e17055",
                    "#d63031", "#feca57", "#5f27cd", "#54a0ff", "#01a3a4"
                ],
                borderColor: "#fff",
                borderWidth: 2
            }
        ],
        options: {
            plugins: {
                legend: {
                    position: "bottom"
                },
                datalabels: {
                    color: '#fff',
                    formatter: (value) => {
                        // Customize the value display format as per your requirement
                        return Math.round(value) + '%';
                    }
                }
            }
        }
    });

    useEffect(() => {
        if (arrPercentfn !== undefined) {
            setChart(prevChart => ({
                ...prevChart,
                labels: arrPercentfn?.map((data) => languages === "EN" ? data.skill_en : data.skill_vn),
                datasets: [
                    {
                        ...prevChart.datasets[0],
                        data: arrPercentfn?.map((data) => Number(data.value))
                    }
                ]
            }));
        }
    }, [setChart, arrPercentfn, languages]);

    return (
        <Box sx={ChartEmployeeStyle}>
            <Typography sx={TitleStyle} variant="h4" component="div">
                {t("personal_info.repair_method")}
            </Typography>
            <Box sx={ContentStyle}>
                <Pie data={chart} options={chart.options} plugins={[ChartDataLabels]} />
            </Box>
        </Box>
    )
}

export default ChartEmployee;