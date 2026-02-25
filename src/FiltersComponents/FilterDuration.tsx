// react
import React, {useCallback, useRef, useState} from 'react';
// ag grid
import {CustomFilterProps, useGridFilter} from "ag-grid-react";
import {DoesFilterPassParams} from "ag-grid-community";
// mui
import {
    Button,
    FormControl,
    FormControlLabel,
    MenuItem,
    Radio,
    RadioGroup,
    Select,
    SelectChangeEvent,
    Stack,
    TextField,
    Typography
} from '@mui/material';
// comparison (lodash)
import {isEqual} from 'lodash';
// types
import {ITimeFilterArgs} from "../Types/ITimeFilterArgs";
import {ITimeFormat} from "../Types/ITimeFormat";
import {ITimeFilter} from "../Types/ITimeFilter";
import {FilterList} from "../Types/FilterList";
import {FilterConditionalList} from "../Types/FilterConditionalList";
// styling
import "./FilterDuration.css"
import {FilterDurationMUI} from "./FilterDurationMUI";

export default function FilterDuration ({onModelChange, colDef}: CustomFilterProps) {
    // object used for filter adjustment
    const [draft, setDraft] = useState<ITimeFilterArgs>({
        first: {
            userInput: {
                hour: "",
                min: "",
                sec: "",
            },
            filter: FilterList.NONE,
        },
        second: {
            userInput: {
                hour: "",
                min: "",
                sec: "",
            },
            filter: FilterList.NONE,

        }
    })

    // object used for applying filter
    const [applied, setApplied] = useState<ITimeFilterArgs>({
        first: {
            userInput: {
                hour: "",
                min: "",
                sec: "",
            },
            filter: FilterList.NONE,
        },
        second: {
            userInput: {
                hour: "",
                min: "",
                sec: "",
            },
            filter: FilterList.NONE,
        }
    })

    // references prev draft obj
    const prevArgsRef = useRef<ITimeFilterArgs|null>(null);

    // conditionals used when a second argument is used
    const [radio, setRadio] = useState<FilterConditionalList>(FilterConditionalList.AND);

    // converts string time to int seconds
    // - converts empty vals ("") to 0
    const convertToSec = useCallback((time:ITimeFormat) => {
        const hour = time.hour !== "" ? parseInt(time.hour) * 3600 : 0;
        const min = time.min !== "" ? parseInt(time.min) * 60 : 0;
        const sec = time.sec !== "" ? parseInt(time.sec) : 0;
        return hour + min + sec;
    }, [])

    // determines if each argument contains a filter and time
    // - returns true if it contains valid filter and time
    // - returns false otherwise
    const doesContainInput = useCallback((arg:ITimeFilter) => {
        return (arg.filter !== FilterList.NONE) && (arg.userInput.hour !== "" || arg.userInput.min !== "" || arg.userInput.sec !== "");
    }, [])

    // converts single digit values into two
    // - "2" will be converted to "02"
    const valueFormatter = useCallback((data:string) => {
        if(!data || data?.length > 2)
            return data
        return data?.padStart(2, "0");
    }, [])

    // evaluates node and input value based on the chosen filter type
    // - returns true of it satisfies assigned filter
    // - returns false if it doesn't satisfy filter or if filter type is unknown
    const evaluate = useCallback((node:number, value:number, filter:FilterList) => {
        if(!value) return false;
        switch(filter) {
            case FilterList.LESS_THAN:
                return node < value;
            case FilterList.GREATER_THAN:
                return node > value;
            case FilterList.EQUAL:
                return node === value
            case FilterList.GREATER_THAN_EQUAL:
                return node >= value;
            case FilterList.LESS_THAN_EQUAL:
                return node <= value;
            default:  return false;
        }
    }, [])

    // reassigns filter type for argument
    const handleFilterChange = useCallback((e:SelectChangeEvent) => {
        const argType = e.target.name as keyof ITimeFilterArgs
        setDraft(prev => ({
            ...prev, [argType]: {
                ...prev[argType], filter: e.target.value
            }
        }))
    }, [])

    // invokes useGridData() and overwrites applied object
    // - returns with no changes if no change is found last previous args
    const handleApplyButton = useCallback(() => {
        // if equal from prev state, leave
        if(isEqual(prevArgsRef, draft))
            return;
        // alert AG Grid for filter change
        onModelChange(draft);
        // assign new applied data
        setApplied(draft);
        // update prev state
        prevArgsRef.current = draft;
    }, [onModelChange, draft, prevArgsRef])

    // reverts filter to initial state
    const handleResetButton = useCallback(() => {
        // clear applied data
        setApplied({
            first: {
                userInput: {
                    hour: "",
                    min: "",
                    sec: "",
                },
                filter: FilterList.NONE,
            },
            second: {
                userInput: {
                    hour: "",
                    min: "",
                    sec: "",
                },
                filter: FilterList.NONE,

            }
        })
        // clear model and prev reference
        onModelChange(null);
        prevArgsRef.current = null;
    }, [onModelChange])

    // determines which row to hide
    const doesFilterPass = useCallback(({data}:DoesFilterPassParams) => {
        // retrieve current col cell
        const node = parseInt(data[colDef?.field as string]);
        // retrieve user args and convert to int sec
        // assign -1 if empty
        const firstArg =  doesContainInput(applied.first) ? convertToSec(applied.first.userInput) : -1;
        const secondArg = doesContainInput(applied.second) ? convertToSec(applied.second.userInput) : -1;
        // if both are empty, (no filters set) show all values
        if(firstArg === -1 && secondArg === -1)
            return true;
        // if only one arg contains valid int, evaluate w/o conditional
        if(secondArg === -1)
            return evaluate(node, firstArg, applied.first.filter);
        // evaluate two args with AND
        if(radio === FilterConditionalList.AND)
            return evaluate(node, firstArg, applied.first.filter) && evaluate(node, secondArg, applied.second.filter);
        // evaluate two args with OR
        else
            return evaluate(node, firstArg, applied.first.filter) || evaluate(node, secondArg, applied.second.filter);
    }, [applied.first, applied.second, colDef?.field, convertToSec, doesContainInput, evaluate, radio])

    useGridFilter({doesFilterPass});

    return (
        <>
            <div className="FilterContainer">
                <FormControl
                    fullWidth
                    size="small"
                    onMouseDown={(e) => e.stopPropagation()}
                    onClick={(e) => e.stopPropagation()}
                    sx={FilterDurationMUI.FormArgsSx}>
                    <Select<string>
                        name="first"
                        value={draft.first.filter}
                        onChange={handleFilterChange}
                    >
                        {Object.values(FilterList).map((i:FilterList) => {return <MenuItem value={i}>{i}</MenuItem>})}
                    </Select>
                </FormControl>
                <Stack direction="row" spacing={0} sx={FilterDurationMUI.StackSx}>
                    <TextField
                        id="hour"
                        value={draft.first.userInput.hour}
                        onChange={e => setDraft(prev => {
                            return {...prev, first: {...prev.first, userInput:
                                        {...prev.first.userInput, hour: e.target.value}
                                }}
                        })}
                        onBlur={() => setDraft(prev => {
                            return {...prev, first: {...prev.first, userInput:
                                        {...prev.first.userInput, hour: valueFormatter(draft.first.userInput.hour)}
                                }}
                        })}
                        slotProps={FilterDurationMUI.TimeSlotProp}
                        size="small"
                        placeholder="HH"
                        disabled={draft.first.filter === FilterList.NONE}
                    />
                    <Typography>:</Typography>
                    <TextField
                        value={draft.first.userInput.min}
                        onChange={e => setDraft(prev => {
                            return {...prev, first: {...prev.first, userInput:
                                        {...prev.first.userInput, min: e.target.value}
                            }}
                        })}
                        onBlur={() => setDraft(prev => {
                            return {...prev, first: {...prev.first, userInput:
                                        {...prev.first.userInput, min: valueFormatter(draft.first.userInput.min)}
                            }}
                        })}
                        slotProps={FilterDurationMUI.TimeSlotProp}
                        size="small"
                        placeholder="MM"
                        disabled={draft.first.filter === FilterList.NONE}
                    />
                    <Typography>:</Typography>
                    <TextField
                        value={draft.first.userInput.sec}
                        onChange={e => setDraft(prev => {
                            return {...prev, first: {...prev.first, userInput:
                                        {...prev.first.userInput, sec: e.target.value}
                                }}
                        })}
                        onBlur={() => setDraft(prev => {
                            return {...prev, first: {...prev.first, userInput:
                                        {...prev.first.userInput, sec: valueFormatter(draft.first.userInput.sec)}
                                }}
                        })}
                        slotProps={FilterDurationMUI.TimeSlotProp}
                        size="small"
                        placeholder="SS"
                        disabled={draft.first.filter === FilterList.NONE}
                    />
                </Stack>
                {(draft.first.userInput?.min || draft.first.userInput?.hour || draft.first.userInput?.sec) && (
                    <>
                        <FormControl sx={FilterDurationMUI.FormSx}>
                            <RadioGroup
                                row
                                value={radio}
                                onChange={e => {setRadio(e.target.value as FilterConditionalList)}}>
                                <FormControlLabel value={FilterConditionalList.AND} control={<Radio/>} label={"AND"}/>
                                <FormControlLabel value={FilterConditionalList.OR} control={<Radio/>} label={"OR"}/>
                            </RadioGroup>
                        </FormControl>
                        <FormControl
                            fullWidth
                            size="small"
                            onMouseDown={(e) => e.stopPropagation()}
                            onClick={(e) => e.stopPropagation()}
                            sx={FilterDurationMUI.FormArgsSx}>
                            <Select<string>
                                name="second"
                                value={draft.second.filter}
                                onChange={handleFilterChange}
                            >
                                {Object.values(FilterList).map((i:FilterList) => {return <MenuItem value={i}>{i}</MenuItem>})}
                            </Select>
                        </FormControl>
                        <Stack direction="row" spacing={0} sx={FilterDurationMUI.StackSx}>
                            <TextField
                                id="hour"
                                value={draft.second.userInput.hour}
                                onChange={e => setDraft(prev => {
                                    return {...prev, second: {...prev.second, userInput:
                                                {...prev.second.userInput, hour: e.target.value}
                                        }}
                                })}
                                onBlur={() => setDraft(prev => {
                                    return {...prev, second: {...prev.second, userInput:
                                                {...prev.second.userInput, hour: valueFormatter(draft.second.userInput.hour)}
                                        }}
                                })}
                                slotProps={FilterDurationMUI.TimeSlotProp}
                                size="small"
                                placeholder="HH"
                                disabled={draft.second.filter === FilterList.NONE}
                            />
                            <Typography>:</Typography>
                            <TextField
                                value={draft.second.userInput.min}
                                onChange={e => setDraft(prev => {
                                    return {...prev, second: {...prev.second, userInput:
                                                {...prev.second.userInput, min: e.target.value}
                                        }}
                                })}
                                onBlur={() => setDraft(prev => {
                                    return {...prev, second: {...prev.second, userInput:
                                                {...prev.second.userInput, min: valueFormatter(draft.second.userInput.min)}
                                        }}
                                })}
                                slotProps={FilterDurationMUI.TimeSlotProp}
                                size="small"
                                placeholder="MM"
                                disabled={draft.second.filter === FilterList.NONE}
                            />
                            <Typography>:</Typography>
                            <TextField
                                value={draft.second.userInput.sec}
                                onChange={e => setDraft(prev => {
                                    return {...prev, second: {...prev.second, userInput:
                                                {...prev.second.userInput, sec: e.target.value}
                                        }}
                                })}
                                onBlur={() => setDraft(prev => {
                                    return {...prev, second: {...prev.second, userInput:
                                                {...prev.second.userInput, sec: valueFormatter(draft.second.userInput.sec)}
                                        }}
                                })}
                                slotProps={FilterDurationMUI.TimeSlotProp}
                                size="small"
                                placeholder="SS"
                                disabled={draft.second.filter === FilterList.NONE}
                            />
                        </Stack>
                    </>
                )}
                <Stack direction="row" gap={1} sx={FilterDurationMUI.StackButtonSx}>
                    <Button
                        variant="outlined"
                        onClick={handleApplyButton}>
                        Apply
                    </Button>
                    <Button
                        variant="outlined"
                        onClick={handleResetButton}>
                        Reset
                    </Button>
                </Stack>
            </div>
        </>
    )
}