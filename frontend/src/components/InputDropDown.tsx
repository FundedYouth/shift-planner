import { convertNumToTimeString } from "util/NumToTime"

type InputDropDownProps = {
    start: number;
    end: number;
    value: number;
    onChange: (newValue: number) => void;
}

function InputDropDown({ start, end, value, onChange }: InputDropDownProps) {

    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        onChange(Number(event.target.value));
    };
    
    const hours: number[] = [];
    for (let i = start; i <= end;i += 1) {
        hours.push(i);
    }

    return (
        <div>
            <select value={value} onChange={handleChange} className="w-full px-3 py-2 text-black-primary focus:text-blue-primary rounded border border-gray-primary focus:border-blue-primary">
                {hours.map((hour) => (
                <option key={hour} value={hour}>
                    {convertNumToTimeString(hour)}
                </option>
                ))}
            </select>
        </div>
    );
}

export default InputDropDown
