import { Class, Subject, Teacher } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";

type TeacherList = Teacher & { subjects: Subject[] } & { classes: Class[] };

const TeacherCard = ({ data }: { data: TeacherList }) => {
  return (
    <div className="rounded-2xl bg-[#FCFBFC] p-4 h-[352px] shadow-md">
      <Link
        href={`/list/teachers/${data.id}`}
        className="flex flex-col justify-end items-end"
      >
        <Image
          src={"/icons/Dots.png"}
          alt="more"
          width={100}
          height={100}
          className="w-5 h-5"
        />
      </Link>

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
            <h2 className="font-semibold text-[#4D44B5] capitalize text-xl">
              {data.name}
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
