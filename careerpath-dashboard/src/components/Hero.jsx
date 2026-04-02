import React from 'react';
import { ArrowRight } from 'lucide-react';

const Hero = ({ onStartAssessment }) => {
  return (
    <section className="flex flex-col items-center justify-center text-center px-4 py-24 min-h-[500px]">
      <div className="inline-flex items-center justify-center px-3 py-1 mb-8 text-xs font-medium rounded-full bg-primary/10 text-primary border border-primary/20">
        Trusted by 10,000+ Students
      </div>
      
      <h1 className="text-4xl md:text-6xl font-bold max-w-4xl tracking-tight mb-6 mt-4">
        Your Future Starts with the <span className="text-primary">Right Choice</span>
      </h1>
      
      <p className="text-textMuted max-w-2xl text-base md:text-lg mb-10 leading-relaxed">
        Navigate your post-12th journey with confidence. Get personalized guidance on subject combinations, college selection, career outcomes, and access to scholarships and resources.
      </p>
      
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <button 
          onClick={onStartAssessment}
          className="flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white font-medium px-6 py-3 rounded-lg w-full sm:w-auto transition-colors"
        >
          <span>Start Your Journey</span>
          <ArrowRight className="w-4 h-4" />
        </button>
        <button className="flex items-center justify-center px-6 py-3 rounded-lg border border-white/10 hover:bg-white/5 transition-colors text-white font-medium w-full sm:w-auto bg-secondary">
          Take Career Quiz
        </button>
      </div>
    </section>
  );
};

export default Hero;
