import React, {createContext, useContext, useMemo, useState} from "react";
import {IAccountData} from "../Types/IAccountData";
import {IAccount} from "../Types/IAccount";

interface IProviderFetcher {
    fetched: boolean;
    setFetched: React.Dispatch<React.SetStateAction<boolean>>;
    fetchAccounts: Promise<Map<string, IAccountData>>;
}

const FetcherContext = createContext<IProviderFetcher | null>(null);

export default function ProviderFetcher({children}:{children: React.ReactNode}) {
    const [fetched, setFetched] = useState<boolean>(false);

    const fetchAccounts:Promise<Map<string, IAccountData>> = useMemo(async() => {
        const temp:Map<string, IAccountData> = new Map<string, IAccountData>();
        // fetch data
        const res = await fetch("/api/retrieveAccounts")
        // if any error occurs
        if(!res.ok) {
            const err = res.text();
            console.error("Error occurred in fetchAccounts: ", res.status, err);
        }
        // get values
        const data = await res.json();
        // if not empty, initialize account map
        if(data?.accounts?.length > 0) {
            data.accounts.forEach((i:IAccount) => {
                temp.set(i.AccName, i.Data);
            })
        }
        return temp;
    }, [])

    return (
        <FetcherContext value={{fetched, setFetched, fetchAccounts}}>
            {children}
        </FetcherContext>
    )
}

export const useFetcher = () => {
    const context = useContext(FetcherContext);
    if(!context) throw new Error("FetcherContext must be used within a provider.");
    return context;
}