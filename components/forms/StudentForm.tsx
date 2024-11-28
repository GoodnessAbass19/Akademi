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
import CustomFormField, { FormFieldType } from "../ui/CustomFormField";
import { SelectItem } from "../ui/select";
import InputField from "../ui/InputField";
import prisma from "@/lib/prisma";

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
  const [parentId, setParentId] = useState<string>();
  const [loadingParent, setLoadingParent] = useState(false);
  const [state, formAction] = useFormState(
    type === "create" ? createStudent : updateStudent,
    {
      success: false,
      error: false,
    }
  );

  // Fetch Parent ID Function
  const fetchParentId = async (parentName: string) => {
    if (!parentName) return;
    try {
      setLoadingParent(true);
      const parent = await prisma.parent.findUnique({
        where: { name: parentName },
        select: { id: true },
      });
      if (parent) {
        setParentId(parent.id);
        console.log(parent.id);
      } else {
        toast.error("Parent not found!");
        setParentId(null);
      }
    } catch (error) {
      console.error("Error fetching parent ID:", error);
      toast.error("Failed to fetch parent information.");
      setParentId(null);
    } finally {
      setLoadingParent(false);
    }
  };
  const onSubmit = handleSubmit((data) => {
    console.log("hello");
    console.log(data);
    formAction({ ...data, img: img?.secure_url, parentId: parentId });
  });

  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      toast(`Student has been ${type === "create" ? "created" : "updated"}!`);
      setOpen(false);
      router.refresh();
    }
  }, [state, router, type, setOpen]);

  const { grades, classes } = relatedData;

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
                          src={img?.secure_url}
                          alt="img"
                          width={200}
                          height={200}
                        />
                      ) : (
                        <div
                          className="text-xs text-gray-500 flex items-center justify-center gap-2 cursor-pointer w-[200px] h-[200px] border-dashed border-2 border-gray-300"
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
                  label="Parent Name"
                  name="parentId"
                  placeholder="John doe"
                  iconAlt="parent"
                  iconSrc="/icons/parent-form.png"
                  defaultValue={data?.parentId}
                  register={register}
                  error={errors?.parentId}
                  onBlur={(e) => fetchParentId(e.target.value)}
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
        {loadingParent && <p>Loading parent...</p>}
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