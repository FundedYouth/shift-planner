import { convertNumToTimeString } from "util/NumToTime"

import { useUsers } from "context/UsersContext"
import { useEffect, useState } from "react";
import { User } from 'context/UsersContext';

type RowData = {
    profile: number;
    start: number;
    end: number;
}

function UserItemRow( {profile, start, end} : RowData) {
    const { getUser } = useUsers();

    const [user, setUser] = useState<User | null>(null);
    
    useEffect(() => {
        let mounted = true;
        getUser(profile).then((u) => {
            if (mounted){
                setUser(u)
            }
        });
        return () => {
            mounted = false;
        };
    }, [profile, getUser]);

    return (
        <div className="flex flex-row w-full border-b border-blue-accent p-2">
            <div className="flex relative w-14 h-14">
                <img
                    src="https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"
                    alt="Profile"
                    className="w-14 h-14 rounded-full object-cover border border-gray-primary shadow"
                />
            </div>
            <div className="flex flex-col px-4 justify-center">
                <div className="flex text-black-primary text-base font-bold">
                      {user === null || user.loading ? (
                            <span className="spinner">Loading...</span>
                        ) : (
                            `${user.first_name} ${user.last_name}`
                        )}
                </div>
                <div className="flex text-black-primary text-base">{convertNumToTimeString(start)} - {convertNumToTimeString(end)}</div>
            </div>
        </div>
    );
}

export default UserItemRow