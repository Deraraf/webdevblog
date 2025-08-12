"use client";

import { verifyEmail } from "@/action/auth/email-verification";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Heading from "../common/Heading";
import Alert from "../common/Alert";
import Button from "../common/Button";
import toast from "react-hot-toast";

const EmailVerificationClient = () => {
  const router = useRouter();
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [Pending, setPending] = useState<boolean>(true);
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

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

  useEffect(() => {
    setPending(true);
    const verify = async () => {
      if (!token) return setError("missing verification token");
      const res = await verifyEmail(token);
      if (res.error) {
        showToast("error", res.error);
        setError(res.error);
      }
      if (res.success) {
        showToast("success", res.success);
        setSuccess(res.success);
      }
    };
    verify();
  }, [token]);
  return (
    <div className="flex flex-col items-center justify-center border-2 rounded-md p-2 gap-2 my-8 max-w-[400px] mx-auto">
      <Heading title="WEBDEV.blog" center />
      {Pending && <div>Verifying Email ...</div>}
      {!Pending && !success && !error && (
        <div>Verification failed. Please try again.</div>
      )}
      {success && (
        <Button
          type="submit"
          label="login"
          onClick={() => router.push("/login")}
        />
      )}
    </div>
  );
};

export default EmailVerificationClient;
