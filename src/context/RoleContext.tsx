import { getRoles } from "api/api";
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface Role {
    id: number;
    name: string;
}

interface RoleContextType {
    roles: Role[];
}

interface LoginProviderProps {
    children: ReactNode;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export const RolesProvider: React.FC<LoginProviderProps> = ({ children }) => {
    const [roles, setRoles] = useState<Role[]>([]);

    const fetchRoles = async () => {
        try {
            const res = await getRoles();
            //console.log(res.data);
            setRoles(
                res.data.data.map((d: any) => ({
                    ...d,
                }))
            );
        }
        catch (err) {
            console.error("failed to fetch user", err);
        }
    };

    useEffect(() => {
        fetchRoles(); //fetch dates once on startup
        const interval = setInterval(fetchRoles, 60000); // refresh every minute
        return () => clearInterval(interval);
    }, []);

    //providing a wrapper that gives the children access to user, login, logout, and loading variables
    return (
        <RoleContext.Provider value={{ roles }}> 
            {children}
        </RoleContext.Provider>
    );
};

export const useRoles = (): RoleContextType => {
    const context = useContext(RoleContext);
    if (!context) throw new Error('useRoles must be used within a RolesProvider');
    return context;
};