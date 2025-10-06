import ButtonNav from "./ButtonNav";
import { useLogin } from "context/LoginContext";
import { useDates } from "context/DatesContext";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";

type CalendarProps = {
    anyUserID: boolean;
    start: number;
    date: Date;
    onSelectDate: (date: Date) => void;
    onChangeMonth: (change: number) => void;
}
function Calendar({ anyUserID, start, date, onSelectDate, onChangeMonth }: CalendarProps) {

    const { dates } = useDates();
    const { user_id } = useLogin();
    const userId = user_id ?? -1;

    const year = date.getFullYear();
    const month = date.getMonth();

    const numDaysInMonth = new Date(year, month+1, 0).getDate();
    
    const showDot: boolean[] = new Array(numDaysInMonth).fill(false);
    dates.forEach( (date) => {
        if ((anyUserID || date.user_id == userId) && date.dt_start.getMonth() == month && date.dt_start.getFullYear() == year){
            showDot[date.dt_start.getDate()-1] = true;
        }
    }); 

    let padStartDays = (new Date(year, month, 1).getDay()-start);
    padStartDays += padStartDays < 0 ? 7 : 0
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    
    const selectedDay = date.getDate();
    
    return (
        <>
            <p className="flex items-center justify-center text-blue-accent text-sm">
                Select a day
            </p>
            <div className="relative flex items-center justify-between w-full">
                <button className="flex p-1 rounded-full hover:bg-gray-primary text-black-primary hover:text-blue-primary" onClick={() => {onChangeMonth(-1)}}>
                    <ChevronLeftIcon className="w-6 h-6" />
                </button>
                <p className="absolute left-1/2 transform -translate-x-1/2 text-black-primary text-lg font-bold">
                    {monthNames[month]} {year}
                </p>
                <button className="flex p-1 rounded-full hover:bg-gray-primary text-black-primary hover:text-blue-primary" onClick={() => {onChangeMonth(1)}}>
                    <ChevronRightIcon className="w-6 h-6" />
                </button>
            </div>
            <div className="flex flex-row gap-4 p-4">
                {Array.from({ length: 7 }, (_, i) => (
                    <div key={i} className="flex-1 flex justify-center text-black-primary">
                    {dayNames[(i + start)%7]}
                    </div>
                ))}
            </div>
            {Array.from({ length: Math.ceil((padStartDays + numDaysInMonth)/7)}, (_, week) => (
            <div key={week} className="flex flex-row">
                {Array.from({ length: 7 }, (_, day) => {
                    const k = week * 7 + day + 1 - padStartDays;
                    return (
                        <div key={k} className="relative flex-1">
                            {k > 0 && k <= numDaysInMonth ?
                                <>
                                    <ButtonNav
                                        text={k.toString()}
                                        active={selectedDay === k}
                                        onClick={() => {onSelectDate(new Date(year,month,k))}}
                                        className="w-full"
                                    /> 
                                    {showDot[k-1] ? 
                                        <span className={`absolute bottom-0.5 left-1/2 -translate-x-1/2 h-2 w-2 ${selectedDay === k ? "bg-gray-light" : "bg-blue-primary"} rounded-full`} />
                                        : ""
                                    }
                                </>
                                : ""
                            }
                        </div>
                    );
                })}
            </div>
            ))}
        </>
    );
}

export default Calendar
