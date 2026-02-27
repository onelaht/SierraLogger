import React, {createContext, useContext, useState} from "react";

interface IInitializerContextType {
    accountNames: string[];
    setAccountNames: React.Dispatch<React.SetStateAction<string[]>>
}

const InitializerContext = createContext<IInitializerContextType | null>(null);

export default function ProviderInitializer({children}:{children:React.ReactNode}) {
    const [accountNames, setAccountNames] = useState<string[]>([]);

    return (
        <InitializerContext value={{accountNames, setAccountNames}}>
            {children}
        </InitializerContext>
    )
}

export const useInitializer = () => {
    const ctx = useContext(InitializerContext);
    if (!ctx) throw new Error("InitializerContext must be used within a provider");
    return ctx;
}