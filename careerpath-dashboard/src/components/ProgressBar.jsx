import React from 'react';

const ProgressBar = ({ progress, stepTitle }) => {
  return (
    <div className="w-full max-w-4xl mx-auto mb-10">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-xl md:text-2xl font-bold">{stepTitle}</h2>
        <span className="text-sm font-medium text-textMuted">{progress}% Complete</span>
      </div>
      <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
        <div 
          className="h-full bg-primary transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
