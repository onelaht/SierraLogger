// ag grid: core
import { AgGridReact } from 'ag-grid-react';
// ag grid: theme related
import { themeAlpine } from "ag-grid-community";
// global vars
import {useAccount} from "../Providers/ProviderAccount";
// styling
import "./MUIStyling/LogTable.css";

export default function LogTable() {
    // global vars
    const { gridRef, rowData, colDefs } = useAccount();

    return (
        <div className="GridContainer">
            <AgGridReact
                ref={gridRef}
                theme={themeAlpine}
                rowData={rowData}
                columnDefs={colDefs}
            />
        </div>
    )
}