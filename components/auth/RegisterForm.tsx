"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import FormField from "../common/FormField";
import Button from "../common/Button";
import Heading from "../common/Heading";
import SocialAuth from "./SocialAuth";
import { RegisterSchema, RegisterSchemaType } from "@/schemas/RegisterSchema";
import { signUp } from "@/action/auth/register";
import { useState, useTransition } from "react";
import Alert from "../common/Alert";

type ErrorType =
  | string
  | {
      errors: string[];
      properties?: {
        name?: { errors: string[] };
        email?: { errors: string[] };
        password?: { errors: string[] };
        confirmPassword?: { errors: string[] };
      };
    };

const RegisterForm = () => {
  const [isLoading, startTransition] = useTransition();
  const [error, setError] = useState<ErrorType | undefined>();
  const [success, setSuccess] = useState<string | undefined>("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterSchemaType>({ resolver: zodResolver(RegisterSchema) });

  const onSubmit: SubmitHandler<RegisterSchemaType> = async (data) => {
    setError("");
    setSuccess("");
    startTransition(async () => {
      const res = await signUp(data);
      console.log(res.error);
      if (res.error) {
        setError(res.error);
      }
      if (res.success) {
        setSuccess(res.success);
      }
    });
  };
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col max-w-[500px] m-auto"
    >
      <Heading title="Register to WEBDEV.blog" lg center />
      <FormField
        id="name"
        label="name"
        type="name"
        register={register}
        inputClassName="w-full"
        placeholder="Enter your name"
        errors={errors}
        disabled={isLoading}
      />
      <FormField
        id="email"
        label="Email"
        type="email"
        register={register}
        inputClassName="w-full"
        placeholder="Enter your email"
        errors={errors}
        disabled={isLoading}
      />
      <FormField
        id="password"
        label="Password"
        type="password"
        register={register}
        inputClassName="w-full"
        placeholder="Enter your password"
        errors={errors}
        disabled={isLoading}
      />
      <FormField
        id="confirmPassword"
        label="confirm Password"
        type="confirmPassword"
        register={register}
        inputClassName="w-full"
        placeholder="Enter your confirm Password"
        errors={errors}
        disabled={isLoading}
      />

      {error && (
        <Alert
          error
          message={typeof error === "string" ? error : error?.errors[0]}
        />
      )}
      {success && <Alert success message={success} />}

      <Button
        label={isLoading ? "Submitting..." : "Register"}
        disabled={isLoading}
      />
      <div className="flex justify-center">Or</div>
      <SocialAuth />
    </form>
  );
};

export default RegisterForm;
