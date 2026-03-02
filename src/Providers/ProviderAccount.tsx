import {Row} from "../Types/Row";
import {AgGridReact} from "ag-grid-react";
import React, {createContext, useContext, useRef, useState} from "react";
import {ColDef} from "ag-grid-community";

interface IAccountContextType {
    gridRef: React.RefObject<AgGridReact<Row> | null>;
    accName: string;
    setAccName: React.Dispatch<React.SetStateAction<string>>;
    rowData: Row[];
    setRowData: React.Dispatch<React.SetStateAction<Row[]>>;
    colDefs: ColDef<Row>[];
    setColDefs: React.Dispatch<React.SetStateAction<ColDef<Row>[]>>;
}

const AccountContext = createContext<IAccountContextType | null>(null);

export default function ProviderAccount({children}:{children:React.ReactNode}) {
    const gridRef = useRef<AgGridReact<Row>| null>(null);
    const [accName, setAccName] = useState<string>("");
    const [rowData, setRowData] = useState<Row[]>([]);
    const [colDefs, setColDefs] = useState<ColDef<Row>[]>([]);

    return (
        <AccountContext value={{gridRef, accName, setAccName, rowData, setRowData, colDefs, setColDefs}}>
            {children}
        </AccountContext>
    )
}

export const useAccount = () => {
    const ctx = useContext(AccountContext);
    if(!ctx) throw new Error ("AccountContext must be used within a provider");
    return ctx;
}