import React from 'react';

const STATS = [
  { value: '10,000+', label: 'Students Guided' },
  { value: '500+',    label: 'Career Paths'    },
  { value: '1,200+', label: 'Colleges Listed' },
  { value: '95%',    label: 'Success Rate'    },
];

const Statistics = () => (
  <section className="w-full relative z-10">
    {/* Ambient top glow edge */}
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        background:
          'radial-gradient(ellipse 60% 100% at 50% 0%, rgba(139,92,246,0.12) 0%, transparent 70%)',
        pointerEvents: 'none',
      }}
    />

    {/* Glass strip */}
    <div
      style={{
        background: 'rgba(15, 12, 26, 0.72)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(139, 92, 246, 0.18)',
        borderBottom: '1px solid rgba(139, 92, 246, 0.10)',
        boxShadow: '0 0 40px rgba(99, 102, 241, 0.06)',
      }}
    >
      <div className="max-w-5xl mx-auto px-6 py-6 flex flex-row items-center justify-center gap-0">
        {STATS.map((stat, i) => (
          <React.Fragment key={stat.label}>
            {/* Stat item */}
            <div className="flex-1 flex flex-col items-center justify-center text-center px-4 py-1 min-w-0">
              <span
                className="text-3xl md:text-4xl font-extrabold tracking-tight text-white leading-none"
                style={{
                  background: 'linear-gradient(135deg, #e2e8f0 0%, #a5b4fc 60%, #c4b5fd 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  letterSpacing: '-0.02em',
                }}
              >
                {stat.value}
              </span>
              <span
                className="mt-1 text-xs md:text-sm font-medium"
                style={{ color: 'rgba(203, 213, 225, 0.55)', letterSpacing: '0.04em' }}
              >
                {stat.label}
              </span>
            </div>

            {/* Divider — hidden after last */}
            {i < STATS.length - 1 && (
              <div
                aria-hidden="true"
                style={{
                  width: '1px',
                  height: '36px',
                  flexShrink: 0,
                  background:
                    'linear-gradient(to bottom, transparent, rgba(139,92,246,0.30), transparent)',
                }}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  </section>
);

export default Statistics;
