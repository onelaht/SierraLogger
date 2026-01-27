// react
import {useEffect} from "react";
// global vars
import {useFetcher} from "../Providers/ProviderFetcher";
import {useGrid} from "../Providers/ProviderGrid";
// MUI components
import {Box, CircularProgress, Typography } from "@mui/material";
// MUI styling
import {LogFetcherMUI} from "./LogFetcherMUI";

export default function LogFetcher() {
    // global vars
    const {setFetched, fetchAccounts} = useFetcher();
    const {setAccounts} = useGrid();

    // get account list
    useEffect(() => {
        // retrieve accounts from backend
        const initializeAccounts = async () => {
            const temp = await fetchAccounts;
            setAccounts(temp);
            setFetched(true);
        }
        initializeAccounts();
    }, [])

    return (
        <Box sx={LogFetcherMUI.Container}>
            <CircularProgress sx={LogFetcherMUI.Spinner}/>
            <Typography sx={LogFetcherMUI.Text}>Loading data...</Typography>
        </Box>
    )
}