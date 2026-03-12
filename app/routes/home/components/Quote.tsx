import { Card } from "~/components/ui/card";

export function Quote() {
  return (
    <Card className="h-max w-75 mx-auto bg-card px-8">
      <blockquote className="text-lg leading-relaxed">
        <p className="text-muted-foreground">
          "The universe is a pretty big place. If it's just us, seems like an
          awful waste of space"
        </p>
        <footer className="mt-2 text-sm font-medium">— Carl Sagan</footer>
      </blockquote>
    </Card>
  );
}
