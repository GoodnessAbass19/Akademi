"use client";
import Image from "next/image";
import { StudentWithDetails } from "../../app/(dashboard)/list/term-summary/[id]/page";
import { Button } from "./button";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "react-toastify";

const Pdf = ({ student }: { student: StudentWithDetails }) => {
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

  function hasFirstTermScores(studentResults: any[]) {
    return studentResults.some((item) => item.firstTermscore !== null);
  }
  function hasSecondTermScores(studentResults: any[]) {
    return studentResults.some((item) => item.secondTermscore !== null);
  }

  function hasThirdTermScores(studentResults: any[]) {
    return studentResults.some((item) => item.ThirdTermscore !== null);
  }

  const showSecondTerm = hasSecondTermScores(student.result);
  const showThirdTerm = hasThirdTermScores(student.result);
  const hasAllTerm =
    hasFirstTermScores(student.result) &&
    hasSecondTermScores(student.result) &&
    hasThirdTermScores(student.result);

  async function handleOnClick(fileName: string) {
    const html2pdf = await require("html2pdf.js");
    const element = document.querySelector("#result");
    html2pdf()
      .set({
        filename: fileName, // Set the desired file name
        margin: 2, // Define the margin
        html2canvas: { scale: 4 }, // Optional: Improve PDF resolution
        jsPDF: { orientation: "portrait" }, // Set the orientation (optional)
      })
      .from(element)
      .save();
  }

  function getAcademicYear(month: number, year: number) {
    if (month >= 1 && month <= 8) {
      // January to July
      return `${year - 1}/${year}`;
    } else if (month >= 9 && month <= 12) {
      // September to December
      return `${year}/${year + 1}`;
    } else {
      // August is not explicitly handled in your rules, so default to current year/current year
      return `${year}/${year + 1}`;
    }
  }

  // Example Usage
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1; // getMonth() is 0-based
  const currentYear = currentDate.getFullYear();
  const year = getAcademicYear(currentMonth, currentYear);
  const router = useRouter();

  // useEffect(() => {
  if (!hasFirstTermScores(student.result)) {
    router.push(`/list/term-summary`);
    toast(`Result not ready`);
  }
  // }, [student.result, router]);

  return (
    <div
      className="p-6 md:max-w-5xl w-full mx-auto bg-lamaSkyLight"
      id="result"
    >
      <div className="flex flex-row items-start justify-between md:max-w-4xl w-full mx-auto">
        <Image src="/logo.svg" alt="logo" width={50} height={50} />
        <h2 className="md:text-2xl text-lg font-bold uppercase text-center  flex items-center flex-col justify-center space-y-2">
          Akademi International school
          <span className="text-sm font-medium capitalize">
            report card for academic year {year}
          </span>
        </h2>
        <div>
          <Image
            src={student.img || "/icons/avatar.png"}
            alt={student.name}
            width={150}
            height={150}
            className="object-center"
          />
        </div>
      </div>
      <div className="md:max-w-4xl w-full mx-auto pt-6">
        {/* Student Information */}
        <div className="mb-6">
          <table className="table-auto border border-gray-300 w-full text-left table">
            <tbody className="table-row-group">
              <tr className="table-row">
                <th className="px-4 py-2 border border-gray-300 md:table-cell bg-gray-100 w-1/3">
                  Name
                </th>
                <td className="px-4 py-2 border border-gray-300 md:table-cell">
                  {student.name} {student.surname}
                </td>
              </tr>
              <tr className="table-row">
                <th className="px-4 py-2 border border-gray-300 md:table-cell bg-gray-100">
                  Student ID
                </th>
                <td className="px-4 py-2 border border-gray-300 md:table-cell">
                  {student.id}
                </td>
              </tr>
              <tr className="table-row">
                <th className="px-4 py-2 border border-gray-300 md:table-cell bg-gray-100">
                  Sex
                </th>
                <td className="px-4 py-2 border border-gray-300 md:table-cell">
                  {student.sex}
                </td>
              </tr>
              <tr className="table-row">
                <th className="px-4 py-2 border border-gray-300 bg-gray-100">
                  Class
                </th>
                <td className="px-4 py-2 border border-gray-300">
                  {student.class.name}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Student Results */}
        <div>
          <table className="table-auto border-collapse border border-gray-300 w-full table box-border">
            <thead>
              <tr className="bg-gray-100 table-row">
                <th className="px-4 py-2 border border-gray-300 md:table-cell">
                  Subject
                </th>
                <th className="px-4 py-2 border border-gray-300">First Term</th>
                {showSecondTerm && (
                  <th className="px-4 py-2 border border-gray-300 md:table-cell">
                    Second Term
                  </th>
                )}
                {showThirdTerm && (
                  <th className="px-4 py-2 border border-gray-300 md:table-cell">
                    Third Term
                  </th>
                )}
                {hasAllTerm && (
                  <th className="px-4 py-2 border border-gray-300 md:table-cell">
                    Annual Avg
                  </th>
                )}
                <th className="px-4 py-2 border border-gray-300 md:table-cell">
                  {!hasAllTerm ? "Term Grade" : "Annual Grade"}
                </th>
                <th className="px-4 py-2 border border-gray-300 md:table-cell"></th>
              </tr>
            </thead>
            <tbody className="table-row-group">
              {student.result.map((item) => {
                const firstTerm = item.firstTermscore ?? null; // Preserve null if not available
                const secondTerm = item.secondTermscore ?? null;
                const thirdTerm = item.ThirdTermscore ?? null;

                let grade: string;
                let comment: string;
                let annualAverage: string | null = null; // Define annualAverage with initial value null

                // Calculate based on available scores
                if (
                  thirdTerm !== null &&
                  secondTerm !== null &&
                  firstTerm !== null
                ) {
                  // All scores are available, calculate the annual average
                  annualAverage = (
                    (firstTerm + secondTerm + thirdTerm) /
                    3
                  ).toFixed(2);
                  ({ grade, comment } = calculateGrade(Number(annualAverage)));
                } else if (secondTerm !== null) {
                  // Only second term is available
                  ({ grade, comment } = calculateGrade(secondTerm));
                } else if (firstTerm !== null) {
                  // Only first term is available
                  ({ grade, comment } = calculateGrade(firstTerm));
                } else {
                  // No scores available
                  grade = "-";
                  comment = "-";
                }

                return (
                  <tr key={item.id} className="table-row">
                    <td className="px-4 py-2 border border-gray-300 text-center">
                      {item.exam?.subject?.name || "-"}
                    </td>
                    <td className="px-4 py-2 border border-gray-300 text-center">
                      {firstTerm || "-"}
                    </td>
                    {showSecondTerm && (
                      <td className="px-4 py-2 border border-gray-300 text-center">
                        {secondTerm || "-"}
                      </td>
                    )}
                    {showThirdTerm && (
                      <td className="px-4 py-2 border border-gray-300 text-center">
                        {thirdTerm || "-"}
                      </td>
                    )}
                    {hasAllTerm && (
                      <td className="px-4 py-2 border border-gray-300 text-center">
                        {annualAverage}
                      </td>
                    )}
                    <td className="px-4 py-2 border border-gray-300 text-center">
                      {grade}
                    </td>
                    <td className="px-4 py-2 border border-gray-300 text-center font-semibold">
                      {comment}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      {/* Download Button */}
      <div className="flex justify-end mt-6">
        <button
          data-html2canvas-ignore
          onClick={() =>
            handleOnClick(`${student.name}_${student.surname}_result.pdf`)
          }
          className="bg-blue-500 text-white rounded-xl px-6 py-2 text-sm md:text-base font-semibold transition"
        >
          Download Result
        </button>
      </div>
    </div>
  );
};

export default Pdf;
