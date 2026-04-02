import React from 'react';

const Statistics = () => {
  const stats = [
    { value: "10,000+", label: "Students Guided" },
    { value: "500+", label: "Career Paths" },
    { value: "1,200+", label: "Colleges Listed" },
    { value: "95%", label: "Success Rate" }
  ];

  return (
    <section className="width-full bg-primary/95 py-16">
      <div className="max-w-6xl mx-auto px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="flex flex-col items-center justify-center text-white text-center">
              <span className="text-4xl md:text-5xl font-bold mb-2">{stat.value}</span>
              <span className="text-sm md:text-base font-medium opacity-90">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Statistics;
