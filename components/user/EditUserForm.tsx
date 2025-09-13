"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import Heading from "../common/Heading";
import FormField from "../common/FormField";
import Alert from "../common/Alert";
import Button from "../common/Button";
import toast from "react-hot-toast";
import { User } from "@prisma/client";
import {
  EditProfileFormType,
  EditProfileSchema,
} from "../../schemas/EditProfileSchema";
import { editUser } from "../../action/user/edit-user";
import { tags } from "@/lib/tags";
import { DeletUser } from "@/action/user/delete-user";

import { signOut } from "next-auth/react";

const UserEditForm = ({
  user,
  isCredential,
}: {
  user: User;
  isCredential: boolean;
}) => {
  const [isPending, startTransition] = useTransition();
  const [isDeleting, startDeleting] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EditProfileFormType>({
    resolver: zodResolver(EditProfileSchema),
    defaultValues: {
      name: user.name || undefined,
      email: user.email || undefined,
      bio: user.bio || undefined,
      tags: user.tags || [],
    },
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

  const onSubmit: SubmitHandler<EditProfileFormType> = async (data) => {
    startTransition(async () => {
      const res = await editUser(data, user.id);
      if (res?.error) {
        showToast("error", res.error);
      } else {
        showToast("success", res.success ?? "Success!");
      }
    });
  };

  const HandleDelete = async () => {
    startDeleting(async () => {
      const res = await DeletUser(user.id);
      if (res?.error) {
        showToast("error", res.error);
      } else {
        showToast("success", res.success ?? "Success!");
        setTimeout(() => {
          signOut();
        }, 5000);
      }
    });
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col max-w-[500px] m-auto"
      >
        <Heading title="Edit Profile" lg />
        <FormField
          id="name"
          label="name"
          type="name"
          register={register}
          inputClassName="w-full"
          placeholder="Enter your name"
          errors={errors}
          disabled={isPending}
        />
        {isCredential && (
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
        )}
        <FormField
          id="bio"
          label="Bio"
          register={register}
          inputClassName="w-full"
          placeholder="Enter your "
          errors={errors}
          disabled={isPending}
        />
        <fieldset className="flex flex-col gap-2">
          <legend className="mb-2 pr-2">Select Tags</legend>
          <div className="flex flex-wrap gap-4 w-full">
            {tags.map((tag) => {
              if (tag === "All") return null;
              return (
                <label key={tag}>
                  <input
                    type="checkbox"
                    value={tag}
                    {...register("tags")}
                    className="cursor-pointer"
                  />
                  <span className="ml-2">{tag}</span>
                </label>
              );
            })}
          </div>
        </fieldset>

        <Button
          label={isPending ? "Saving..." : "Save Changes"}
          disabled={isPending}
        />
      </form>
      <div className="max-w-[500px] m-auto mt-12">
        <div className="text-rose-500">
          <Heading title="Danger Zone" lg />
        </div>
        <Button
          outlined
          type="button"
          className="mt-4"
          label={isDeleting ? "Deleting..." : "Delete Account"}
          onClick={HandleDelete}
          disabled={isDeleting}
        />
      </div>
    </>
  );
};

export default UserEditForm;
