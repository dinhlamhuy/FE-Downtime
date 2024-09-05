import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { useTranslation } from "react-i18next";
import ChartDataLabels from 'chartjs-plugin-datalabels'; 

// Đăng ký các plugin cần thiết
ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const ChartPieStyle = {
    padding: "20px",
    height: "100%",
    borderRadius: "40px",
    border: '2px solid #292020'
};

const TitleStyle = {
    textTransform: "uppercase",
    fontSize: "1rem",
    fontWeight: "bold",
};

const ContentStyle2 = {
    display: "flex",
    justifyContent: "center",
    marginTop: "10px",
    maxHeight: "100%",
    height: "90%",
};

const ChartPie = ({ getTop3BrokenMachines }) => {
    const { t } = useTranslation("global");
    const languages = localStorage.getItem("languages");
    const [chart, setChart] = useState({
        labels: [],
        datasets: [
            {
                label: t("personal_info.frequency"),
                data: [],
                backgroundColor: [
                    '#0088FE', '#00C49F', '#FFBB28', '#FF8042'
                ],
                borderColor: "#fff",
                borderWidth: 2
            }
        ],
        options: {
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        boxWidth: 20,
                        padding: 15,
                        color: '#000',
                        font: {
                            size: 14
                        }
                    }
                },
                datalabels: { 
                    color: '#fff',
                    formatter: (value) => `${value}`,
                    font: {
                        weight: 'bold'
                    },
                    anchor: 'center', 
                    align: 'center'  
                }
            }
        }
    });

    useEffect(() => {
        if (getTop3BrokenMachines && getTop3BrokenMachines.length > 0) {
            const label = t("personal_info.frequency");
            setChart(prevChart => ({
                ...prevChart,
                labels: getTop3BrokenMachines.map((data) => data.id_machine),
                datasets: [{
                    ...prevChart.datasets[0],
                    label, 
                    data: getTop3BrokenMachines.map((data) => Number(data.Time))
                }]
            }));
        } else {
           
            setChart(prevChart => ({
                ...prevChart,
                labels: [],
                datasets: [{
                    ...prevChart.datasets[0],
                    data: []
                }]
            }));
        }
    }, [getTop3BrokenMachines, languages, t]);

    return (
        <Box sx={ChartPieStyle}>
            <Typography sx={{ ...TitleStyle, textAlign: 'center', color: '#2196F3', fontSize: '1rem', }} variant="h4">
                {t("personal_info.top_breakdown")}
            </Typography>
            <Box sx={ContentStyle2}>
                {chart.labels.length > 0 ? (
                    <Pie data={chart} options={chart.options} />
                ) : (
                    <Typography>No Data</Typography>
                )}
            </Box>
        </Box>
    );
}

export default ChartPie;
