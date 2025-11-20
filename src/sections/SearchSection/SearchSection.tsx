import React, { useState, memo, useEffect } from "react";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { useFAQ } from "../../hooks/useFAQ";
import SearchButton from "./modules/SearchButton";
import SuggestionSearchList from "./modules/SuggestionSearchList";

const SearchSection: React.FC = () => {
  const { searchResults, recommended, searchFAQs, loading } = useFAQ();
  const [searchValue, setSearchValue] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [typing, setTyping] = useState(false);

  // Trigger real-time suggestions
  useEffect(() => {
    if (!searchValue) {
      setShowDropdown(false);
      return;
    }

    setTyping(true);
    const delay = setTimeout(() => {
      searchFAQs(searchValue);
      setShowDropdown(true);
      setTyping(false);
    }, 300);

    return () => clearTimeout(delay);
  }, [searchValue, searchFAQs]);

  const handleSearch = () => {
    searchFAQs(searchValue);
    setShowDropdown(false);
  };

  const handleSuggestionClick = (value: string) => {
    setSearchValue(value);
    searchFAQs(value);
    setShowDropdown(false);
  };

  const displayedFAQs = searchValue ? searchResults : recommended;

  return (
    <div className="w-full px-4 sm:px-6 py-6 flex flex-col items-center">
      <motion.div className="relative flex flex-col sm:flex-row items-center w-full max-w-3xl gap-3 sm:gap-2">

        {/* Search Icon */}
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
          <Icons.Search size={20} />
        </div>

        {/* Input */}
        <motion.input
          type="text"
          placeholder="What do you want to know about the DTP Program..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onFocus={() => searchValue && setShowDropdown(true)}
          className="
            flex-1 border border-gray-300 rounded-full 
            pl-10 py-3 text-sm sm:text-base 
            focus:outline-none focus:ring-2 focus:ring-blue-500
            transition w-full
          "
        />

        {/* Search Button */}
        <SearchButton label="Find answer" icon="Search" onClick={handleSearch} />

        {/* 🔽 Live Dropdown Suggestions */}
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="
              absolute top-14 w-full bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.08)]
              border border-gray-200 max-h-72 overflow-auto z-50 p-2
            "
          >
            {/* ⏳ Skeleton Loading */}
            {(typing || loading) && (
              <div className="space-y-3 p-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="h-4 w-4 bg-gray-200 rounded-full animate-pulse"></div>
                    <div className="h-4 w-3/4 bg-gray-200 rounded-md animate-pulse"></div>
                  </div>
                ))}
              </div>
            )}

            {/* Results */}
            {!typing && !loading && searchResults.length > 0 && (
              <div className="flex flex-col gap-1">
                {searchResults.map((faq) => (
                  <motion.div
                    key={faq.id}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => handleSuggestionClick(faq.question)}
                    className="
                      px-3 py-2 rounded-xl cursor-pointer flex items-center gap-2
                      bg-white hover:bg-gray-50 transition-all
                      border border-gray-100
                    "
                  >
                    <Icons.CircleHelp size={18} className="text-blue-600" />
                    <span className="text-sm text-gray-800">
                      {faq.question}
                    </span>
                  </motion.div>
                ))}
              </div>
            )}

            {/* ❌ No Results */}
            {!typing && !loading && searchResults.length === 0 && (
              <div className="flex flex-col items-center justify-center py-6 text-gray-500">
                <Icons.SearchX size={28} className="text-red-500 mb-2" />
                <p className="text-sm">No matching questions found</p>
              </div>
            )}
          </motion.div>
        )}
      </motion.div>

      {/* Suggested FAQ List (below search box) */}
      <div className="w-full max-w-6xl mt-4 px-1 sm:px-0">
        {loading ? (
          <div className="text-gray-400 text-sm">Loading FAQs...</div>
        ) : (
          <SuggestionSearchList
            suggestions={displayedFAQs.map((f) => f.question)}
            onSelect={handleSuggestionClick}
          />
        )}
      </div>
    </div>
  );
};

export default memo(SearchSection);
