"use client";

import { useEffect, useState, ChangeEvent } from "react";
import { Advocate, AdvocatesResponse } from "@/types/advocate";
import AdvocateDialog from "@/Components/AdvocateDialog";
import AdvocateSearchInput from "@/components/AdvocateSearchInput";
import { filterAdvocates } from "@/utils/advocateFilters";

export default function ManageAdvocatesPage() {
  const [advocates, setAdvocates] = useState<Advocate[]>([]);
  const [filteredAdvocates, setFilteredAdvocates] = useState<Advocate[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedAdvocate, setSelectedAdvocate] = useState<Advocate | null>(null);
  const [dialogMode, setDialogMode] = useState<"add" | "edit">("add");

  useEffect(() => {
    const fetchAdvocates = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch("/api/advocates");

        if (!response.ok) {
          throw new Error(`Failed to fetch advocates: ${response.statusText}`);
        }

        const jsonResponse: AdvocatesResponse = await response.json();
        setAdvocates(jsonResponse.data);
        setFilteredAdvocates(jsonResponse.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        console.error("Error fetching advocates:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAdvocates();
  }, []);

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    const filtered = filterAdvocates(advocates, value);
    setFilteredAdvocates(filtered);
  };

  const handleReset = () => {
    setSearchTerm("");
    setFilteredAdvocates(advocates);
  };

  const formatPhoneNumber = (phoneNumber: number) => {
    const phone = phoneNumber.toString();
    return `(${phone.slice(0, 3)}) ${phone.slice(3, 6)}-${phone.slice(6)}`;
  };

  const handleEdit = (advocate: Advocate) => {
    setSelectedAdvocate(advocate);
    setDialogMode("edit");
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this advocate?")) {
      try {
        const response = await fetch(`/api/advocates?id=${id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Failed to delete advocate");
        }

        // Remove advocate from state
        const updatedAdvocates = advocates.filter(adv => adv.id !== id);
        setAdvocates(updatedAdvocates);
        setFilteredAdvocates(filterAdvocates(updatedAdvocates, searchTerm));
      } catch (err) {
        console.error("Error deleting advocate:", err);
        alert("Failed to delete advocate. Please try again.");
      }
    }
  };

  const handleAddNew = () => {
    setSelectedAdvocate(null);
    setDialogMode("add");
    setIsDialogOpen(true);
  };

  const handleDialogSubmit = async (advocateData: Partial<Advocate>) => {
    try {
      const method = dialogMode === "add" ? "POST" : "PUT";
      const body = dialogMode === "edit" && selectedAdvocate 
        ? { ...advocateData, id: selectedAdvocate.id }
        : advocateData;

      const response = await fetch("/api/advocates", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(`Failed to ${dialogMode} advocate`);
      }

      const result = await response.json();

      if (dialogMode === "add") {
        const updatedAdvocates = [...advocates, result.data];
        setAdvocates(updatedAdvocates);
        setFilteredAdvocates(filterAdvocates(updatedAdvocates, searchTerm));
      } else {
        const updatedAdvocates = advocates.map(adv => 
          adv.id === selectedAdvocate?.id ? result.data : adv
        );
        setAdvocates(updatedAdvocates);
        setFilteredAdvocates(filterAdvocates(updatedAdvocates, searchTerm));
      }

      setIsDialogOpen(false);
    } catch (err) {
      console.error(`Error ${dialogMode}ing advocate:`, err);
      alert(`Failed to ${dialogMode} advocate. Please try again.`);
    }
  };

  if (error) {
    return (
      <main className="min-h-screen p-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
            <h2 className="text-lg font-semibold mb-2">Error</h2>
            <p>{error}</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-medium text-gray-900">
            Manage Advocates
          </h1>
          <button 
            onClick={handleAddNew}
            className="bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700 transition-colors font-medium"
          >
            Add New Advocate
          </button>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <AdvocateSearchInput
            searchTerm={searchTerm}
            onSearchChange={handleSearch}
            onReset={handleReset}
          />
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="flex justify-center items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          </div>
        ) : (
          /* Table */
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      City
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Degree
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Specialties
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Experience
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Phone
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredAdvocates.length === 0 ? (
                    <tr>
                      <td
                        colSpan={7}
                        className="px-6 py-4 text-center text-gray-500"
                      >
                        {searchTerm 
                          ? "No advocates found matching your search criteria." 
                          : "No advocates found."}
                      </td>
                    </tr>
                  ) : (
                    filteredAdvocates.map((advocate) => (
                      <tr key={advocate.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {advocate.firstName} {advocate.lastName}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {advocate.city}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {advocate.degree}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1">
                            {advocate.specialties.map((specialty, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                              >
                                {specialty}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {advocate.yearsOfExperience} years
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatPhoneNumber(advocate.phoneNumber)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEdit(advocate)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(advocate.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            {filteredAdvocates.length > 0 && searchTerm && (
              <div className="bg-gray-50 px-6 py-3 text-sm text-gray-600">
                Showing {filteredAdvocates.length} of {advocates.length} advocates
              </div>
            )}
          </div>
        )}
      </div>

      <AdvocateDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSubmit={handleDialogSubmit}
        advocate={selectedAdvocate}
        mode={dialogMode}
      />
    </main>
  );
}
