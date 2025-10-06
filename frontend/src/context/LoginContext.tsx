import { loginAPI } from "api/api";
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface LoginContextType {
    user_id: number | null;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => void;
}

interface LoginProviderProps {
    children: ReactNode;
}

const LoginContext = createContext<LoginContextType | undefined>(undefined);

export const LoginProvider: React.FC<LoginProviderProps> = ({ children }) => {
    const [user_id, setUserId] = useState<number | null>(null);
    const login = async (email: string, password: string) => {
        //make an API call to login
        try {
            const res = await loginAPI(email, password);
            //console.log(res.data);
            //console.log(res.data.data.id);
            setUserId(res.data.data.id);
            return true;
        }
        catch (err) {
            console.error("failed to fetch user", err);
        }
        return false;
    };
    const logout = () => setUserId(null);
    
    return (
        <LoginContext.Provider value={{user_id, login, logout}}> 
            {children}
        </LoginContext.Provider>
    );
};

export const useLogin = (): LoginContextType => {
    const context = useContext(LoginContext);
    if (!context) throw new Error('useLogin must be used within a LoginProvider');
    return context;
};