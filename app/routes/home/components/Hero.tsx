import { ActionButtons } from "./ActionButtons";
import AsteroidScene from "./Asteroid";
import { Quote } from "./Quote";

export function Hero() {
  return (
    <div className="flex flex-col gap-8 max-w-3xl mx-auto">
      {/*<Header></Header>*/}
      <div className="flex sm:flex-row flex-col-reverse gap-4 justify-center items-center">
        <Quote></Quote>
        <AsteroidScene></AsteroidScene>
      </div>
      <ActionButtons></ActionButtons>
    </div>
  );
}
