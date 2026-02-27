// react
import {ReactNode} from "react";
// providers wrapped
import ProviderFilter from "./ProviderFilter";
import ProviderGrid from "./ProviderGrid";
import ProviderTag from "./ProviderTag";
import ProviderFetcher from "./ProviderFetcher";
import ProviderInitializer from "./ProviderIniitalizer";

interface IProviderAppType{
    children: ReactNode;
}

export default function ProviderApp({children}:IProviderAppType) {
    return (
        <ProviderInitializer>
            <ProviderGrid>
                <ProviderFilter>
                    <ProviderTag>
                        <ProviderFetcher>
                            {children}
                        </ProviderFetcher>
                    </ProviderTag>
                </ProviderFilter>
            </ProviderGrid>
        </ProviderInitializer>
    )
}