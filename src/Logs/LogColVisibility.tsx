// react
import React, {useCallback, useEffect, useMemo, useState} from "react";
// global vars
import {useGrid} from "../Providers/ProviderGrid";
// mui components
import {Box, Checkbox, FormControl, ListItemText, MenuItem, Typography} from "@mui/material";
// mui styling
import {LogColVisibilityMUI} from "./LogColVisibilityMUI";

export default function LogColVisibility() {
    // global vars
    const {gridRef, colDefs} = useGrid();
    // selected cols
    const [colMap, setColMap] = useState<Map<string, boolean>>(new Map<string, boolean>());

    // initialize checkbox status
    // - if retrieved from db, restore based on hide attribute value
    // - otherwise, set all columns as visible
    useEffect(() => {
        if(colDefs.length < 1) return;
        const tempMap = new Map<string, boolean>();
        // set all as visible
        colDefs.forEach((f) => {
            tempMap.set(f.field as string, !f.hide ?? true);
        })
        // use as column map
        setColMap(tempMap);
    }, [colDefs])

    // hide or show specified column
    // - no action is done if reference to grid is null
    const colVisibility = useCallback((arr:string, value:boolean) => {
        if(!gridRef.current) return
        gridRef?.current?.api?.setColumnsVisible([arr], value);
    }, [gridRef])

    // toggles visibility of specified column
    // - if column/field is not found, returns w/ no changes
    // - if column is found, inverses previous boolean state.
    const handleCheckbox = useCallback((field: string) => {
        // if not found return
        if(!colMap.has(field)) return;
        // update field status and map
        setColMap(prev => {
            const tempMap = new Map(prev);
            tempMap.set(field, !tempMap.get(field));
            colVisibility(field, !!tempMap.get(field));
            return tempMap;})
    }, [colMap, colVisibility])

    // returns true if all checkboxes are checked
    // - returns false if map is empty
    // - returns false if at least one checkbox is true
    const ifAllTrue = useMemo(() => {
        // if empty return false
        if(colMap.size === 0) return false;
        let state = true;
        // change state if false;
        Array.from(colMap.values()).forEach((i:boolean) => {
            if(!i) state = false;
        })
        return state;
    }, [colMap])

    // disables or enables are checkboxes based on parameter provide
    // - returns with no changes if map is empty
    const modifyAll = useCallback((state:boolean) => {
        // if empty, ignore
        if(colMap.size === 0) return;
        // modify all checkboxes based on state var
        setColMap(prev => {
            let temp = new Map<string, boolean>(prev);
            Array.from(temp.keys()).forEach((k:string) => {
                temp.set(k, !state);
                colVisibility(k, !state);
            })
            return temp;
        })
    }, [setColMap, colMap, colVisibility])

    return (
        <Box sx={LogColVisibilityMUI.Container}>
            {colMap.size > 0
                ?
                    <>
                        <FormControl>
                            <MenuItem sx={LogColVisibilityMUI.MenuItemSx}>
                                <Checkbox
                                    onClick={() => modifyAll(ifAllTrue)}
                                    checked={ifAllTrue}/>
                                <ListItemText primary="All"/>
                            </MenuItem>
                            {colMap.size > 0 && Array.from(colMap.keys()).map((k) => (
                                <MenuItem
                                    sx={LogColVisibilityMUI.MenuItemSx}
                                >
                                    <Checkbox
                                        onChange={() => handleCheckbox(k)}
                                        checked={!!colMap.get(k)}/>
                                    <ListItemText
                                        primary={k}/>
                                </MenuItem>
                            ))}
                        </FormControl>
                    </>
                :
                    <>
                        <Box sx={LogColVisibilityMUI.MessageBox}>
                            <Typography variant="h5" sx={LogColVisibilityMUI.TextAlign}><b>No columns found</b></Typography>
                            <Typography sx={LogColVisibilityMUI.TextAlign}>Update trade log or load existing account</Typography>
                        </Box>
                    </>
            }
        </Box>
    )
}