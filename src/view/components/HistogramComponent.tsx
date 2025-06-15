import {Box, Group, Paper} from "@mantine/core";
import React, {RefObject, useState} from "react";
import * as Chart from 'chart.js';
import { Line } from 'react-chartjs-2';

Chart.Chart.register(
    Chart.CategoryScale,
    Chart.LinearScale,
    Chart.PointElement,
    Chart.LineElement,
    Chart.Title,
    Chart.Tooltip,
    Chart.Legend);

interface HistogramComponentProps {
    histogramData: number[][] | undefined;
}

export default function HistogramComponent(props: HistogramComponentProps) {

    if(!props.histogramData) {
        return (<></>);
    }

    const labels = Array.from({length: 256}, (_, i) => i.toString());
    const data = {
        labels: labels,
        datasets: [
            {
                label: 'Red',
                data: props.histogramData[0],
                borderColor: 'red',
                backgroundColor: 'red',
                pointRadius: 0
            },
            {
                label: 'Green',
                data: props.histogramData[1],
                borderColor: 'green',
                backgroundColor: 'green',
                pointRadius: 0
            },
            {
                label: 'Blue',
                data: props.histogramData[2],
                borderColor: 'blue',
                backgroundColor: 'blue',
                pointRadius: 0
            }
        ]
    };

    const options: Chart.ChartOptions<'line'> = {
        aspectRatio: 3.5,
        maintainAspectRatio: true,
        scales: {
            x: {display: false},
            y: {display: false},
        },
        plugins: {
            tooltip: {
                enabled: false
            },
            legend: {
                labels: {

                },
                position: 'right' as const,

            },
            title: {
                display: false
            },
        },
    };

    return (
        <Paper shadow="sm">
            <Group justify="flex-start" gap="sm">
                <Box style={{width: '100%', border: '1px solid', borderRadius: '4px', display: 'flex', justifyContent: 'center'}}>
                    <Line data={data} options={options} />
                </Box>
            </Group>
        </Paper>
    );
}
