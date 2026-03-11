import { Rocket } from "lucide-react";
import { Separator } from "~/components/ui/separator";

export function PageTitle() {
  return (
    <header className="flex w-max gap-4 items-center justify-center">
      <span>
        <Rocket className="w-8 h-8 text-primary"></Rocket>
      </span>
      <Separator orientation="vertical" />
      <h1 className="xl:text-3xl font-bold text-foreground duration-300">
        Rocks in the space
      </h1>
    </header>
  );
}
