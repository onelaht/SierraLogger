import {ColDef} from "ag-grid-community";
import {Row} from "./Row";
// customer filters
import FilterDuration from "../Filters/FilterDuration";
import FilterCheckboxSet from "../Filters/FilterCheckboxSet";

export const defaultColDefs:ColDef<Row>[] = (
    [
        {
            field: "Entry DateTime",
            editable: false,
            hide: false,
            cellDataType: "dateTimeString",
            filter: "agDateColumnFilter",
            filterParams: {
                buttons: ["apply", "reset"],
            },
        },
        {
            field: "Exit DateTime",
            editable: false,
            cellDataType: "dateTimeString",
            filter: "agDateColumnFilter",
            filterParams: {
                buttons: ["apply", "reset"],
            },
        },
        {
            field: "Duration",
            editable: false,
            hide: false,
            cellDataType: "number",
            filter: FilterDuration,
        },
        {
            field: "Symbol",
            editable: false,
            hide: false,
            cellDataType: "text",
            filter: FilterCheckboxSet,
        },
        {
            field: "Trade Type",
            editable: false,
            hide: false,
            cellDataType: "text",
            filter: FilterCheckboxSet,
        },
        {
            field: "Entry Price",
            editable: false,
            hide: false,
            cellDataType: "number",
            filter: "agNumberColumnFilter",
            filterParams: {
                buttons: ["apply", "reset"],
            },
        },
        {
            field: "Exit Price",
            editable: false,
            hide: false,
            cellDataType: "number",
            filter: "agNumberColumnFilter",
            filterParams: {
                buttons: ["apply", "reset"],
            },
        },
        {
            field: "Low Price While Open",
            editable: false,
            hide: false,
            cellDataType: "number",
            filter: "agNumberColumnFilter",
            filterParams: {
                buttons: ["apply", "reset"],
            },
        },
        {
            field: "High Price While Open",
            editable: false,
            hide: false,
            cellDataType: "number",
            filter: "agNumberColumnFilter",
            filterParams: {
                buttons: ["apply", "reset"],
            },
        },
        {
            field: "Profit/Loss (C)",
            editable: false,
            hide: false,
            cellDataType: "number",
            filter: "agNumberColumnFilter",
            filterParams: {
                buttons: ["apply", "reset"],
            },
        },
        {
            field: "Max Open Profit (C)",
            editable: false,
            hide: false,
            cellDataType: "number",
            filter: "agNumberColumnFilter",
            filterParams: {
                buttons: ["apply", "reset"],
            },
        },
        {
            field: "Max Open Loss (C)",
            editable: false,
            hide: false,
            cellDataType: "number",
            filter: "agNumberColumnFilter",
            filterParams: {
                buttons: ["apply", "reset"],
            },
        },
        {
            field: "Commission (C)",
            editable: false,
            hide: false,
            cellDataType: "number",
            filter: "agNumberColumnFilter",
            filterParams: {
                buttons: ["apply", "reset"],
            },
       },
        {
            field: "Trade Quantity",
            editable: false,
            hide: false,
            cellDataType: "number",
            filter: "agNumberColumnFilter",
            filterParams: {
                buttons: ["apply", "reset"],
            },
        },
        {
            field: "Open Position Quantity",
            editable: false,
            hide: false,
            cellDataType: "number",
            filter: "agNumberColumnFilter",
            filterParams: {
                buttons: ["apply", "reset"],
            },
        },
        {
            field: "Close Position Quantity",
            editable: false,
            hide: false,
            cellDataType: "number",
            filter: "agNumberColumnFilter",
            filterParams: {
                buttons: ["apply", "reset"],
            },
        },
        {
            field: "Max Open Quantity",
            editable: false,
            hide: false,
            cellDataType: "number",
            filter: "agNumberColumnFilter",
            filterParams: {
                buttons: ["apply", "reset"],
            },
        },
        {
            field: "Max Closed Quantity",
            editable: false,
            hide: false,
            cellDataType: "number",
            filter: "agNumberColumnFilter",
            filterParams: {
                buttons: ["apply", "reset"],
            },
        },
        {
            field: "Entry Efficiency",
            editable: false,
            hide: false,
            cellDataType: "number",
            filter: "agNumberColumnFilter",
        },
        {
            field: "Exit Efficiency",
            editable: false,
            hide: false,
            cellDataType: "number",
            filter: "agNumberColumnFilter",
        },
        {
            field: "Total Efficiency",
            editable: false,
            hide: false,
            cellDataType: "number",
            filter: "agNumberColumnFilter",
        },
        {
            field: "FlatToFlat Profit/Loss (C)",
            editable: false,
            hide: false,
            cellDataType: "number",
            filter: "agNumberColumnFilter",
        },
        {
            field: "FlatToFlat Max Open Loss (C)",
            editable: false,
            hide: false,
            cellDataType: "number",
            filter: "agNumberColumnFilter",
        },
        {
            field: "FlatToFlat Max Open Profit (C)",
            editable: false,
            hide: false,
            cellDataType: "number",
            filter: "agNumberColumnFilter",
        },
        {
            field: "Note",
            editable: false,
            hide: false,
            cellDataType: "text",
        },
    ]
)