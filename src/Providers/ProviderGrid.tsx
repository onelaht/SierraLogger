// react
import React, {createContext, ReactNode, useContext, useRef, useState} from 'react';
// types
import type { Row } from "../Types/Row"
// ag grid
import {AgGridReact} from "ag-grid-react";
import {ColDef} from "ag-grid-community";
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
}

const GridContext = createContext<IGridContextType | null>(null);

export default function ProviderGrid({children}:{children: ReactNode}) {
    const gridRef = useRef<AgGridReact<Row> | null>(null);
    const [accounts, setAccounts] = useState<Map<string, IAccountData>>(new Map<string, IAccountData>());
    const [rowData, setRowData] = useState<Row[] | null>(null);

    // definitions of grid columns
    // - specifies data type used
    // - specifies filter type
    // - implements apply and reset buttons
    const [colDefs, setColDefs] = useState<ColDef<Row>[]> ([]);

    return(
        <GridContext value={{gridRef, rowData, setRowData, colDefs, setColDefs, accounts, setAccounts}}>
            {children}
        </GridContext>
    )
}

export const useGrid = () => {
    const context = useContext(GridContext);
    if(!context) throw new Error("GridContext must be used within a provider.");
    return context;
}