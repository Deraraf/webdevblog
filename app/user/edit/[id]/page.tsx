import { auth } from "@/auth";
import Alert from "@/components/common/Alert";
import { db } from "@/lib/db";
import UserEditForm from "@/components/user/EditUserForm";

const EditUser = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  const user = await db.user.findUnique({
    where: {
      id,
    },
  });

  if (!user) return <Alert error message="No user found" />;

  const session = await auth();

  if (session?.user?.id !== user.id)
    return <Alert error message="unauthorized" />;

  const account = await db.account.findFirst({
    where: {
      userId: user.id,
    },
  });

  const isOAuth =
    account?.provider === "google" || account?.provider === "github";

  const isCredential = !isOAuth;

  return <UserEditForm user={user} isCredential={isCredential} />;
};

export default EditUser;
