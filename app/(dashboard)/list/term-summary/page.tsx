import Pagination from "@/components/ui/Pagination";
import TableSearch from "@/components/ui/Search";
import Table from "@/components/ui/Table";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { auth } from "@clerk/nextjs/server";
import { Class, Parent, Prisma, Result, Student } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import FormContainer from "@/components/ui/FormContainer";
import Dropdown from "@/components/ui/Dropdown";

type StudentList = Student & { class: Class } & { parent: Parent } & {
  result: Result;
};

const TermSummaryPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const { userId, sessionClaims } = await auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;
  const currentUserId = userId;
  const { page, ...queryParams } = searchParams;
  const p = page ? parseInt(page) : 1;

  const columns = [
    {
      header: "Name",
      accessor: "name",
    },
    {
      header: "ID",
      accessor: "studentId",
      className: "hidden md:table-cell",
    },
    {
      header: "Class",
      accessor: "class",
      className: "hidden md:table-cell",
    },
    {
      header: "Resut",
      accessor: "result",
      className: "hidden md:table-cell",
    },
  ];

  const renderRow = (item: StudentList, index: number) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaSkyLight text-start"
    >
      <td className="flex items-center gap-4 py-4">
        <Image
          src={item.img || "/icons/avatar.png"}
          alt=""
          width={48}
          height={48}
          className="md:hidden xl:block w-12 h-12 rounded-full object-cover"
        />
        <div className="flex flex-col">
          <h3 className="font-semibold">{item.name + " " + item.surname}</h3>
          {/* <p className="text-xs text-gray-500">{item.class}</p> */}
        </div>
      </td>
      <td className="hidden md:table-cell font-semibold text-[#4D44B5] ">
        #{item.id}
      </td>
      <td className="hidden md:table-cell font-semibold text-[#4D44B5] ">
        {item.class.name}
      </td>

      <td>
        <div className="flex items-center gap-2">
          <Link href={`/list/term-summary/${item.id}`}>View result</Link>
        </div>
      </td>
    </tr>
  );

  // URL PARAMS CONDITION

  const query: Prisma.StudentWhereInput = {};

  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "class":
            query.class = {
              name: { contains: value, mode: "insensitive" },
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

  switch (role) {
    case "admin":
      break;
    case "teacher":
      break;

    case "student":
      query.id = currentUserId!;
      break;

    case "parent":
      query.parentId = currentUserId!;
      break;
    default:
      break;
  }

  const [data, count] = await prisma.$transaction([
    prisma.student.findMany({
      where: query,
      include: {
        class: true,
        parent: true,
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.student.count({ where: query }),
  ]);

  const studentClasses = await prisma.class.findMany({
    select: { id: true, name: true },
  });

  return (
    <div className="rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex flex-col items-start space-y-4 justify-between">
        <h1 className="hidden md:block text-lg font-semibold">Students</h1>
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 w-full md:w-full">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/icons/filter.png" alt="" width={14} height={14} />
            </button>
            {/* <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/icons/sort.png" alt="" width={14} height={14} />
            </button> */}
            {role === "admin" || role === "teacher" ? (
              <Dropdown studentClasses={studentClasses} />
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
      {/* LIST */}
      <Table columns={columns} renderRow={renderRow} data={data} />
      {/* PAGINATION */}
      <Pagination count={count} page={p} />
    </div>
  );
};

export default TermSummaryPage;
