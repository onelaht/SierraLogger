// react
import React, {ChangeEvent, useCallback, useEffect, useMemo, useState} from "react";
// MUI
import {Box, Accordion, AccordionSummary, AccordionDetails,
        Typography, styled, Button, Divider, TextField} from '@mui/material'
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
// MUI styling
import {HiddenInput, LogAccountsMUI} from "./LogAccountsMUI";
// global vars
import {useGrid} from "../Providers/ProviderGrid";
import {useTag} from "../Providers/ProviderTag";
import {useFilter} from "../Providers/ProviderFilter";
// types and interfaces
import {Row} from "../Types/Row";
import {IAccount} from "../Types/IAccount";
import {IAccountData} from "../Types/IAccountData";
import {ColDef} from "ag-grid-community";

export default function LogAccounts() {
    // global vars
    const {gridRef, colDefs, accounts, setRowData, setColDefs} = useGrid();
    const {tagDefs, setTagDefs} = useTag();
    const {setUniqueAccount, setUniqueSymbol} = useFilter();
    // MUI; hidden file upload form
    const VisuallyHiddenInput = styled('input')(HiddenInput);
    // store raw user log data
    const [gridData, setGridData] = useState<string | null>(null);
    // store account name
    const [accountName, setAccountName] = useState<string>("");
    // store filename
    const [filename, setFilename] = useState<string>("");
    // store user log file
    const [rawString, setRawString] = useState<ArrayBuffer | string | null>(null);

    // read in and save user data
    const readInFile = useCallback((data:File | null) => {
        if(!data || !data?.type.startsWith("text/plain")) return;
        // assign filename received
        setFilename(data.name);
        // read file
        const reader = new FileReader();
        reader.onload = () => {
            // save data
            setRawString(reader.result);
        }
        reader.readAsBinaryString(data);
    }, [])

    // initialize grid data
    useEffect(() => {
        // leave if uploaded data is empty
        if(!rawString) return;
        // if data contains strings
        if (typeof rawString === "string") {
            // assign data
            setGridData(rawString);
        }
    }, [rawString, setGridData])

    // splits sc defs from user-defined tags
    const unsplitDef = useMemo(() => {
        // return existing defs if no tags are found
        if(tagDefs.length < 1) return colDefs;
        // copy column defs
        const tempDefs = [...colDefs];
        // filter out tag defs
        return tempDefs.filter((i) => {
            const idx = tagDefs.indexOf(i);
            return idx < 0;
        })
    }, [colDefs, tagDefs])

    // save data as new account
    const createAccount = useCallback(async () => {
        if(!gridRef?.current) return;
        // get row data
        const rowData:Row[] = [];
        gridRef.current.api?.forEachNode((i) => {
            if(i?.data) rowData.push(i.data);
        });
        // initialize account type
        const accData:IAccountData = {
            RowData: rowData,
            ColDefs: unsplitDef,
            TagDefs: tagDefs
        };
        const acc:IAccount = {
            AccName: accountName,
            Data: accData
        };
        // send data to backend
        const res = await fetch("api/saveNewAccount", {
            method: "POST",
            headers: {'Content-Type': "application/json"},
            body: JSON.stringify({acc: acc})
        });
        // if any error occurs, prompt err msg to console
        if(!res.ok) {
            const text = await res.text();
            console.error("Error occurred in createAccount():", res.status, text);
        }
    }, [gridRef, unsplitDef, tagDefs, accountName])

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

    // set selected account to grid
    const setAccount = useCallback((acc:string) => {
        if(!accounts.has(acc)) return;
        const account = accounts.get(acc) as IAccountData;
        // assign column/tag definitions and row data
        setRowData(account.RowData);
        setTagDefs(account.TagDefs);
        setColDefs(prev => {
            const temp = [...prev];
            account.TagDefs.forEach((i:ColDef<Row>) => {
                temp.push(i);
            })
            return temp;
        });
    }, [accounts, setTagDefs, setColDefs, setRowData])

    // if user uploads a file, call toBackend (send data to backend)
    useEffect(() => {
        if(!gridData) return;
        toBackend();
    }, [gridData])

    return (
        <Box sx={LogAccountsMUI.Container}>
            <Accordion defaultExpanded>
                <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
                    <Typography>Accounts ({accounts.size})</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    {accounts.size > 0 && Array.from(accounts.entries()).map(([k, v]) => (
                        <Accordion>
                            <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
                                <Typography>{k}</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Box sx={{m:1, display: "flex", flexDirection: "column"}}>
                                    <Button
                                        variant="outlined"
                                        onClick={() => setAccount(k)}
                                    >
                                        Load
                                    </Button>
                                </Box>
                            </AccordionDetails>
                        </Accordion>
                    ))}
                </AccordionDetails>
            </Accordion>
            <Accordion defaultExpanded>
                <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
                    <Typography>Create new account</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Box sx={LogAccountsMUI.TabFlexCenteredContainer}>
                        <TextField
                            label={"Account Name"}
                            value={accountName}
                            onChange={(e:ChangeEvent<HTMLInputElement>) => setAccountName(e.target.value)}
                        />
                    </Box>
                    <Divider sx={LogAccountsMUI.Divider}/>
                    <Box sx={LogAccountsMUI.TabFlexContainer}>
                        <Box sx={LogAccountsMUI.UploadGridContainer}>
                            <Box sx={LogAccountsMUI.UploadGridCol1}>
                                <Button
                                    variant="outlined"
                                    component="label"
                                    size="small"
                                    sx={LogAccountsMUI.UploadButton}
                                >
                                    Upload Log
                                    <VisuallyHiddenInput
                                        type="file"
                                        onChange={(e:ChangeEvent<HTMLInputElement>) =>
                                            readInFile(e.target.files?.[0] ?? null)}
                                        accept="csv"
                                    />
                                </Button>
                            </Box>
                            <Box sx={LogAccountsMUI.UploadGridCol2}>
                                    <Typography variant="subtitle2">
                                        {rawString ? filename : "No file selected"}
                                    </Typography>
                            </Box>
                        </Box>
                    </Box>
                    <Divider sx={LogAccountsMUI.Divider}/>
                    <Box sx={LogAccountsMUI.TabFlexCenteredContainer}>
                        <Button
                            variant="outlined"
                            disabled={!rawString || accountName === ""}
                            onClick={createAccount}>
                            Save Account
                        </Button>
                    </Box>
                </AccordionDetails>
            </Accordion>
        </Box>
    )
}