import { Outlet } from "react-router";
import { StarfieldBackground } from "~/components/ui/starfield";
import { Nav } from "./components/Nav";

export default function RootLayout() {
  return (
    <StarfieldBackground>
      <div className="z-9 h-screen w-screen overflow-y-auto">
        <Nav></Nav>
        <main className="px-4 py-2">
          <Outlet />
        </main>
      </div>
    </StarfieldBackground>
  );
}
