import { BarChart3, Search } from "lucide-react";
import { NavLink } from "react-router";
import { Button } from "~/components/ui/button";

// temp
export function ActionButtons() {
  return (
    <div className="flex flex-wrap gap-4 mx-auto">
      <Button asChild variant="outline" size="lg">
        <NavLink to="/graphs">
          <BarChart3 className="mr-2 h-5 w-5" />
          Rocks Stats
        </NavLink>
      </Button>
      <Button asChild variant="outline" size="lg">
        <NavLink to="/browse">
          <Search className="mr-2 h-5 w-5" />
          Browse rocks
        </NavLink>
      </Button>
    </div>
  );
}
