import React, { useState } from "react";
import axios from "axios";

function ComplaintFeedback() {
  const [complaint, setComplaint] = useState({
    category: "",
    description: "",
    isAnonymous: false,
    status: "Pending",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState({ show: false, type: "", message: "" });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setComplaint((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 5000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
  
    const payload = {
      category: complaint.category,
      cdescription: complaint.description,
      isAnonymous: complaint.isAnonymous,
      cstatus: "Pending", // Always set to 'Pending'
      submittedAt: new Date().toISOString(), // Add date here
    };
  
    try {
      const response = await axios.post(
        "http://localhost:9000/api/owner/lodgecomplaint",
        payload
      );
      showNotification(response.data.message || "Complaint submitted successfully!", "success");
      setComplaint({
        category: "",
        description: "",
        isAnonymous: false,
        status: "Pending",
      }); // Reset form
    } catch (error) {
      console.error("Error submitting complaint:", error);
      showNotification("Failed to submit complaint. Please try again.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };
  

  const categories = [
    { value: "maintenance", label: "Maintenance" },
    { value: "security", label: "Security" },
    { value: "parking", label: "Parking" },
    { value: "noise", label: "Noise Complaint" },
    { value: "facilities", label: "Facilities" },
    { value: "other", label: "Other" }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      {/* Notification */}
      {notification.show && (
        <div className={`fixed top-4 right-4 px-4 py-3 rounded shadow-lg ${
          notification.type === 'error' ? 'bg-red-100 border-l-4 border-red-500 text-red-700' : 
          'bg-green-100 border-l-4 border-green-500 text-green-700'
        }`}>
          <div className="flex items-center">
            <div className="py-1">
              <svg className={`fill-current h-6 w-6 mr-4 ${
                notification.type === 'error' ? 'text-red-500' : 'text-green-500'
              }`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                {notification.type === 'error' ? (
                  <path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zM11.4 10l2.83-2.83-1.41-1.41L10 8.59 7.17 5.76 5.76 7.17 8.59 10l-2.83 2.83 1.41 1.41L10 11.41l2.83 2.83 1.41-1.41L11.41 10z"/>
                ) : (
                  <path d="M0 11l2-2 5 5L18 3l2 2L7 18z"/>
                )}
              </svg>
            </div>
            <div>
              <p className="font-bold">{notification.type === 'error' ? 'Error' : 'Success'}</p>
              <p className="text-sm">{notification.message}</p>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-lg mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="px-6 py-6 bg-gradient-to-r from-blue-500 to-blue-600">
          <h2 className="text-xl font-bold text-white flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
            </svg>
            Submit Complaint or Feedback
          </h2>
          <p className="mt-1 text-sm text-blue-100">
            Please complete the form below to submit your complaint or feedback
          </p>
        </div>

        <form className="px-6 py-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-5">
            {/* Category Dropdown */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Category *
              </label>
              <select
                id="category"
                name="category"
                value={complaint.category}
                onChange={handleInputChange}
                required
                className="block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              >
                <option value="" disabled>
                  Select a category
                </option>
                {categories.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Description Textarea */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={complaint.description}
                onChange={handleInputChange}
                placeholder="Please provide details about your complaint or feedback..."
                rows="5"
                required
                className="block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              ></textarea>
              <p className="mt-1 text-xs text-gray-500">
                Please be specific and include any relevant details that might help us address your concerns.
              </p>
            </div>

            {/* Anonymity Checkbox */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isAnonymous"
                name="isAnonymous"
                checked={complaint.isAnonymous}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="isAnonymous" className="ml-2 block text-sm text-gray-700">
                Submit this complaint anonymously
              </label>
            </div>

            <div className="text-xs text-gray-500 italic">
              {complaint.isAnonymous ? 
                "Your identity will be kept confidential when submitting this complaint." : 
                "Your identity will be associated with this complaint. Check the box above to submit anonymously."}
            </div>
            
            {/* Divider */}
            <div className="border-t border-gray-200 my-2"></div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 bg-blue-600 rounded-lg shadow-md text-sm font-medium text-white 
                hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150"
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                    Submit Complaint
                  </div>
                )}
              </button>
            </div>
          </div>
        </form>
        
        <div className="px-6 py-4 bg-gray-50 text-center">
          <p className="text-xs text-gray-500">All complaints are reviewed by our management team within 48 hours</p>
        </div>
      </div>
    </div>
  );
}

export default ComplaintFeedback;