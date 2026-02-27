// react
import React, {useCallback, useEffect, useState} from "react";
// MUI
import {Box, Accordion, AccordionSummary, AccordionDetails,
        Typography, Button} from '@mui/material'
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
// MUI styling
import {LogAccountsMUI} from "./MUIStyling/LogAccountsMUI";
// global vars
import {useGrid} from "../Providers/ProviderGrid";
import {useTag} from "../Providers/ProviderTag";
import {useFilter} from "../Providers/ProviderFilter";
// types and interfaces
import {Row} from "../Types/Row";
import {IAccountData} from "../Types/IAccountData";
import {floatPercentSet, integerSet, floatRoundedSet, checkboxSet, durationSet} from "../Types/colDefSets";
import {defaultColDefs} from "../Types/defaultColDefs";
// ag grid: types
import {ColDef, ValueFormatterParams, ValueGetterParams} from "ag-grid-community";
// ag grid: custom filters
import FilterDuration from "../FiltersComponents/FilterDuration";
import FilterCheckboxSet from "../FiltersComponents/FilterCheckboxSet";
import {useInitializer} from "../Providers/ProviderIniitalizer";
import {useNavigate} from "react-router-dom"

export default function LogAccountSelector() {
    //
    const {accountNames} = useInitializer();
    //
    const nav = useNavigate();
    // global vars
    const {accounts, setRowData, setColDefs} = useGrid();
    const {setTagDefs} = useTag();
    const {setUniqueAccount, setUniqueSymbol} = useFilter();
    // store raw user log data
    const [gridData, setGridData] = useState<string | null>(null);
    // store user log file
    const [rawString, setRawString] = useState<ArrayBuffer | string | null>(null);

    // initialize grid data
    useEffect(() => {
        // leave if uploaded data is empty
        if(!rawString) return;
        // if data contains strings
        if (typeof rawString === "string") {
            // assign data
            setGridData(rawString);
            // use default colDef configuration
            handleColDefs(defaultColDefs, []);
        }
    }, [rawString, setGridData])

    // sends raw file to backend and retrieves split array
    const toBackend = useCallback( async () => {
        // send raw file
        await fetch("/api/upload",
            {
                method: "POST",
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({UserData: gridData})
            })
            // retrieve data and assign as row data
            .then(async res => {
                const data = await res.json();
                // assign data
                data?.data && setRowData(data.data);
                data?.uSymbol && setUniqueSymbol(data.uSymbol);
                data?.uAccount && setUniqueAccount(data.uAccount);
            })
            // handle any error that occurs
            .catch(error => {
                console.error("Error during fetch:", error);
            });
    }, [gridData, setUniqueAccount, setUniqueSymbol, setRowData])

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
    const handleColDefs = useCallback((rawColDef:ColDef<Row>[], rawTagDef:ColDef<Row>[]) => {
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
    }, [setColDefs, setTagDefs, convertDuration])

    // if user uploads a file, call toBackend (send data to backend)
    useEffect(() => {
        if(!gridData) return;
        toBackend();
    }, [gridData])

    return (
        <Box sx={LogAccountsMUI.Container}>
            <Accordion defaultExpanded>
                <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
                    <Typography>Accounts ({accountNames.length})</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    {accountNames.length > 0 && accountNames.map((i:string) => (
                        <Accordion>
                            <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
                                <Typography>{i}</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Box sx={LogAccountsMUI.TabFlexContainer}>
                                    <Button
                                        variant="outlined"
                                        onClick={() => nav(`/${i}`)}
                                    >
                                        Load
                                    </Button>
                                </Box>
                            </AccordionDetails>
                        </Accordion>
                    ))}
                </AccordionDetails>
            </Accordion>
        </Box>
    )
}