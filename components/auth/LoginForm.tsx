"use client";

import { LoginSchema, LoginSchemaType } from "@/schemas/LoginSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import FormField from "../common/FormField";
import Button from "../common/Button";
import Heading from "../common/Heading";
import SocialAuth from "./SocialAuth";
import { login } from "@/action/auth/login";
import { useState, useTransition, useEffect } from "react";
import Alert from "../common/Alert";
import { useRouter, useSearchParams } from "next/navigation";
import { LOGIN_REDIRECT } from "@/lib/routes";
import { useSession } from "next-auth/react";
import Link from "next/link";
import toast from "react-hot-toast";

const LoginForm = () => {
  const [error, setError] = useState<string | undefined>();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const { update } = useSession();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchemaType>({ resolver: zodResolver(LoginSchema) });

  // Show OAuth errors from URL query params
  useEffect(() => {
    const oauthError = searchParams.get("error");
    if (oauthError === "OAuthAccountNotLinked") {
      setError(
        "Email already linked to a different provider. Please use that provider or a different email."
      );
    } else if (oauthError) {
      setError(`OAuth Error: ${oauthError}`);
    }
  }, [searchParams]);

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

  const onSubmit: SubmitHandler<LoginSchemaType> = async (data) => {
    startTransition(async () => {
      const res = await login(data);
      if (res?.error) {
        setError(res.error);
        showToast("error", res.error);
        router.replace("/login");
      } else {
        update();
        showToast("success", res.success ?? "success");
        router.push(LOGIN_REDIRECT);
      }
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col max-w-[500px] m-auto"
    >
      <Heading title="Login to WEBDEV.blog" lg center />

      {error && <Alert message={error} error />}

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

      <Button label={isPending ? "Loading..." : "Login"} disabled={isPending} />

      <div className="flex justify-center">Or</div>
      <SocialAuth />

      <div className="flex justify-end items-end">
        <Link
          href="/password-email-form"
          className="mt-2 text-sm underline text-slate-700 dark:text-slate-300"
        >
          forgot password?
        </Link>
      </div>
    </form>
  );
};

export default LoginForm;
