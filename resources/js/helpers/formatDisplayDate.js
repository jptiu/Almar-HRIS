import dayjs from "dayjs";

export const formatDisplayDate = (value) => {
  if (!value) return "";

  const date = dayjs(value);
  return date.isValid() ? date.format("MMM. D, YYYY") : "";
};