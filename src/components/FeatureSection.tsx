
import { Check, Calendar, Settings, List, Clock, User } from "lucide-react";

const features = [
  {
    icon: <Calendar className="h-8 w-8 text-lifeblue" />,
    title: "Life Countdown Grid",
    description: "Visualize your entire life in weeks with an intuitive grid that shows time passed and time remaining."
  },
  {
    icon: <Clock className="h-8 w-8 text-lifeblue" />,
    title: "Progress Tracking",
    description: "Dynamic progress bars show your life completion percentage, creating urgency and motivation."
  },
  {
    icon: <List className="h-8 w-8 text-lifeblue" />,
    title: "Goal Alignment & Tasks",
    description: "Manage daily, weekly and long-term goals. Check off tasks and connect them to your larger vision."
  },
  {
    icon: <Check className="h-8 w-8 text-lifeblue" />,
    title: "Daily & Weekly Reminders",
    description: "Automated reminders help you review progress and plan upcoming tasks to stay on track."
  },
  {
    icon: <Settings className="h-8 w-8 text-lifeblue" />,
    title: "Comprehensive Dashboard",
    description: "Track your to-do lists, habits, goals and see insightful analytics about your progress."
  },
  {
    icon: <User className="h-8 w-8 text-lifeblue" />,
    title: "Personalized Experience",
    description: "Enter your birthdate, name, and goals for a completely customized life tracking experience."
  }
];

const FeatureSection = () => {
  return (
    <section id="features" className="py-20 px-6 bg-lifegray-100">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Features That Keep You Focused
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            LifeTracker combines visual time awareness with productivity tools to help you stay in "emergency mode" and take action.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-white p-6 rounded-xl shadow-sm border border-lifegray-200 hover:shadow-md transition-shadow"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;
