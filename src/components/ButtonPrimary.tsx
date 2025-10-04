import { Link } from "react-router-dom";

type ButtonPrimaryProps = {
    text: string;
    onClick: () => void;
    type?: "button" | "submit" | "reset";
}
function ButtonPrimary({ text, onClick, type }: ButtonPrimaryProps) {
    return (
        <button
            onClick={onClick}
            className={"px-4 py-2 w-full rounded-md transition-colors bg-blue-primary hover:bg-blue-dark text-white font-bold"}
            type={type}
        >
            {text}
        </button>
    );
}

export default ButtonPrimary
