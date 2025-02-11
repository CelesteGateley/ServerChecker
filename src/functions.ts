import dayjs from "dayjs";


export function formatDate(date: Date|null = null): string
{
    return dayjs(date || Date.now()).format("YYYY-MM-DD HH:mm:ss");
}