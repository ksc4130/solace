import { Advocate } from "@/types/advocate";

export function filterAdvocates(advocates: Advocate[], searchTerm: string): Advocate[] {
  if (!searchTerm) {
    return advocates;
  }

  const lowerSearchTerm = searchTerm.toLowerCase();
  
  return advocates.filter((advocate) => {
    return (
      advocate.firstName.toLowerCase().includes(lowerSearchTerm) ||
      advocate.lastName.toLowerCase().includes(lowerSearchTerm) ||
      advocate.city.toLowerCase().includes(lowerSearchTerm) ||
      advocate.degree.toLowerCase().includes(lowerSearchTerm) ||
      advocate.specialties.some((specialty) =>
        specialty.toLowerCase().includes(lowerSearchTerm)
      ) ||
      advocate.yearsOfExperience.toString().includes(searchTerm)
    );
  });
}
