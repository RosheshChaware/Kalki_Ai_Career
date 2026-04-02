import React from 'react';
import { Check, Circle } from 'lucide-react';

const QuestionStep = ({ question, options, isMultiple, selections, onSelect }) => {
  const handleToggle = (option) => {
    if (isMultiple) {
      if (selections.includes(option)) {
        onSelect(selections.filter((s) => s !== option));
      } else {
        onSelect([...selections, option]);
      }
    } else {
      onSelect([option]);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto glass-card rounded-3xl p-8 md:p-12">
      <h3 className="text-2xl md:text-3xl font-bold mb-4">{question}</h3>
      <p className="text-textMuted mb-10">
        {isMultiple ? "Select all that apply" : "Choose the option that best describes you"}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {options.map((option, index) => {
          const isSelected = selections.includes(option);
          return (
            <button
              key={index}
              onClick={() => handleToggle(option)}
              className={`flex items-center gap-4 p-5 rounded-2xl border transition-all duration-300 text-left ${
                isSelected
                  ? "bg-primary/20 border-primary shadow-[0_0_20px_rgba(99,102,241,0.15)]"
                  : "bg-surface/50 border-white/5 hover:border-white/10"
              }`}
            >
              <div className={`w-6 h-6 rounded-md flex items-center justify-center transition-colors ${
                isSelected ? "bg-primary text-white" : "bg-white/5 border border-white/10"
              }`}>
                {isSelected ? (
                  <Check className="w-4 h-4" />
                ) : (
                  !isMultiple && <Circle className="w-2 h-2 text-white/20" />
                )}
              </div>
              <span className={`font-medium ${isSelected ? "text-white" : "text-textMuted"}`}>
                {option}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuestionStep;
