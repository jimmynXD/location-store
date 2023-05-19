export function calcTimeElapsed(previousDate: Date) {
  const currentDate = new Date()
  const elapsedMilliseconds = currentDate.getTime() - previousDate.getTime()
  const elapsedSeconds = Math.floor(elapsedMilliseconds / 1000)

  if (elapsedSeconds < 60) {
    return `${elapsedSeconds}s`
  } else if (elapsedSeconds < 3600) {
    const elapsedMinutes = Math.floor(elapsedSeconds / 60)
    return `${elapsedMinutes}m`
  } else if (elapsedSeconds < 86400) {
    const elapsedHours = Math.floor(elapsedSeconds / 3600)
    return `${elapsedHours}h`
  } else if (elapsedSeconds < 31536000) {
    const elapsedDays = Math.floor(elapsedSeconds / 86400)
    return `${elapsedDays}d`
  } else {
    const elapsedYears = Math.floor(elapsedSeconds / 31536000)
    const elapsedDays = Math.floor(elapsedSeconds / 86400)
    return `${elapsedYears}y ${elapsedDays}d`
  }
}
