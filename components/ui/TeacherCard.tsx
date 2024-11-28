import { Class, Subject, Teacher } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import FormContainer from "@/components/ui/FormContainer";

type TeacherList = Teacher & { subjects: Subject[] } & { classes: Class[] };

const TeacherCard = async ({ data }: { data: TeacherList }) => {
  const { userId, sessionClaims } = await auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;
  return (
    <div className="rounded-2xl bg-[#FCFBFC] p-4 h-[300px] lg:h-[320px] shadow-md">
      <div className="flex flex-col justify-end items-end">
        {role === "admin" && (
          <FormContainer table="teacher" type="delete" id={data.id} />
        )}
      </div>

      <div className="flex flex-col justify-center items-center gap-4">
        <Image
          src={data.img || "/icons/avatar.png"}
          alt={data.name}
          width={1000}
          height={1000}
          className="rounded-full object-cover object-top w-[120px] h-[120px]"
        />
        <div className="gap-2.5 flex flex-col items-center">
          <Link href={`/list/teachers/${data.id}`}>
            <h2 className="font-semibold text-[#4D44B5] capitalize text-base">
              {data.name + " " + data.surname}
            </h2>
          </Link>

          <span className="text-sm font-normal text-[A098AE]">
            {data.subjects.map((subject) => subject.name).join(",")}
            {/* {data.subjects.map((item, idx) => (
              <span key={idx}>
                {idx < data.subjects.length - 1 ? `${item}, ` : item}
              </span>
            ))} */}
          </span>
        </div>
        <div className="flex justify-center items-center gap-3">
          <Link
            href={`tel:${data.phone}`}
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
            href={`mailto:${data.email}`}
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
      </div>
    </div>
  );
};

export default TeacherCard;
