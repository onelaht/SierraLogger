// MUI components
import {Box, Accordion, AccordionSummary, AccordionDetails,
    Typography, Button} from '@mui/material'
// MUI icons
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
// MUI styling
import {LogAccountsMUI} from "./MUIStyling/LogAccountsMUI";
// global vars
import {useInitializer} from "../Providers/ProviderIniitalizer";
// react router (get path)
import {useNavigate} from "react-router-dom"
// split component
import LogAccountCreator from "./LogAccountCreator";

export default function LogAccountSelector() {
    // go to path
    const nav = useNavigate();
    // global vars
    const {accountNames} = useInitializer();

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
            <LogAccountCreator/>
        </Box>
    )
}