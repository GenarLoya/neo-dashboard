import { Card } from "~/components/ui/card";
import { PageTitle } from "./PageTitle";

export function Nav() {
  return (
    <nav className="max-w-7xl mx-auto xl:py-2 duration-300">
      <Card className="flex flex-row justify-between items-center rounded-none xl:rounded-full px-8 py-4 duration-300 bg-card">
        <PageTitle></PageTitle>
        {/*<ThemeSwitch />*/}
      </Card>
    </nav>
  );
}
