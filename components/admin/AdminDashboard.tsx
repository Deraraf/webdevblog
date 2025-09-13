import { getCount } from "@/action/admin/getCount";
import Heading from "../common/Heading";
import Alert from "../common/Alert";

const AdminDashboard = async () => {
  const { success, error } = await getCount();

  if (error) return <Alert error message={error} />;

  const users = success?.users ? success.users : 0;
  const blogs = success?.blogs ? success.blogs : 0;
  return (
    <div>
      <Heading title="analytics" center lg />
      <div className="flex items-center justify-center mt-12 gap-12">
        <div className="flex flex-col items-center gap-2 border rounded-sm px-12 py-8 text-4xl">
          <span>{users}</span>
          <span>Users</span>
        </div>
        <div className="flex flex-col items-center gap-2 border rounded-sm px-12 py-8 text-4xl">
          <span>{blogs}</span>
          <span>Blogs</span>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
