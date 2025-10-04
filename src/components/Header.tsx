import { ArrowRightOnRectangleIcon, UserGroupIcon } from "@heroicons/react/24/solid";
import { NavLink } from "react-router-dom";
import NavBar from "components/NavBar";

function Header() {
  return (
    <div className="sticky top-0 left-0 w-full bg-gray-light z-50 border-b border-blue-accent">
      <div className="w-full flex items-stretch justify-between">
          <div className="flex items-center justify-center flex-1 bg-blue-primary text-white px-4 py-3 font-semibold">
              <UserGroupIcon className="w-6 h-6" />
              <span className="ml-2">Volunteer Hub</span>
          </div>
          <NavLink
              key={"header"}
              to={"/"}
              className="flex items-center bg-blue-700 text-white px-4 hover:bg-blue-dark"
          >
              <ArrowRightOnRectangleIcon className="w-5 h-5" />
          </NavLink>
      </div>
      <div className="py-1">
        <NavBar />
      </div>
    </div>
  );
}

export default Header;
