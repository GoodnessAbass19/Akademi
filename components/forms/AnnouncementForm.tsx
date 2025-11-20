"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useFormState } from "react-dom";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Form } from "../ui/form";
import InputField from "../ui/InputField";
import { createAnnouncement, updateAnnouncement } from "@/lib/actions";
import {
  announcementSchema,
  AnnouncementSchema,
} from "@/lib/formValidationSchema";
import { Textarea } from "../ui/textarea";

const AnnouncementForm = ({
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
  const form = useForm<AnnouncementSchema>({
    resolver: zodResolver(announcementSchema),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = form;

  const [state, formAction] = useFormState(
    type === "create" ? createAnnouncement : updateAnnouncement,
    {
      success: false,
      error: false,
      message: "",
    }
  );

  const onSubmit = handleSubmit((data) => {
    console.log(data);
    formAction({ ...data });
  });

  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      toast(
        `Announcement has been ${type === "create" ? "created" : "updated"}!`
      );
      setOpen(false);
      router.refresh();
    }
  }, [state, router, type, setOpen]);

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-8">
        <div className="lg:p-4 p-2 gap-y-8 gap-x-5 grid md:grid-cols-2 justify-between items-center md:items-start w-full">
          <InputField
            label="Title"
            name="title"
            defaultValue={data?.title}
            register={register}
            error={errors?.title}
            placeholder="Announcement Title"
          />

          <div className="flex flex-col gap-2 w-full md:w-full">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Class (optional)
            </label>
            <select
              className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
              {...register("classId")}
              defaultValue={data?.classId}
            >
              {relatedData.class.map((lesson: { id: string; name: string }) => (
                <option value={lesson.id} key={lesson.id}>
                  {lesson.name}
                </option>
              ))}
            </select>
            {errors.classId?.message && (
              <p className="text-xs text-red-400">
                {errors.classId.message.toString()}
              </p>
            )}
          </div>

          <InputField
            name="date"
            label="Date"
            defaultValue={data?.date.toISOString().split("T")[0]}
            register={register}
            error={errors?.date}
            type="date"
          />

          <div className="flex flex-col gap-2 w-full md:col-span-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Description
            </label>
            <Textarea
              placeholder="Type your message here."
              {...register("description")}
            />
            {errors.description?.message && (
              <p className="text-xs text-red-400">
                {errors.description.message.toString()}
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
        {state.error && (
          <span className="text-red-500">Something went wrong!</span>
        )}
        <button
          type="submit"
          className="bg-[#4D44B5] text-white p-2 rounded-md w-full text-center font-semibold"
        >
          {type === "create" ? "Create" : "Update"}
        </button>
      </form>
    </Form>
  );
};

export default AnnouncementForm;
