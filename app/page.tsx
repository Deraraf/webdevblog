import { redirect } from "next/navigation";

const Home = () => {
  return redirect("/blog/feed/1");
};

export default Home;
