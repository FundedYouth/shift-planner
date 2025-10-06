type ButtonNavProps = {
    text: string;
    active: boolean;
    onClick: () => void;
    className?: string;
}
function ButtonNav({ text, active, onClick, className }: ButtonNavProps) {
    return (
        <button
            onClick={onClick}
            className={`
                px-4 py-2 rounded-md transition-colors hover:bg-blue-accent
                ${active 
                ? "bg-blue-primary text-white hover:text-black-primary font-bold" 
                : "bg-transparent text-black-primary font-normal"}
                ${className}
            `}
        >
            {text}
        </button>
    );
}

export default ButtonNav
