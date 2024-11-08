import prisma from "@/lib/prisma";
import Image from "next/image";

const UserCard = async ({
  type,
  icon,
}: {
  type: "event" | "teacher" | "student" | "parent";
  icon: string;
}) => {
  const modelMap: Record<typeof type, any> = {
    event: prisma.event,
    teacher: prisma.teacher,
    student: prisma.student,
    parent: prisma.parent,
  };

  const data = await modelMap[type].count();

  return (
    <div className="p-4 flex-1 min-w-[130px]">
      <div className="flex justify-start gap-4 items-center">
        <Image src={icon} alt="icon" width={52} height={52} />
        <div>
          <h2 className="capitalize text-sm font-medium text-gray-500">
            {type}s
          </h2>
          <h1 className="text-2xl font-bold">{data}</h1>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
