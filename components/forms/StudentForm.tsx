"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Image from "next/image";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { studentSchema, StudentSchema } from "@/lib/formValidationSchema";
import { useFormState } from "react-dom";
import { createStudent, updateStudent } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { CldUploadWidget } from "next-cloudinary";
import { Form, FormControl } from "../ui/form";
import InputField from "../ui/InputField";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const StudentForm = ({
  type,
  data,
  setOpen,
  relatedData,
}: {
  type: "create" | "update";
  data?: any;
  setOpen: Dispatch<SetStateAction<boolean>>;
  relatedData?: any;
}) => {
  const form = useForm<StudentSchema>({
    resolver: zodResolver(studentSchema),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  const [img, setImg] = useState<any>();

  const [state, formAction] = useFormState(
    type === "create" ? createStudent : updateStudent,
    {
      success: false,
      error: false,
    }
  );

  const onSubmit = handleSubmit((data) => {
    formAction({ ...data, img: img?.secure_url });
  });

  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      toast(`Student has been ${type === "create" ? "created" : "updated"}!`);
      setOpen(false);
      router.refresh();
    }
  }, [state, router, type, setOpen]);

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-8">
        {/* Authentication Information */}
        <div className="rounded-2xl bg-white">
          <section className="mb-4 p-4 w-full bg-[#4D44B5] rounded-t-2xl">
            <h1 className="text-xl font-semibold text-white">
              Authentication Information
            </h1>
          </section>
          <div className="gap-5 p-4 grid grid-cols-3 justify-between items-center">
            <InputField
              label="Username"
              name="username"
              defaultValue={data?.username}
              register={register}
              error={errors?.username}
              iconAlt="user"
              iconSrc="/icons/user.svg"
              placeholder="John Doe"
            />
            <InputField
              label="Email"
              name="email"
              defaultValue={data?.email}
              register={register}
              error={errors?.email}
              iconAlt="email"
              iconSrc="/icons/email.svg"
              placeholder="Johndoe@gmail.com"
            />
            <InputField
              label="Password"
              name="password"
              defaultValue={data?.password}
              register={register}
              error={errors?.password}
              iconAlt="password"
              iconSrc="/icons/Password.svg"
              type="password"
            />
          </div>
        </div>

        {/* Student Information */}

        <div className="rounded-2xl bg-white">
          <section className="mb-4 p-4 w-full bg-[#4D44B5] rounded-t-2xl">
            <h1 className="text-xl font-semibold text-white">
              Personal Information
            </h1>
          </section>
          <div className="lg:p-4 p-2 gap-y-8 gap-x-5 grid md:grid-cols-4 justify-between items-start">
            <div className="col-span-1">
              <CldUploadWidget
                uploadPreset="school"
                onSuccess={(result, { widget }) => {
                  setImg(result.info);
                  widget.close();
                }}
              >
                {({ open }) => {
                  return (
                    <div>
                      {img ? (
                        <Image
                          src={img?.secure_url || data.img}
                          alt="img"
                          width={200}
                          height={200}
                        />
                      ) : (
                        <div
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center justify-center gap-2 cursor-pointer w-[200px] h-[200px] border-dashed border-2 border-gray-300"
                          onClick={() => open()}
                        >
                          <Image
                            src="/icons/upload.png"
                            alt=""
                            width={28}
                            height={28}
                          />
                          <span>Upload a photo</span>
                        </div>
                      )}
                    </div>
                  );
                }}
              </CldUploadWidget>
            </div>

            <div className="col-span-3 space-y-8">
              <div className="gap-y-8 gap-x-5 grid grid-cols-2 justify-between items-center">
                <InputField
                  label="First name"
                  name="name"
                  defaultValue={data?.name}
                  register={register}
                  error={errors?.name}
                  iconAlt="user"
                  iconSrc="/icons/user.svg"
                  placeholder="John"
                />
                <InputField
                  name="surname"
                  label="Last name"
                  placeholder="Doe"
                  iconAlt="user"
                  iconSrc="/icons/user.svg"
                  defaultValue={data?.surname}
                  register={register}
                  error={errors?.surname}
                />
              </div>
              <div className="gap-y-8 gap-x-5 grid grid-cols-2 justify-between items-center">
                <InputField
                  name="birthday"
                  label="Date of Birth"
                  type="date"
                  defaultValue={data?.birthday.toISOString().split("T")[0]}
                  register={register}
                  error={errors?.birthday}
                />
                <InputField
                  label="Parent ID"
                  name="parentId"
                  placeholder="parent123"
                  iconAlt="parent"
                  iconSrc="/icons/parent-form.png"
                  defaultValue={data?.parentId}
                  register={register}
                  error={errors?.parentId}
                />
              </div>

              <div className="gap-y-8 gap-x-5 grid grid-cols-2 justify-between items-center">
                <InputField
                  name="email"
                  label="Email"
                  placeholder="Johndoe@gmail.com"
                  iconAlt="email"
                  iconSrc="/icons/email.svg"
                  defaultValue={data?.email}
                  register={register}
                  error={errors?.email}
                />
                <InputField
                  name="phone"
                  label="Phone Number"
                  placeholder="(234) 809-5678-354"
                  iconAlt="phone"
                  iconSrc="/icons/Call.svg"
                  defaultValue={data?.phone}
                  register={register}
                  error={errors?.phone}
                />
              </div>
              <div className="gap-y-8 gap-x-5 grid grid-cols-2 justify-between items-center">
                <div>
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Sex
                  </label>
                  <select
                    className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
                    {...form.register("sex")}
                    defaultValue={data?.sex}
                  >
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                  </select>
                </div>
                <InputField
                  name="bloodType"
                  label="Blood Group"
                  placeholder="blood group"
                  iconAlt="blood"
                  iconSrc="/icons/blood-bank.png"
                  defaultValue={data?.bloodType}
                  register={register}
                  error={errors?.name}
                />
              </div>
              <div className="gap-y-8 gap-x-5 grid grid-cols-2 justify-between items-end">
                <InputField
                  name="address"
                  label="Address"
                  placeholder="123 Main St."
                  iconAlt="address"
                  iconSrc="/icons/Location.svg"
                  defaultValue={data?.address}
                  register={register}
                  error={errors?.address}
                />

                <div className="flex flex-col gap-2 w-full md:w-full">
                  <label className="text-xs text-gray-500">Grade</label>
                  <select
                    className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
                    {...register("gradeId")}
                    defaultValue={data?.gradeId}
                  >
                    {relatedData?.grades.map(
                      (grade: { id: number; level: number }) => (
                        <option value={grade.id} key={grade.id}>
                          {grade.level}
                        </option>
                      )
                    )}
                  </select>
                  {errors.gradeId?.message && (
                    <p className="text-xs text-red-400">
                      {errors.gradeId.message.toString()}
                    </p>
                  )}
                </div>
              </div>
              <div className="gap-y-8 gap-x-5 grid grid-cols-2 justify-between items-end">
                <div className="flex flex-col gap-2 w-full md:w-full">
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Class
                  </label>
                  <select
                    className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
                    {...register("classId")}
                    defaultValue={data?.classId}
                  >
                    {relatedData?.classes.map(
                      (classItem: {
                        id: number;
                        name: string;
                        capacity: number;
                        _count: { students: number };
                      }) => (
                        <option value={classItem.id} key={classItem.id}>
                          ({classItem.name} -{" "}
                          {classItem._count.students + "/" + classItem.capacity}{" "}
                          Capacity)
                        </option>
                      )
                    )}
                  </select>
                  {errors.classId?.message && (
                    <p className="text-xs text-red-400">
                      {errors.classId.message.toString()}
                    </p>
                  )}
                </div>

                {data && (
                  <InputField
                    label="Id"
                    name="id"
                    defaultValue={data?.id}
                    register={register}
                    error={errors?.id}
                    hidden
                  />
                )}
              </div>
            </div>
          </div>
        </div>
        {state.error && (
          <span className="text-red-500">Something went wrong!</span>
        )}
        <button className="bg-[#4D44B5] text-white p-2 rounded-md w-full text-center font-semibold">
          {type === "create" ? "Create" : "Update"}
        </button>
      </form>
    </Form>
  );
};

export default StudentForm;
