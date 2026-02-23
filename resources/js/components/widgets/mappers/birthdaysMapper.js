import dayjs from "dayjs";
import { getDaysLeft } from "@/helpers";

const formatDate = (dateStr) => {
  return dayjs(dateStr).format("MMM DD").toUpperCase();
};

const splitName = (fullName) => {
  const parts = fullName.split(" ");
  return {
    firstName: parts[0],
    lastName: parts.slice(1).join(" "),
  };
};

const mapEmployee = (emp) => {
  const { firstName, lastName } = splitName(emp.full_name);

  return {
    id: emp.employee_id,
    firstName,
    lastName,
    role: emp.position,
    daysLeft: getDaysLeft(emp.birthdate),
  };
};

export const mapBirthdaysResponse = (apiData) => {
  const groupByDate = (employees) => {
    const map = {};

    employees.forEach((emp) => {
      const date = formatDate(emp.birthdate);

      if (!map[date]) map[date] = [];

      map[date].push(mapEmployee(emp));
    });

    return Object.entries(map).map(([date, employees]) => ({
      date,
      employees,
    }));
  };

  return {
    today: groupByDate(apiData.today),
    upcoming: groupByDate(apiData.upcoming),
  };
};