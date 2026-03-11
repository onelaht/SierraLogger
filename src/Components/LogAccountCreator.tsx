// react
import React, {useCallback, useEffect, useMemo, useState} from "react";
// mui components
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
// mui icons
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
// types and interfaces
import {Row} from "../Types/Row";
import {ColDef} from "ag-grid-community";
import {IAccount} from "../Types/IAccount";
import {defaultColDefs} from "../Types/defaultColDefs";
// react router
import {useNavigate} from "react-router-dom";
// global vars
import {useInitializer} from "../Providers/ProviderIniitalizer";
import {useAccount} from "../Providers/ProviderAccount";

export default function LogAccountCreator() {
    // go tp path
    const nav = useNavigate();
    // global vars
    const {setAccountNames} = useInitializer();
    const {gridRef, colDefs, tagDefs, handleDefs} = useAccount();
    // MUI; hidden file upload form
    const VisuallyHiddenInput = styled('input')(HiddenInput);
    // store account name
    const [accountName, setAccountName] = useState<string>("");
    // store filename
    const [filename, setFilename] = useState<string>("");
    // store user log file
    const [rawString, setRawString] = useState<ArrayBuffer | string | null>(null);

    // convert txt file to array of Row type
    const uploadRawString = useCallback(async() => {
        const res = await fetch("/api/upload", {
            method: "POST",
            headers: {
                "Content-Type" : "application/json"
            },
            body: JSON.stringify({rawString: rawString})
        })
        if(!res.ok)
            return;
        const data:{data:Row[]} = await res.json();
        handleDefs("", data?.data ?? [], defaultColDefs, []);
    }, [rawString, handleDefs])

    // read in and save user data
    const readInFile = useCallback((data:File | null) => {
        if(!data || !data?.type.startsWith("text/plain")) return;
        // assign filename received
        setFilename(data.name);
        // read file
        const reader = new FileReader();
        // save data
        reader.onload = ()=> setRawString(reader.result);
        reader.readAsBinaryString(data);
    }, [])

    useEffect(() => {
        if(!rawString || rawString === "") return;
        uploadRawString();
    }, [rawString])

    // reloads account name list
    const refreshAccountsNames = useCallback(async() => {
        // fetch data
        const res = await fetch("/api/getAccountNames")
        // if any error occurs
        if(!res.ok) {
            const err = res.text();
            console.error("Error occurred in refreshAccountNames: ", res.status, err);
        }
        // get values
        const data = await res.json();
        // if not empty, initialize account map
        if(data?.names?.length > 0)
            setAccountNames(data.names);
    }, [setAccountNames])

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
        // initialize account
        const acc:IAccount = {
            AccName: accountName,
            RowData: rowData,
            ColDefs: unsplitDef,
            TagDefs: tagDefs
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
            await refreshAccountsNames();
        nav(`/${accountName}`);

    }, [gridRef, unsplitDef, tagDefs, accountName, refreshAccountsNames, nav])

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