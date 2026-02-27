import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Button,
    Divider, styled,
    TextField,
    Typography
} from "@mui/material";
import {HiddenInput, LogAccountsMUI} from "./MUIStyling/LogAccountsMUI";
import React, {useCallback, useEffect, useMemo, useState} from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {Row} from "../Types/Row";
import {IAccountData} from "../Types/IAccountData";
import {IAccount} from "../Types/IAccount";
import {useGrid} from "../Providers/ProviderGrid";
import {useTag} from "../Providers/ProviderTag";
import {useFilter} from "../Providers/ProviderFilter";
import {defaultColDefs} from "../Types/defaultColDefs";
import {ColDef} from "ag-grid-community";

export default function LogAccountCreator() {
    // global vars
    const {gridRef, colDefs, setAccounts, accounts, setRowData, setColDefs} = useGrid();
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

    const refreshAccounts = useCallback(async() => {
        // fetch data
        const res = await fetch("/api/retrieveAccounts")
        // if any error occurs
        if(!res.ok) {
            const err = res.text();
            console.error("Error occurred in fetchAccounts: ", res.status, err);
        }
        // get values
        const data = await res.json();
        // if not empty, initialize account map
        if(data?.accounts?.length > 0) {
            const temp:Map<string, IAccountData> = new Map<string, IAccountData>();
            data.accounts.forEach((i:IAccount) => {
                temp.set(i.AccName, i.Data);
            })
            setAccounts(temp);
        }
    }, [setAccounts])

    // splits sc defs from user-defined tags
    const unsplitDef = useMemo(() => {
        // return existing defs if no tags are found
        if(tagDefs.length < 1) return colDefs;
        // copy column defs
        const tempDefs = [...gridRef?.current?.api?.getColumnDefs() as ColDef<Row>[]];
        // filter out tag defs
        return tempDefs.filter((i) => {
            const idx = tagDefs.indexOf(i);
            return idx < 0;
        })
    }, [colDefs, tagDefs, gridRef])

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
        } else
            await refreshAccounts();

    }, [gridRef, unsplitDef, tagDefs, accountName, refreshAccounts])

    return (
        <>
            <Accordion defaultExpanded>
                <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
                    <Typography>Create new account</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Box sx={LogAccountsMUI.TabFlexCenteredContainer}>
                        <TextField
                            label={"Account Name"}
                            value={accountName}
                            onChange={(e:React.ChangeEvent<HTMLInputElement>) => setAccountName(e.target.value)}
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
                                        onChange={(e:React.ChangeEvent<HTMLInputElement>) =>
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
        </>
    )
}