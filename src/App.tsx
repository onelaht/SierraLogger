// react
import React, {useCallback, useEffect, useState} from 'react';
// styling
import "./App.css"
// react router
import {BrowserRouter as Router, Routes, Route} from "react-router-dom"
// split components
import LogLayout from "./Components/LogLayout";
import ProviderApp from "./Providers/ProviderApp";
// global vars
import SpinnerTemplate from "./Components/Templates/SpinnerTemplate";
import {useInitializer} from "./Providers/ProviderIniitalizer";

function AppInner() {
    const [fetched, setFetched] = useState<boolean>(false);
    const {setAccountNames} = useInitializer();

    const fetchNames = useCallback(async() => {
        // get names via db/backend
        const res = await fetch("/api/getAccountNames");
        const data = await res.json();
        // prompt to console if any error occurs
        if(!res.ok) {
            console.error("Error occurred in fetchNames(): ", res.status);
            return;
        }
        // if contains any value, assign to global var
        if(data?.names?.length > 0)
            setAccountNames(data?.names);
    }, [])

    useEffect(() => {
        fetchNames().then(() => setFetched(true));
    }, [])

    return (
        <>
            {fetched ?
                <div className="Container">
                    <div className="Layout"><LogLayout/></div>
                </div>
            :
                <div className="Container">
                    <SpinnerTemplate caption="Loading..."/>
                </div>
            }
        </>
    );
}

export default function App() {
    return (
        <ProviderApp>
            <Router>
                <Routes>
                    <Route path="/:account?" element={<AppInner/>}/>
                </Routes>
            </Router>
        </ProviderApp>
    )
}
