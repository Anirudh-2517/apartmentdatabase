import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
import { FaBuilding, FaUser, FaIdCard, FaRulerCombined, FaLayerGroup, FaSpinner, FaCheck, FaTimes } from "react-icons/fa";

function AddFlatDetails() {
  const flatNumberRef = useRef("");
  const flatOwnerRef = useRef("");
  const ownerIdRef = useRef("");
  const flatSizeRef = useRef("");
  const flatFloorRef = useRef("");
  const wingBlockRef = useRef("");

  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ show: false, type: "", message: "" });
  const [formErrors, setFormErrors] = useState({});
  const [wings, setWings] = useState([]);
  const [isWingOrBlock, setIsWingOrBlock] = useState("Wing");
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  // Simulated fetch of available wings/blocks
  useEffect(() => {
    // In a real app, fetch from API
    setWings(["A", "B", "C", "D"]);

    // You can also fetch the wing/block setting from your backend
    axios.get(`${API_BASE_URL}i/admin/getblocksorwings`)
      .then(response => {
        if (response.data && response.data.Blocks) {
          setIsWingOrBlock(response.data.Blocks);
        }
      })
      .catch(err => console.error("Error fetching wing/block setting:", err));
  }, []);

  const showNotification = (type, message) => {
    setNotification({ show: true, type, message });
    setTimeout(() => {
      setNotification({ show: false, type: "", message: "" });
    }, 3000);
  };

  const validateForm = () => {
    const errors = {};

    if (!flatNumberRef.current.value.trim()) {
      errors.flatNumber = "Flat number is required";
    }

    if (!flatOwnerRef.current.value.trim()) {
      errors.flatOwner = "Owner name is required";
    }

    if (!ownerIdRef.current.value.trim()) {
      errors.ownerId = "Owner ID is required";
    }

    if (!flatSizeRef.current.value.trim()) {
      errors.flatSize = "Flat size is required";
    } else if (isNaN(flatSizeRef.current.value) || Number(flatSizeRef.current.value) <= 0) {
      errors.flatSize = "Please enter a valid flat size";
    }

    if (!flatFloorRef.current.value.trim()) {
      errors.flatFloor = "Floor number is required";
    } else if (isNaN(flatFloorRef.current.value)) {
      errors.flatFloor = "Floor must be a number";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const addFlatDetails = () => {
    if (!validateForm()) {
      showNotification("error", "Please fix the errors in the form");
      return;
    }

    setLoading(true);

    const payload = {
      FlatNumber: flatNumberRef.current.value,
      FlatOwner: flatOwnerRef.current.value,
      Oid: ownerIdRef.current.value,
      FlatSize: flatSizeRef.current.value,
      FlatFloor: flatFloorRef.current.value,
      Wing: wingBlockRef.current.value || "A"
    };
    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
    axios.post(`${API_BASE_URL}/admin/insertFlatDetails`, payload)
      .then((response) => {
        showNotification("success", "Flat details have been successfully added!");
        // Clear input fields after submission
        flatNumberRef.current.value = "";
        flatOwnerRef.current.value = "";
        ownerIdRef.current.value = "";
        flatSizeRef.current.value = "";
        flatFloorRef.current.value = "";
        wingBlockRef.current.value = "";
        setFormErrors({});
      })
      .catch((err) => {
        console.error("Error inserting flat details:", err);
        showNotification("error", "Failed to add flat details. Please try again.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      {notification.show && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center transition-all duration-500 ${notification.type === "success" ? "bg-green-100 border-l-4 border-green-500 text-green-700" :
            "bg-red-100 border-l-4 border-red-500 text-red-700"
          }`}>
          {notification.type === "success" ? <FaCheck className="mr-2" /> : <FaTimes className="mr-2" />}
          {notification.message}
        </div>
      )}

      <div className="bg-white shadow-2xl rounded-xl p-8 sm:p-10 max-w-2xl w-full m-4">
        <div className="mb-8 text-center">
          <FaBuilding className="text-indigo-600 text-4xl mx-auto mb-2" />
          <h2 className="text-2xl font-extrabold mb-2 text-gray-800 tracking-wide">Add Flat Details</h2>
          <p className="text-gray-600">Enter the details of the new flat to add it to the system</p>
        </div>

        <div className="space-y-5">
          {/* Wing/Block Selection */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">{isWingOrBlock}</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaBuilding className="text-gray-500" />
              </div>
              <select
                ref={wingBlockRef}
                className={`w-full pl-10 pr-4 py-3 text-gray-800 rounded-lg bg-white border ${formErrors.wing ? "border-red-500" : "border-gray-300"
                  } shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
              >
                <option value="">Select {isWingOrBlock}</option>
                {wings.map(wing => (
                  <option key={wing} value={wing}>{isWingOrBlock} {wing}</option>
                ))}
              </select>
            </div>
            {formErrors.wing && <p className="mt-1 text-sm text-red-600">{formErrors.wing}</p>}
          </div>

          {/* Flat Number Input */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">Flat Number *</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaBuilding className="text-gray-500" />
              </div>
              <input
                type="text"
                ref={flatNumberRef}
                className={`w-full pl-10 pr-4 py-3 text-gray-800 rounded-lg bg-white border ${formErrors.flatNumber ? "border-red-500" : "border-gray-300"
                  } shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                placeholder="e.g., 101"
                name="flatNumber"
              />
            </div>
            {formErrors.flatNumber && <p className="mt-1 text-sm text-red-600">{formErrors.flatNumber}</p>}
          </div>

          {/* Owner Name Input */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">Owner Name *</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaUser className="text-gray-500" />
              </div>
              <input
                type="text"
                ref={flatOwnerRef}
                className={`w-full pl-10 pr-4 py-3 text-gray-800 rounded-lg bg-white border ${formErrors.flatOwner ? "border-red-500" : "border-gray-300"
                  } shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                placeholder="e.g., John Doe"
                name="ownerName"
              />
            </div>
            {formErrors.flatOwner && <p className="mt-1 text-sm text-red-600">{formErrors.flatOwner}</p>}
          </div>

          {/* Owner ID Input */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">Owner ID *</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaIdCard className="text-gray-500" />
              </div>
              <input
                type="text"
                ref={ownerIdRef}
                className={`w-full pl-10 pr-4 py-3 text-gray-800 rounded-lg bg-white border ${formErrors.ownerId ? "border-red-500" : "border-gray-300"
                  } shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                placeholder="e.g., OID12345"
                name="ownerId"
              />
            </div>
            {formErrors.ownerId && <p className="mt-1 text-sm text-red-600">{formErrors.ownerId}</p>}
          </div>

          {/* Flat Size Input */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">Flat Size (sq ft) *</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaRulerCombined className="text-gray-500" />
              </div>
              <input
                type="text"
                ref={flatSizeRef}
                className={`w-full pl-10 pr-4 py-3 text-gray-800 rounded-lg bg-white border ${formErrors.flatSize ? "border-red-500" : "border-gray-300"
                  } shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                placeholder="e.g., 1200"
                name="size"
              />
            </div>
            {formErrors.flatSize && <p className="mt-1 text-sm text-red-600">{formErrors.flatSize}</p>}
          </div>

          {/* Flat Floor Input */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">Floor Number *</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaLayerGroup className="text-gray-500" />
              </div>
              <input
                type="text"
                ref={flatFloorRef}
                className={`w-full pl-10 pr-4 py-3 text-gray-800 rounded-lg bg-white border ${formErrors.flatFloor ? "border-red-500" : "border-gray-300"
                  } shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                placeholder="e.g., 1"
                name="floor"
              />
            </div>
            {formErrors.flatFloor && <p className="mt-1 text-sm text-red-600">{formErrors.flatFloor}</p>}
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              className="w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center"
              onClick={addFlatDetails}
              disabled={loading}
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin mr-2" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <FaCheck className="mr-2" />
                  <span>Add Flat</span>
                </>
              )}
            </button>
          </div>

          <p className="text-center text-sm text-gray-600 mt-4">
            Fields marked with * are required
          </p>
        </div>
      </div>
    </div>
  );
}

export default AddFlatDetails;