import NewTeacherForm from "@/components/forms/NewForm";
import prisma from "@/lib/prisma";
import React from "react";

const AddNewTeacher = async () => {
  let relatedData = {};
  const subjectTeachers = await prisma.teacher.findMany({
    select: { id: true, name: true, surname: true, img: true },
  });
  relatedData = { teachers: subjectTeachers };

  return (
    <div className="">
      <NewTeacherForm type="create" />
    </div>
  );
};

export default AddNewTeacher;
