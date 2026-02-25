// react
import React, {useCallback, useEffect, useMemo, useState} from 'react';
// ag grid
import {CustomFilterProps, useGridFilter} from "ag-grid-react";
import {DoesFilterPassParams} from "ag-grid-community";
// global vars
import {useFilter} from "../Providers/ProviderFilter";
// mui components
import {Checkbox, FormControlLabel, FormGroup} from "@mui/material";
// styling
import './/FilterCheckboxSet.css'

export default function FilterCheckboxSet ({onModelChange, colDef}: CustomFilterProps) {
    // retrieve unique sets for column
    const { retrieveColSet } = useFilter();
    // determines which set is enabled/disabled
    const [map, setMap] = useState(new Map<string, boolean>());

    // initialize map
    useEffect(() => {
        const tempMap = new Map<string, boolean>();
        // retrieve each col set and show all
        retrieveColSet(colDef?.field)?.forEach((v) => {
            tempMap.set(v, true)
        })
        setMap(tempMap);
    }, [])

    // retrieves state for specified set
    // - returns true if set is enabled
    // - returns false if set is disabled
    const ifTrue = useCallback((key:string):boolean => {
        return !!(map.get(key));
    }, [map])

    // retrieves state of all sets
    // - returns true if all are enabled
    // - returns false if at least one is disabled
    const ifAllTrue = useMemo(():boolean => {
        let status = true;
        map.forEach((v:boolean) => {
            if (!v) status = false;
        })
        return status;
    }, [map])

    // modifies state for specified set
    // - uses key value for O(1) lookup and assignment
    const modifyKey = useCallback((key:string):void => {
        // if not found in map, leave
        if(!map.has(key)) return;
        // create new instance, assign, and update map
        setMap(prev => {
            const newMap = new Map(prev);
            newMap.set(key, !newMap.get(key));
            return newMap;
        })
    }, [map])

    // modifies state of all set
    // - utilizes boolean parameter to assign state
    const modifyAllKeys = useCallback((state: boolean):void => {
        // create new instance, loop through all set, assign, and update map
        setMap(prev => {
            const newMap = new Map(prev);
            Array.from(newMap.keys()).forEach((key) => {
                newMap.set(key, state);
            })
            return newMap;
        })
    }, [])

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        // all checkbox
        // - if checked, show all sets
        // - otherwise, hide all sets
        if(e.target.id === "all")
            e.target.checked ? modifyAllKeys(true) : modifyAllKeys(false);
        // toggle boolean condition via key value (if exists)
        else
            modifyKey(e.target.id);
        // update ag grid filter model
        onModelChange(e.target.id ? map : null);
    }, [modifyAllKeys, modifyKey, onModelChange, map])

    // determine which nodes to show
    // - compares all nodes based on boolean condition
    // - returns boolean status via key lookup
    const doesFilterPass = useCallback(({data}:DoesFilterPassParams) => {
        return ifTrue(data?.[colDef.field as string])
    }, [colDef, ifTrue])

    // call hook (apply new filtered rows)
    useGridFilter({doesFilterPass});

    return (
        <div className="FormContainer">
            <FormGroup className="FormGroupContainer">
                <FormControlLabel
                    control={
                        <Checkbox
                            id="all"
                            size="small"
                            onChange={handleChange}
                            checked={ifAllTrue}
                        />
                    }
                    label="All"
                />
                {map.size >= 1 && (Array.from(map.keys())).map((att:string) => (
                    <FormControlLabel
                        control={
                            <Checkbox
                                id={att}
                                size="small"
                                onChange={handleChange}
                                checked={ifTrue(att)}
                            />
                        }
                        label={att}
                    />
                ))}
            </FormGroup>
        </div>
    )
}