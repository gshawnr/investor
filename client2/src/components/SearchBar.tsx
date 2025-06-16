import React, { useState } from "react";
import styles from "./SearchBar.module.css";

interface SearchBarProps {
  onSearch: (value: string) => void;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  placeholder = "Search...",
}) => {
  const [value, setValue] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setValue(value);
    onSearch(value);
  };

  return (
    <div className={styles.container}>
      <form
        className={styles.searchBar}
        onSubmit={(e) => e.preventDefault()}
        role="search"
      >
        <span className={styles.icon} aria-hidden="true">
          {/* SVG magnifying glass */}
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
            <circle cx="9" cy="9" r="7" stroke="#888" strokeWidth="2" />
            <line
              x1="14.5"
              y1="14.5"
              x2="19"
              y2="19"
              stroke="#888"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </span>
        <input
          className={styles.input}
          type="text"
          value={value}
          onChange={handleInputChange}
          placeholder={placeholder}
          aria-label={placeholder}
        />
      </form>
    </div>
  );
};

export default SearchBar;
