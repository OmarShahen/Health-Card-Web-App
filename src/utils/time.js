const getTimeZone = () => Intl.DateTimeFormat().resolvedOptions().timeZone


export const getTime = (dateTimeValue) => {
    return new Date(dateTimeValue).toLocaleTimeString('en', { timeZone: getTimeZone() })
}