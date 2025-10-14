interface PageSizeControlsProps {
  pageSize: number;
  onPageSizeChange: (size: number) => void;
  total: number;
}

export default function PageSizeControls({
  pageSize,
  onPageSizeChange,
  total,
}: PageSizeControlsProps) {
  const pageSizeOptions = [5, 10, 20, 50];

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm font-medium text-gray-700">Mostrar:</span>
      <select
        value={pageSize}
        onChange={(e) => onPageSizeChange(Number(e.target.value))}
        className="input text-sm"
      >
        {pageSizeOptions.map((size) => (
          <option key={size} value={size}>
            {size}
          </option>
        ))}
      </select>
      <span className="text-sm text-gray-600">de {total} elementos</span>
    </div>
  );
}
