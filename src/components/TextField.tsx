type TextFieldProps = {
    value: string;
    onChange: (newValue: string) => void;
    className?: string;
    placeholder?: string;
    type?: string;
}

function TextField( { value, onChange, className, placeholder, type }: TextFieldProps) {

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        onChange(event.target.value);
    };

    return (
        <input value={value} onChange={handleChange} className={`w-full px-3 py-2 text-black-primary focus:text-blue-primary rounded border border-gray-primary focus:border-blue-primary ${className}`} placeholder={placeholder} type={type} />
    );
}

export default TextField;