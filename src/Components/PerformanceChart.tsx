import {AgCharts} from "ag-charts-react";
import {
    AgChartOptions,
} from "ag-charts-community";
import {useCallback, useEffect, useMemo, useState} from "react";
import {Box, Typography} from "@mui/material";
import {useAccount} from "../Providers/ProviderAccount";


interface chartData {
    title: string,
    value: number
}

export default function PerformanceChart() {

    const {rowData} = useAccount();

    const getRow = useCallback((column:string):number[] =>  {
        const col:number[] = [];
        rowData.forEach((i) => {
            if(column in i)
                if(typeof i[column] === "string")
                    col.push(parseFloat(i[column] as string))
        })
        return col
    }, [rowData])

    const getWLData:chartData[] = useMemo(() => {
        // get pl account col
        const profitLoss = getRow("Profit/Loss (C)");
        // counter for won and loss
        let won:number = 0;
        let loss:number = 0;
        // loop through pl ool
        profitLoss.forEach((i:number) => {
            if(i < 0) loss++;
            else won++;
        })
        // create chart data type
        const temp:chartData[] = [
            {title: "Won", value: won},
            {title: "Loss", value: loss}
        ]
        return temp;
    }, [getRow])

    const WLPieChart = useMemo<AgChartOptions>(() => {
        return {
            data: getWLData,
            title: {text: "Winning/Losing Trades"},
            series: [
                {
                    type: "pie",
                    angleKey: "value",
                    calloutLabelKey: "title",
                    sectorLabelKey: "value",
                }
            ]
        }
    }, [getWLData])

    return (
        <>
            {(!rowData || rowData.length === 0) ?
                <Typography> Nothing </Typography>
            :
                <Box sx={{display: "flex", flexDirection: "row", justifyContent: "center"}}>
                    <AgCharts options={WLPieChart}/>
                </Box>
            }
        </>
    )
}