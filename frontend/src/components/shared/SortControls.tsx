import { ArrowDown, ArrowUp } from 'react-feather';

interface SortOption {
  value: string;
  label: string;
}

interface SortControlsProps {
  sortBy: string;
  sortOrder: 'ASC' | 'DESC';
  onSortChange: (sortBy: string, sortOrder: 'ASC' | 'DESC') => void;
  options: SortOption[];
}

export default function SortControls({
  sortBy,
  sortOrder,
  onSortChange,
  options,
}: SortControlsProps) {
  const handleSortChange = (newSortBy: string) => {
    if (newSortBy === sortBy) {
      // toggle order if same field
      onSortChange(newSortBy, sortOrder === 'ASC' ? 'DESC' : 'ASC');
    } else {
      // new field, default to ASC
      onSortChange(newSortBy, 'ASC');
    }
  };

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm font-medium text-gray-700">Ordenar por:</span>
      <select
        value={sortBy}
        onChange={(e) => handleSortChange(e.target.value)}
        className="input text-sm"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <button
        onClick={() =>
          onSortChange(sortBy, sortOrder === 'ASC' ? 'DESC' : 'ASC')
        }
        className={`p-2 rounded-md border transition-colors ${
          sortOrder === 'ASC'
            ? 'bg-urbano-primary text-white border-urbano-primary'
            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
        }`}
        title={`Ordenar ${sortOrder === 'ASC' ? 'descendente' : 'ascendente'}`}
      >
        {sortOrder === 'ASC' ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
      </button>
    </div>
  );
}
