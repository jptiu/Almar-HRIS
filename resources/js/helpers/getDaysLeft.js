import dayjs from "dayjs";

export const getDaysLeft = (birthdate) => {
    const today = dayjs().startOf("day");
    const bday = dayjs(birthdate);

    let nextBirthday = dayjs()
        .month(bday.month())
        .date(bday.date())
        .startOf("day");

    if (nextBirthday.isBefore(today)) {
        nextBirthday = nextBirthday.add(1, "year");
    }

    return nextBirthday.diff(today, "day");
};
