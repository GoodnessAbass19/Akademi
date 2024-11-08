import EventCalendar from "@/components/ui/EventCalendar";
import EventList from "@/components/ui/EventList";
import { formatDate } from "@/lib/settings";
import React from "react";

const EventListPage = ({
  searchParams,
}: {
  searchParams: { [keys: string]: string | undefined };
}) => {
  const { date } = searchParams;
  const day = new Date();
  return (
    <div className="p-4 flex flex-col gap-4 xl:flex-row">
      <div className="w-full xl:w-4/6">
        <EventCalendar />
      </div>
      <div className="w-full xl:w-2/6">
        <div className="rounded-2xl bg-white p-8 flex flex-col space-y-4">
          <h2 className="text-xl font-bold capitalize text-[#4D44B5]">
            Event details
          </h2>
          <span className="text-sm font-normal capitalize text-gray-500">
            {formatDate(day)}
          </span>
        </div>
        <EventList dateParam={date} />
      </div>
    </div>
  );
};

export default EventListPage;
