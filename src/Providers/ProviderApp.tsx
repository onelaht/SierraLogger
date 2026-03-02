// react
import {ReactNode} from "react";
// providers wrapped
import ProviderFilter from "./ProviderFilter";
import ProviderGrid from "./ProviderGrid";
import ProviderTag from "./ProviderTag";
import ProviderFetcher from "./ProviderFetcher";
import ProviderInitializer from "./ProviderIniitalizer";
import ProviderAccount from "./ProviderAccount";

interface IProviderAppType{
    children: ReactNode;
}

export default function ProviderApp({children}:IProviderAppType) {
    return (
        <ProviderInitializer>
            <ProviderAccount>
                <ProviderGrid>
                    <ProviderFilter>
                        <ProviderTag>
                            <ProviderFetcher>
                                {children}
                            </ProviderFetcher>
                        </ProviderTag>
                    </ProviderFilter>
                </ProviderGrid>
            </ProviderAccount>
        </ProviderInitializer>
    )
}