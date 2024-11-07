import { lessonsData } from "@/lib/data";
import { formatDate } from "@/lib/settings";
import React from "react";
import LessonCard from "./LessonCard";
import prisma from "@/lib/prisma";

// const data = [
//   {
//     id: 1,
//     name: "Algebra Lesson 1",
//     day: "MONDAY",
//     startTime: new Date(),
//     endTime: new Date(),
//     subjectId: 1,
//     subject: {
//       id: 1,
//       name: "Mathematics",
//     },
//     classId: 1,
//     class: {
//       id: 1,
//       name: "Class A",
//       grade: 10,
//     },
//     teacherId: "T001",
//     teacher: {
//       id: "T001",
//       name: "John Smith",
//     },
//     exams: [
//       {
//         id: 1,
//         date: "2024-11-13T09:00:00Z",
//         lessonId: 1,
//       },
//     ],
//     assignments: [
//       {
//         id: 1,
//         title: "Algebra Homework 1",
//         dueDate: "2024-11-08T23:59:00Z",
//         lessonId: 1,
//       },
//     ],
//     attendance: [
//       {
//         id: 1,
//         date: "2024-11-06T08:00:00Z",
//         status: "Present",
//         lessonId: 1,
//       },
//     ],
//   },
//   {
//     id: 2,
//     name: "Geometry Lesson 1",
//     day: "WEDNESDAY",
//     startTime: new Date(),
//     endTime: new Date(),
//     subjectId: 2,
//     subject: {
//       id: 2,
//       name: "Geometry",
//     },
//     classId: 2,
//     class: {
//       id: 2,
//       name: "Class B",
//       grade: 11,
//     },
//     teacherId: "T002",
//     teacher: {
//       id: "T002",
//       name: "Jane Doe",
//     },
//     exams: [
//       {
//         id: 2,
//         date: "2024-11-15T11:00:00Z",
//         lessonId: 2,
//       },
//     ],
//     assignments: [
//       {
//         id: 2,
//         title: "Geometry Worksheet 1",
//         dueDate: "2024-11-10T23:59:00Z",
//         lessonId: 2,
//       },
//     ],
//     attendance: [
//       {
//         id: 2,
//         date: "2024-11-08T10:00:00Z",
//         status: "Absent",
//         lessonId: 2,
//       },
//     ],
//   },
//   {
//     id: 3,
//     name: "Algebra Lesson 1",
//     day: "MONDAY",
//     startTime: "2024-11-06T08:00:00Z",
//     endTime: "2024-11-06T09:30:00Z",
//     subjectId: 1,
//     subject: {
//       id: 1,
//       name: "Mathematics",
//     },
//     classId: 1,
//     class: {
//       id: 1,
//       name: "Class A",
//       grade: 10,
//     },
//     teacherId: "T001",
//     teacher: {
//       id: "T001",
//       name: "John Smith",
//     },
//     exams: [
//       {
//         id: 1,
//         date: "2024-11-13T09:00:00Z",
//         lessonId: 1,
//       },
//     ],
//     assignments: [
//       {
//         id: 1,
//         title: "Algebra Homework 1",
//         dueDate: "2024-11-08T23:59:00Z",
//         lessonId: 1,
//       },
//     ],
//     attendance: [
//       {
//         id: 1,
//         date: "2024-11-06T08:00:00Z",
//         status: "Present",
//         lessonId: 1,
//       },
//     ],
//   },
//   {
//     id: 4,
//     name: "Geometry Lesson 1",
//     day: "WEDNESDAY",
//     startTime: "2024-11-08T10:00:00Z",
//     endTime: "2024-11-08T11:30:00Z",
//     subjectId: 2,
//     subject: {
//       id: 2,
//       name: "Geometry",
//     },
//     classId: 2,
//     class: {
//       id: 2,
//       name: "Class B",
//       grade: 11,
//     },
//     teacherId: "T002",
//     teacher: {
//       id: "T002",
//       name: "Jane Doe",
//     },
//     exams: [
//       {
//         id: 2,
//         date: "2024-11-15T11:00:00Z",
//         lessonId: 2,
//       },
//     ],
//     assignments: [
//       {
//         id: 2,
//         title: "Geometry Worksheet 1",
//         dueDate: "2024-11-10T23:59:00Z",
//         lessonId: 2,
//       },
//     ],
//     attendance: [
//       {
//         id: 2,
//         date: "2024-11-08T10:00:00Z",
//         status: "Absent",
//         lessonId: 2,
//       },
//     ],
//   },
// ];

const Schedules = async ({
  type,
  id,
}: {
  type: "teacherId" | "classId";
  id: string | number;
}) => {
  const date = new Date();
  const dataRes = await prisma.lesson.findMany({
    where: {
      ...(type === "teacherId"
        ? { teacherId: id as string }
        : { classId: id as number }),
    },
  });

  const data = dataRes.map((lesson) => ({
    title: lesson.name,
    startTime: lesson.startTime,
    endTime: lesson.endTime,
    name: lesson.name,
    classId: lesson.classId,
    id: lesson.id,
    day: lesson.day,
    teacherId: lesson.teacherId,
    subjectId: lesson.subjectId,
  }));

  return (
    <div className="grid gap-7">
      <div className="rounded-2xl bg-white p-8 flex flex-col space-y-4">
        <h2 className="text-2xl font-bold capitalize text-[#4D44B5]">
          Schedule details
        </h2>
        <span className="text-sm font-normal capitalize text-gray-500">
          {formatDate(date)}
        </span>
      </div>
      <div className="flex flex-col justify-between items-start gap-4">
        {data.map((item, idx) => (
          <LessonCard key={idx} data={item} index={idx} />
        ))}
      </div>
    </div>
  );
};

export default Schedules;
