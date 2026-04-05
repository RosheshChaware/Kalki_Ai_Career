import React from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import Lottie from 'lottie-react';
import animationData from '../assets/chatbot-animation.json';

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

        {/* RIGHT SECTION: Lottie AI Bot Animation */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="relative hidden lg:flex items-center justify-center lg:h-[550px]"
        >
          <div
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at center, rgba(99,102,241,0.18) 0%, rgba(139,92,246,0.10) 50%, transparent 75%)',
              filter: 'blur(40px)',
            }}
          />
          <HeroLottie />
        </motion.div>

      </div>
    </section>
  );
};

class LottieErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Lottie animation failed to load:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-[420px] max-w-full h-[420px] flex flex-col items-center justify-center text-white/40 border border-white/10 rounded-3xl bg-white/5 backdrop-blur-sm">
          <div className="w-24 h-24 mb-4 rounded-full bg-white/10 flex items-center justify-center">
            <span className="text-xs">Bot Offline</span>
          </div>
          <span className="text-sm font-medium">Animation Unavailable</span>
        </div>
      );
    }

    return this.props.children;
  }
}

function HeroLottie() {
  if (!Lottie || !animationData) {
    return (
      <div className="w-[420px] max-w-full h-[420px] flex items-center justify-center text-white/40 border-2 border-white/20 rounded-3xl bg-white/10">
        <span className="text-lg font-medium text-white">Bot Data Missing</span>
      </div>
    );
  }

  // Properly handle Vite ESM to CJS interop for lottie-react
  const LottieComponent = Lottie.default ? Lottie.default : Lottie;
  const rawData = animationData.default ? animationData.default : animationData;

  return (
    <div
      style={{
        width: 420,
        height: 420,
        maxWidth: '100%',
        filter: 'drop-shadow(0 0 32px rgba(99,102,241,0.45)) drop-shadow(0 0 10px rgba(139,92,246,0.3))',
        position: 'relative',
        zIndex: 20
      }}
    >
      <LottieErrorBoundary>
        <LottieComponent
          animationData={rawData}
          loop={true}
          autoplay={true}
          style={{ width: '100%', height: '100%' }}
        />
      </LottieErrorBoundary>
    </div>
  );
}

export default Hero;
