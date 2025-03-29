
import { Button } from "@/components/ui/button";
import WeekGrid from "./WeekGrid";

const CTASection = () => {
  return (
    <section className="py-20 px-6 bg-gradient-to-r from-lifeblue to-lifepurple text-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold leading-tight">
              Don't Let Another Week Pass Without Purpose
            </h2>
            <p className="mt-6 text-lg opacity-90">
              The average human lives for just 4,000 weeks. How many have you already used up? 
              Start tracking your life's progress and align your daily actions with your long-term vision.
            </p>
            <div className="mt-8">
              <Button className="bg-white text-lifeblue hover:bg-lifegray-100 text-lg px-8 py-6">
                Start Your Life Tracker
              </Button>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-xl p-4 md:p-6">
            <div className="bg-white/5 rounded-lg p-4 border border-white/20">
              <WeekGrid age={35} yearCount={80} animated={true} small={true} />
            </div>
            <div className="mt-6 text-center">
              <p className="text-lg font-semibold">This could be your life right now</p>
              <p className="mt-2 text-sm opacity-80">
                Each square represents one week of your life. Don't let them slip away unnoticed.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
