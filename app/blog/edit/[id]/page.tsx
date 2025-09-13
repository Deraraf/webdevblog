import { getBlogById } from "@/action/blogs/getBlogById";
import CreateBlogForm from "@/components/blog/CreateBlogForm";
import Alert from "@/components/common/Alert";
import Container from "@/components/layout/Container";

const EditBlog = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  const res = await getBlogById({ blogId: id });

  if (!res.success)
    return <Alert error message={res.error || "Error fetching blog"} />;

  const { blog } = res.success;

  if (!blog) return <Alert error message="No blog found" />;

  return (
    <Container>
      <CreateBlogForm blog={blog} />
    </Container>
  );
};

export default EditBlog;
