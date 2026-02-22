export const truncate = (s?: string, n = 200) => {
  if (!s) return ''
  return s.length > n ? s.slice(0, n) + '…' : s
}

export const formatAiredDate = (value?: string) => {
  if (!value) return 'Unknown'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'Unknown'
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date)
}
