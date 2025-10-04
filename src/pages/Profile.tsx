import TextField from "components/TextField";
import { PencilIcon } from "@heroicons/react/24/solid";
import { useState, useEffect } from "react";
import { useUsers, UpdateUserArgs } from "context/UsersContext";
import { User } from "context/UsersContext";
import { useLogin } from "context/LoginContext";
import { useRoles } from "context/RoleContext";
import ButtonPrimary from "components/ButtonPrimary";

function Profile() {
    const { user_id } = useLogin();
    const { getUser, updateUser } = useUsers();
    const { roles } = useRoles();

    const [user, setUser] = useState<User | null>(null);
    
    useEffect(() => {
        let mounted = true;

        if (user_id === null) return;
        
        getUser(user_id).then((u) => {
            if (mounted){
                setUser(u)
            }
        });
        return () => {
            mounted = false;
        };
    }, [user_id, getUser]);

    const [firstName, setFirstName] = useState("Loading...");
    const [lastName, setLastName] = useState("Loading...");
    const [email, setEmail] = useState("Loading...");
    const [password, setPassword] = useState("");
    const [phone, setPhone] = useState("Loading...");
    const [DOB, setDOB] = useState("Loading...");
    const [role, setRole] = useState<string | undefined>();
    
    useEffect(() => {
    if (user && !user.loading) {
        setFirstName(user.first_name);
        setLastName(user.last_name);
        setEmail(user.email);
        setPhone(user.phone);
        setDOB(user.dob);

        setRole(roles.find((u) => u.id === user.user_role)?.name);
    }
    }, [user]);

    const handleUpdate = async () =>{
        if (user && !user.loading){
            const args: UpdateUserArgs = {};
            
            if (firstName !== user.first_name) args.first_name = firstName;
            if (lastName !== user.last_name) args.last_name = lastName;
            if (email !== user.email) args.email = email;
            if (phone !== user.phone) args.phone = phone;
            if (DOB !== user.dob) args.dob = DOB;
            
            if (password && password.trim() !== "") args.password = password;
            
            if (Object.keys(args).length === 0) {
                console.log("No changes to save");
                return;
            }

            try {
                await updateUser(args);
                console.log("User updated successfully!");
            } catch (err) {
                console.error("Failed to update user", err);
            }
        }
    };

    return(
        <>
            <div className="flex flex-col items-center justify-center gap-2">
                <div className="flex flex-col p-4 rounded-md border border-gray-primary shadow-xl bg-white items-center w-80">
                    <div className="relative w-32 h-32">
                    <img
                        src="https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"
                        alt="Profile"
                        className="w-32 h-32 rounded-full object-cover border border-gray-primary shadow"
                    />
                    <button
                        type="button"
                        className="absolute bottom-0 right-0 bg-blue-primary p-2 rounded-full hover:bg-blue-dark"
                    >
                        <PencilIcon className="h-5 w-5 text-white" />
                    </button>
                    </div>
                    <div className="text-black-primary text-xl font-bold">{(user && !user.loading) ? `${user?.first_name} ${user?.last_name}` : "Loading..."}</div>
                    <div className="text-black-primary text-base">{role ? role : "Loading..."}</div>
                </div>
                <div className="flex flex-col p-4 gap-3 rounded-md border border-gray-primary shadow-xl bg-white w-80">
                    <div className="flex flex-col text-black-primary text-lg">
                        <div>
                            First Name
                        </div>
                        <TextField value={firstName} onChange={(value: string) => {setFirstName(value);}}/>
                    </div>
                    <div className="flex flex-col text-black-primary text-lg">
                        <div>
                            Last Name
                        </div>
                        <TextField value={lastName} onChange={(value: string) => {setLastName(value);}}/>
                    </div>
                    <div className="flex flex-col text-black-primary text-lg">
                        <div>
                            Email
                        </div>
                        <TextField value={email} onChange={(value: string) => {setEmail(value);}}/>
                    </div>
                    <div className="flex flex-col text-black-primary text-xl">
                        <div>
                            Password
                        </div>
                    </div>
                        <TextField value={password} onChange={(value: string) => {setPassword(value);}}/>
                    <div className="flex flex-col text-black-primary text-lg">
                        <div>
                            Phone
                        </div>
                        <TextField value={phone} onChange={(value: string) => {setPhone(value);}}/>
                    </div>
                    <div className="flex flex-col text-black-primary text-lg">
                        <div>
                            DOB
                        </div>
                        <TextField value={DOB} onChange={(value: string) => {setDOB(value);}}/>
                    </div>
                    <div className="flex flex-col text-xl">
                        <ButtonPrimary text="Update" onClick={handleUpdate}/>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Profile