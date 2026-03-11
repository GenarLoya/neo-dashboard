import { Rocket } from "lucide-react";

export function Header() {
  return (
    <div className="mb-6 flex items-center gap-2">
      <span>
        <Rocket className="h-6 w-6" />
      </span>
      <h1 className="text-2xl font-semibold">Rocks in the space</h1>
    </div>
  );
}
