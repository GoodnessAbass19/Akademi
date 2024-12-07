import Pdf from "@/components/ui/Pdf";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { Class, Result, Student } from "@prisma/client";
import Image from "next/image";
import { notFound } from "next/navigation";
import React from "react";

export type StudentWithDetails = Student & {
  class: Class;
  result: Array<
    Result & {
      exam: {
        subject: {
          id: number;
          name: string;
        } | null;
      } | null;
    }
  >;
};

const StudentResultPage = async ({
  params: { id },
}: {
  params: { id: string };
}) => {
  const { sessionClaims } = await auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;

  const student: StudentWithDetails | null = await prisma.student.findUnique({
    where: { id },
    include: {
      class: true,
      result: {
        include: {
          exam: {
            select: {
              subject: true,
            },
          },
        },
      },
    },
  });

  if (!student) {
    return notFound();
  }

  const calculateGrade = (
    average: number
  ): { grade: string; comment: string } => {
    if (average >= 75) return { grade: "A1", comment: "Excellent" };
    if (average >= 71) return { grade: "B2", comment: "Very Good" };
    if (average >= 65) return { grade: "B3", comment: "Good" };
    if (average >= 61) return { grade: "C4", comment: "Credit" };
    if (average >= 55) return { grade: "C5", comment: "Credit" };
    if (average >= 50) return { grade: "C6", comment: "Credit" };
    if (average >= 45) return { grade: "D7", comment: "Pass" };
    if (average >= 40) return { grade: "E8", comment: "Pass" };
    return { grade: "F9", comment: "Fail" };
  };

  return (
    // <div className="p-6 max-w-5xl mx-auto">
    //   <div className="flex flex-row items-center justify-between max-w-4xl mx-auto">
    //     <Image src="/logo.svg" alt="logo" width={50} height={50} />
    //     <h2 className="text-2xl font-bold uppercase text-center">
    //       Akademi International school
    //     </h2>
    //     <div>
    //       <Image
    //         src={student.img || "/icons/avatar.png"}
    //         alt={student.name}
    //         width={100}
    //         height={100}
    //       />
    //     </div>
    //   </div>
    //   <div className="max-w-4xl mx-auto pt-6">
    //     {/* Student Information */}
    //     <div className="mb-6">
    //       <table className="table-auto border border-gray-300 w-full text-left">
    //         <tbody>
    //           <tr>
    //             <th className="px-4 py-2 border border-gray-300 bg-gray-100 w-1/3">
    //               Name
    //             </th>
    //             <td className="px-4 py-2 border border-gray-300">
    //               {student.name} {student.surname}
    //             </td>
    //           </tr>
    //           <tr>
    //             <th className="px-4 py-2 border border-gray-300 bg-gray-100">
    //               Student ID
    //             </th>
    //             <td className="px-4 py-2 border border-gray-300">
    //               {student.id}
    //             </td>
    //           </tr>
    //           <tr>
    //             <th className="px-4 py-2 border border-gray-300 bg-gray-100">
    //               Sex
    //             </th>
    //             <td className="px-4 py-2 border border-gray-300">
    //               {student.sex}
    //             </td>
    //           </tr>
    //           <tr>
    //             <th className="px-4 py-2 border border-gray-300 bg-gray-100">
    //               Class
    //             </th>
    //             <td className="px-4 py-2 border border-gray-300">
    //               {student.class.name}
    //             </td>
    //           </tr>
    //         </tbody>
    //       </table>
    //     </div>

    //     {/* Student Results */}
    //     <div>
    //       <table className="table-auto border-collapse border border-gray-300 w-full">
    //         <thead>
    //           <tr className="bg-gray-100">
    //             <th className="px-4 py-2 border border-gray-300">Subject</th>
    //             <th className="px-4 py-2 border border-gray-300">First Term</th>
    //             <th className="px-4 py-2 border border-gray-300">
    //               Second Term
    //             </th>
    //             <th className="px-4 py-2 border border-gray-300">Third Term</th>
    //             <th className="px-4 py-2 border border-gray-300">Annual Avg</th>
    //             <th className="px-4 py-2 border border-gray-300">
    //               Annual Grade
    //             </th>
    //             <th className="px-4 py-2 border border-gray-300"></th>
    //           </tr>
    //         </thead>
    //         <tbody>
    //           {student.result.map((item) => {
    //             const firstTerm = item.firstTermscore || 0;
    //             const secondTerm = item.secondTermscore || 0;
    //             const thirdTerm = item.ThirdTermscore || 0;
    //             const annualAverage = (firstTerm + secondTerm + thirdTerm) / 3;
    //             const { grade, comment } = calculateGrade(annualAverage);

    //             return (
    //               <tr key={item.id}>
    //                 <td className="px-4 py-2 border border-gray-300 text-center">
    //                   {item.exam?.subject?.name || "-"}
    //                 </td>
    //                 <td className="px-4 py-2 border border-gray-300 text-center">
    //                   {firstTerm || "-"}
    //                 </td>
    //                 <td className="px-4 py-2 border border-gray-300 text-center">
    //                   {secondTerm || "-"}
    //                 </td>
    //                 <td className="px-4 py-2 border border-gray-300 text-center">
    //                   {thirdTerm || "-"}
    //                 </td>
    //                 <td className="px-4 py-2 border border-gray-300 text-center">
    //                   {annualAverage.toFixed(2)}
    //                 </td>
    //                 <td className="px-4 py-2 border border-gray-300 text-center">
    //                   {grade}
    //                 </td>
    //                 <td className="px-4 py-2 border border-gray-300 text-center font-semibold">
    //                   {comment}
    //                 </td>
    //               </tr>
    //             );
    //           })}
    //         </tbody>
    //       </table>
    //     </div>
    //   </div>
    // </div>

    <Pdf student={student} />
  );
};

export default StudentResultPage;
