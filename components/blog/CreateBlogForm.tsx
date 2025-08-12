"use client";

import { BlogFormType, BlogSchema } from "@/schemas/BlogShema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import FormField from "../common/FormField";

const CreateBlogForm = () => {
  const session = useSession();
  const userId = session.data?.user?.id;
  const {
    handleSubmit,
    register,
    formState: { errors },
    setValue,
  } = useForm<BlogFormType>({
    resolver: zodResolver(BlogSchema),
    defaultValues: {
      userId,
      isPublished: false,
    },
  });
  return (
    <div className="flex flex-col justify-between max-w-[1200px] m-auto min-h-[85vh]">
      <FormField
        id="title"
        register={register}
        placeholder="blog title"
        errors={errors}
        inputClassName="border-none text-5xl font-bold bg-transparent px-0"
      />
    </div>
  );
};

export default CreateBlogForm;
