/**
 * Result filter component
 * Allows filtering team metrics by match result
 */

import React from 'react';
import { MatchResult } from '../../services/mock-data';

type ResultFilterProps = {
  selectedResult: MatchResult;
  onChange: (result: MatchResult) => void;
  className?: string;
};

const ResultFilter: React.FC<ResultFilterProps> = ({
  selectedResult,
  onChange,
  className = '',
}) => {
  const options: { value: MatchResult; label: string }[] = [
    { value: 'all', label: 'All Matches' },
    { value: 'win', label: 'Wins' },
    { value: 'draw', label: 'Draws' },
    { value: 'loss', label: 'Losses' },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value as MatchResult);
  };

  return (
    <div className={`flex flex-col sm:flex-row items-center gap-2 ${className}`}>
      <label htmlFor="result-filter" className="text-sm font-medium text-gray-700">
        Filter by Result:
      </label>
      <select
        id="result-filter"
        value={selectedResult}
        onChange={handleChange}
        className="form-select rounded-md border border-gray-300 py-1 px-3 text-sm focus:border-primary-500 focus:ring-primary-500"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ResultFilter;