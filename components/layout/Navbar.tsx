import { MdNoteAlt } from "react-icons/md";
import ThemeToggle from "../ThemeToggle";
import Container from "./Container";

const Navbar = () => {
  return (
    <nav className="sticky top-0 border-b z-50 bg-white  dark:bg-gray-950 dark:text-white">
      <Container>
        <div className="flex items-center justify-between gap-8">
          <div className="flex items-center gap-1 cursor-pointer ">
            <MdNoteAlt size={24} />
            <div>WEBDEV.blog</div>
          </div>
          <div>search</div>
          <div className="flex gap-5 sm:gap-8 items-center">
            <ThemeToggle />
            <div>Notification</div>
            <div>UserManu</div>
          </div>
        </div>
      </Container>
    </nav>
  );
};

export default Navbar;
