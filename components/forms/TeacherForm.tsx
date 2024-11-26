"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Image from "next/image";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import CustomFormField from "../ui/CustomFormField";
import { teacherSchema, TeacherSchema } from "@/lib/formValidationSchema";
import { Form, FormControl } from "../ui/form";
import { useRouter } from "next/navigation";
import { createTeacher, updateTeacher } from "@/lib/actions";
import { useFormState } from "react-dom";
import { CldUploadWidget } from "next-cloudinary";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import { GenderOptions } from "@/lib/types";
import { SelectItem } from "../ui/select";
import { toast } from "react-toastify";

export enum FormFieldType {
  INPUT = "input",
  TEXTAREA = "textarea",
  PHONE_INPUT = "phoneInput",
  CHECKBOX = "checkbox",
  DATE_PICKER = "datePicker",
  SELECT = "select",
  SKELETON = "skeleton",
  PASSWORD = "password",
}

const TeacherForm = ({
  type,
  data,
  relatedData,
}: {
  type: "create" | "update";
  data?: any;
  relatedData?: any;
}) => {
  const form = useForm<TeacherSchema>({
    resolver: zodResolver(teacherSchema),
  });

  const [img, setImg] = useState<any>();

  const [state, formAction] = useFormState(
    type === "create" ? createTeacher : updateTeacher,
    {
      success: false,
      error: false,
    }
  );

  const onSubmit = (data: {
    username: string;
    name: string;
    surname: string;
    address: string;
    bloodType: string;
    birthday: Date;
    sex: "MALE" | "FEMALE";
    id?: string | undefined;
    password?: string | undefined;
    email?: string | undefined;
    phone?: string | undefined;
    img?: string | undefined;
    subjects?: string[] | undefined;
  }) => {
    console.log(data);
    formAction({ ...data, img: img?.secure_url });
  };
  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      toast(`Teacher has been ${type === "create" ? "created" : "updated"}!`);
      // setOpen(false);
      router.refresh();
    }
  }, [state, router, type]);

  const { subjects } = relatedData;
  console.log(subjects);

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-8"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        {/* AUTHENTICATION INFORMATION */}
        <div className="rounded-2xl bg-white">
          <section className="mb-4 p-4 w-full bg-[#4D44B5] rounded-t-2xl">
            <h1 className="text-xl font-semibold text-white">
              {" "}
              Authentication Information
            </h1>
          </section>
          <div className="space-x-5 p-4 grid grid-cols-3 justify-between items-center">
            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.INPUT}
              name="name"
              label="Full name"
              placeholder="John doe"
              iconSrc="/icons/user.svg"
              iconAlt="user"
            />
            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.INPUT}
              name="email"
              label="Email"
              placeholder="Johndoe@gmail.com"
              iconSrc="/icons/email.svg"
              iconAlt="email"
            />
            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.PASSWORD}
              name="password"
              label="Password"
              placeholder="password"
              iconSrc="/icons/Password.svg"
              iconAlt="password"
            />
          </div>
        </div>

        {/* PERSONAL INFORMATION */}
        <div className="rounded-2xl bg-white">
          <section className="mb-4 p-4 w-full bg-[#4D44B5] rounded-t-2xl">
            <h1 className="text-xl font-semibold text-white">
              Personal Information
            </h1>
          </section>
          {/* FORM */}
          <div className="space-y-8 p-4 ">
            {/* First Name and Last Name */}
            <div className="gap-y-8 gap-x-5 grid grid-cols-2 justify-between items-center">
              <CustomFormField
                control={form.control}
                fieldType={FormFieldType.INPUT}
                name="name"
                label="First name"
                placeholder="John doe"
                iconSrc="/icons/user.svg"
                iconAlt="user"
              />
              <CustomFormField
                control={form.control}
                fieldType={FormFieldType.INPUT}
                name="surname"
                label="Last name"
                placeholder="John doe"
                iconSrc="/icons/user.svg"
                iconAlt="user"
              />
            </div>
            {/* Email and Phone Number */}
            <div className="gap-y-8 gap-x-5 grid grid-cols-2 justify-between items-center">
              <CustomFormField
                control={form.control}
                fieldType={FormFieldType.INPUT}
                name="email"
                label="Email"
                placeholder="Johndoe@gmail.com"
                iconSrc="/icons/email.svg"
                iconAlt="email"
              />
              <CustomFormField
                control={form.control}
                fieldType={FormFieldType.PHONE_INPUT}
                name="phone"
                label="Phone number"
                placeholder="(234) 809-5678-354"
                iconSrc="/assets/icons/email.svg"
                iconAlt="email"
              />
            </div>

            {/* Address and Photo */}
            <div className="gap-y-8 gap-x-5 grid grid-cols-2 justify-between items-center">
              <CustomFormField
                control={form.control}
                fieldType={FormFieldType.INPUT}
                name="address"
                label="Address"
                placeholder="Address"
                iconSrc="/icons/Location.svg"
                iconAlt="user"
              />
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
                          className="text-xs text-gray-500 flex items-center gap-2 cursor-pointer"
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

            {/* Date of birth and gender */}
            <div className="gap-y-8 gap-x-5 grid grid-cols-2 justify-between items-center">
              <CustomFormField
                control={form.control}
                fieldType={FormFieldType.DATE_PICKER}
                name="birthday"
                label="Date of Birth"
              />

              <CustomFormField
                control={form.control}
                fieldType={FormFieldType.SKELETON}
                name="gender"
                label="Gender"
                renderSkeleton={(field) => (
                  <FormControl>
                    <RadioGroup
                      className="flex h-11 gap-6 xl:justify-start"
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      {GenderOptions.map((option, i) => (
                        <div
                          key={option + i}
                          className="flex h-full flex-1 items-center gap-2 rounded-md border border-dashed border-dark-500 bg-dark-400 p-3"
                        >
                          <RadioGroupItem value={option} id={option} />
                          <Label htmlFor={option} className="cursor-pointer">
                            {option}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </FormControl>
                )}
              />
            </div>

            {/* Teacher Subjects */}
            <div className="gap-y-8 gap-x-5 grid grid-cols-2 justify-between items-center">
              {/* <CustomFormField
                fieldType={FormFieldType.SELECT}
                control={form.control}
                name="subjects"
                label="Teacher Subjects"
                placeholder="Subjects"
              >
                {subjects.map((doctor, i) => (
              <SelectItem key={doctor.name + i} value={doctor.name}>
                <div className="flex cursor-pointer items-center gap-2">
                  <Image
                    src={doctor.img}
                    width={32}
                    height={32}
                    alt="doctor"
                    className="rounded-full border border-dark-500"
                  />
                  <p>{doctor.name}</p>
                </div>
              </SelectItem>
            ))}
              </CustomFormField> */}

              <div className="flex flex-col gap-2 w-full md:w-1/4">
                <label className="text-xs text-gray-500">Subjects</label>
                <select
                  multiple
                  className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
                  {...form.register("subjects")}
                  defaultValue={data?.subjects}
                >
                  {subjects.map((subject: { id: number; name: string }) => (
                    <option value={subject.id} key={subject.id}>
                      {subject.name}
                    </option>
                  ))}
                </select>
                {/* {errors.subjects?.message && (
                  <p className="text-xs text-red-400">
                    {errors.subjects.message.toString()}
                  </p>
                )} */}
              </div>
            </div>
          </div>
        </div>
        {state.error && (
          <span className="text-red-500">Something went wrong!</span>
        )}
        <button className="bg-blue-400 text-white p-2 rounded-md">
          {type === "create" ? "Create" : "Update"}
        </button>
      </form>
    </Form>
  );
};

export default TeacherForm;
