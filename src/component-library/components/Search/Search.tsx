import { useState } from "react";
import { SearchIcon } from "@heroicons/react/outline";
import { classNames } from "../../../helpers";

interface SearchProps {
  /**
   * Placeholder text for the search input
   */
  placeholder?: string;
  /**
   * Function to call when the search is submitted
   */
  onSearch: (query: string) => void;
  /**
   * Whether to show a search button
   */
  showButton?: boolean;
  /**
   * Custom CSS classes for the container
   */
  className?: string;
  /**
   * Test id for the search component
   */
  testId?: string;
}

export const Search: React.FC<SearchProps> = ({
  placeholder = "Search...",
  onSearch,
  showButton = false,
  className = "",
  testId,
}) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={classNames("flex w-full", className)}
      data-testid={testId}>
      <div className="relative flex-grow">
        <input
          type="text"
          className="w-full py-2 pl-10 pr-4 text-sm text-gray-900 bg-white border border-[#FF0083] rounded-md dark:bg-[#353739] dark:text-gray-100 dark:border-gray-700 focus:ring-0"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="absolute inset-y-0 left-0 flex items-center pl-3">
          <SearchIcon className="w-5 h-5 text-[#FF0083]" aria-hidden="true" />
        </div>
      </div>
      {showButton && (
        <button
          type="submit"
          className="px-4 py-2 ml-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:ring-0">
          Search
        </button>
      )}
    </form>
  );
};
