import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { Bell } from "lucide-react";
const Notifications = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="relative">
        <div className="absolute bg-rose-500 h-6 w-6 flex text-sm items-center justify-center rounded-full left-2 bottom-2">
          <span className="">5</span>
        </div>
        <Bell size={24} />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[100%] max-w-[400px]">
        <div className="flex gap-4 justify-between p-2 mb-2">
          <h3 className="font-bold text-lg">Notifications</h3>
          <button>Mark all as read</button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Notifications;
