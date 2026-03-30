import React from 'react';
import { MacroLabel } from '../utils/macroLabels';
import './MacroLabels.css';

interface MacroLabelsProps {
  labels: readonly MacroLabel[];
  className?: string;
}

const labelClassMap: Record<MacroLabel, string> = {
  'high protein': 'macro-label-pill--high-protein',
  'high fat': 'macro-label-pill--high-fat',
  'low carb': 'macro-label-pill--low-carb',
  '40/40/20': 'macro-label-pill--balanced',
};

const MacroLabels: React.FC<MacroLabelsProps> = ({ labels, className = '' }) => {
  if (labels.length === 0) {
    return null;
  }

  return (
    <div className={`macro-labels ${className}`.trim()}>
      {labels.map((label) => (
        <span key={label} className={`macro-label-pill ${labelClassMap[label]}`}>
          {label}
        </span>
      ))}
    </div>
  );
};

export default MacroLabels;
