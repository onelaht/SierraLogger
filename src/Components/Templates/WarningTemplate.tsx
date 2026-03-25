// MUI components
import {Box, Typography} from "@mui/material";
// MUI Icons
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
// styling
import {WarningTemplateMUI} from "../MUIStyling/Templates/WarningTemplateMUI";

export default function WarningTemplate({caption}:{caption: string}) {
    return (
        <Box sx={WarningTemplateMUI.Container}>
            <PriorityHighIcon sx={WarningTemplateMUI.Spinner}/>
            <Typography sx={WarningTemplateMUI.Text}>{caption}</Typography>
        </Box>
    )
}