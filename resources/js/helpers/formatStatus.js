export function formatStatus(status) {
  if (!status) return ""

  return status
    .toLowerCase()
    .replace(/[_-]/g, " ")   // on_leave → on leave
    .replace(/\s+/g, " ")   // multiple spaces → single
    .replace(/\b\w/g, (c) => c.toUpperCase()) // capitalize each word
}
