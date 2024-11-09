import EventCalendar from "@/components/ui/EventCalendar";
import EventList from "@/components/ui/EventList";
import TableSearch from "@/components/ui/Search";
import { role } from "@/lib/data";
import { formatDate } from "@/lib/settings";
import Image from "next/image";
import React from "react";

const EventListPage = ({
  searchParams,
}: {
  searchParams: { [keys: string]: string | undefined };
}) => {
  const { date } = searchParams;
  const day = new Date();
  return (
    <div>
      {/* TOP */}
      <div className="flex flex-col items-start space-y-4 justify-between">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 w-full md:w-full">
          <h1 className="hidden md:block text-lg font-semibold">Events</h1>
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/icons/filter.png" alt="" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/icons/sort.png" alt="" width={14} height={14} />
            </button>
            {role === "admin" && (
              <button className="flex items-center justify-center rounded-full bg-[#4D44B5] py-1.5 px-4 space-x-2">
                <Image
                  src="/icons/plus.png"
                  alt=""
                  width={10}
                  height={10}
                  className="inline-flex"
                />
                <h3 className="text-white text-sm capitalize font-medium">
                  new event
                </h3>
              </button>
              // <FormContainer table="teacher" type="create" />
            )}
          </div>
        </div>
      </div>
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
    </div>
  );
};

export default EventListPage;
