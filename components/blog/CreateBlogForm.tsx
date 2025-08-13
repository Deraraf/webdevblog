"use client";

import { BlogFormType, BlogSchema } from "@/schemas/BlogShema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import FormField from "../common/FormField";
import AddCover from "./AddCover";
import { useState } from "react";

const CreateBlogForm = () => {
  const session = useSession();
  const userId = session.data?.user?.id;
  const [uploadedCover, setUploadedCover] = useState<string>();
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
  console.log(uploadedCover);
  return (
    <form className="flex flex-col justify-between max-w-[1200px] m-auto min-h-[85vh]">
      <div>
        <AddCover setUploadedCover={setUploadedCover} />
        <FormField
          id="title"
          register={register}
          placeholder="blog title"
          errors={errors}
          inputClassName="border-none text-5xl font-bold bg-transparent px-0"
        />
      </div>
    </form>
  );
};

export default CreateBlogForm;
