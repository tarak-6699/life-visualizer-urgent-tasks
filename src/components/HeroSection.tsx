
import { Button } from "@/components/ui/button";
import WeekGrid from "./WeekGrid";

const HeroSection = () => {
  return (
    <section className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div className="order-2 md:order-1">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-gray-900">
            Visualize Your Life in 
            <span className="text-lifeblue"> Weeks</span>
          </h1>
          <p className="mt-6 text-lg text-gray-600">
            See your life's timeline, track goals, and stay focused on what matters.
            LifeTracker helps you make the most of your limited time.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <Button className="bg-lifeblue hover:bg-lifeblue-dark text-white text-lg px-8 py-6">
              Get Started
            </Button>
            <Button 
              variant="outline" 
              className="border-lifeblue text-lifeblue hover:bg-lifeblue/5 text-lg px-8 py-6"
            >
              Learn More
            </Button>
          </div>
        </div>
        <div className="order-1 md:order-2 animate-fade-in">
          <div className="bg-white rounded-xl shadow-xl p-6 border border-lifegray-200">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Your Life in Weeks</h3>
            <WeekGrid animated={true} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
