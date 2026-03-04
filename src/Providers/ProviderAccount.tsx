// react
import React, {createContext, useCallback, useContext, useRef, useState} from "react";
// types and intefaces
import {Row} from "../Types/Row";
import {checkboxSet, durationSet, floatPercentSet, floatRoundedSet, integerSet} from "../Types/colDefSets";
// ag grid types
import {AgGridReact} from "ag-grid-react";
import {ColDef, ValueFormatterParams, ValueGetterParams} from "ag-grid-community";
// filter components
import FilterDuration from "../FiltersComponents/FilterDuration";
import FilterCheckboxSet from "../FiltersComponents/FilterCheckboxSet";

interface IAccountContextType {
    gridRef: React.RefObject<AgGridReact<Row> | null>;
    accName: string;
    rowData: Row[];
    setRowData: React.Dispatch<React.SetStateAction<Row[]>>;
    colDefs: ColDef<Row>[];
    setColDefs: React.Dispatch<React.SetStateAction<ColDef<Row>[]>>;
    tagDefs: ColDef<Row>[];
    setTagDefs: React.Dispatch<React.SetStateAction<ColDef<Row>[]>>;
    handleDefs: (rawAccName:string, rawRowData: Row[], rawColDef: ColDef<Row>[], rawTagDef: ColDef<Row>[]) => void;
}

const AccountContext = createContext<IAccountContextType | null>(null);

export default function ProviderAccount({children}:{children:React.ReactNode}) {
    const gridRef = useRef<AgGridReact<Row>| null>(null);
    const [accName, setAccName] = useState<string>("");
    const [rowData, setRowData] = useState<Row[]>([]);
    const [colDefs, setColDefs] = useState<ColDef<Row>[]>([]);
    const [tagDefs, setTagDefs] = useState<ColDef<Row>[]>([]);

    // stringify duration value
    const convertDuration = useCallback((seconds:number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return [h, m, s]
            .map(v => String(v).padStart(2, "0"))
            .join(":");
    }, [])

    // handles colDef configuration/assignment
    // - assigns grid display based on column type and filter
    // - assigns tagDef arr (if exists)
    // - combines tagDef and colDef (if both exists)
    // - assigns [] if passed tagDef and colDef is empty
    const handleDefs = useCallback((rawAccName:string, rawRowData: Row[], rawColDef:ColDef<Row>[], rawTagDef:ColDef<Row>[]) => {
        console.log(rawRowData, rawColDef);
        setAccName(rawAccName ?? "");
        setRowData(rawRowData ?? []);
        // var to store modified colDef arr
        const temp:ColDef<Row>[] = [];
        // traverse through colDef arr
        rawColDef?.length > 0 && rawColDef.forEach((i:ColDef<Row>) => {
            // var to store modified specific col set
            let newCol:ColDef<Row> = i;
            // if col is using duration filter
            if(durationSet.has(newCol.field as string)) {
                delete newCol.filter;
                newCol = Object.assign({
                    filter: FilterDuration,
                    valueGetter: (p:ValueGetterParams) => {return parseInt(p.data?.[newCol.field as string])},
                    valueFormatter: (p:ValueFormatterParams) => {return convertDuration(p.value)}
                }, newCol)
                // if col is using checkbox filter
            } else if(checkboxSet.has(newCol.field as string)) {
                delete newCol.filter;
                newCol = Object.assign({
                    filter: FilterCheckboxSet
                }, newCol);
                // if col is float type and displayed as %
            } else if(floatPercentSet.has(newCol.field as string)) {
                newCol = Object.assign({
                    valueGetter: (p:ValueGetterParams) => {return parseFloat(p.data?.[newCol.field as string])},
                    valueFormatter: (p:any) => {return (p.value).toFixed(2) + "%"}
                }, newCol)
                // if col is integer type
            } else if(integerSet.has(newCol.field as string)) {
                newCol = Object.assign({
                    valueGetter: (p:ValueGetterParams) => {return parseInt(p.data?.[newCol.field as string])}
                }, newCol)
                // if col is float type and rounded
            } else if(floatRoundedSet.has(newCol.field as string)) {
                newCol = Object.assign({
                    valueGetter: (p:ValueGetterParams) => {return parseFloat(p.data?.[newCol.field as string])},
                    valueFormatter: (p:ValueFormatterParams) => {return (p.value?.toFixed(2))}
                }, newCol)
            }
            // append to temp array
            temp.push(newCol);
        })
        // if tags exists
        if(rawTagDef?.length > 0) {
            // append to current colDef arr
            setTagDefs(rawTagDef);
            rawTagDef.forEach((i:ColDef<Row>) => {
                temp.push(i);
            })
        }
        // assign as colDef arr
        setColDefs(temp);
    }, [setColDefs, setTagDefs, setRowData, convertDuration])

    return (
        <AccountContext value={{gridRef, accName, rowData, setRowData, colDefs, setColDefs, tagDefs, setTagDefs, handleDefs}}>
            {children}
        </AccountContext>
    )
}

export const useAccount = () => {
    const ctx = useContext(AccountContext);
    if(!ctx) throw new Error ("AccountContext must be used within a provider");
    return ctx;
}