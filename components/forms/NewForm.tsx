// "use client";
// import CustomFormField from "../ui/CustomFormField";
// import { teacherSchema, TeacherSchema } from "@/lib/formValidationSchema";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";
// import { Form, FormControl } from "../ui/form";
// import { useRouter } from "next/navigation";
// import { createTeacher, updateTeacher } from "@/lib/actions";
// import { useFormState } from "react-dom";
// import { useState } from "react";
// import Image from "next/image";
// import { CldUploadWidget } from "next-cloudinary";
// import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
// import { Label } from "../ui/label";
// import { GenderOptions } from "@/lib/types";
// import { SelectItem } from "../ui/select";

// export enum FormFieldType {
//   INPUT = "input",
//   TEXTAREA = "textarea",
//   PHONE_INPUT = "phoneInput",
//   CHECKBOX = "checkbox",
//   DATE_PICKER = "datePicker",
//   SELECT = "select",
//   SKELETON = "skeleton",
//   PASSWORD = "password",
// }

// const NewTeacherForm = ({ type }: { type: "create" | "update" }) => {
//   const form = useForm<TeacherSchema>({
//     resolver: zodResolver(teacherSchema),
//   });

//   const [img, setImg] = useState<any>();

//   const [state, formAction] = useFormState(
//     type === "create" ? createTeacher : updateTeacher,
//     {
//       success: false,
//       error: false,
//     }
//   );

//   const onSubmit = (data: {
//     username: string;
//     name: string;
//     surname: string;
//     address: string;
//     bloodType: string;
//     birthday: Date;
//     sex: "MALE" | "FEMALE";
//     id?: string | undefined;
//     password?: string | undefined;
//     email?: string | undefined;
//     phone?: string | undefined;
//     img?: string | undefined;
//     subjects?: string[] | undefined;
//   }) => {
//     console.log(data);
//     formAction({ ...data, img: img?.secure_url });
//   };

//   const router = useRouter();

//   return (
//     <Form {...form}>
//       <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
//         {/* AUTHENTICATION INFORMATION */}
//         <div className="rounded-2xl bg-white">
//           <section className="mb-4 p-4 w-full bg-[#4D44B5] rounded-t-2xl">
//             <h1 className="text-xl font-semibold text-white">
//               {" "}
//               Authentication Information
//             </h1>
//           </section>
//           <div className="space-x-5 p-4 grid grid-cols-3 justify-between items-center">
//             <CustomFormField
//               control={form.control}
//               fieldType={FormFieldType.INPUT}
//               name="name"
//               label="Full name"
//               placeholder="John doe"
//               iconSrc="/icons/user.svg"
//               iconAlt="user"
//             />
//             <CustomFormField
//               control={form.control}
//               fieldType={FormFieldType.INPUT}
//               name="email"
//               label="Email"
//               placeholder="Johndoe@gmail.com"
//               iconSrc="/icons/email.svg"
//               iconAlt="email"
//             />
//             <CustomFormField
//               control={form.control}
//               fieldType={FormFieldType.PASSWORD}
//               name="password"
//               label="Password"
//               placeholder="password"
//               iconSrc="/icons/Password.svg"
//               iconAlt="password"
//             />
//           </div>
//         </div>

//         {/* PERSONAL INFORMATION */}
//         <div className="rounded-2xl bg-white">
//           <section className="mb-4 p-4 w-full bg-[#4D44B5] rounded-t-2xl">
//             <h1 className="text-xl font-semibold text-white">
//               Personal Information
//             </h1>
//           </section>
//           {/* FORM */}
//           <div className="space-y-8 p-4 ">
//             {/* First Name and Last Name */}
//             <div className="gap-y-8 gap-x-5 grid grid-cols-2 justify-between items-center">
//               <CustomFormField
//                 control={form.control}
//                 fieldType={FormFieldType.INPUT}
//                 name="name"
//                 label="First name"
//                 placeholder="John doe"
//                 iconSrc="/icons/user.svg"
//                 iconAlt="user"
//               />
//               <CustomFormField
//                 control={form.control}
//                 fieldType={FormFieldType.INPUT}
//                 name="surname"
//                 label="Last name"
//                 placeholder="John doe"
//                 iconSrc="/icons/user.svg"
//                 iconAlt="user"
//               />
//             </div>
//             {/* Email and Phone Number */}
//             <div className="gap-y-8 gap-x-5 grid grid-cols-2 justify-between items-center">
//               <CustomFormField
//                 control={form.control}
//                 fieldType={FormFieldType.INPUT}
//                 name="email"
//                 label="Email"
//                 placeholder="Johndoe@gmail.com"
//                 iconSrc="/icons/email.svg"
//                 iconAlt="email"
//               />
//               <CustomFormField
//                 control={form.control}
//                 fieldType={FormFieldType.PHONE_INPUT}
//                 name="phone"
//                 label="Phone number"
//                 placeholder="(234) 809-5678-354"
//                 iconSrc="/assets/icons/email.svg"
//                 iconAlt="email"
//               />
//             </div>

//             {/* Address and Photo */}
//             <div className="gap-y-8 gap-x-5 grid grid-cols-2 justify-between items-center">
//               <CustomFormField
//                 control={form.control}
//                 fieldType={FormFieldType.INPUT}
//                 name="address"
//                 label="Address"
//                 placeholder="Address"
//                 iconSrc="/icons/Location.svg"
//                 iconAlt="user"
//               />
//               <CldUploadWidget
//                 uploadPreset="school"
//                 onSuccess={(result, { widget }) => {
//                   setImg(result.info);
//                   widget.close();
//                 }}
//               >
//                 {({ open }) => {
//                   return (
//                     <div>
//                       {img ? (
//                         <Image
//                           src={img?.secure_url}
//                           alt="img"
//                           width={200}
//                           height={200}
//                         />
//                       ) : (
//                         <div
//                           className="text-xs text-gray-500 flex items-center gap-2 cursor-pointer"
//                           onClick={() => open()}
//                         >
//                           <Image
//                             src="/icons/upload.png"
//                             alt=""
//                             width={28}
//                             height={28}
//                           />
//                           <span>Upload a photo</span>
//                         </div>
//                       )}
//                     </div>
//                   );
//                 }}
//               </CldUploadWidget>
//             </div>

//             {/* Date of birth and gender */}
//             <div className="gap-y-8 gap-x-5 grid grid-cols-2 justify-between items-center">
//               <CustomFormField
//                 control={form.control}
//                 fieldType={FormFieldType.DATE_PICKER}
//                 name="birthday"
//                 label="Date of Birth"
//               />

//               <CustomFormField
//                 control={form.control}
//                 fieldType={FormFieldType.SKELETON}
//                 name="gender"
//                 label="Gender"
//                 renderSkeleton={(field) => (
//                   <FormControl>
//                     <RadioGroup
//                       className="flex h-11 gap-6 xl:justify-start"
//                       onValueChange={field.onChange}
//                       defaultValue={field.value}
//                     >
//                       {GenderOptions.map((option, i) => (
//                         <div
//                           key={option + i}
//                           className="flex h-full flex-1 items-center gap-2 rounded-md border border-dashed border-dark-500 bg-dark-400 p-3"
//                         >
//                           <RadioGroupItem value={option} id={option} />
//                           <Label htmlFor={option} className="cursor-pointer">
//                             {option}
//                           </Label>
//                         </div>
//                       ))}
//                     </RadioGroup>
//                   </FormControl>
//                 )}
//               />
//             </div>

//             {/* Teacher Subjects */}
//             <div className="gap-y-8 gap-x-5 grid grid-cols-2 justify-between items-center">
//               <CustomFormField
//                 fieldType={FormFieldType.SELECT}
//                 control={form.control}
//                 name="subjects"
//                 label="Teacher Subjects"
//                 placeholder="Subjects"
//               >
//                 {/* {Doctors.map((doctor, i) => (
//               <SelectItem key={doctor.name + i} value={doctor.name}>
//                 <div className="flex cursor-pointer items-center gap-2">
//                   <Image
//                     src={doctor.image}
//                     width={32}
//                     height={32}
//                     alt="doctor"
//                     className="rounded-full border border-dark-500"
//                   />
//                   <p>{doctor.name}</p>
//                 </div>
//               </SelectItem>
//             ))} */}
//               </CustomFormField>
//             </div>
//           </div>
//         </div>
//         {state.error && (
//           <span className="text-red-500">Something went wrong!</span>
//         )}
//         <button className="bg-[#4D44B5] text-white p-2 rounded-md w-full text-center font-semibold">
//           {type === "create" ? "Create" : "Update"}
//         </button>
//       </form>
//     </Form>
//   );
// };

// export default NewTeacherForm;

"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Form, FormControl } from "../ui/form";
import CustomFormField from "../ui/CustomFormField";
import { createTeacher, updateTeacher } from "@/lib/actions";
import { teacherSchema, TeacherSchema } from "@/lib/formValidationSchema";
import { CldUploadWidget } from "next-cloudinary";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import { GenderOptions } from "@/lib/types";
import { SelectItem } from "../ui/select";
import { toast } from "react-toastify";
import { useFormState } from "react-dom";

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

  const [img, setImg] = useState<any>(data?.img || null);
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

  const renderField = (
    fieldType: FormFieldType,
    name: keyof TeacherSchema,
    label: string,
    placeholder?: string,
    iconSrc?: string
  ) => (
    <CustomFormField
      control={form.control}
      fieldType={fieldType}
      name={name}
      label={label}
      placeholder={placeholder}
      iconSrc={iconSrc}
    />
  );

  // const { subjects } = relatedData;
  console.log("relatedData in TeacherForm:", relatedData);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Authentication Information */}
        <div className="rounded-2xl bg-white">
          <section className="mb-4 p-4 w-full bg-[#4D44B5] rounded-t-2xl">
            <h1 className="text-xl font-semibold text-white">
              Authentication Information
            </h1>
          </section>
          <div className="space-x-5 p-4 grid grid-cols-3 justify-between items-center">
            {renderField(
              FormFieldType.INPUT,
              "name",
              "Full name",
              "John Doe",
              "/icons/user.svg"
            )}
            {renderField(
              FormFieldType.INPUT,
              "email",
              "Email",
              "Johndoe@gmail.com",
              "/icons/email.svg"
            )}
            {renderField(
              FormFieldType.PASSWORD,
              "password",
              "Password",
              "password",
              "/icons/Password.svg"
            )}
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
              {renderField(
                FormFieldType.INPUT,
                "name",
                "First name",
                "John Doe",
                "/icons/user.svg"
              )}
              {renderField(
                FormFieldType.INPUT,
                "surname",
                "Last name",
                "Doe",
                "/icons/user.svg"
              )}
            </div>
            <div className="gap-y-8 gap-x-5 grid grid-cols-2 justify-between items-center">
              {renderField(
                FormFieldType.INPUT,
                "email",
                "Email",
                "Johndoe@gmail.com",
                "/icons/email.svg"
              )}
              {renderField(
                FormFieldType.PHONE_INPUT,
                "phone",
                "Phone number",
                "(234) 809-5678-354",
                "/assets/icons/email.svg"
              )}
            </div>
            <div className="gap-y-8 gap-x-5 grid grid-cols-2 justify-between items-center">
              {renderField(
                FormFieldType.INPUT,
                "address",
                "Address",
                "123 Main St.",
                "/icons/Location.svg"
              )}
              <CldUploadWidget
                uploadPreset="school"
                onSuccess={(result) => setImg(result.info)}
              >
                {({ open }) => (
                  <div>
                    {img ? (
                      <Image
                        src={img?.secure_url}
                        alt="Uploaded Image"
                        width={200}
                        height={200}
                      />
                    ) : (
                      <div className="cursor-pointer flex items-center gap-2 text-xs text-gray-500">
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
                )}
              </CldUploadWidget>
            </div>
            <div className="gap-y-8 gap-x-5 grid grid-cols-2 justify-between items-center">
              {renderField(
                FormFieldType.DATE_PICKER,
                "birthday",
                "Date of Birth"
              )}
              <CustomFormField
                control={form.control}
                fieldType={FormFieldType.SKELETON}
                name="sex"
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
            <div className="gap-y-8 gap-x-5 grid grid-cols-2 justify-between items-center">
              <CustomFormField
                fieldType={FormFieldType.SELECT}
                control={form.control}
                name="subjects"
                label="Teacher Subjects"
                placeholder="Select subjects"
              >
                {relatedData?.subjects.map((subject: string) => (
                  <SelectItem key={subject} value={subject}>
                    {subject}
                  </SelectItem>
                ))}
              </CustomFormField>
            </div>
          </div>
        </div>
        <button className="bg-[#4D44B5] text-white p-2 rounded-md w-full text-center font-semibold">
          {type === "create" ? "Create" : "Update"}
        </button>
      </form>
    </Form>
  );
};

export default TeacherForm;
