import React, { useState } from "react";

import InputDropDown from "components/InputDropDown"
import ButtonNav from "components/ButtonNav";
import Calendar from "components/Calendar";
import UserDateAndTimeTableRow from "components/UserDateAndTimeTableRow";

import { useDates } from "context/DatesContext";
import { useLogin } from "context/LoginContext";
import ButtonPrimary from "components/ButtonPrimary";

function Schedule() {
    const { dates, createDate, updateDate, deleteDate } = useDates();
    const { user_id } = useLogin();
    const userId = user_id ?? -1;

    const [startTime, setStartTime] = React.useState(14);
    const [endTime, setEndTime] = React.useState(19);
    const [selectedDate, setSelectedDate] = React.useState(new Date());
    const [editId, setEditId] = React.useState<number | null>(null);

    const handleStartChange = (value: number) => {
        setStartTime(value);
    };

    const handleEndChange = (value: number) => {
        setEndTime(value);
    };
    
    const handleDateChange = (newDate: Date) => {
        setSelectedDate(newDate);
    };

    const handleMonthChange = (change: number) => {
        let newDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth()+change+1, 0);
        newDate.setDate(Math.min(selectedDate.getDate(), newDate.getDate()))
        setSelectedDate(newDate);
    };

    const saveDate = async () =>{
        const dt_start = new Date(selectedDate);
        dt_start.setHours(startTime, 0, 0, 0);
        const dt_end = new Date(selectedDate);
        dt_end.setHours(endTime, 0, 0, 0);

        if (editId){
            updateDate(editId, { user_id: userId, dt_start, dt_end });
            setEditId(null);
        }
        else {
            createDate({ user_id: userId, dt_start, dt_end });
        }
    };

    return (
        <>
            <div className="flex flex-col md:flex-row gap-4 p-4">
                <div className="flex flex-col gap-4 md:w-1/2">
                    <div className="w-full px-4 py-2 rounded-md border border-gray-primary shadow-xl bg-white">
                        <Calendar anyUserID={false} start={0} date={selectedDate} onSelectDate={handleDateChange} onChangeMonth={handleMonthChange}/>
                    </div>
                    <div className="w-full px-4 py-2 rounded-md border border-gray-primary shadow-xl bg-white">
                        <p className="flex items-center justify-center text-blue-accent text-sm">
                            Select available times
                        </p>
                        <h3 className="text-black-primary text-lg">
                            Start Time
                        </h3>
                        <InputDropDown start={6} end={endTime-1} value={startTime} onChange={handleStartChange} />
                        <h3 className="text-black-primary text-lg">
                            End Time
                        </h3>
                        <InputDropDown start={startTime+1} end={20} value={endTime} onChange={handleEndChange}/>
                        <h4 className="text-black-primary font-bold">
                            Duration: {endTime-startTime} hour{(endTime-startTime) > 1 ? 's' : ''}
                        </h4>
                        <p className="text-black-primary italic text-sm">
                            I agree to donate {endTime-startTime} hour{endTime-startTime > 1 && 's'} on this date. I agree to show up 10 minutes prior to my agreed upon time. I agree to notify team members at least 1 hour ahead of time if I can't make the time agreed to.
                        </p>
                        <ButtonPrimary text="Save" onClick={saveDate} />
                    </div>
                </div>
                <div className="flex flex-col gap-4 md:w-1/2">
                    <div className="w-full px-4 py-2 rounded-md border border-gray-300 shadow-xl bg-white">
                        <p className="flex items-center justify-center text-blue-accent text-sm">
                            My Agreed Upon Times
                        </p>
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-gray-primary">
                                <th className="py-2 px-4 text-black-primary">Date</th>
                                <th className="py-2 px-4 text-black-primary">Time</th>
                                <th className="py-2 px-4 text-black-primary">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dates
                                .filter(date => date.user_id === userId)
                                .map(date => date.dt_start.getMonth() === selectedDate.getMonth() && date.dt_start.getFullYear() == selectedDate.getFullYear() ? 
                                (
                                    <UserDateAndTimeTableRow
                                    key={date.id}
                                    date={date.dt_start}
                                    start={date.dt_start.getHours()}
                                    end={date.dt_end.getHours()}
                                    edit={editId === date.id}
                                    onClickEdit={() => {
                                        if (editId === date.id){
                                            setEditId(null);
                                        }
                                        else {
                                            setEditId(date.id)
                                            setStartTime(date.dt_start.getHours())
                                            setEndTime(date.dt_end.getHours())
                                            setSelectedDate(new Date(date.dt_start))
                                        }
                                    }}
                                    onClickDelete={() => {
                                        if (editId === date.id){
                                            setEditId(null);
                                        }
                                        deleteDate(date.id);
                                    }}
                                    />
                                ) : "")}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Schedule