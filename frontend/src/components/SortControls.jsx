function SortControls({
  sortBy,
  sortDirection,
  sortOptions,
  onSortByChange,
  onSortDirectionChange,
}) {
  return (
    <div className="filter-row">
      <label>
        Sort by:
        <select
          value={sortBy}
          onChange={(event) => onSortByChange(event.target.value)}
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>

      <label>
        Direction:
        <select
          value={sortDirection}
          onChange={(event) => onSortDirectionChange(event.target.value)}
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </label>
    </div>
  );
}

export default SortControls;