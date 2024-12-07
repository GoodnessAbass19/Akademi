import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { Prisma, Result } from "@prisma/client";
import Image from "next/image";
import { auth } from "@clerk/nextjs/server";
import FormContainer from "@/components/ui/FormContainer";
import TableSearch from "@/components/ui/Search";
import Table from "@/components/ui/Table";
import Pagination from "@/components/ui/Pagination";

type ResultList = Result & {
  student: {
    name: string;
    surname: string;
    class: {
      name: string;
    };
  };
  exam: {
    title: string;
    subject: {
      name: string;
    };
  };
};

const ResultListPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const { userId, sessionClaims } = await auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;
  const currentUserId = userId;

  const columns = [
    {
      header: "Title",
      accessor: "title",
    },
    {
      header: "Student",
      accessor: "student",
    },
    {
      header: "Subject",
      accessor: "subject",
      className: "hidden md:table-cell",
    },
    {
      header: "First term",
      accessor: "firstTerm",
      className: "hidden md:table-cell",
    },
    {
      header: "Second term",
      accessor: "secondTerm",
      className: "hidden md:table-cell",
    },
    {
      header: "Third term",
      accessor: "thirdTerm",
      className: "hidden md:table-cell",
    },

    {
      header: "Class",
      accessor: "class",
      className: "hidden md:table-cell",
    },

    ...(role === "teacher" || role === "admin"
      ? [
          {
            header: "Actions",
            accessor: "action",
          },
        ]
      : []),
  ];

  const renderRow = (item: ResultList) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
    >
      <td className="flex items-center gap-4 p-4">{item.exam.title}</td>
      <td>{item.student.name + " " + item.student.surname}</td>
      <td className="hidden md:table-cell">{item.exam.subject.name}</td>
      <td className="hidden md:table-cell">{item.firstTermscore}</td>
      <td className="hidden md:table-cell">{item.secondTermscore}</td>
      <td className="hidden md:table-cell">{item.ThirdTermscore}</td>
      <td className="hidden md:table-cell">{item.student.class.name}</td>
      <td>
        <div className="flex items-center gap-2">
          {role === "admin" ||
            (role === "teacher" && (
              <>
                <FormContainer table="result" type="update" data={item} />
                <FormContainer table="result" type="delete" id={item.id} />
              </>
            ))}
        </div>
      </td>
    </tr>
  );

  const { page, ...queryParams } = searchParams;
  const p = page ? parseInt(page) : 1;

  // URL PARAMS CONDITION

  const query: Prisma.ResultWhereInput = {};

  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "studentId":
            query.studentId = value;
            break;
          case "classId":
            query.student = { classId: Number(value) };
            break;
          case "search":
            query.OR = [
              { exam: { title: { contains: value, mode: "insensitive" } } },
              { student: { name: { contains: value, mode: "insensitive" } } },
              { student: { classId: Number(value) } },
            ];
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
      break;
    case "teacher":
      query.OR = [
        { exam: { subject: { teachers: { some: { id: currentUserId! } } } } },
      ];
      break;

    case "student":
      query.studentId = currentUserId!;
      break;

    case "parent":
      query.student = {
        parentId: currentUserId!,
      };
      break;
    default:
      break;
  }

  const [dataRes, count] = await prisma.$transaction([
    prisma.result.findMany({
      where: query,
      include: {
        student: {
          select: {
            name: true,
            surname: true,
            class: { select: { name: true } },
          },
        },
        exam: {
          include: {
            subject: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.result.count({ where: query }),
  ]);

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All Results</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/icons/filter.png" alt="" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/icons/sort.png" alt="" width={14} height={14} />
            </button>
            {role === "teacher" ||
              (role === "admin" && (
                <FormContainer table="result" type="create" />
              ))}
          </div>
        </div>
      </div>
      {/* LIST */}
      <Table columns={columns} renderRow={renderRow} data={dataRes} />
      {/* PAGINATION */}
      <Pagination page={p} count={count} />
    </div>
  );
};

export default ResultListPage;
