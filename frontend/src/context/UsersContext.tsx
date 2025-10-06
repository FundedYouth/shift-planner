import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { getUserById, putUser } from "api/api";
import { useLogin } from "./LoginContext";

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  user_role: number;
  email: string;
  phone: string;
  dob: string;
  profile: string;
  loading: boolean;
  cache_time: number;
}

export interface UpdateUserArgs {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  dob?: string;
  password?: string;
};

interface UserContextType {
    getUser: (user_id: number) => Promise<User>;
    updateUser: (args: UpdateUserArgs) => Promise<void>;
}

interface UserProviderProps {
    children: ReactNode;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UsersProvider: React.FC<UserProviderProps> = ({ children }) => {
    const [users, setUsers] = useState<User[]>([]);

    const getUser = async (targetId: number): Promise<User> => {
        const cached = users.find((u) => u.id === targetId);
        if (cached && Date.now() - cached.cache_time < 240000) { //cache time of 4 min before we refresh it
            return cached;
        }

        const optimisticUser: User = cached ?? {
            id: targetId,
            first_name: "",
            last_name: "",
            user_role: -1,
            email: "",
            phone: "",
            dob: "",
            profile: "",
            loading: true,
            cache_time: Date.now(),
        };

        if (!cached){
            setUsers((prev) => [...prev, optimisticUser]);
        }

        getUserById(targetId)
        .then((realUser) => {
            setUsers((prev) =>
                prev.map((u) => u.id === targetId ? { ...realUser, loading: false, cache_time: Date.now(), } : u)
            );
        })
        .catch((err) => {
            console.error("Failed to fetch user:", err);
            setUsers((prev) =>
                prev.filter((u) => u.id !== targetId)
            );
        });

        return optimisticUser;
    };

    const updateUser = async ( args: UpdateUserArgs): Promise<void> => {
        if(!user_id){ //if we don't have a valid user_id then there is no point in continuing
            return;
        }

        const oldUser = users.find((u) => u.id === user_id && !u.loading);
        if (!oldUser){
            console.log(`Couldn't find date with id ${user_id} to edit`);
            return;
        }

        const newUser: User = { ...oldUser, ...(args as Partial<User>),} as User;
        setUsers(prev => 
            prev.map(d => (d.id === user_id ? newUser : d))
        );
        try {
            const res = await putUser(user_id, args);
            setUsers(prev =>
                prev.map(d => (d.id === user_id ? {...res.data.data, loading: false, cache_time: Date.now()} : d))
            );
        }
        catch (err) {
            console.error(err);
            setUsers(prev => 
                prev.map(d => (d.id === user_id ? oldUser : d))
            );
        }
    };


    const { user_id } = useLogin();
    useEffect(() => {
        if (user_id){
            getUser(user_id); //fetch the person who logged in once on startup
        }
    }, []);


    //providing a wrapper that gives the children access to user, login, logout, and loading variables
    return (
        <UserContext.Provider value={{ getUser, updateUser }}> 
            {children}
        </UserContext.Provider>
    );
};

export const useUsers = (): UserContextType => {
    const context = useContext(UserContext);
    if (!context) throw new Error('useUsers must be used within a UsersProvider');
    return context;
};