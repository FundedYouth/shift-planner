export function convertNumToTimeString(time: number):string {
    return `${time%12 === 0 ? 12 : time%12}:00 ${time < 12 ? 'AM' : 'PM'}`
}