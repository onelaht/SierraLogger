import {AgCharts} from "ag-charts-react";
import {
    AgChartOptions,
    LegendModule,
    ModuleRegistry,
    PieSeriesModule,
} from "ag-charts-community";
import {useState} from "react";
import {Box} from "@mui/material";

export default function PerformanceChart() {

    const WLdata =  [
        {title: "Wins", value: 51},
        {title: "Losses", value: 49}
    ];
    const SymbolData = [
        {title: "ES", value: 80},
        {title: "NQ", value: 15},
        {title: "RTY", value: 5}
    ]
    const TradeTypeData = [
        {title: "Short", value: 75},
        {title: "Long", value: 25}
    ]
    const [WLPieChart] = useState<AgChartOptions>({
        data: WLdata,
        title: {text: "Winning/Losing Trades"},
        series: [
            {
                type: "pie",
                angleKey: "value",
                calloutLabelKey: "title",
                sectorLabelKey: "value",
            }
        ]
    })
    const [SymbolPieChart] = useState<AgChartOptions>({
        data: SymbolData,
        title: {text: "Symbols Used"},
        series: [
            {
                type: "pie",
                angleKey: "value",
                calloutLabelKey: "title",
                sectorLabelKey: "value",
            }
        ]
    })
    const [TradeTypePieChart] = useState<AgChartOptions>({
        data: TradeTypeData,
        title: {text: "Trade Type"},
        series: [
            {
                type: "pie",
                angleKey: "value",
                calloutLabelKey: "title",
                sectorLabelKey: "value",
            }
        ]
    })

    return (
        <Box sx={{display: "flex", flexDirection: "row", justifyContent: "center"}}>
            <AgCharts options={WLPieChart}/>
            <AgCharts options={SymbolPieChart}/>
            <AgCharts options={TradeTypePieChart}/>
        </Box>
    )
}