"use client";

import { useEffect, useState, useCallback, ChangeEvent } from "react";
import { Advocate, AdvocatesResponse } from "@/types/advocate";

export default function Home() {
  const [advocates, setAdvocates] = useState<Advocate[]>([]);
  const [filteredAdvocates, setFilteredAdvocates] = useState<Advocate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

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

  const filterAdvocates = useCallback(
    (term: string) => {
      if (!term) {
        setFilteredAdvocates(advocates);
        return;
      }

      const lowerSearchTerm = term.toLowerCase();
      const filtered = advocates.filter((advocate) => {
        return (
          advocate.firstName.toLowerCase().includes(lowerSearchTerm) ||
          advocate.lastName.toLowerCase().includes(lowerSearchTerm) ||
          advocate.city.toLowerCase().includes(lowerSearchTerm) ||
          advocate.degree.toLowerCase().includes(lowerSearchTerm) ||
          advocate.specialties.some((specialty) =>
            specialty.toLowerCase().includes(lowerSearchTerm)
          ) ||
          advocate.yearsOfExperience.toString().includes(term)
        );
      });

      setFilteredAdvocates(filtered);
    },
    [advocates]
  );

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    filterAdvocates(value);
  };

  const handleReset = () => {
    setSearchTerm("");
    setFilteredAdvocates(advocates);
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
    <main style={{ margin: "24px" }}>
      <h1>Solace Advocates</h1>
      <br />
      <br />
      <div>
        <p>Search</p>
        <p>
          Searching for: <span id="search-term"></span>
        </p>
        <input style={{ border: "1px solid black" }} onChange={handleSearch} />
        <button onClick={handleReset}>Reset Search</button>
      </div>
      <br />
      <br />
      <table>
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>City</th>
            <th>Degree</th>
            <th>Specialties</th>
            <th>Years of Experience</th>
            <th>Phone Number</th>
          </tr>
        </thead>
        <tbody>
          {filteredAdvocates.map((advocate) => {
            return (
              <tr key={advocate.phoneNumber}>{/* TODO: us id */}
                <td>{advocate.firstName}</td>
                <td>{advocate.lastName}</td>
                <td>{advocate.city}</td>
                <td>{advocate.degree}</td>
                <td>
                  {advocate.specialties.map((s) => (
                    <div
                      key={advocate.phoneNumber + s }
                    >{s}</div>
                  ))}
                </td>
                <td>{advocate.yearsOfExperience}</td>
                <td>{advocate.phoneNumber}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </main>
  );
}
