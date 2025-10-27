"use client";

import { ChangeEvent } from "react";

interface AdvocateSearchInputProps {
  searchTerm: string;
  onSearchChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onReset: () => void;
  placeholder?: string;
}

export default function AdvocateSearchInput({
  searchTerm,
  onSearchChange,
  onReset,
  placeholder = "Search by name, city, degree, specialty, or experience"
}: AdvocateSearchInputProps) {
  return (
    <div className="flex gap-4 items-center">
      <input
        id="search"
        type="text"
        value={searchTerm}
        onChange={onSearchChange}
        placeholder={placeholder}
        className="flex-1 px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
      />
      {searchTerm && (
        <button
          onClick={onReset}
          className="px-6 py-3 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors font-medium whitespace-nowrap"
        >
          Reset Search
        </button>
      )}
    </div>
  );
}
