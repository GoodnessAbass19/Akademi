import prisma from "@/lib/prisma";
import {
  formatDateToMonthDayYear,
  getTimeWithAmPm,
  ITEM_PER_PAGE,
} from "@/lib/settings";
import { Class, Exam, Prisma, Subject, Teacher } from "@prisma/client";
import Image from "next/image";
import { auth } from "@clerk/nextjs/server";
import FormContainer from "@/components/ui/FormContainer";
import TableSearch from "@/components/ui/Search";
import Table from "@/components/ui/Table";
import Pagination from "@/components/ui/Pagination";

type ExamList = Exam & {
  subject: Subject;
};

const ExamListPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const { userId, sessionClaims } = await auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;
  const currentUserId = userId;

  const columns = [
    {
      header: "Subject Name",
      accessor: "name",
    },
    // {
    //   header: "Class",
    //   accessor: "class",
    // },
    // {
    //   header: "Teacher",
    //   accessor: "teacher",
    //   className: "hidden md:table-cell",
    // },
    {
      header: "Date",
      accessor: "date",
      className: "hidden md:table-cell",
    },
    {
      header: "Start Time",
      accessor: "startTime",
      className: "hidden md:table-cell",
    },
    {
      header: "End Time",
      accessor: "endTime",
      className: "hidden md:table-cell",
    },
    ...(role === "admin" || role === "teacher"
      ? [
          {
            header: "Actions",
            accessor: "action",
          },
        ]
      : []),
  ];

  const renderRow = (item: ExamList) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
    >
      <td className="flex items-center gap-4 p-4">{item.subject.name}</td>
      {/* <td>{item.lesson.class.name}</td> */}
      {/* <td className="hidden md:table-cell">
        {item.teacher.name + " " + item.lesson.teacher.surname}
      </td> */}
      <td className="hidden md:table-cell">
        {formatDateToMonthDayYear(item.startTime)}
      </td>
      <td className="hidden md:table-cell">
        {getTimeWithAmPm(item.startTime)}
      </td>
      <td className="hidden md:table-cell">{getTimeWithAmPm(item.endTime)}</td>
      <td>
        <div className="flex items-center gap-2">
          {(role === "admin" || role === "teacher") && (
            <>
              <FormContainer table="exam" type="update" data={item} />
              <FormContainer table="exam" type="delete" id={item.id} />
            </>
          )}
        </div>
      </td>
    </tr>
  );

  const { page, ...queryParams } = searchParams;

  const p = page ? parseInt(page) : 1;

  // URL PARAMS CONDITION
  const query: Prisma.ExamWhereInput = {};

  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value) {
        switch (key) {
          case "search":
            query.subject = {
              is: { name: { contains: value, mode: "insensitive" } },
            };
            break;
          default:
            break;
        }
      }
    }
  }

  // ROLE CONDITIONS
  switch (role) {
    case "admin":
      break; // Admins see all exams
    case "teacher":
      query.subject = { is: { teachers: { some: { id: currentUserId! } } } }; // Teachers see exams they are teaching
      break;
    case "student":
      // Students see all exams; no additional filtering needed
      break;
    case "parent":
      query.results = { some: { student: { parentId: currentUserId! } } }; // Parents see exams of their children
      break;
    default:
      break;
  }

  // Fetch data and count using Prisma transactions
  const [data, count] = await prisma.$transaction([
    prisma.exam.findMany({
      where: query,
      include: {
        subject: { select: { name: true } }, // Fetch subject details
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.exam.count({ where: query }),
  ]);

  // query.lesson = {};
  // if (queryParams) {
  //   for (const [key, value] of Object.entries(queryParams)) {
  //     if (value !== undefined) {
  //       switch (key) {
  //         case "classId":
  //           query.lesson.classId = parseInt(value);
  //           break;
  //         case "teacherId":
  //           query.lesson.teacherId = value;
  //           break;
  //         case "search":
  //           query.lesson.subject = {
  //             name: { contains: value, mode: "insensitive" },
  //           };
  //           break;
  //         default:
  //           break;
  //       }
  //     }
  //   }
  // }

  // // ROLE CONDITIONS

  // switch (role) {
  //   case "admin":
  //     break;
  //   case "teacher":
  //     query.lesson.teacherId = currentUserId!;
  //     break;
  //   case "student":
  //     query.lesson.class = {
  //       students: {
  //         some: {
  //           id: currentUserId!,
  //         },
  //       },
  //     };
  //     break;
  //   case "parent":
  //     query.lesson.class = {
  //       students: {
  //         some: {
  //           parentId: currentUserId!,
  //         },
  //       },
  //     };
  //     break;

  //   default:
  //     break;
  // }

  // const [data, count] = await prisma.$transaction([
  //   prisma.exam.findMany({
  //     where: query,
  //     include: {
  //       lesson: {
  //         select: {
  //           subject: { select: { name: true } },
  //           teacher: { select: { name: true, surname: true } },
  //           class: { select: { name: true } },
  //         },
  //       },
  //     },
  //     take: ITEM_PER_PAGE,
  //     skip: ITEM_PER_PAGE * (p - 1),
  //   }),
  //   prisma.exam.count({ where: query }),
  // ]);

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All Exams</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/icons/filter.png" alt="" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/icons/sort.png" alt="" width={14} height={14} />
            </button>
            {(role === "admin" || role === "teacher") && (
              <FormContainer table="exam" type="create" />
            )}
          </div>
        </div>
      </div>
      {/* LIST */}
      <Table columns={columns} renderRow={renderRow} data={data} />
      {/* PAGINATION */}
      <Pagination page={p} count={count} />
    </div>
  );
};

export default ExamListPage;
