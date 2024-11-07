import prisma from "@/lib/prisma";

const EventList = async () =>
  // { dateParam }: { dateParam: string | undefined }
  {
    // const date = dateParam ? new Date(dateParam) : new Date();

    // const data = await prisma.event.findMany({
    //   where: {
    //     startTime: {
    //       gte: new Date(date.setHours(0, 0, 0, 0)),
    //       lte: new Date(date.setHours(23, 59, 59, 999)),
    //     },
    //   },
    // });

    // TEMPORARY
    const events = [
      {
        id: 1,
        title: "Lorem ipsum dolor",
        time: "12:00 PM - 2:00 PM",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      },
      {
        id: 2,
        title: "Lorem ipsum dolor",
        time: "12:00 PM - 2:00 PM",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      },
      {
        id: 3,
        title: "Lorem ipsum dolor",
        time: "12:00 PM - 2:00 PM",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      },
    ];

    return events.map((event: any) => (
      <div
        className="p-5 rounded-md border-2 border-gray-100 border-t-4 odd:border-t-lamaSky even:border-t-lamaPurple"
        key={event.id}
      >
        <div className="flex items-center justify-between">
          <h1 className="font-semibold text-gray-600">{event.title}</h1>
          <span className="text-gray-300 text-xs">
            {/* {event.startTime.toLocaleTimeString("en-NG", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            })} */}
            {event.time}
          </span>
        </div>
        <p className="mt-2 text-gray-400 text-sm">{event.description}</p>
      </div>
    ));
  };

export default EventList;
