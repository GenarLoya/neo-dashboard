import { Rocket } from "lucide-react";

export function Hero() {
  return (
    <div className="relative rounded-xl border bg-card p-8 shadow-sm">
      {/* Header with Rocket Icon */}
      <div className="mb-6 flex items-center gap-2">
        <Rocket className="h-6 w-6" />
        <h1 className="text-2xl font-semibold">Rocks in the space</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-2 lg:items-center">
        {/* Left side: Carl Sagan Quote */}
        <div className="space-y-4">
          <blockquote className="text-lg leading-relaxed">
            <p className="text-muted-foreground">
              "The universe is a pretty big place. If it's just us, seems like
              an awful waste of space"
            </p>
            <footer className="mt-2 text-sm font-medium">— Carl Sagan</footer>
          </blockquote>

          {/* Sticky Note Response */}
          <div className="relative ml-12 max-w-xs rounded-lg border-2 border-primary/20 bg-yellow-50 p-4 shadow-md dark:bg-yellow-900/20">
            <div className="absolute -top-3 left-1/2 h-6 w-0.5 rotate-12 bg-red-500" />
            <p className="font-handwriting text-base text-foreground">
              "But we have rocks too many rocks"
            </p>
            <div className="absolute -bottom-2 right-4">
              <svg
                width="60"
                height="20"
                viewBox="0 0 60 20"
                className="text-red-500"
              >
                <path
                  d="M 5 15 Q 20 5, 30 10 T 55 15"
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="none"
                  strokeLinecap="round"
                />
                <path
                  d="M 50 10 L 55 15 L 52 18"
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className="mt-2 text-right text-xs text-muted-foreground">
              sticky note
            </div>
          </div>
        </div>

        {/* Right side: Asteroid Image */}
        <div className="flex justify-center lg:justify-end">
          <div className="relative h-64 w-64 lg:h-80 lg:w-80">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-900 via-slate-800 to-slate-950 shadow-2xl">
              {/* Asteroid texture simulation */}
              <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(217,119,6,0.3)_0%,transparent_50%)]" />
              <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_70%_60%,rgba(120,113,108,0.4)_0%,transparent_40%)]" />
              <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_50%_80%,rgba(234,179,8,0.2)_0%,transparent_30%)]" />

              {/* Craters */}
              <div className="absolute left-[20%] top-[30%] h-8 w-8 rounded-full bg-slate-950/40 shadow-inner" />
              <div className="absolute right-[25%] top-[45%] h-12 w-12 rounded-full bg-slate-950/50 shadow-inner" />
              <div className="absolute bottom-[30%] left-[40%] h-6 w-6 rounded-full bg-slate-950/30 shadow-inner" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
