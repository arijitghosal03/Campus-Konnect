import React, { useRef } from 'react';
import { useState } from 'react';

interface FormData {
  fullName: string;
  dateOfBirth: string;
  gender: string;
  nationality: string;
  contactInformation: string;
  schoolName: string;
  graduationDate: string;
  cgpa: string;
  profileImage?: string;
}

interface StudentDetailsFormProps {
  title: string;
  onSubmit: (formData: FormData) => void;
}

const StudentDetailsForm = ({ title, onSubmit }: StudentDetailsFormProps) => {
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    dateOfBirth: '',
    gender: '',
    nationality: '',
    contactInformation: '',
    schoolName: '',
    graduationDate: '',
    cgpa: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName) newErrors.fullName = 'Full name is required';
    if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
    if (!formData.gender) newErrors.gender = 'Gender is required';
    if (!formData.nationality) newErrors.nationality = 'Nationality is required';
    if (!formData.contactInformation) newErrors.contactInformation = 'Contact information is required';
    if (!formData.schoolName) newErrors.schoolName = 'School/Institution name is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File size should not exceed 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setPreviewImage(base64String);
        setFormData(prev => ({
          ...prev,
          profileImage: base64String
        }));
      };
      reader.readAsDataURL(file);
      setIsModalOpen(false);
    }
  };

  const removeImage = () => {
    setPreviewImage(null);
    setFormData(prev => {
      const newData = { ...prev };
      delete newData.profileImage;
      return newData;
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
      <div className="flex justify-between items-start mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
            <span className="text-2xl">📚</span>
          </div>
          <h2 className="text-2xl font-bold">{title}</h2>
        </div>
        <div 
          onClick={() => setIsModalOpen(true)} 
          className="w-16 h-16 bg-orange-400 rounded-lg flex items-center justify-center hover:cursor-pointer hover:bg-orange-500 transition-colors relative overflow-hidden"
        >
          {previewImage ? (
            <img 
              src={previewImage} 
              alt="Profile" 
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-2xl">👤</span>
          )}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md m-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Upload Profile Picture</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              {previewImage ? (
                <div className="relative w-full aspect-square">
                  <img 
                    src={previewImage} 
                    alt="Preview" 
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <button
                    onClick={removeImage}
                    className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-orange-500"
                >
                  <div className="mb-2">📤</div>
                  <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                  <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 5MB</p>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          <div className="bg-orange-100 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Student Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
                />
                {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Date of Birth</label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
                />
                {errors.dateOfBirth && <p className="text-red-500 text-sm mt-1">{errors.dateOfBirth}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Gender</label>
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="gender"
                      value="male"
                      checked={formData.gender === 'male'}
                      onChange={handleInputChange}
                      className="mr-2"
                    />
                    Male
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="gender"
                      value="female"
                      checked={formData.gender === 'female'}
                      onChange={handleInputChange}
                      className="mr-2"
                    />
                    Female
                  </label>
                </div>
                {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Nationality</label>
                <input
                  type="text"
                  name="nationality"
                  value={formData.nationality}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
                />
                {errors.nationality && <p className="text-red-500 text-sm mt-1">{errors.nationality}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Contact Information</label>
                <input
                  type="text"
                  name="contactInformation"
                  value={formData.contactInformation}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
                />
                {errors.contactInformation && <p className="text-red-500 text-sm mt-1">{errors.contactInformation}</p>}
              </div>
            </div>
          </div>

          <div className="bg-orange-100 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Education Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">School/Institution Name</label>
                <input
                  type="text"
                  name="schoolName"
                  value={formData.schoolName}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
                />
                {errors.schoolName && <p className="text-red-500 text-sm mt-1">{errors.schoolName}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Graduation Date (if applicable)</label>
                <input
                  type="date"
                  name="graduationDate"
                  value={formData.graduationDate}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">CGPA</label>
                <input
                  type="number"
                  name="cgpa"
                  value={formData.cgpa}
                  onChange={handleInputChange}
                  step="0.01"
                  min="0"
                  max="10"
                  className="w-full p-2 border rounded-md"
                />
              </div>
            </div>
          </div>


          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-orange-500 text-white px-6 py-2 rounded-md hover:bg-orange-600 transition-colors"
            >
              Submit
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default StudentDetailsForm;