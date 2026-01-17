// react
import React, {createContext, ReactNode, useCallback, useContext, useMemo, useRef, useState} from 'react';
// types
import type { Row } from "../Types/Row"
// ag grid
import {AgGridReact} from "ag-grid-react";
import {ColDef, ValueFormatterParams, ValueGetterParams} from "ag-grid-community";
// filter components
import FilterCheckboxSet from "../Filters/FilterCheckboxSet";
import FilterDuration from "../Filters/FilterDuration";
// types and interfaces
import {IAccountData} from "../Types/IAccountData";

interface IGridContextType {
    gridRef: React.RefObject<AgGridReact<Row> | null>;
    rowData: Row[] | null;
    setRowData: React.Dispatch<React.SetStateAction<Row[] | null>>;
    colDefs:ColDef<Row>[];
    setColDefs: React.Dispatch<React.SetStateAction<ColDef<Row>[]>>;
    accounts: Map<string, IAccountData>;
    setAccounts: React.Dispatch<React.SetStateAction<Map<string, IAccountData>>>;
    colFields:string[];
}

const GridContext = createContext<IGridContextType | null>(null);

export default function ProviderGrid({children}:{children: ReactNode}) {
    const gridRef = useRef<AgGridReact<Row> | null>(null);
    const [accounts, setAccounts] = useState<Map<string, IAccountData>>(new Map<string, IAccountData>());
    const [rowData, setRowData] = useState<Row[] | null>(null);
    const convertDuration = useCallback((seconds:number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return [h, m, s]
            .map(v => String(v).padStart(2, "0"))
            .join(":");
    }, [])

    // definitions of grid columns
    // - specifies data type used
    // - specifies filter type
    // - implements apply and reset butttons
    const [colDefs, setColDefs] = useState<ColDef<Row>[] >([
        {
            field: "Entry DateTime",
            cellDataType: "dateTimeString",
            filter: "agDateColumnFilter",
            filterParams: {
                buttons: ["apply", "reset"],
            },
        },
        {
            field: "Exit DateTime",
            cellDataType: "dateTimeString",
            filter: "agDateColumnFilter",
            filterParams: {
                buttons: ["apply", "reset"],
            },
        },
        {
            field: "Duration",
            cellDataType: "number",
            filter: FilterDuration,
            valueGetter: (p:ValueGetterParams) => {return parseInt(p.data?.["Duration"])},
            valueFormatter: (p:ValueFormatterParams) => {return convertDuration(p.value)}
        },
        {
            field: "Symbol",
            cellDataType: "text",
            filter: FilterCheckboxSet,
        },
        {
            field: "Trade Type",
            cellDataType: "text",
            filter: FilterCheckboxSet,
        },
        {
            field: "Entry Price",
            cellDataType: "number",
            filter: "agNumberColumnFilter",
            filterParams: {
                buttons: ["apply", "reset"],
            },
            valueGetter: (p:ValueGetterParams) => {return parseFloat(p.data?.["Entry Price"])},
            valueFormatter: (p:ValueFormatterParams) => {return (p.value?.toFixed(2))}
        },
        {
            field: "Exit Price",
            cellDataType: "number",
            filter: "agNumberColumnFilter",
            filterParams: {
                buttons: ["apply", "reset"],
            },
            valueGetter: (p:ValueGetterParams) => {return parseFloat(p.data?.["Exit Price"])},
            valueFormatter: (p:ValueFormatterParams) => {return (p.value?.toFixed(2))}
        },
        {
            field: "Low Price While Open",
            cellDataType: "number",
            filter: "agNumberColumnFilter",
            filterParams: {
                buttons: ["apply", "reset"],
            },
            valueGetter: (p:ValueGetterParams) => {return parseFloat(p.data?.["Low Price While Open"])},
            valueFormatter: (p:ValueFormatterParams) => {return (p.value?.toFixed(2))}
        },
        {
            field: "High Price While Open",
            cellDataType: "number",
            filter: "agNumberColumnFilter",
            filterParams: {
                buttons: ["apply", "reset"],
            },
            valueGetter: (p:ValueGetterParams) => {return parseFloat(p.data?.["High Price While Open"])},
            valueFormatter: (p:ValueFormatterParams) => {return (p.value?.toFixed(2))}
        },
        {
            field: "Profit/Loss (C)",
            cellDataType: "number",
            filter: "agNumberColumnFilter",
            filterParams: {
                buttons: ["apply", "reset"],
            },
            valueGetter: (p:ValueGetterParams) => {return parseFloat(p.data?.["Profit/Loss (C)"])},
            valueFormatter: (p:ValueFormatterParams) => {return (p.value?.toFixed(2))}
        },
        {
            field: "Max Open Profit (C)",
            cellDataType: "number",
            filter: "agNumberColumnFilter",
            filterParams: {
                buttons: ["apply", "reset"],
            },
            valueGetter: (p:ValueGetterParams) => {return parseFloat(p.data?.["Max Open Profit (C)"])},
            valueFormatter: (p:ValueFormatterParams) => {return (p.value?.toFixed(2))}
        },
        {
            field: "Max Open Loss (C)",
            cellDataType: "number",
            filter: "agNumberColumnFilter",
            filterParams: {
                buttons: ["apply", "reset"],
            },
            valueGetter: (p:ValueGetterParams) => {return parseFloat(p.data?.["Max Open Loss (C)"])},
            valueFormatter: (p:ValueFormatterParams) => {return (p.value?.toFixed(2))}
        },
        {
            field: "Commission (C)",
            cellDataType: "number",
            filter: "agNumberColumnFilter",
            filterParams: {
                buttons: ["apply", "reset"],
            },
            valueGetter: (p:ValueGetterParams) => {return parseFloat(p.data?.["Commission (C)"])},
            valueFormatter: (p:ValueFormatterParams) => {return (p.value?.toFixed(2))}
        },
        {
            field: "Trade Quantity",
            cellDataType: "number",
            filter: "agNumberColumnFilter",
            filterParams: {
                buttons: ["apply", "reset"],
            },
            valueGetter: (p:ValueGetterParams) => {return parseInt(p.data?.["Trade Quantity"])}
        },
        {
            field: "Open Position Quantity",
            cellDataType: "number",
            filter: "agNumberColumnFilter",
            filterParams: {
                buttons: ["apply", "reset"],
            },
            valueGetter: (p:ValueGetterParams) => {return parseInt(p.data?.["Open Position Quantity"])}
        },
        {
            field: "Close Position Quantity",
            cellDataType: "number",
            filter: "agNumberColumnFilter",
            filterParams: {
                buttons: ["apply", "reset"],
            },
            valueGetter: (p:ValueGetterParams) => {return parseInt(p.data?.["Close Position Quantity"])}
        },
        {
            field: "Max Open Quantity",
            cellDataType: "number",
            filter: "agNumberColumnFilter",
            filterParams: {
                buttons: ["apply", "reset"],
            },
            valueGetter: (p:ValueGetterParams) => {return parseInt(p.data?.["Max Open Quantity"])}
        },
        {
            field: "Max Closed Quantity",
            cellDataType: "number",
            filter: "agNumberColumnFilter",
            filterParams: {
                buttons: ["apply", "reset"],
            },
            valueGetter: (p:ValueGetterParams) => {return parseInt(p.data?.["Max Closed Quantity"])}
        },
        {
            field: "Entry Efficiency",
            cellDataType: "number",
            filter: "agNumberColumnFilter",
            valueGetter: (p:ValueGetterParams) => {return parseFloat(p.data?.["Entry Efficiency"])},
            valueFormatter: (p:any) => {return (p.value).toFixed(2) + "%"}
        },
        {
            field: "Exit Efficiency",
            cellDataType: "number",
            filter: "agNumberColumnFilter",
            valueGetter: (p:ValueGetterParams) => {return parseFloat(p.data?.["Exit Efficiency"])},
            valueFormatter: (p:any) => {return (p.value).toFixed(2) + "%"}
        },
        {
            field: "Total Efficiency",
            cellDataType: "number",
            filter: "agNumberColumnFilter",
            valueGetter: (p:ValueGetterParams) => {return parseFloat(p.data?.["Total Efficiency"])},
            valueFormatter: (p:ValueFormatterParams) => {return (p.value).toFixed(2) + "%"}
        },
        {
            field: "FlatToFlat Profit/Loss (C)",
            cellDataType: "number",
            filter: "agNumberColumnFilter",
            valueGetter: (p:ValueGetterParams) => {return parseFloat(p.data?.["FlatToFlat Profit/Loss (C)"])},
            valueFormatter: (p:ValueFormatterParams) => {return (p.value?.toFixed(2))}
        },
        {
            field: "FlatToFlat Max Open Loss (C)",
            cellDataType: "number",
            filter: "agNumberColumnFilter",
            valueGetter: (p:ValueGetterParams) => {return parseFloat(p.data?.["FlatToFlat Max Open Loss (C)"])},
            valueFormatter: (p:ValueFormatterParams) => {return (p.value?.toFixed(2))}
        },
        {
            field: "FlatToFlat Max Open Profit (C)",
            cellDataType: "number",
            filter: "agNumberColumnFilter",
            valueGetter: (p:ValueGetterParams) => {return parseFloat(p.data?.["FlatToFlat Max Open Profit (C)"])},
            valueFormatter: (p:ValueFormatterParams) => {return (p.value?.toFixed(2))}
        },
        {
            field: "Note",
            cellDataType: "text",
        },
    ])

    const colFields = useMemo(() => {
        return colDefs.map((i:ColDef<Row>) => {
            return i.field as string;
        })
    }, [colDefs])

    return(
        <GridContext value={{gridRef, rowData, setRowData, colDefs, setColDefs, accounts, setAccounts, colFields}}>
            {children}
        </GridContext>
    )
}

export const useGrid = () => {
    const context = useContext(GridContext);
    if(!context) throw new Error("GridContext must be used within a provider.");
    return context;
}