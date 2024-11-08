export const ITEM_PER_PAGE = 12;

type RouteAccessMap = {
  [key: string]: string[];
};

export const routeAccessMap: RouteAccessMap = {
  "/admin(.*)": ["admin"],
  "/student(.*)": ["student"],
  "/teacher(.*)": ["teacher"],
  "/parent(.*)": ["parent"],
  "/list/teachers": ["admin", "teacher"],
  "/list/students": ["admin", "teacher"],
  "/list/parents": ["admin", "teacher"],
  "/list/subjects": ["admin"],
  "/list/classes": ["admin", "teacher"],
  "/list/exams": ["admin", "teacher", "student", "parent"],
  "/list/assignments": ["admin", "teacher", "student", "parent"],
  "/list/results": ["admin", "teacher", "student", "parent"],
  "/list/attendance": ["admin", "teacher", "student", "parent"],
  "/list/events": ["admin", "teacher", "student", "parent"],
  "/list/announcements": ["admin", "teacher", "student", "parent"],
};

export const ordinal = (n: number) => {
  if (n > 3 && n < 21) return "th"; // covers 11th-13th
  switch (n % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
};

export function formatDate(dateString: string | number | Date) {
  const date = new Date(dateString);

  // Get day of the week
  const dayOfWeek = date.toLocaleDateString("en-GB", { weekday: "long" });

  // Get day with ordinal suffix
  const day = date.getDate();
  const ordinal = (n: number) => {
    if (n > 3 && n < 21) return "th"; // covers 11th-13th
    switch (n % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };
  const dayWithSuffix = `${day}${ordinal(day)}`;

  // Get month name
  const month = date.toLocaleDateString("en-GB", { month: "long" });

  // Get year
  const year = date.getFullYear();

  // Combine into the desired format
  return `${dayOfWeek}, ${dayWithSuffix} ${month}, ${year}`;
}

// const formattedDate = formatDate("2024-11-02T19:49:14.181Z");
// console.log(formattedDate); // "Saturday, 2nd November, 2024"

export function getTimeWithAmPm(dateString: string | number | Date) {
  const date = new Date(dateString);

  let hours = date.getHours();
  const minutes = date.getMinutes();
  const amPm = hours >= 12 ? "PM" : "AM";

  // Convert 24-hour time to 12-hour format
  hours = hours % 12 || 12; // '0' becomes '12'

  // Pad minutes with leading zero if needed
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

  return `${hours}:${formattedMinutes} ${amPm}`;
}

// const formattedTime = getTimeWithAmPm('2024-11-02T19:49:14.181Z');
// console.log(formattedTime); // "7:49 PM"

export function formatDateToMonthDayYear(dateString: string | number | Date) {
  const date = new Date(dateString);

  // Get month name
  const month = date.toLocaleDateString("en-US", { month: "long" });

  // Get day
  const day = date.getDate();

  // Get year
  const year = date.getFullYear();

  return `${month} ${day}, ${year}`;
}

// import { auth } from "@clerk/nextjs/server";

// const { userId, sessionClaims } = auth();
// const role = (sessionClaims?.metadata as { role?: string })?.role;
// const currentUserId = userId;

// IT APPEARS THAT BIG CALENDAR SHOWS THE LAST WEEK WHEN THE CURRENT DAY IS A WEEKEND.
// FOR THIS REASON WE'LL GET THE LAST WEEK AS THE REFERENCE WEEK.
// IN THE TUTORIAL WE'RE TAKING THE NEXT WEEK AS THE REFERENCE WEEK.

const getLatestMonday = (): Date => {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const daysSinceMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  const latestMonday = today;
  latestMonday.setDate(today.getDate() - daysSinceMonday);
  return latestMonday;
};

const adjustScheduleToCurrentWeek = (
  lessons: { title: string; start: Date; end: Date }[]
): { title: string; start: Date; end: Date }[] => {
  const latestMonday = getLatestMonday();

  return lessons.map((lesson) => {
    const lessonDayOfWeek = lesson.start.getDay();

    const daysFromMonday = lessonDayOfWeek === 0 ? 6 : lessonDayOfWeek - 1;

    const adjustedStartDate = new Date(latestMonday);

    adjustedStartDate.setDate(latestMonday.getDate() + daysFromMonday);
    adjustedStartDate.setHours(
      lesson.start.getHours(),
      lesson.start.getMinutes(),
      lesson.start.getSeconds()
    );
    const adjustedEndDate = new Date(adjustedStartDate);
    adjustedEndDate.setHours(
      lesson.end.getHours(),
      lesson.end.getMinutes(),
      lesson.end.getSeconds()
    );

    return {
      title: lesson.title,
      start: adjustedStartDate,
      end: adjustedEndDate,
    };
  });
};

export { adjustScheduleToCurrentWeek };
// role, currentUserId,
