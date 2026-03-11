// MUI components
import {Box, CircularProgress, Typography} from "@mui/material";
// styling
import {SpinnerTemplateMUI} from "../MUIStyling/Templates/SpinnerTemplateMUI";

export default function SpinnerTemplate({caption}:{caption: string}) {
    return (
        <Box sx={SpinnerTemplateMUI.Container}>
            <CircularProgress sx={SpinnerTemplateMUI.Spinner}/>
            <Typography sx={SpinnerTemplateMUI.Text}>{caption}</Typography>
        </Box>
    )
}