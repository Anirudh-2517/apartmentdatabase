import React, { useRef, useState } from "react";
import axios from "axios";
import {
  FaBuilding,
  FaUser,
  FaMapMarkerAlt,
  FaCity,
  FaRegBuilding,
  FaHome,
} from "react-icons/fa";

function AddApartmentDetails() {
  const ApartmentName = useRef(null);
  const BuilderName = useRef(null);
  const Address = useRef(null);
  const AreaName = useRef(null);
  const City = useRef(null);
  const NoOfWings = useRef(null);
  const NoOfFlats = useRef(null);
  const NoOfFloors = useRef(null);
  const SocietyName = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState({ show: false, type: '', message: '' });
  const validateForm = () => {
    const required = [
      { ref: ApartmentName, name: 'Apartment Name' },
      { ref: Address, name: 'Address' },
      { ref: City, name: 'City' },
      { ref: NoOfFlats, name: 'Number of Flats' },
      { ref: SocietyName, name: 'Society Name' }
    ];
    for (const field of required) {
      if (!field.ref.current.value.trim()) {
        showNotification('error', `${field.name} is required`);
        field.ref.current.focus();
        return false;
      }
    }
    const numericFields = [
      { ref: NoOfWings, name: 'Number of Wings' },
      { ref: NoOfFlats, name: 'Number of Flats' },
      { ref: NoOfFloors, name: 'Number of Floors' }
    ];
    for (const field of numericFields) {
      const value = field.ref.current.value;
      if (value && (isNaN(value) || parseInt(value) <= 0)) {
        showNotification('error', `${field.name} must be a positive number`);
        field.ref.current.focus();
        return false;
      }
    }
    return true;
  };
  const showNotification = (type, message) => {
    setNotification({ show: true, type, message });
    setTimeout(() => {
      setNotification({ show: false, type: '', message: '' });
    }, 5000);
  };
  const addApartmentDetails = () => {
    if (!validateForm()) return;
    setIsSubmitting(true);
    const payload = {
      ApartmentName: ApartmentName.current.value,
      BuilderName: BuilderName.current.value,
      Address: Address.current.value,
      AreaName: AreaName.current.value,
      City: City.current.value,
      NoOfWings: NoOfWings.current.value,
      Noofflats: NoOfFlats.current.value,
      Nooffloors: NoOfFloors.current.value,
      SocietyName: SocietyName.current.value,
    };


    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;


    axios.post(`${API_BASE_URL}/admin/insertapartmentdetails`, payload)
      .then((response) => {
        showNotification('success', 'Apartment details have been successfully added!');
        document.getElementById("apartmentForm").reset();
      })
      .catch((err) => {
        console.error("Error inserting apartment details:", err);
        showNotification('error', 'Failed to add apartment details. Please try again.');
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };
  const InputField = ({ icon, label, placeholder, type = "text", reference, required = false }) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="flex">
        <div className="flex items-center justify-center bg-gray-100 rounded-l-lg px-3 border border-r-0 border-gray-300">
          {icon}
        </div>
        <input
          type={type}
          ref={reference}
          className="w-full px-4 py-2.5 text-gray-700 bg-white rounded-r-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          placeholder={placeholder}
          aria-label={label}
        />
      </div>
    </div>
  );
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {notification.show && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg ${notification.type === 'success'
          ? 'bg-green-100 border-l-4 border-green-500 text-green-700'
          : 'bg-red-100 border-l-4 border-red-500 text-red-700'
          } flex items-center`}>
          <div className="mr-3">
            {notification.type === 'success' ? (
              <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            )}
          </div>
          {notification.message}
          <button
            onClick={() => setNotification({ show: false, type: '', message: '' })}
            className="ml-auto text-gray-600 hover:text-gray-800"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6">
          <h2 className="text-white text-2xl font-bold">Add Apartment Details</h2>
          <p className="text-blue-100 mt-2">Register a new apartment complex in the system</p>
        </div>
        <form id="apartmentForm" className="p-6">
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                icon={<FaBuilding className="text-gray-500" size={16} />}
                label="Apartment Name"
                placeholder="Enter apartment name"
                reference={ApartmentName}
                required={true}
              />
              <InputField
                icon={<FaUser className="text-gray-500" size={16} />}
                label="Builder Name"
                placeholder="Enter builder name"
                reference={BuilderName}
              />
              <InputField
                icon={<FaRegBuilding className="text-gray-500" size={16} />}
                label="Society Name"
                placeholder="Enter society name"
                reference={SocietyName}
                required={true}
              />
              {/* <InputField 
                icon={<FaIdCard className="text-gray-500" size={16} />} 
                label="Registration Number"
                placeholder="Enter registration number"
                reference={RegistrationNumber}
              /> */}
              {/* <InputField 
                icon={<FaCalendarAlt className="text-gray-500" size={16} />} 
                label="Registration Date"
                placeholder="YYYY-MM-DD"
                type="date"
                reference={RegistrationDate}
              /> */}
            </div>
          </div>
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">Location</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <InputField
                  icon={<FaMapMarkerAlt className="text-gray-500" size={16} />}
                  label="Address"
                  placeholder="Enter complete address"
                  reference={Address}
                  required={true}
                />
              </div>
              <InputField
                icon={<FaMapMarkerAlt className="text-gray-500" size={16} />}
                label="Area Name"
                placeholder="Enter area name"
                reference={AreaName}
              />
              <InputField
                icon={<FaCity className="text-gray-500" size={16} />}
                label="City"
                placeholder="Enter city name"
                reference={City}
                required={true}
              />
            </div>
          </div>
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">Structure Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <InputField
                icon={<FaHome className="text-gray-500" size={16} />}
                label="Number of Wings"
                placeholder="Enter number"
                type="number"
                reference={NoOfWings}
              />
              <InputField
                icon={<FaHome className="text-gray-500" size={16} />}
                label="Number of Flats"
                placeholder="Enter number"
                type="number"
                reference={NoOfFlats}
                required={true}
              />
              <InputField
                icon={<FaBuilding className="text-gray-500" size={16} />}
                label="Number of Floors"
                placeholder="Enter number"
                type="number"
                reference={NoOfFloors}
              />
            </div>
          </div>
          <div className="flex justify-end mt-8">
            <button
              type="button"
              className={`px-6 py-3 font-semibold text-white rounded-lg shadow-lg transition-all ${isSubmitting
                ? 'bg-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50'
                }`}
              onClick={addApartmentDetails}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                <span className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                  </svg>
                  Add Apartment
                </span>
              )}
            </button>
          </div>
        </form>
      </div>
      <div className="mt-4 text-center text-gray-500 text-sm">
        <p>Fields marked with <span className="text-red-500">*</span> are required</p>
      </div>
    </div>
  );
}

export default AddApartmentDetails;