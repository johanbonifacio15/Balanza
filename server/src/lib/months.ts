export function getMonthRange(month?: string) {
    const now = new Date();
    const year = month ? Number(month.slice(0, 4)) : now.getUTCFullYear();
    const monthNumber = month
        ? Number(month.slice(5, 7))
        : now.getUTCMonth() + 1;

    return {
        start: new Date(Date.UTC(year, monthNumber - 1, 1)),
        end: new Date(Date.UTC(year, monthNumber, 1)),
    };
}