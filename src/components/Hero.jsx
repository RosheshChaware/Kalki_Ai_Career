import React from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

const Hero = ({ onStartJourney }) => {
  const features = [
    "Personalized AI career guidance",
    "Dynamic skill roadmap generation",
    "Smart learning recommendations"
  ];

  return (
    <section className="relative w-full px-6 pt-6 pb-8 md:pt-10 md:pb-14 min-h-[calc(100vh-60px)] flex items-center overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        
        {/* LEFT SECTION: Content */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="z-10"
        >
          <div className="inline-flex items-center px-3 py-1 mb-5 text-xs font-medium rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 backdrop-blur-sm">
            AI-Powered Learning Platform
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-5 leading-tight text-white/90">
            AI Learning Path <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400">
              Generator
            </span>
          </h1>

          <p className="text-white/60 max-w-xl text-lg md:text-xl mb-6 leading-relaxed font-light">
            Discover the best learning roadmap tailored to your goals using artificial intelligence.
          </p>

          <div className="space-y-3 mb-6">
            {features.map((feature, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className="flex items-center gap-3 text-white/70"
              >
                <CheckCircle2 className="w-5 h-5 text-cyan-400" />
                <span className="text-base font-medium">{feature}</span>
              </motion.div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-5">
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onStartJourney}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold px-8 py-4 rounded-xl w-full sm:w-auto transition-all shadow-lg shadow-blue-500/20"
            >
              <span>Get Started</span>
              <ArrowRight className="w-5 h-5" />
            </motion.button>
            
            <button className="flex items-center justify-center px-8 py-4 rounded-xl border border-white/10 hover:bg-white/5 transition-all text-white/80 font-medium w-full sm:w-auto bg-white/5 backdrop-blur-sm">
              View Demo
            </button>
          </div>
        </motion.div>

        {/* RIGHT SECTION: Career Tree Image */}
        <div className="relative flex items-center justify-center lg:h-[550px]">
          <img
            src="/images/career-tree.jpg"
            alt="AI Career Tree - Interactive Learning Path Visualization"
            className="w-full max-w-[560px] h-auto"
            style={{ mixBlendMode: 'screen' }}
          />
        </div>

      </div>
    </section>
  );
};

export default Hero;
