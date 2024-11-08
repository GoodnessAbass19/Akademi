import { lessonsData } from "@/lib/data";
import { formatDate } from "@/lib/settings";
import React from "react";
import LessonCard from "./LessonCard";
import prisma from "@/lib/prisma";

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
        <h2 className="text-xl font-bold capitalize text-[#4D44B5]">
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
