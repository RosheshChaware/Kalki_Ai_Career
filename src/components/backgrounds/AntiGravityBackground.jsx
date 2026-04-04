import React, { useEffect, useRef } from 'react';

export default function AntiGravityBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let animationFrameId;
    let particles = [];
    let mouse = { x: -1000, y: -1000, vx: 0, vy: 0 };
    let lastMouse = { x: -1000, y: -1000 };

    // --- Agent 3: Color & Atmosphere Designer ---
    // Manages changing neon/pastel color palettes and ambient glow
    class AtmosphereDesigner {
      constructor() {
        this.hue = 220; // Start with soft blues
        this.time = 0;
      }
      update() {
        this.time += 0.005;
        // Shift colors between blues, purples, and pinks (180 to 300 hue)
        this.hue = 240 + Math.sin(this.time) * 60;
      }
      getBgColor() {
        return `hsl(${this.hue}, 40%, 4%)`;
      }
      getParticleColor(alpha) {
        return `hsla(${this.hue + 20}, 80%, 70%, ${alpha})`;
      }
    }
    const atmosphere = new AtmosphereDesigner();

    // --- Agent 1: Particle Motion Controller ---
    // Floating particles with anti-gravity motion
    class Particle {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.baseSize = Math.random() * 4 + 2; // 2px to 6px
        this.size = this.baseSize;
        this.vx = (Math.random() - 0.5) * 0.5; // Slow to medium
        this.vy = (Math.random() - 0.5) * 0.5;
        this.baseAlpha = Math.random() * 0.5 + 0.2;
        this.alpha = this.baseAlpha;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        // Wrap around screen
        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height;
        if (this.y > canvas.height) this.y = 0;

        // Anti-gravity response: React to cursor movement
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        // --- Agent 4: Interactive Layer Manager (Depth Perception) ---
        // Particles closer to cursor appear larger and brighter
        if (dist < 150) {
          const force = (150 - dist) / 150; // 0 to 1
          
          // Repel slightly if mouse moves fast
          const mouseSpeed = Math.abs(mouse.vx) + Math.abs(mouse.vy);
          if (mouseSpeed > 5) {
             this.x -= (dx / dist) * force * 2;
             this.y -= (dy / dist) * force * 2;
          } else {
             // Gentle pull
             this.x += (dx / dist) * force * 0.5;
             this.y += (dy / dist) * force * 0.5;
          }

          this.size = this.baseSize + force * 3;
          this.alpha = this.baseAlpha + force * 0.5;
        } else {
          this.size = this.baseSize;
          this.alpha = this.baseAlpha;
        }
      }

      draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = atmosphere.getParticleColor(this.alpha);
        ctx.shadowBlur = 10;
        ctx.shadowColor = atmosphere.getParticleColor(this.alpha * 0.5);
        ctx.fill();
        ctx.shadowBlur = 0; // reset
      }
    }

    // --- Agent 2: Spotlight / Glow Enhancer ---
    function drawSpotlight() {
      if (mouse.x < 0) return;
      const gradient = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 400);
      gradient.addColorStop(0, `hsla(${atmosphere.hue}, 60%, 20%, 0.15)`);
      gradient.addColorStop(0.5, `hsla(${atmosphere.hue - 20}, 50%, 10%, 0.05)`);
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    function initParticles() {
      particles = [];
      const numParticles = Math.floor((canvas.width * canvas.height) / 15000); // Responsive amount
      for (let i = 0; i < numParticles; i++) {
        particles.push(new Particle(Math.random() * canvas.width, Math.random() * canvas.height));
      }
    }

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    }

    function animate() {
      // Background clear with atmosphere color
      atmosphere.update();
      ctx.fillStyle = atmosphere.getBgColor();
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      drawSpotlight();

      // Deep copy particles for the Layer Manager (Agent 4)
      // Sort by size (depth perception: smaller particles rendered first so they are behind)
      particles.sort((a, b) => a.size - b.size);

      particles.forEach((p) => {
        p.update();
        p.draw(ctx);
      });

      lastMouse.x = mouse.x;
      lastMouse.y = mouse.y;

      animationFrameId = requestAnimationFrame(animate);
    }

    resize();
    window.addEventListener('resize', resize);
    
    const handleMouseMove = (e) => {
      mouse.vx = e.clientX - lastMouse.x;
      mouse.vy = e.clientY - lastMouse.y;
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 w-full h-full -z-20 pointer-events-none"
    />
  );
}
