export const truncate = (s?: string, n = 200) => {
  if (!s) return ''
  return s.length > n ? s.slice(0, n) + '…' : s
}
