export function formatToGoogleUTC(date: Date) {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
}

export function formatToOutlook(date: Date) {
    const pad = (n: number) => String(n).padStart(2, '0');

    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);     // meses começam em 0
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    const seconds = pad(date.getSeconds());

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
}