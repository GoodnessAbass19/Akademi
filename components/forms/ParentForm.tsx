"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { parentSchema, ParentSchema } from "@/lib/formValidationSchema";
import { useFormState } from "react-dom";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Form } from "../ui/form";
import InputField from "../ui/InputField";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createParent, updateParent } from "@/lib/actions";

const ParentForm = ({
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
  const form = useForm<ParentSchema>({
    resolver: zodResolver(parentSchema),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  const [state, formAction] = useFormState(
    type === "create" ? createParent : updateParent,
    {
      success: false,
      error: false,
    }
  );

  const onSubmit = handleSubmit((data) => {
    formAction({ ...data });
  });

  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      toast(`Parent has been ${type === "create" ? "created" : "updated"}!`);
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
          <div className="gap-5 w-full lg:p-4 p-2 grid md:grid-cols-3 md:justify-between items-center md:items-start">
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
          <div className="lg:p-4 p-2 gap-y-8 gap-x-5 grid md:grid-cols-2 justify-between items-center md:items-start w-full">
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

export default ParentForm;
