import FormModal from "@/components/ui/FormModal";
import Pagination from "@/components/ui/Pagination";
import TableSearch from "@/components/ui/Search";
import Table from "@/components/ui/Table";
// import { role, studentsData } from "@/lib/data/";
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

const StudentListPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const { userId, sessionClaims } = await auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;
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
      header: "Date of Birth",
      accessor: "birthDate",
      className: "hidden md:table-cell",
    },
    {
      header: "Parent Name",
      accessor: "parent",
      className: "hidden md:table-cell",
    },
    {
      header: "City",
      accessor: "address",
      className: "hidden lg:table-cell",
    },
    {
      header: "Contact",
      accessor: "contact",
      className: "hidden lg:table-cell",
    },

    {
      header: "Grade",
      accessor: "grade",
      className: "hidden md:table-cell",
    },
    ...(role === "admin"
      ? [
          {
            header: "Actions",
            accessor: "action",
          },
        ]
      : []),
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
          <h3 className="font-semibold">{item.name}</h3>
          {/* <p className="text-xs text-gray-500">{item.class}</p> */}
        </div>
      </td>
      <td className="hidden md:table-cell font-semibold text-[#4D44B5] ">
        #{item.id}
      </td>
      <td className="hidden md:table-cell">
        {new Intl.DateTimeFormat("en-GB").format(item.birthday)}
      </td>
      <td className="hidden md:table-cell">
        {item.parent.surname + " " + item.parent.name}
      </td>

      <td className="hidden md:table-cell">{item.address.split(",").pop()}</td>
      <td className="hidden md:table-cell">
        <div className="flex justify-normal items-center space-x-2">
          <Link
            href={`tel:${item.phone}`}
            className="w-8 h-8 rounded-full p-1 bg-[#4D44B5] flex justify-center items-center"
          >
            <Image
              src={"/icons/Call.png"}
              alt="phone"
              width={32}
              height={32}
              className="w-4 h-4"
            />
          </Link>
          <Link
            href={`mailto:${item.email}`}
            className="w-8 h-8 rounded-full p-1 bg-[#4D44B5] flex justify-center items-center"
          >
            <Image
              src={"/icons/Email.png"}
              alt="mail"
              width={32}
              height={32}
              className="w-4 h-4"
            />
          </Link>
        </div>
      </td>
      <td className="hidden md:table-cell">
        <div
          className={`lg:w-4/5 w-full h-[30px] xl:h-[40px] rounded-full flex items-center justify-center text-center font-bold text-xs xl:text-sm text-white capitalize ${
            index % 2 === 0 ? "bg-[#FB7D5B]" : "bg-[#FCC43E]"
          }`}
        >
          grade {item.gradeId}
        </div>
      </td>

      <td>
        <div className="flex items-center gap-2">
          <Link href={`/list/students/${item.id}`}>
            <button className="w-7 h-7 flex items-center justify-center rounded-full bg-lamaSky">
              <Image src="/icons/view.png" alt="" width={16} height={16} />
            </button>
          </Link>
          {role === "admin" && (
            // <button className="w-7 h-7 flex items-center justify-center rounded-full bg-lamaPurple">
            //   <Image src="/delete.png" alt="" width={16} height={16} />
            // </button>
            <FormContainer table="student" type="delete" id={item.id} />
          )}
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
            <Dropdown studentClasses={studentClasses} />
            {role === "admin" && (
              // <button className="flex items-center justify-center rounded-full bg-[#4D44B5] py-1.5 px-4 space-x-2">
              //   <Image
              //     src="/icons/plus.png"
              //     alt=""
              //     width={10}
              //     height={10}
              //     className="inline-flex"
              //   />
              //   <h3 className="text-white text-sm capitalize font-medium">
              //     new student
              //   </h3>
              // </button>
              <FormContainer table="student" type="create" />
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

export default StudentListPage;
