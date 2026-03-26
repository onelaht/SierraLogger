import {AgCharts} from "ag-charts-react";
import {
    AgChartOptions,
} from "ag-charts-community";
import {useMemo} from "react";
import {Box, Grid, Typography} from "@mui/material";
import {useAccount} from "../Providers/ProviderAccount";
import {Row} from "../Types/Row";
import {toUpper} from "lodash";
import WarningTemplate from "./Templates/WarningTemplate";


interface chartData {
    title: string,
    value: number
}

export default function PerformanceChart() {
    const {rowData} = useAccount();

    // get win and loss
    const getWLData:chartData[] = useMemo(():chartData[] => {
        // get pl account col
        const profitLoss:number[] = []
        rowData.forEach((i) => {
            if("Profit/Loss (C)" in i)
                (typeof i["Profit/Loss (C)"] === "string")
                    ? profitLoss.push(parseFloat(i["Profit/Loss (C)"] as string))
                    : profitLoss.push(i["Profit/Loss (C)"])
        })
        // counter for won and loss
        let won:number = 0;
        let loss:number = 0;
        // loop through pl ool
        profitLoss.forEach((i:number) => {
            if(i < 0) loss++;
            else won++;
        })
        // create chart data type
        return [
            {title: "Won", value: won},
            {title: "Loss", value: loss}
        ]
    }, [rowData])

    // get symbols used
    const getSymbolData= useMemo(():chartData[] => {
        const indices = new Map<string, number>(
            new Map([
                ["ES", 0],
                ["NQ", 0],
                ["RTY", 0],
                ["YM", 0]
            ])
        )
        // get columns
        const symbols:string[] = []
        rowData.forEach((i:Row) => {
            if("Symbol" in i && typeof i["Symbol"] === "string")
                symbols.push(i["Symbol"])
        })
        // loop through symbol col arr
        symbols.forEach((i:string) => {
            // set symbol to uppercase
            const symbol = toUpper<string>(i);
            // increment if matches symbol
            if(symbol.includes("ES")) {
                let current:number = indices.get("ES") ?? 0;
                indices.set("ES", current + 1);
            }
            else if(symbol.includes("NQ")) {
                let current:number = indices.get("NQ") ?? 0;
                indices.set("NQ", current + 1);
            }
            else if(symbol.includes("RTY")) {
                let current:number = indices.get("RTY") ?? 0;
                indices.set("RTY", current + 1);
            }
            else if(symbol.includes("YM")) {
                let current:number = indices.get("YM") ?? 0;
                indices.set("YM", current + 1);
            }
        })
        const data:chartData[] = [];
        // ignore if value is 0
        indices.forEach((v, k) => {if(v > 0) data.push({title: k, value: v})})
        return data;
    }, [rowData])

    // get trade types (long or short)
    const getTradeTypeData = useMemo(():chartData[] => {
        // get trade type col
        const tradesType:string[] = [];
        rowData.forEach((i) => {
            if("Trade Type" in i && typeof i["Trade Type"] === "string")
                tradesType.push(i["Trade Type"])
        })
        // track trade typ
        let short:number = 0;
        let long:number = 0;
        // loop through trade type arr
        tradesType.forEach((i) => {(i === "Short") ? short++ : long++})
        return [
            {title: "Short", value: short},
            {title: "Long", value: long}
        ];
    }, [rowData])

    // pie chart config for win loss data
    const wlPieChart = useMemo<AgChartOptions>(() => {
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

    // pie chart config for symbol used data
    const symbolPieChart = useMemo<AgChartOptions>(() => {
        return {
            data: getSymbolData,
            title: {text: "Symbols Used"},
            series: [
                {
                    type: "pie",
                    angleKey: "value",
                    calloutLabelKey: "title",
                    sectorLabelKey: "value",
                }
            ]
        }
    }, [getSymbolData])

    // pie chart config for type data data
    const tradeTypePieChart = useMemo<AgChartOptions>(() => {
        return {
            data: getTradeTypeData,
            title: {text: "Trade Type"},
            series: [
                {
                    type: "pie",
                    angleKey: "value",
                    calloutLabelKey: "title",
                    sectorLabelKey: "value",
                }
            ]
        }
    }, [getTradeTypeData])

    const getCumPL = useMemo(():number => {
        // get pl col
        const pl:number[] = [];
        rowData.forEach((i) => {
            if("Profit/Loss (C)" in i)
                (typeof i["Profit/Loss (C)"] === "string") ? pl.push(parseFloat(i["Profit/Loss (C)"]))
                    : pl.push(i["Profit/Loss (C)"])
        })
        let cumPL:number = 0;
        // loop through pl col
        pl.forEach((i) => {
            cumPL += i;
        })
        return cumPL
    }, [rowData])

    const getMaxProfit = useMemo(():number => {
        // get pl col
        const pl:number[] = [];
        rowData.forEach((i) => {
            if("Profit/Loss (C)" in i)
                (typeof i["Profit/Loss (C)"] === "string") ? pl.push(parseFloat(i["Profit/Loss (C)"]))
                    : pl.push(i["Profit/Loss (C)"])
        })
        let maxProfit:number = Number.MIN_VALUE;
        // loop through pl col
        pl.forEach((i) => { if(maxProfit < i) maxProfit = i;})
        return maxProfit;
    }, [rowData])

    const getMaxLoss = useMemo(():number => {
        // get pl col
        const pl:number[] = [];
        rowData.forEach((i) => {
            if("Profit/Loss (C)" in i)
                (typeof i["Profit/Loss (C)"] === "string") ? pl.push(parseFloat(i["Profit/Loss (C)"]))
                    : pl.push(i["Profit/Loss (C)"])
        })
        let maxLoss:number = Number.MAX_VALUE;
        // loop through pl col
        pl.forEach((i) => { if(maxLoss > i) maxLoss = i;})
        return maxLoss;
    }, [rowData])

    const getAverageProfit = useMemo(():number => {
        // get pl col
        const profits:number[] = [];
        rowData.forEach((i) => {
            let pl:number = 0;
            // normalize col value to number
            if("Profit/Loss (C)" in i)
                pl = (typeof i["Profit/Loss (C)"] === "string") ? parseFloat(i["Profit/Loss (C)"]) : i["Profit/Loss (C)"];
            // add to array if over 0
            if(pl > 0) profits.push(pl);
        })
        // get sum get pl
        let sum:number = 0;
        profits.forEach((i) => {sum += i})
        // return average
        return sum/profits.length;
    }, [rowData])

    const getAverageLoss = useMemo(():number => {
        // get pl col
        const losses:number[] = [];
        rowData.forEach((i) => {
            let pl:number = 0;
            // normalize col value to number
            if("Profit/Loss (C)" in i)
                pl = (typeof i["Profit/Loss (C)"] === "string") ? parseFloat(i["Profit/Loss (C)"]) : i["Profit/Loss (C)"];
            // add to array if over 0
            if(pl < 0) losses.push(pl);
        })
        // get sum get pl
        let sum:number = 0;
        losses.forEach((i) => {sum += i})
        // return average
        return sum/losses.length;
    }, [rowData])

    const getProfitFactor = useMemo(():number => {
        return getAverageProfit/Math.abs(getAverageLoss);
    }, [getAverageProfit, getAverageLoss])

    return (
        <>
            {(!rowData || rowData.length === 0) ?
                <WarningTemplate caption={"No account selected"}/>
            :
                <Box height="auto" width="auto" margin="1rem">
                    <Grid container spacing={3} justifyItems="center">
                        <Grid size={4}>
                            <AgCharts options={wlPieChart}/>
                        </Grid>
                        <Grid size={4}>
                            <AgCharts options={symbolPieChart}/>
                        </Grid>
                        <Grid size={4}>
                            <AgCharts options={tradeTypePieChart}/>
                        </Grid>

                        <Grid size={4}>
                            <Box border={1} width="100%" height="100%" justifyItems="center" margin="0.5rem">
                                <Typography>Profit Factor</Typography>
                                <Typography variant="h5">{getProfitFactor.toFixed(2)}</Typography>
                            </Box>
                        </Grid>

                        <Grid size={4}>
                            <Box border={1} width="100%" height="100%" justifyItems="center" margin="0.5rem">
                                <Typography>Average Profit</Typography>
                                <Typography variant="h5">$ {getAverageProfit.toFixed((2))}</Typography>
                            </Box>
                        </Grid>

                        <Grid size={4}>
                            <Box border={1} width="100%" height="100%" justifyItems="center" margin="0.5rem">
                                <Typography>Average Loss</Typography>
                                <Typography variant="h5">$ {getAverageLoss.toFixed(2)}</Typography>
                            </Box>
                        </Grid>

                        <Grid size={4}>
                            <Box border={1} width="100%" height="100%" justifyItems="center" margin="0.5rem">
                                <Typography>Current PL</Typography>
                                <Typography variant="h5">$ {getCumPL.toFixed(2)}</Typography>
                            </Box>
                        </Grid>

                        <Grid size={4}>
                            <Box border={1} width="100%" height="100%" justifyItems="center" margin="0.5rem">
                                <Typography>Max Profit</Typography>
                                <Typography variant="h5">$ {getMaxProfit.toFixed(2)}</Typography>
                            </Box>
                        </Grid>

                        <Grid size={4}>
                            <Box border={1} width="100%" height="100%" justifyItems="center" margin="0.5rem">
                                <Typography>Max Loss</Typography>
                                <Typography variant="h5">$ {getMaxLoss.toFixed(2)}</Typography>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            }
        </>
    )
}