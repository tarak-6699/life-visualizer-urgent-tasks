
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeatureSection from "@/components/FeatureSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <HeroSection />
        <FeatureSection />
        
        {/* How It Works Section */}
        <section id="how-it-works" className="py-20 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                How It Works
              </h2>
              <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                LifeTracker is designed to be simple yet powerful. Get started in just a few easy steps.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center p-6">
                <div className="bg-lifeblue h-12 w-12 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto">
                  1
                </div>
                <h3 className="mt-6 text-xl font-semibold text-gray-800">Sign Up & Set Up Profile</h3>
                <p className="mt-2 text-gray-600">
                  Enter your birthdate, name, and goals to personalize your LifeTracker experience.
                </p>
              </div>
              
              <div className="text-center p-6">
                <div className="bg-lifeblue h-12 w-12 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto">
                  2
                </div>
                <h3 className="mt-6 text-xl font-semibold text-gray-800">Visualize Your Timeline</h3>
                <p className="mt-2 text-gray-600">
                  See your life in weeks with a visual grid showing time passed and time remaining.
                </p>
              </div>
              
              <div className="text-center p-6">
                <div className="bg-lifeblue h-12 w-12 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto">
                  3
                </div>
                <h3 className="mt-6 text-xl font-semibold text-gray-800">Track Goals & Tasks</h3>
                <p className="mt-2 text-gray-600">
                  Set up your to-do lists, habits, and goals to align with your long-term vision.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
