import { UserGroupIcon } from "@heroicons/react/24/solid";
import { useState, useEffect } from "react";
import TextField from "components/TextField";
import tailwindConfig from "../../tailwind.config.mjs";
import { useNavigate } from "react-router-dom";
import { useLogin } from "context/LoginContext";
import ButtonPrimary from "components/ButtonPrimary";

function Login() {
    const colors = tailwindConfig?.theme?.extend?.colors as Record<string, string> | undefined;
    const grayLight = colors?.["gray-light"] ?? "#f7f7f7";
    
    useEffect(() => {
        document.title = "Login";
        document.body.style.backgroundColor = grayLight;
    }, [grayLight]);

    
    const navigate = useNavigate();
    const { login } = useLogin();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(false);
    
    const handleUsernameChange = (value: string) => {
        setUsername(value);
    };

    const handlePasswordChange = (value: string) => {
        setPassword(value);
    };
    
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        console.log(username)
        console.log(password)
        if (username != "" && password != ""){
            if (login(username, password)){
                navigate("/schedule");
            }
            else {
                setError(true);
            }
        }
        else{
            setError(true);
        }
    };

    return(
        <div className="min-h-screen flex items-center justify-center">
            <div className="flex flex-col p-4 gap-8 rounded-md border border-gray-primary shadow-xl bg-white">
                <div className="flex flex-col items-center items-center w-80">
                    <UserGroupIcon className="text-blue-primary w-20 h-20" />
                    <div className="text-blue-primary font-bold text-3xl">Volunteer Hub</div>
                    <div className="text-black-primary">Sign in to track your impact</div>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-3">
                        {error && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                                <strong className="font-bold">Login failed!</strong>
                                <span className="block sm:inline"> Invalid email or password.</span>
                            </div>
                        )}
                        <div>
                            <div className="text-lg font-semibold text-black-primary">Email</div>
                            <TextField value={username} onChange={handleUsernameChange} placeholder="you@example.com" type="email" />
                        </div>
                        <div>
                            <div className="text-lg font-semibold text-black-primary">Password</div>
                            <TextField value={password} onChange={handlePasswordChange} placeholder="••••••••" type="password" />
                        </div>
                    </div>
                    <div>
                        <ButtonPrimary text="Login" onClick={() => {}} type="submit" />
                        <div className="flex flex-col items-center text-sm">
                            <div>
                                Don't have an account?
                                <a className="font-semibold text-blue-primary hover:text-blue-500" href="#">Sign up</a>
                            </div>
                            <a className="font-semibold text-blue-primary hover:text-blue-500" href="#">Forgot passowrd / reset password</a>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Login