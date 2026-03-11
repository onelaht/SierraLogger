// react
import {ReactNode} from "react";
// providers wrapped
import ProviderFilter from "./ProviderFilter";
import ProviderInitializer from "./ProviderIniitalizer";
import ProviderAccount from "./ProviderAccount";

interface IProviderAppType{
    children: ReactNode;
}

export default function ProviderApp({children}:IProviderAppType) {
    return (
        <ProviderInitializer>
            <ProviderAccount>
                <ProviderFilter>
                    {children}
                </ProviderFilter>
            </ProviderAccount>
        </ProviderInitializer>
    )
}