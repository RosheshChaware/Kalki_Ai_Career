import { useMotionValue, motion, useMotionTemplate } from "framer-motion";
import React, { useEffect } from "react";
import CanvasRevealEffect from "../ui/canvas-reveal-effect";


export const PixelSpotlightBackground = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-black">
      <motion.div
        className="absolute inset-0"
        style={{
          maskImage: useMotionTemplate`
            radial-gradient(
              650px circle at ${mouseX}px ${mouseY}px,
              white,
              transparent 80%
            )
          `,
          WebkitMaskImage: useMotionTemplate`
            radial-gradient(
              650px circle at ${mouseX}px ${mouseY}px,
              white,
              transparent 80%
            )
          `,
        }}
      >
        <CanvasRevealEffect
          animationSpeed={3.5}
          containerClassName="bg-transparent absolute inset-0"
          colors={[
            [59, 130, 246], // Deep Blue
            [139, 92, 246], // Vibrant Purple
          ]}
          dotSize={3}
        />
      </motion.div>
      
      {/* Subtle overlay to ensure dashboard readability */}
      <div className="absolute inset-0 bg-black/40 pointer-events-none" />
    </div>
  );
};
export default PixelSpotlightBackground;
