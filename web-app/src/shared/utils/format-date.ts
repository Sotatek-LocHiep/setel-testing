export function formatDateToCleanString(inputDate?: string | number | Date) {
  const d = new Date(inputDate || Date.now())
  const date =
    ('0' + d.getDate()).slice(-2) +
    '/' +
    ('0' + (d.getMonth() + 1)).slice(-2) +
    '/' +
    d.getFullYear()
  const time = d.getHours() + ':' + ('0' + d.getMinutes()).slice(-2)
  return `${time} ${date}`
}
