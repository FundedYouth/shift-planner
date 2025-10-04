import React, { createContext, useContext, useState, useEffect, ReactNode, useRef } from "react";
import { delDate, getDates, postDate, putDate } from "api/api";

export interface DateItem {
    id: number;
    user_id: number;
    dt_start: Date;
    dt_end: Date;
    loading: boolean;
}

interface DatesContextType {
    dates: DateItem[];
    createDate: (date: Partial<DateItem>) => Promise<void>;
    updateDate: (edit_id: number, date: Partial<DateItem>) => Promise<void>;
    deleteDate: (del_id: number) => Promise<void>;
}

interface DatesProviderProps {
    children: ReactNode;
}

const DatesContext = createContext<DatesContextType | undefined>(undefined);

export const DatesProvider: React.FC<DatesProviderProps> = ({ children }) => {
    const [dates, setDates] = useState<DateItem[]>([]);

    const [pendingDeletes, setPendingDeletes] = useState<Set<number>>(new Set());
    const pendingDeletesRef = useRef<Set<number>>(new Set());
    const setPendingDeletesSafe = (updater: (prev: Set<number>) => Set<number>) => {
        pendingDeletesRef.current = updater(pendingDeletesRef.current);
        setPendingDeletes(new Set(pendingDeletesRef.current));
    };

    const [pendingUpdates, setPendingUpdates] = useState<Set<number>>(new Set());
    const pendingUpdatesRef = useRef<Set<number>>(new Set());
    const setPendingUpdatesSafe = (updater: (prev: Set<number>) => Set<number>) => {
        pendingUpdatesRef.current = updater(pendingUpdatesRef.current);
        setPendingUpdates(new Set(pendingUpdatesRef.current));
    };

    const fetchingRef = useRef(false);
    const fetchDates = async () => {        
        if (fetchingRef.current) return;
        fetchingRef.current = true;
        try {
            const res = await getDates();
            //console.log(res.data.data)
            
            const serverDates: DateItem[] = res.data.data.map((d: any) => ({
                ...d,
                dt_start: new Date(d.dt_start),
                dt_end: new Date(d.dt_end),
            } as DateItem));

            setDates(prev => {
                const localOptimistic = prev.filter(d => d.id < 0  || pendingUpdatesRef.current.has(d.id)); //temp IDs and is currently updating
                const filteredServer = serverDates.filter(d => !pendingDeletesRef.current.has(d.id) && !pendingUpdatesRef.current.has(d.id));
                return [...filteredServer, ...localOptimistic];
            });
        }
        catch (err) {
            console.error("failed to fetch user", err);
        }
        finally {
            fetchingRef.current = false;
        }
    };

    const createDate = async (date: Partial<DateItem>) => {
        const tempId = -Date.now();
        const newDate: DateItem = { ...date, id: tempId, loading: true} as DateItem;
        //add our fake dateItem to the localDatabase
        setDates(prev => [...prev, newDate]);
        try {
            const res = await postDate(newDate);
            //console.log(res.data.data)
            //fix the dateItem object to be one on the server
            const formatedDate: DateItem = {...res.data.data,
                dt_start: new Date(res.data.data.dt_start),
                dt_end: new Date(res.data.data.dt_end),
                loading: false
            } as DateItem;
            setDates(prev =>
                prev.map(d => (d.id === tempId ? formatedDate : d))
            );
        }
        catch (err) {
            console.error(err);
            //rollback the optimistic date that was added to the dates after it was found to fail the add
            setDates(prev => prev.filter(d => d.id !== tempId));
        }
    };

    const updateDate = async (edit_id: number, date: Partial<DateItem>) => {
        //find the one we are deleting --> for if we ever need to restore it
        const oldDate = dates.find((u) => u.id === edit_id && !u.loading);
        if (!oldDate){
            console.log(`Couldn't find date with id ${edit_id} to edit`);
            return;
        }
        const newDate: DateItem = { ...date, id: edit_id} as DateItem;
        //update the dateItem in the localDatabase
        setDates(prev => 
            prev.map(d => (d.id === edit_id ? newDate : d))
        );
        setPendingUpdatesSafe(prev => {
            const newSet = new Set(prev);
            newSet.add(edit_id);
            return newSet;
        });

        try {
            const res = await putDate(newDate);
            //console.log(res.data.data)
            //fix the dateItem object to be one on the server -- this seems redundent but good to do anyway
            const formatedDate: DateItem = {...res.data.data,
                dt_start: new Date(res.data.data.dt_start),
                dt_end: new Date(res.data.data.dt_end)
            } as DateItem;
            setDates(prev =>
                prev.map(d => (d.id === edit_id ? formatedDate : d))
            );
            setPendingUpdatesSafe(prev => {
                const newSet = new Set(prev);
                newSet.delete(edit_id);
                return newSet;
            });
        }
        catch (err) {
            console.error(err);
            //rollback the optimistic date that was added to the dates after it was found to fail the add
            setDates(prev => 
                prev.map(d => (d.id === edit_id ? oldDate : d))
            );
            setPendingUpdatesSafe(prev => {
                const newSet = new Set(prev);
                newSet.delete(edit_id);
                return newSet;
            });
        }
    };

    const deleteDate = async (del_id: number) => {
        //find the one we are deleting --> for if we ever need to restore it
        const oldDate = dates.find((u) => u.id === del_id && !u.loading);
        if (!oldDate){
            console.log(`Couldn't find date with id ${del_id} to delete`);
            return;
        }
        //update the dateItem in the localDatabase
        setDates(prev => prev.filter(d => d.id !== del_id));
        setPendingDeletesSafe(prev => {
            const newSet = new Set(prev);
            newSet.add(del_id);
            return newSet;
        });

        try {
            const res = await delDate(del_id);
            //console.log(res.data.data)
            setPendingDeletesSafe(prev => {
                const newSet = new Set(prev);
                newSet.delete(del_id);
                return newSet;
            });
        }
        catch (err) {
            console.error(err);
            //rollback the optimistic date deletion
            setDates(prev => [...prev, oldDate]);
            setPendingDeletesSafe(prev => {
                const newSet = new Set(prev);
                newSet.delete(del_id);
                return newSet;
            });
        }
    };

    useEffect(() => {
        fetchDates(); //fetch dates once on startup
        const interval = setInterval(fetchDates, 15000); // refresh every 15s
        return () => clearInterval(interval);
    }, []);

    //providing a wrapper that gives the children access to user, login, logout, and loading variables
    return (
        <DatesContext.Provider value={{ dates, createDate, updateDate, deleteDate }}> 
            {children}
        </DatesContext.Provider>
    );
};

export const useDates = (): DatesContextType => {
    const context = useContext(DatesContext);
    if (!context) throw new Error('useDates must be used within a DatesProvider');
    return context;
};