export function convertSecondsToDaysHoursMinutesSeconds(n: number) {
  let days = Math.floor( n / (24 * 3600))

  n = n % (24 * 3600)
  let hours = Math.floor(n / 3600)

  n %= 3600;
  let minutes = n / 60

  n %= 60
  let seconds = n;
  return {days:  Math.floor(days), hours:  Math.floor(hours), minutes: Math.floor(minutes), seconds}
}

export function convertDaysHoursMinutesSecondsToSeconds(days: number, hours: number, minutes: number, seconds: number) {
  return days * 24 * 3600 + hours * 3600 + minutes * 60 + seconds
}