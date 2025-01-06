import Announcements from "@/components/ui/Announcement";
import Dropdown from "@/components/ui/Dropdown";
import FormContainer from "@/components/ui/FormContainer";
import Pagination from "@/components/ui/Pagination";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { auth } from "@clerk/nextjs/server";
import { Prisma } from "@prisma/client";
import Image from "next/image";

const AnnouncementPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const { userId, sessionClaims } = await auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;

  const { page, ...queryParams } = searchParams;
  const p = page ? parseInt(page) : 1;
  const roleConditions = {
    teacher: { lessons: { some: { teacherId: userId! } } },
    student: { students: { some: { id: userId! } } },
    parent: { students: { some: { parentId: userId! } } },
  };

  // URL PARAMS CONDITION

  const query: Prisma.AnnouncementWhereInput = {};
  query.class = {};

  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "class":
            query.class = { name: value };
            break;
          default:
            break;
        }
      }
    }
  }

  const [data, count] = await prisma.$transaction([
    prisma.announcement.findMany({
      orderBy: { date: "desc" },
      where: {
        ...(role !== "admin" && {
          OR: [
            { classId: null },
            {
              class: roleConditions[role as keyof typeof roleConditions] || {},
            },
          ],
        }),
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.announcement.count({ where: query }),
  ]);

  const studentClasses = await prisma.class.findMany({
    select: { id: true, name: true },
  });

  return (
    <div>
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">
          All Announcements
        </h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/icons/filter.png" alt="" width={14} height={14} />
            </button>
            {/* <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/icons/sort.png" alt="" width={14} height={14} />
            </button> */}
            <Dropdown studentClasses={studentClasses} />
            {role === "admin" && (
              <FormContainer table="announcement" type="create" />
            )}
          </div>
        </div>
      </div>
      {/* <div className="flex flex-col gap-4 mt-4">
        {data.map((item) => (
          <div
            key={item.id}
            className="rounded-md p-4 odd:bg-lamaPurpleLight even:bg-lamaYellowLight"
          >
            <div className="flex items-center justify-between">
              <h2 className="font-medium">{item.title}</h2>
              <span className="text-xs text-gray-400 bg-white rounded-md px-1 py-1">
                {new Intl.DateTimeFormat("en-GB").format(item.date)}
              </span>
            </div>
            <p className="text-sm text-gray-400 mt-1">{item.description}</p>
          </div>
        ))}
      </div> */}
      <Announcements />
      {/* PAGINATION */}
      {/* <Pagination page={p} count={count} /> */}
    </div>
  );
};

export default AnnouncementPage;
