"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../ui/InputField";
import { classSchema, ClassSchema } from "@/lib/formValidationSchema";
import { createClass, updateClass } from "@/lib/actions";
import { useFormState } from "react-dom";
import { Dispatch, SetStateAction, useEffect } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const ClassForm = ({
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
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ClassSchema>({
    resolver: zodResolver(classSchema),
  });

  // AFTER REACT 19 IT'LL BE USEACTIONSTATE

  const [state, formAction] = useFormState(
    type === "create" ? createClass : updateClass,
    {
      success: false,
      error: false,
    }
  );

  const onSubmit = handleSubmit((data) => {
    console.log(data);
    formAction(data);
  });

  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      toast(
        `Class has been ${
          type === "create" ? "created" : "updated"
        } successfully!`
      );
      setOpen(false);
      router.refresh();
    }
  }, [state, router, type, setOpen]);

  const { teachers, grades } = relatedData;

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <section className="mb-4 p-4 w-full bg-[#4D44B5] rounded-t-2xl">
        <h1 className="text-xl font-semibold text-white">
          {type === "create" ? "Create a new class" : "Update the class"}
        </h1>
      </section>

      <div className="space-y-8 lg:p-4 p-2">
        <div className="gap-y-8 gap-x-5 grid grid-cols-2 justify-between items-center">
          <InputField
            label="Class name"
            name="name"
            defaultValue={data?.name}
            register={register}
            error={errors?.name}
          />
          <InputField
            label="Capacity"
            name="capacity"
            defaultValue={data?.capacity}
            register={register}
            error={errors?.capacity}
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
        <div className="gap-y-8 gap-x-5 grid grid-cols-2 justify-between items-center">
          <div className="flex flex-col gap-2 w-full md:w-full">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Supervisor
            </label>
            <select
              className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
              {...register("supervisorId")}
              defaultValue={data?.teachers}
            >
              {teachers.map(
                (teacher: { id: string; name: string; surname: string }) => (
                  <option
                    value={teacher.id}
                    key={teacher.id}
                    selected={data && teacher.id === data.supervisorId}
                  >
                    {teacher.name + " " + teacher.surname}
                  </option>
                )
              )}
            </select>
            {errors.supervisorId?.message && (
              <p className="text-xs text-red-400">
                {errors.supervisorId.message.toString()}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-2 w-full md:w-full">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Grade
            </label>
            <select
              className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
              {...register("gradeId")}
              defaultValue={data?.gradeId}
            >
              {grades.map((grade: { id: number; level: number }) => (
                <option
                  value={grade.id}
                  key={grade.id}
                  selected={data && grade.id === data.gradeId}
                >
                  {grade.level}
                </option>
              ))}
            </select>
            {errors.gradeId?.message && (
              <p className="text-xs text-red-400">
                {errors.gradeId.message.toString()}
              </p>
            )}
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
  );
};

export default ClassForm;
