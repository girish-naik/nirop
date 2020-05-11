import dateFormat from 'dateformat'

export default function convertToDisplayDateTime(time: number| string) {
    const date:Date = new Date(parseInt(time.toString()));
    return dateFormat(date, "mmmm dS, yyyy, h:MM:ss TT");
}