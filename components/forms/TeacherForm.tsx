"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField, { FormFieldType } from "../ui/InputField";
import Image from "next/image";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { teacherSchema, TeacherSchema } from "@/lib/formValidationSchema";
import { useFormState } from "react-dom";
import { createTeacher, updateTeacher } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { CldUploadWidget } from "next-cloudinary";
import PhoneInput from "react-phone-number-input";
import { E164Number } from "libphonenumber-js/core";
import { Form, FormControl } from "../ui/form";
import { GenderOptions } from "@/lib/types";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import CustomFormField from "../ui/CustomFormField";
import { SelectItem } from "../ui/select";

const TeacherForm = ({
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
  const form = useForm<TeacherSchema>({
    resolver: zodResolver(teacherSchema),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;
  const [img, setImg] = useState<any>();

  const [state, formAction] = useFormState(
    type === "create" ? createTeacher : updateTeacher,
    {
      success: false,
      error: false,
    }
  );

  const onSubmit = handleSubmit((data) => {
    console.log(data);
    formAction({ ...data, img: img?.secure_url });
  });

  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      toast(`Teacher has been ${type === "create" ? "created" : "updated"}!`);
      setOpen(false);
      router.refresh();
    }
  }, [state, router, type, setOpen]);

  const renderField = (
    fieldType: FormFieldType,
    name: keyof TeacherSchema,
    label: string,
    placeholder?: string,
    iconSrc?: string
  ) => (
    <InputField
      control={form.control}
      fieldType={fieldType}
      name={name}
      label={label}
      placeholder={placeholder}
      iconSrc={iconSrc}
    />
  );

  return (
    // <form className="flex flex-col gap-8" onSubmit={onSubmit}>
    //   <h1 className="text-xl font-semibold">
    //     {type === "create" ? "Create a new teacher" : "Update the teacher"}
    //   </h1>

    //   {/* Authentication information */}
    //   <div className="rounded-2xl bg-white">
    //     <section className="mb-4 py-2.5 px-4 w-full bg-[#4D44B5] rounded-t-2xl">
    //       <h1 className="text-lg font-semibold text-white">
    //         Authentication Information
    //       </h1>
    //     </section>

    //     {/* Inputs */}

    //     <div className="gap-5 p-4 grid grid-cols-3 justify-between items-center">
    //       <InputField
    //         label="Username"
    //         name="username"
    //         defaultValue={data?.username}
    //         register={register}
    //         error={errors?.username}
    //         iconAlt="name"
    //         iconSrc="/icons/user.svg"
    //       />
    //       <InputField
    //         label="Email"
    //         name="email"
    //         defaultValue={data?.email}
    //         register={register}
    //         error={errors?.email}
    //         iconAlt="name"
    //         iconSrc="/icons/email.svg"
    //       />
    //       <InputField
    //         label="Password"
    //         name="password"
    //         type="password"
    //         defaultValue={data?.password}
    //         register={register}
    //         error={errors?.password}
    //         iconAlt="password"
    //         iconSrc="/icons/Password.svg"
    //       />
    //     </div>
    //   </div>

    //   <div className="rounded-2xl bg-white">
    //     <section className="mb-4 py-2.5 px-4 w-full bg-[#4D44B5] rounded-t-2xl">
    //       <h1 className="text-lg font-semibold text-white">
    //         Personal Information
    //       </h1>
    //     </section>

    //     <div className="gap-y-8 gap-x-5 grid grid-cols-2 justify-between items-center">
    //       <InputField
    //         label="First Name"
    //         name="name"
    //         defaultValue={data?.name}
    //         register={register}
    //         error={errors.name}
    //       />
    //       <InputField
    //         label="Last Name"
    //         name="surname"
    //         defaultValue={data?.surname}
    //         register={register}
    //         error={errors.surname}
    //       />

    //       <PhoneInput
    //         defaultCountry="US"
    //         placeholder={"(234) 809-5678-354"}
    //         international
    //         withCountryCallingCode
    //         value={field.value as E164Number | undefined}
    //         onChange={field.onChange}
    //         className="input-phone"
    //       />
    //       <InputField
    //         label="Address"
    //         name="address"
    //         defaultValue={data?.address}
    //         register={register}
    //         error={errors.address}
    //       />
    //     </div>
    //   </div>
    //   <div className="flex justify-between flex-wrap gap-4">
    //     <InputField
    //       label="First Name"
    //       name="name"
    //       defaultValue={data?.name}
    //       register={register}
    //       error={errors.name}
    //     />
    //     <InputField
    //       label="Last Name"
    //       name="surname"
    //       defaultValue={data?.surname}
    //       register={register}
    //       error={errors.surname}
    //     />
    //     <InputField
    //       label="Phone"
    //       name="phone"
    //       defaultValue={data?.phone}
    //       register={register}
    //       error={errors.phone}
    //     />
    //     <InputField
    //       label="Address"
    //       name="address"
    //       defaultValue={data?.address}
    //       register={register}
    //       error={errors.address}
    //     />
    //     <InputField
    //       label="Blood Type"
    //       name="bloodType"
    //       defaultValue={data?.bloodType}
    //       register={register}
    //       error={errors.bloodType}
    //     />
    //     <InputField
    //       label="Birthday"
    //       name="birthday"
    //       defaultValue={data?.birthday.toISOString().split("T")[0]}
    //       register={register}
    //       error={errors.birthday}
    //       type="date"
    //     />
    //     {data && (
    //       <InputField
    //         label="Id"
    //         name="id"
    //         defaultValue={data?.id}
    //         register={register}
    //         error={errors?.id}
    //         hidden
    //       />
    //     )}
    //     <div className="flex flex-col gap-2 w-full md:w-1/4">
    //       <label className="text-xs text-gray-500">Sex</label>
    //       <select
    //         className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
    //         {...register("sex")}
    //         defaultValue={data?.sex}
    //       >
    //         <option value="MALE">Male</option>
    //         <option value="FEMALE">Female</option>
    //       </select>
    //       {errors.sex?.message && (
    //         <p className="text-xs text-red-400">
    //           {errors.sex.message.toString()}
    //         </p>
    //       )}
    //     </div>
    //     <div className="flex flex-col gap-2 w-full md:w-1/4">
    //       <label className="text-xs text-gray-500">Subjects</label>
    //       <select
    //         multiple
    //         className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
    //         {...register("subjects")}
    //         defaultValue={data?.subjects}
    //       >
    //         {subjects.map((subject: { id: number; name: string }) => (
    //           <option value={subject.id} key={subject.id}>
    //             {subject.name}
    //           </option>
    //         ))}
    //       </select>
    //       {errors.subjects?.message && (
    //         <p className="text-xs text-red-400">
    //           {errors.subjects.message.toString()}
    //         </p>
    //       )}
    //     </div>
    //     <CldUploadWidget
    //       uploadPreset="school"
    //       onSuccess={(result, { widget }) => {
    //         setImg(result.info);
    //         widget.close();
    //       }}
    //     >
    //       {({ open }) => {
    //         return (
    //           <div>
    //             {img ? (
    //               <Image
    //                 src={img?.secure_url}
    //                 alt="img"
    //                 width={200}
    //                 height={200}
    //               />
    //             ) : (
    //               <div
    //                 className="text-xs text-gray-500 flex items-center gap-2 cursor-pointer"
    //                 onClick={() => open()}
    //               >
    //                 <Image
    //                   src="/icons/upload.png"
    //                   alt=""
    //                   width={28}
    //                   height={28}
    //                 />
    //                 <span>Upload a photo</span>
    //               </div>
    //             )}
    //           </div>
    //         );
    //       }}
    //     </CldUploadWidget>
    //   </div>
    //   {state.error && (
    //     <span className="text-red-500">Something went wrong!</span>
    //   )}
    //   <button className="bg-blue-400 text-white p-2 rounded-md">
    //     {type === "create" ? "Create" : "Update"}
    //   </button>
    // </form>

    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-8">
        {/* Authentication Information */}
        <div className="rounded-2xl bg-white">
          <section className="mb-4 p-4 w-full bg-[#4D44B5] rounded-t-2xl">
            <h1 className="text-xl font-semibold text-white">
              Authentication Information
            </h1>
          </section>
          <div className="space-x-5 p-4 grid grid-cols-3 justify-between items-center">
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name="username"
              label="Username"
              placeholder="John Doe"
              iconAlt="user"
              iconSrc="/icons/user.svg"
              defaultValue={data?.username}
              {...form.register}
            />
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name="email"
              label="Email"
              placeholder="Johndoe@gmail.com"
              iconAlt="email"
              iconSrc="/icons/email.svg"
              defaultValue={data?.email}
              {...form.register}
            />
            <CustomFormField
              fieldType={FormFieldType.PASSWORD}
              control={form.control}
              name="password"
              label="Password"
              placeholder="password"
              iconAlt="password"
              iconSrc="/icons/Password.svg"
              defaultValue={data?.password}
            />
          </div>
        </div>

        {/* Personal Information */}
        <div className="rounded-2xl bg-white">
          <section className="mb-4 p-4 w-full bg-[#4D44B5] rounded-t-2xl">
            <h1 className="text-xl font-semibold text-white">
              Personal Information
            </h1>
          </section>
          <div className="space-y-8 p-4">
            <div className="gap-y-8 gap-x-5 grid grid-cols-2 justify-between items-center">
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="name"
                label="First name"
                placeholder="Doe"
                iconAlt="user"
                iconSrc="/icons/user.svg"
                defaultValue={data?.name}
              />
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="surname"
                label="Last name"
                placeholder="Doe"
                iconAlt="user"
                iconSrc="/icons/user.svg"
                defaultValue={data?.surname}
              />
            </div>
            <div className="gap-y-8 gap-x-5 grid grid-cols-2 justify-between items-center">
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="email"
                label="Email"
                placeholder="Johndoe@gmail.com"
                iconAlt="email"
                iconSrc="/icons/email.svg"
                defaultValue={data?.email}
              />
              <CustomFormField
                fieldType={FormFieldType.PHONE_INPUT}
                control={form.control}
                name="phone"
                label="Phone Number"
                placeholder="(234) 809-5678-354"
                iconAlt="phone"
                iconSrc="/icons/email.svg"
                defaultValue={data?.phone}
              />
            </div>
            <div className="gap-y-8 gap-x-5 grid grid-cols-2 justify-between items-center">
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="address"
                label="Address"
                placeholder="123 Main St."
                iconAlt="address"
                iconSrc="/icons/Location.svg"
                defaultValue={data?.address}
              />
              <CustomFormField
                fieldType={FormFieldType.DATE_PICKER}
                control={form.control}
                name="birthday"
                label="Date of Birth"
                defaultValue={data?.birthday.toISOString().split("T")[0]}
              />
            </div>
            <div className="gap-y-8 gap-x-5 grid grid-cols-2 justify-between items-center">
              <div>
                <label className="text-xs text-gray-500">Sex</label>
                <select
                  className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
                  {...form.register("sex")}
                  defaultValue={data?.sex}
                >
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                </select>
              </div>
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="bloodType"
                label="Blood Group"
                placeholder="blood group"
                iconAlt="blood"
                iconSrc="/icons/blood-bank.png"
                defaultValue={data?.bloodType}
              />

              {/* <div>
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
                {errors.subjects?.message && (
                  <p className="text-xs text-red-400">
                    {errors.subjects.message.toString()}
                  </p>
                )}
              </div> */}
            </div>
            <div className="gap-y-8 gap-x-5 grid grid-cols-2 justify-between items-center">
              <CustomFormField
                fieldType={FormFieldType.SELECT}
                control={form.control}
                name="subjects"
                label="Teacher Subjects"
                placeholder="Select subjects"
                defaultValue={data?.subjects}
              >
                {relatedData?.subjects.map(
                  (subject: { id: number; name: string }) => (
                    <SelectItem key={subject.id} value={subject.name}>
                      {subject.name}
                    </SelectItem>
                  )
                )}
              </CustomFormField>
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

export default TeacherForm;
