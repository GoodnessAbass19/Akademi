import FormContainer from "@/components/ui/FormContainer";
import Pagination from "@/components/ui/Pagination";
import TableSearch from "@/components/ui/Search";
import TeacherCard from "@/components/ui/TeacherCard";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { auth } from "@clerk/nextjs/server";
import { Prisma } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";

const TeacherPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const { userId, sessionClaims } = await auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;

  const { page, ...queryParams } = searchParams;
  const p = page ? parseInt(page) : 1;

  // URL PARAMS CONDITION

  const query: Prisma.TeacherWhereInput = {};

  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "classId":
            query.lessons = {
              some: {
                classId: parseInt(value),
              },
            };
            break;
          case "search":
            query.name = { contains: value, mode: "insensitive" };
            break;
          default:
            break;
        }
      }
    }
  }

  const [data, count] = await prisma.$transaction([
    prisma.teacher.findMany({
      where: query,
      include: {
        subjects: true,
        classes: true,
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.teacher.count({ where: query }),
  ]);

  return (
    <div className="rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex flex-col items-start space-y-4 justify-between">
        <h1 className="hidden md:block text-lg font-semibold">Teachers</h1>
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 w-full md:w-full">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/icons/filter.png" alt="" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/icons/sort.png" alt="" width={14} height={14} />
            </button>
            {role === "admin" && (
              // <Link
              //   href={"/list/teachers/new"}
              //   className="flex items-center justify-center rounded-full bg-[#4D44B5] py-1.5 px-4 space-x-2"
              // >
              //   <Image
              //     src="/icons/plus.png"
              //     alt=""
              //     width={10}
              //     height={10}
              //     className="inline-flex"
              //   />
              //   <h3 className="text-white text-sm capitalize font-medium">
              //     new teacher
              //   </h3>
              // </Link>
              <FormContainer table="teacher" type="create" />
            )}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 justify-between items-center gap-8 py-4">
        {data.map((item) => (
          <div key={item.id} className="basis-1/4">
            <TeacherCard data={item} />
          </div>
        ))}
      </div>

      <Pagination count={count} page={p} />
    </div>
  );
};

export default TeacherPage;
