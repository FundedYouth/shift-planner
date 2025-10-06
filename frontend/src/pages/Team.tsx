import Calendar from "components/Calendar";
import UserItemRow from "components/UserItemRow";
import { useState } from "react";

import { useDates } from "context/DatesContext";

function Team() {
    let [selectedDate, setSelectedDate] = useState(new Date());
    
    const handleDateChange = (newDate: Date) => {
        setSelectedDate(newDate);
    };

    const handleMonthChange = (change: number) => {
        let newDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth()+change+1, 0);
        newDate.setDate(Math.min(selectedDate.getDate(), newDate.getDate()))
        setSelectedDate(newDate);
    };
    
    const { dates } = useDates();

    return(
        <>
            <div className="flex flex-col md:flex-row gap-4 p-4">
                <div className="flex flex-col gap-4 md:w-1/2">
                    <div className="w-full px-4 py-2 rounded-md border border-gray-primary shadow-xl bg-white">
                        <Calendar anyUserID={true} start={0} date={selectedDate} onSelectDate={handleDateChange} onChangeMonth={handleMonthChange}/>
                    </div>
                </div>
                <div className="flex flex-col gap-4 md:w-1/2">
                    <div className="w-full px-4 py-2 pb-20 rounded-md border border-gray-primary shadow-xl bg-white">
                        <p className="flex items-center justify-center text-blue-accent text-sm">
                            Volunteers for&nbsp;
                            <strong className="text-blue-primary">
                                {selectedDate.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                            </strong>
                        </p>
                        {dates
                        .filter(date => (
                            date.dt_start.getFullYear() === selectedDate.getFullYear() &&
                            date.dt_start.getMonth() === selectedDate.getMonth() &&
                            date.dt_start.getDate() === selectedDate.getDate()
                        ))
                        .map(date => (
                            <UserItemRow
                            key={date.id}
                            profile={date.user_id}
                            start={date.dt_start.getHours()}
                            end={date.dt_end.getHours()}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}

export default Team