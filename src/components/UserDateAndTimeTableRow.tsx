import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { convertNumToTimeString } from "util/NumToTime"

type RowData = {
    date: Date;
    start: number;
    end: number;
    edit: boolean;
    onClickEdit: () => void;
    onClickDelete: () => void;
}

function UserDateAndTimeTableRow({ date, start, end, edit, onClickEdit, onClickDelete }: RowData) {
    return (
        <tr className="border-b border-gray-primary">
            <td className="py-2 px-4 text-black-primary">{date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</td>
            <td className="py-2 px-4 text-black-primary">{convertNumToTimeString(start)} - {convertNumToTimeString(end)}</td>
            <td className="py-2 px-4 flex gap-2">
                <button 
                    className = {
                        `p-1 rounded 
                        ${edit 
                        ? "bg-blue-primary text-white" 
                        : "bg-transparent text-black-primary hover:bg-gray-primary"}`
                    }
                    onClick={onClickEdit}
                >
                    <PencilIcon className="w-4 h-4" />
                </button>
                <button className="p-1 rounded hover:bg-gray-primary text-black-primary hover:text-red-500" onClick={onClickDelete}>
                    <TrashIcon className="w-4 h-4" />
                </button>
            </td>
        </tr>         
    );
}

export default UserDateAndTimeTableRow