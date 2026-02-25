// react
import React, {ChangeEvent, useCallback, useState} from "react";
// global vars
import {useTag} from "../Providers/ProviderTag";
import {useGrid} from "../Providers/ProviderGrid";
// types
import {Row} from "../Types/Row";
import {ColDef, ISelectCellEditorParams} from "ag-grid-community";
// mui commponents
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Button,
    Divider,
    TextField,
    Typography
} from '@mui/material';
// mui icons
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// mui styling
import {LogTagsMUI} from "./MUIStyling/LogTagsMUI"

export default function LogTags() {
    // global vars
    const {setColDefs, gridRef} = useGrid();
    const {tagDefs, setTagDefs} = useTag();
    // track tags with edit mode enabled
    const [edit, setEdit] = useState<string>("");
    // assign tag and params (new tags)
    const [tagName, setTagName] = useState<string>("");
    const [parameters, setParameters] = useState<string[]>([""]);
    // assign tag and params (existing tags)
    const [draftTagName, setDraftTagName] = useState<string>("");
    const [draftParameters, setDraftParameters] = useState<string[]>([""]);

    // returns tagDefs without the specified def
    const tagDefsExcept = useCallback((def:ColDef<Row>) => {
        return tagDefs.filter((t) => t !== def);
    }, [tagDefs])

    // build new tag and push to column list
    const handleNewTag = useCallback(() => {
        // build new tag
        const col:ColDef<Row> = {
            field: tagName,
            editable: true,
            cellDataType: "text",
            filter: "agTextColumnFilter",
            cellEditor: 'agSelectCellEditor',
            cellEditorParams: {
                values: parameters
            } as ISelectCellEditorParams,
        }
        // track tag column
        setTagDefs(prev => {
            const tempDefs = [...prev];
            tempDefs.push(col);
            return tempDefs;
        })
        // add to column list
        setColDefs(() => {
            const tempDefs = [...gridRef?.current?.api?.getColumnDefs() as ColDef<Row>[]]
            tempDefs.push(col);
            return tempDefs;
        })
        // reset text fields
        setTagName("");
        setParameters([""]);
    }, [tagName, parameters, setColDefs, setTagDefs, gridRef])

    // removes tag from column list
    const handleDeleteTag = useCallback((col:ColDef<Row>) => {
        setTagDefs(prev => {
            return [...prev].filter((i) => i !== col);
        })
        setColDefs(prev => {
            return [...prev].filter((i) => i !== col);
        })
    }, [setColDefs, setTagDefs])

    // update edit tracker and copy current tag name/params for revision
    const handleEditState = useCallback((col:ColDef<Row>, ) => {
        (col.field === edit) ? setEdit("") : setEdit(col.field as string);
        // initialize draft values from current definition
        setDraftTagName(col.field as string);
        setDraftParameters(() => {
            return [...col.cellEditorParams.values];
        })
    }, [edit])

    // update parameter value when updated
    const handleParametersChange = (value: string, index: number, handler:React.Dispatch<React.SetStateAction<string[]>>) => {
        handler(prev => {
            return prev.map((p:string, i:number) => {
                if(index === i) return value;
                return p;
            })
        })
    }

    // determines if tag name already exists in def array
    // - returns true if tag name already exists
    // - returns false if tag name is unused
    const validateTag = (name: string, defs:ColDef<Row>[]) => {
        return (defs.filter((i) => i.field === name).length > 0);
    }

    // determines if all parameters are filled
    // - returns true if each params contains a value
    // - returns false if at least one param is empty
    const validateParameters = (params: string[]) => {
        return (params.filter((i) => i.length < 1).length > 0);
    }

    // determines if revised def is the same the original def
    // - returns true if it contains the same value
    // - returns false if it contains different values
    const isEqual = (name:string, params:string[], def:ColDef<Row>) => {
        return (def.field === name && JSON.stringify(def.cellEditorParams.values) === JSON.stringify(params))
    }

    // update tag based on user input and update column list
    const handleExistingTag = useCallback((oldTag:ColDef<Row>) => {
        // build revised tag
        const newTag:ColDef<Row> = {
            field: draftTagName,
            editable: true,
            cellDataType: "text",
            filter: "agTextColumnFilter",
            cellEditor: 'agSelectCellEditor',
            cellEditorParams: {
                values: draftParameters
            } as ISelectCellEditorParams,
        }
        // update coldefs
        setColDefs(prev => {
            return prev.map((i) => {
                if (i.field === oldTag.field)
                    return newTag;
                return i;
            });
        })
        // update tag tracker
        setTagDefs(prev => {
            return prev.map((i) => {
                if(i.field === oldTag.field)
                    return newTag;
                return i;
            })
        })
    }, [draftTagName, draftParameters, setColDefs, setTagDefs])

    return (
        <Box sx={LogTagsMUI.Container}>
            <Accordion defaultExpanded>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon/>}>
                    <Typography variant="body1">Current tags ({tagDefs.length})</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    {tagDefs.length < 1 &&
                        <Typography variant="body2">No Tags Found</Typography>
                    }
                    {tagDefs.length >= 1 && tagDefs.map((i) => (

                       <Accordion>
                           <AccordionSummary
                               expandIcon={<ExpandMoreIcon/>}>
                               <Typography variant="body1">{i.field}</Typography>
                           </AccordionSummary>
                           <AccordionDetails>
                               <Box sx={LogTagsMUI.EditDeleteContainer}>
                                   <Button
                                       sx={LogTagsMUI.EditDeleteButton}
                                       size="small"
                                       onClick={() => handleEditState(i)}>
                                       {edit === i.field as string ? "Disable Edit" : "Enable Edit"}
                                   </Button>
                                   <Button
                                       sx={LogTagsMUI.EditDeleteButton}
                                       size="small"
                                       onClick={() => handleDeleteTag(i)}>
                                       Delete
                                   </Button>
                               </Box>
                               <Box sx={LogTagsMUI.TagContainer}>
                                   <TextField
                                       label="Tag Name"
                                       disabled={edit !== i.field as string}
                                       error={(edit === i.field as string) && validateTag(draftTagName, tagDefsExcept(i))}
                                       helperText={(edit === i.field as string) &&
                                           (validateTag(draftTagName, tagDefsExcept(i)) && "Tag name already exists")}
                                       onChange={(e:ChangeEvent<HTMLInputElement>) =>
                                           setDraftTagName(e.target.value)}
                                       value={edit !== i.field ? i.field : draftTagName}/>
                               </Box>
                               <Divider sx={LogTagsMUI.Divider}/>
                               <Box sx={LogTagsMUI.TagContainer}>
                                   {edit === i.field as string && draftParameters.map((j:string, index: number) => (
                                       <TextField
                                           sx={LogTagsMUI.TagParamText}
                                           disabled={false}
                                           onChange={(e) =>
                                               handleParametersChange(e.target.value, index, setDraftParameters)}
                                           label={`Parameter ${index+1}`}
                                           value={j}/>
                                   ))}
                                   {edit !== i.field as string && i.cellEditorParams.values.map((j:string, index: number) => (
                                       <TextField
                                           sx={LogTagsMUI.TagParamText}
                                           disabled={true}
                                           label={`Parameter ${index+1}`}
                                           value={j}/>
                                   ))}
                               </Box>
                               {edit === i.field as string &&
                                   <Box sx={LogTagsMUI.ParamAddSaveContainer}>
                                       <Button
                                           onClick={() => setDraftParameters(prev =>  [...prev, ""])}>
                                           Add Parameter
                                       </Button>
                                       <Button
                                           disabled={draftTagName.length < 1 || validateParameters(draftParameters) ||
                                               validateTag(draftTagName, tagDefsExcept(i)) ||
                                               isEqual(draftTagName, draftParameters, i)}
                                           onClick={() => handleExistingTag(i)}>
                                           Save Changes
                                       </Button>
                                   </Box>
                               }
                           </AccordionDetails>
                       </Accordion>
                    ))}
                </AccordionDetails>
            </Accordion>
            <Accordion defaultExpanded>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon/>}>
                    <Typography variant="body1">Create new tag</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Box sx={LogTagsMUI.TagContainer}>
                        <TextField
                            label="Tag Name"
                            error={validateTag(tagName, tagDefs)}
                            helperText={validateTag(tagName, tagDefs) && "Tag name already exists"}
                            value={tagName}
                            onChange={(e) => setTagName(e.target.value)}/>
                    </Box>
                    <Divider sx={LogTagsMUI.Divider}/>
                    <Box sx={LogTagsMUI.TagContainer}>
                        {parameters.map((param, index) => (
                            <TextField
                                sx={LogTagsMUI.TagParamText}
                                label={`Parameter ${index+1}`}
                                value={param}
                                onChange={(e) =>
                                    handleParametersChange(e.target.value, index, setParameters)}
                            />
                        ))}
                        <Button
                            onClick={() => setParameters(prev => [...prev, ""])}>
                            Add parameter
                        </Button>
                        <Divider sx={LogTagsMUI.Divider}/>
                        <Button
                            variant="outlined"
                            disabled={tagName.length < 1 || validateTag(tagName, tagDefs) ||
                                validateParameters(parameters)}
                            onClick={handleNewTag}>
                            Create tag
                        </Button>
                    </Box>
                </AccordionDetails>
            </Accordion>
        </Box>
    )
}