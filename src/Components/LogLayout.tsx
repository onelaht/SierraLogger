// react
import {useCallback, useEffect, useRef, useState} from "react";
// flex-layout
import {Layout, Model, TabNode} from 'flexlayout-react';
import 'flexlayout-react/style/light.css';
import {Layout1} from '../Layouts/Layout1';
// global vars
import {useAccount} from "../Providers/ProviderAccount";
// react router (get path)
import {useLocation} from "react-router-dom";
// split component
import LogTable from "./LogTable"
import LogColVisibility from "./LogColVisibility";
import LogTags from "./LogTags";
import LogAccountSelector from "./LogAccountSelector";
import PerformanceChart from "./PerformanceChart";

export default function LogLayout() {
    // get path
    const {pathname} = useLocation();
    // reference for flexlayout (used in the future)
    const layoutRef = useRef<Layout | null>(null);
    // global vars
    const {handleDefs} = useAccount();
    // flexlayout ui model
    const [model] = useState<Model>(Model.fromJson(Layout1))
    // renders components using specified flexlayout model
    const factory = useCallback((node:TabNode) => {
        // reads in model and retrieves values for "components"
        const component = node.getComponent();
        // render additional components based on value
        switch(component) {
            case "Accounts": return <LogAccountSelector/>
            case "PerformanceChart": return <PerformanceChart/>
            case "ColumnVisibility": return <LogColVisibility/>
            case "Tags": return <LogTags/>
            case "Table": return <LogTable/>
        }
    }, [])

    // get account data (via path/account)
    // - returns empty arrays if account is not found
    const fetchAccount = useCallback(async () => {
        const res = await fetch("/api/getAccount",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({name: pathname.substring(1)}),
            });
        if(!res.ok) {
            console.error("Error occurred in fetchAccount: ", res.statusText);
            return;
        }
        const data = await res.json();
        handleDefs(data?.account?.AccName ?? [], data?.account?.RowData ?? [], data?.account?.ColDefs ?? [],
            data?.account?.TagDefs ?? []);
    }, [pathname, handleDefs])

    useEffect(() => {
        if(pathname === "/") return;
        fetchAccount()
    }, [pathname])

    return (
        <Layout
            ref={layoutRef}
            model={model}
            factory={factory}/>
    )
}