import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { PieChart, Pie, Cell, Legend } from "recharts";

const COLORS = [
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
]

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
        <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
            {`${(percent * 100).toFixed(0)}%`}
        </text>
    );
};

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
}

const ChartEmployee = ({ arrPercentfn }) => {
    const [chart, setChart] = useState([]);

    useEffect(() => {
        setChart([]);
        arrPercentfn?.map((item) => setChart(prevChart => [...prevChart, { "name": item['skill_vn'], "value": Number(item['value']) }]));
    }, [arrPercentfn]);

    return (
        <Box sx={ChartEmployeeStyle}>
            <Typography sx={TitleStyle} variant="h4" component="div">
                avg fix time by category
            </Typography>
            <Box sx={ContentStyle}>
                <PieChart width={250} height={350}>
                    <Pie
                        data={chart}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={renderCustomizedLabel}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                    >
                        {chart.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Legend
                        layout="vertical"
                        verticalAlign="bottom"
                        align="center"
                        iconType="circle"
                    />
                </PieChart>
            </Box>
        </Box>
    )
}

export default ChartEmployee;