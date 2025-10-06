import Header from "components/Header";
import { Outlet } from "react-router-dom";
import { useEffect } from "react";
import tailwindConfig from "../../../tailwind.config.mjs";
import { DatesProvider } from "context/DatesContext";
import { UsersProvider } from "context/UsersContext";
import { RolesProvider } from "context/RoleContext";

function MainLayout() {

  const colors = tailwindConfig?.theme?.extend?.colors;
  const grayLight = colors?.["gray-light"] ?? "#f7f7f7";

  useEffect(() => {
    document.title = "Volunteer Hub";
    document.body.style.backgroundColor = grayLight;
  }, [grayLight]);

 
  return (
    <UsersProvider>
      <DatesProvider>
        <RolesProvider>
          <Header />
          <div className="mt-4">
            <Outlet />
          </div>
        </RolesProvider>
      </DatesProvider>
    </UsersProvider>
  );
}

export default MainLayout;
