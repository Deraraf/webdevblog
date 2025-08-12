"use client";

import {
  PasswordEmailSchema,
  PasswordEmailSchemaType,
} from "@/schemas/PasswordEmailSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import Heading from "../common/Heading";
import FormField from "../common/FormField";
import Alert from "../common/Alert";
import Button from "../common/Button";
import { passwordEmail } from "@/action/auth/password-email";
import toast from "react-hot-toast";

const PasswordEmailForm = () => {
  const [isPending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PasswordEmailSchemaType>({
    resolver: zodResolver(PasswordEmailSchema),
  });

  const showToast = (type: "error" | "success", message: string) => {
    toast.custom(
      () => (
        <Alert
          error={type === "error"}
          success={type === "success"}
          message={message}
          className="animate-slide-in-right"
        />
      ),
      { duration: 2000 }
    );
  };

  const onSubmit: SubmitHandler<PasswordEmailSchemaType> = async (data) => {
    startTransition(async () => {
      const res = await passwordEmail(data);
      if (res?.error) {
        showToast("error", res.error);
      } else {
        showToast("success", res.success ?? "Success!");
      }
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col max-w-[500px] m-auto"
    >
      <Heading title="Login to WEBDEV.blog" lg center />
      <FormField
        id="email"
        label="Email"
        type="email"
        register={register}
        inputClassName="w-full"
        placeholder="Enter your email"
        errors={errors}
        disabled={isPending}
      />
      <Button
        label={isPending ? "Loading..." : "Send Reset Email"}
        disabled={isPending}
      />
    </form>
  );
};

export default PasswordEmailForm;
