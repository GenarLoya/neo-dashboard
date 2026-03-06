import { Rocket } from "lucide-react";
import { Outlet } from "react-router";

export default function RootLayout() {
  return (
    <div className="h-screen w-screen overflow-y-auto bg-gray-100">
      <header className="flex sticky border-t border-t-blue-200 shadow top-0 w-full h-20 bg-background items-center px-10 py-5">
        <div className="flex w-max  gap-3">
          <span>
            <Rocket className="w-8 h-7"></Rocket>
          </span>
          <span>Rocks in the space</span>
        </div>
      </header>
      <Outlet />
    </div>
  );
}
