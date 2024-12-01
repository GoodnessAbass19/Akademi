"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../ui/InputField";
import { resultSchema, ResultSchema } from "@/lib/formValidationSchema";
import { createResult, updateResult } from "@/lib/actions";
import { useFormState } from "react-dom";
import { Dispatch, SetStateAction, useEffect } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const ResultForm = ({
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
  } = useForm<ResultSchema>({
    resolver: zodResolver(resultSchema),
  });

  // AFTER REACT 19 IT'LL BE USEACTIONSTATE

  const [state, formAction] = useFormState(
    type === "create" ? createResult : updateResult,
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
      toast(`Exam has been ${type === "create" ? "created" : "updated"}!`);
      setOpen(false);
      router.refresh();
    }
  }, [state, router, type, setOpen]);

  const { results } = relatedData;

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <section className="mb-4 p-4 w-full bg-blue-400 rounded-t-2xl">
        <h1 className="text-xl font-semibold text-white">
          {type === "create" ? "Add student result" : "Update student result"}
        </h1>
      </section>

      <div className="gap-y-8 gap-x-5 grid md:grid-cols-2 justify-between items-center md:items-start">
        <InputField
          label="Student ID"
          name="studentId"
          defaultValue={data?.studentId}
          register={register}
          error={errors?.studentId}
          placeholder="Student ID"
        />

        <div className="flex flex-col gap-2 w-full">
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Subject
          </label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("examId")}
            defaultValue={data?.teachers}
          >
            {results.map(
              (result: { id: number; subject: { name: string } }) => (
                <option value={result.id} key={result.id}>
                  {result.subject.name}
                </option>
              )
            )}
          </select>
          {errors.examId?.message && (
            <p className="text-xs text-red-400">
              {errors.examId.message.toString()}
            </p>
          )}
        </div>
        <InputField
          label="First Term Total"
          name="firstTermScore"
          defaultValue={data?.firstTermscore}
          register={register}
          error={errors?.firstTermscore}
          placeholder="Student score"
          iconAlt="score"
          iconSrc="/icons/result.png"
        />
        <InputField
          label="Second Term Total"
          name="secondTermScore"
          defaultValue={data?.secondTermscore}
          register={register}
          error={errors?.secondTermscore}
          placeholder="Student score"
          iconAlt="score"
          iconSrc="/icons/result.png"
        />
        <InputField
          label="Third Term Total"
          name="thirdTermScore"
          defaultValue={data?.ThirdTermscore}
          register={register}
          error={errors?.ThirdTermscore}
          placeholder="Student score"
          iconAlt="score"
          iconSrc="/icons/result.png"
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
      {state.error && (
        <span className="text-red-500">Something went wrong!</span>
      )}
      <button className="bg-blue-400 text-white p-2 rounded-md">
        {type === "create" ? "Create" : "Update"}
      </button>
    </form>
  );
};

export default ResultForm;
