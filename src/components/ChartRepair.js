import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { useTranslation } from "react-i18next";
import ChartDataLabels from 'chartjs-plugin-datalabels';

// Đăng ký các plugin cần thiết
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartDataLabels);

const ChartRepairStyle = {
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

const ContentStyle = {
    display: "flex",
    justifyContent: "center",
    marginTop: "10px",
    maxHeight: "100%",
    height: "90%"
};

const ChartRepair = ({ getTop5LongestRepairTime }) => {
    const { t } = useTranslation("global");
    const languages = localStorage.getItem('languages') || 'EN';
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [
            {
                label: t("personal_info.minutes"),
                data: [],
                backgroundColor: '#0088FE',
                borderColor: '#fff',
                borderWidth: 2,
            }
        ],
        options: {
            indexAxis: 'y',
            maintainAspectRatio: false,  
            plugins: {
                legend: {
                    position: "bottom"
                },
                datalabels: {
                    color: '#000',
                    font: {
                        weight: 'bold',
                        size: 12,
                    },
                    align: 'end',
                    anchor: 'end',
                    formatter: (value) => value.toFixed(1)
                },
                tooltip: {
                    callbacks: {
                        label: function(tooltipItem) {
                            const value = tooltipItem.raw.toFixed(1); // Round to one decimal
                            const label = t("personal_info.minutes"); // Label "minutes"
                            return `${label}: ${value}`; // Display label and rounded value
                        }
                    }
                }
            },
            scales: {
                x: {
                    beginAtZero: true,
                    ticks: {
                        padding: 10
                    },
                    grid: {
                        borderColor: '#000',
                        borderWidth: 1
                    },
                    border: {
                        color: '#874e4e',
                    }
                },
                y: {
                    ticks: {
                        padding: 10
                    },
                    grid: {
                        borderColor: '#000',
                        borderWidth: 1
                    },
                    border: {
                        color: '#874e4e',
                    }
                }
            },
            layout: {
                padding: {
                    right: 30,
                    left: 20
                }
            },
            barPercentage: 1.5, 
            categoryPercentage: 0.4, 
        }
    });

    useEffect(() => {
        if (getTop5LongestRepairTime && getTop5LongestRepairTime.length > 0) {
            const label = t("personal_info.minutes");
            setChartData(prevData => ({
                ...prevData,
                labels: getTop5LongestRepairTime.map(data => data.id_machine),
                datasets: [{
                    ...prevData.datasets[0],
                    label,
                    data: getTop5LongestRepairTime.map(data => Number(data.Minutes))
                }]
            }));
        } else {
            setChartData(prevData => ({
                ...prevData,
                labels: [],
                datasets: [{
                    ...prevData.datasets[0],
                    data: []
                }]
            }));
        }
    }, [getTop5LongestRepairTime, languages, t]);

    return (
        <Box sx={ChartRepairStyle}>
            <Typography sx={{ ...TitleStyle, textAlign: 'center', color: '#2196F3' }} variant="h4">
                {t("personal_info.top_machine")}
            </Typography>
            <Box sx={ContentStyle}>
                {chartData.labels.length > 0 ? (
                    <Bar data={chartData} options={chartData.options} height={400} width={600} />
                ) : (
                    <Typography>No Data</Typography>
                )}
            </Box>
        </Box>
    );
}

export default ChartRepair;
