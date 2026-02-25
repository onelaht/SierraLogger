// ag grid: core
import { AgGridReact } from 'ag-grid-react';
// ag grid: theme related
import { themeAlpine } from "ag-grid-community";
// global vars
import { useGrid } from "../Providers/ProviderGrid";
// styling
import "./MUIStyling/LogTable.css";

export default function LogTable() {
    // global vars
    const { gridRef, rowData, colDefs } = useGrid();

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