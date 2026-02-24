import React, { createContext, useContext, useState, ReactNode } from "react";

interface LoaderContextType {
    isLoading: boolean;
    showLoader: (message?: string) => void;
    hideLoader: () => void;
    message?: string;
}

const LoaderContext = createContext<LoaderContextType | undefined>(undefined);

interface LoaderProviderProps {
    children: ReactNode;
}

export const LoaderProvider: React.FC<LoaderProviderProps> = ({ children }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<string | undefined>(undefined);

    const showLoader = (loadingMessage?: string) => {
        setMessage(loadingMessage);
        setIsLoading(true);
    };

    const hideLoader = () => {
        setIsLoading(false);
        setMessage(undefined);
    };

    const value: LoaderContextType = {
        isLoading,
        showLoader,
        hideLoader,
        message,
    };

    return <LoaderContext.Provider value={value}>{children}</LoaderContext.Provider>;
};

export const useLoader = (): LoaderContextType => {
    const context = useContext(LoaderContext);
    if (context === undefined) {
        throw new Error("useLoader must be used within a LoaderProvider");
    }
    return context;
};
