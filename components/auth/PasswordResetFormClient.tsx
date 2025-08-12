"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import Heading from "../common/Heading";
import FormField from "../common/FormField";
import Alert from "../common/Alert";
import Button from "../common/Button";
import { useRouter, useSearchParams } from "next/navigation";
import {
  PasswordResetSchema,
  PasswordResetSchemaType,
} from "@/schemas/PasswordResetSchema";
import { passwordReset } from "@/action/auth/password-reset";
import toast from "react-hot-toast";

const PasswordResetFormClient = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const [isPending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PasswordResetSchemaType>({
    resolver: zodResolver(PasswordResetSchema),
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
      { duration: 4000 }
    );
  };

  const onSubmit: SubmitHandler<PasswordResetSchemaType> = async (data) => {
    startTransition(async () => {
      const res = await passwordReset(data, token);
      if (res?.error) {
        showToast("error", res.error);
      } else if (res?.success) {
        showToast("success", res.success);
        router.push("/login");
      }
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col max-w-[500px] m-auto"
    >
      <Heading title="Enter your New WEBDEV.blog password" lg center />
      <FormField
        id="password"
        label="Password"
        type="password"
        register={register}
        inputClassName="w-full"
        placeholder="Enter your password"
        errors={errors}
        disabled={isPending}
      />
      <FormField
        id="confirmPassword"
        label="confirm Password"
        type="confirmPassword"
        register={register}
        inputClassName="w-full"
        placeholder="Enter your confirm Password"
        errors={errors}
        disabled={isPending}
      />
      <Button
        label={isPending ? "Loading..." : "Save new password"}
        disabled={isPending}
      />
    </form>
  );
};

export default PasswordResetFormClient;
