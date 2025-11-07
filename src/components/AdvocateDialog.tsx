"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Advocate } from "@/types/advocate";
import { Specialty } from "@/types/specialty";

interface AdvocateDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (advocate: Partial<Advocate>) => void;
  advocate?: Advocate | null;
  mode: "add" | "edit";
}

export default function AdvocateDialog({
  isOpen,
  onClose,
  onSubmit,
  advocate,
  mode,
}: AdvocateDialogProps) {
  const [formData, setFormData] = useState<Partial<Advocate>>({
    firstName: "",
    lastName: "",
    city: "",
    degree: "",
    specialties: [],
    yearsOfExperience: 0,
    phoneNumber: 0,
  });

  const [availableSpecialties, setAvailableSpecialties] = useState<Specialty[]>([]);
  const [selectedSpecialtyIds, setSelectedSpecialtyIds] = useState<number[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Fetch available specialties
    fetchSpecialties();
    return () => setMounted(false);
  }, []);

  const fetchSpecialties = async () => {
    try {
      const response = await fetch('/api/specialties');
      if (response.ok) {
        const data = await response.json();
        setAvailableSpecialties(data);
      }
    } catch (error) {
      console.error('Error fetching specialties:', error);
    }
  };

  useEffect(() => {
    if (advocate && mode === "edit") {
      setFormData({
        firstName: advocate.firstName,
        lastName: advocate.lastName,
        city: advocate.city,
        degree: advocate.degree,
        specialties: advocate.specialties,
        yearsOfExperience: advocate.yearsOfExperience,
        phoneNumber: advocate.phoneNumber,
      });
      // Set selected specialty IDs based on specialty names
      const specialtyIds = advocate.specialties
        .map(name => availableSpecialties.find(s => s.name === name)?.id)
        .filter((id): id is number => id !== undefined);
      setSelectedSpecialtyIds(specialtyIds);
    } else {
      setFormData({
        firstName: "",
        lastName: "",
        city: "",
        degree: "",
        specialties: [],
        yearsOfExperience: 0,
        phoneNumber: 0,
      });
      setSelectedSpecialtyIds([]);
    }
  }, [advocate, mode, availableSpecialties]);

  useEffect(() => {
    // Prevent body scroll when dialog is open
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "yearsOfExperience" || name === "phoneNumber" 
        ? parseInt(value) || 0 
        : value,
    }));
  };

  const handleSpecialtyToggle = (specialtyId: number) => {
    setSelectedSpecialtyIds(prev => {
      const newIds = prev.includes(specialtyId)
        ? prev.filter(id => id !== specialtyId)
        : [...prev, specialtyId];
      
      // Update formData with specialty names
      const selectedSpecialtyNames = newIds
        .map(id => availableSpecialties.find(s => s.id === id)?.name)
        .filter((name): name is string => name !== undefined);
      
      setFormData(prevData => ({
        ...prevData,
        specialties: selectedSpecialtyNames,
      }));
      
      return newIds;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  if (!isOpen || !mounted) return null;

  const dialogContent = (
    <>
      {/* Backdrop - Grey overlay */}
      <div 
        className="fixed inset-0"
        style={{ 
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          zIndex: 9998
        }}
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Modal - centered with absolute positioning and transform */}
      <div 
        className="bg-white rounded-lg shadow-lg"
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 9999,
          width: '90%',
          maxWidth: '600px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                {mode === "add" ? "Add New Advocate" : "Edit Advocate"}
              </h3>
            </div>

            {/* Form Body */}
            <div className="px-6 py-4 flex-1" style={{ overflowY: 'auto', maxHeight: 'calc(90vh - 140px)' }}>
              <form onSubmit={handleSubmit} id="advocate-form">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                        First Name
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="degree" className="block text-sm font-medium text-gray-700 mb-1">
                      Degree
                    </label>
                    <select
                      id="degree"
                      name="degree"
                      value={formData.degree}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select a degree</option>
                      <option value="RN">RN (Registered Nurse)</option>
                      <option value="LPN">LPN (Licensed Practical Nurse)</option>
                      <option value="NP">NP (Nurse Practitioner)</option>
                      <option value="PA">PA (Physician Assistant)</option>
                      <option value="MD">MD (Doctor of Medicine)</option>
                      <option value="DO">DO (Doctor of Osteopathic Medicine)</option>
                      <option value="PhD">PhD (Doctor)</option>
                      <option value="MSW">MSW (Master of Social Work)</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="yearsOfExperience" className="block text-sm font-medium text-gray-700 mb-1">
                        Years of Experience
                      </label>
                      <input
                        type="number"
                        id="yearsOfExperience"
                        name="yearsOfExperience"
                        value={formData.yearsOfExperience}
                        onChange={handleInputChange}
                        min="0"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phoneNumber"
                        name="phoneNumber"
                        value={formData.phoneNumber || ""}
                        onChange={handleInputChange}
                        placeholder="1234567890"
                        pattern="[0-9]{10}"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Specialties
                    </label>
                    <div className="border border-gray-300 rounded-md p-2" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                      {availableSpecialties.map((specialty) => (
                        <label
                          key={specialty.id}
                          className="flex items-center p-2 hover:bg-gray-50 cursor-pointer rounded"
                        >
                          <input
                            type="checkbox"
                            checked={selectedSpecialtyIds.includes(specialty.id)}
                            onChange={() => handleSpecialtyToggle(specialty.id)}
                            className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                          />
                          <span className="ml-2 text-sm text-gray-700">
                            {specialty.name}
                          </span>
                        </label>
                      ))}
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      Click to select or deselect specialties
                    </p>
                    {formData.specialties && formData.specialties.length > 0 && (
                      <div className="mt-2">
                        <p className="text-sm font-medium text-gray-700 mb-1">Selected ({formData.specialties.length}):</p>
                        <div className="flex flex-wrap gap-2">
                          {formData.specialties.map((specialty, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-100 text-teal-800"
                            >
                              {specialty}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </form>
            </div>
            
            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="advocate-form"
                className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors"
              >
                {mode === "add" ? "Add Advocate" : "Save Changes"}
              </button>
            </div>
      </div>
    </>
  );

  // Render using React Portal to ensure it's at the document body level
  return createPortal(dialogContent, document.body);
}
