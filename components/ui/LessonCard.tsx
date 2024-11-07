import {
  formatDate,
  formatDateToMonthDayYear,
  getTimeWithAmPm,
} from "@/lib/settings";
import { CalendarIcon, ClockIcon } from "@heroicons/react/24/outline";
import { Lesson } from "@prisma/client";

const LessonCard = ({ data, index }: { data: Lesson; index: number }) => {
  // Create a date for today's date formatted in the same way as the data's start time
  const today = formatDate(new Date());
  const lessonDate = formatDate(data.startTime);

  return (
    <div
      className={`${
        today === lessonDate ? "" : "hidden"
      } flex flex-row items-center gap-4 rounded-2xl bg-white shadow-md w-full`}
    >
      <div
        className={`${
          index % 2 === 0 ? "bg-[#4D44B5]" : "bg-[#FCC43E]"
        } w-7 h-full rounded-l-2xl`}
      ></div>
      <div className="text-sm text-black py-4 flex flex-col gap-4 items-start justify-start">
        <div className="space-y-1 flex flex-col">
          <h2 className="text-lg font-semibold capitalize">{data.name}</h2>
          <span className="text-gray-500 font-normal capitalize text-sm">
            grade {data.classId}
          </span>
        </div>
        <div className="flex flex-col justify-between gap-4">
          <span className="flex gap-2 items-center text-gray-500 text-sm">
            <CalendarIcon className="w-7 h-7 text-[#FB7D5B] inline-flex" />
            {formatDateToMonthDayYear(data.startTime)}
          </span>
          <span className="flex gap-2 items-center text-gray-500 text-sm">
            <ClockIcon className="w-7 h-7 text-[#FCC43E] inline-flex" />
            {getTimeWithAmPm(data.startTime)} - {getTimeWithAmPm(data.endTime)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default LessonCard;
