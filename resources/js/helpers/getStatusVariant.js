export function getStatusVariant(type) {
  const map = {
    // Leave types
    vacation: "info",
    personal: "success",
    bereavement: "default",
    birthday: "danger",
    sick: "warning",
    unpaid: "default",

    // Employee statuses
    active: "success",
    on_leave: "warning",
    terminated: "danger",
    probationary: "warning",
    permanent: "success"
  }

  return map[type?.toLowerCase()] || "default"
}