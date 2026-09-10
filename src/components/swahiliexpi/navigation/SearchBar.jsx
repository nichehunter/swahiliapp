"use client";
import { SearchOutlined, CloseOutlined } from "@ant-design/icons";
export default function SearchBar({
  value = "",
  onChange,
  onClear,
  onSearch,
  placeholder = "Search places, events & experiences",
}) {
  const handleSubmit = (event) => {
    event.preventDefault();
    if (!value.trim()) return;
    onSearch?.(value.trim());
  };
  return (
    <form className="sw-map-search" onSubmit={handleSubmit}>
      <SearchOutlined className="sw-search-icon" />
      <input
        type="text"
        value={value}
        onChange={(event) => onChange?.(event.target.value)}
        placeholder={placeholder}
        aria-label="Search"
      />
      {value && (
        <button
          type="button"
          className="sw-search-clear"
          onClick={onClear}
          aria-label="Clear search"
        >
          <CloseOutlined />
        </button>
      )}
      {value.trim() && (
        <button
          type="submit"
          className="sw-search-submit"
          aria-label="Search"
          title="Search"
        >
          <SearchOutlined />
        </button>
      )}
    </form>
  );
}
