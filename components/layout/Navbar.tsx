import { MdNoteAlt } from "react-icons/md";

import Container from "./Container";
import ThemeToggle from "./ThemeToggle";
import SearchInput from "./SearchInput";
import Notifications from "./Notifications";
import UserInput from "./UserInput";

const Navbar = () => {
  return (
    <nav className="sticky top-0 border-b z-50 bg-white  dark:bg-gray-950 dark:text-white">
      <Container>
        <div className="flex items-center justify-between gap-8">
          <div className="flex items-center gap-1 cursor-pointer ">
            <MdNoteAlt size={24} />
            <div>WEBDEV.blog</div>
          </div>
          <SearchInput />
          <div className="flex gap-5 sm:gap-8 items-center">
            <ThemeToggle />
            <Notifications />
            <UserInput />
          </div>
        </div>
      </Container>
    </nav>
  );
};

export default Navbar;
