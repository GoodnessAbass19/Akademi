import prisma from "@/lib/prisma";
import { formatDate } from "@/lib/settings";

const EventList = async ({ dateParam }: { dateParam: string | undefined }) => {
  const date = dateParam ? new Date(dateParam) : new Date();

  const data = await prisma.event.findMany({
    where: {
      startTime: {
        gte: new Date(date.setHours(0, 0, 0, 0)),
        lte: new Date(date.setHours(23, 59, 59, 999)),
      },
    },
  });

  return (
    <div className="space-y-5">
      {data.map((event) => (
        <div
          className={` p-5 rounded-md shadow-md border-2 bg-white border-gray-200 border-l-4 odd:border-l-[#FCC43E] even:border-l-[#4D44B5]`}
          key={event.id}
        >
          <div className="flex items-center justify-between">
            <h1 className="font-semibold text-gray-600">{event.title}</h1>
            <span className="text-gray-500 text-xs">
              {event.startTime.toLocaleTimeString("en-NG", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              })}
            </span>
          </div>
          <p className="mt-2 text-gray-400 text-sm">{event.description}</p>
        </div>
      ))}
    </div>
  );
};

export default EventList;
