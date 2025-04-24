import axios from 'axios';
import React, { useState } from 'react';
import { AlertCircle, Check, DollarSign, Calendar, FileText, CreditCard } from 'lucide-react';

function RaiseDemand() {
  const [formData, setFormData] = useState({
    paymentDescription: "Annual Maintenance",
    additionalDetails: "",
    year: "",
    dueDate: "",
    amount: "",
    modeOfPayment: ""
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 5 }, (_, i) => `${currentYear + i}-${currentYear + i + 1}`);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.year) newErrors.year = "Year is required";
    if (!formData.dueDate) newErrors.dueDate = "Due date is required";
    if (!formData.amount) {
      newErrors.amount = "Amount is required";
    } else if (isNaN(formData.amount) || parseFloat(formData.amount) <= 0) {
      newErrors.amount = "Amount must be a positive number";
    }
    if (!formData.modeOfPayment) newErrors.modeOfPayment = "Payment mode is required";
    if (formData.paymentDescription === "Additional Expense" && !formData.additionalDetails) {
      newErrors.additionalDetails = "Description is required for additional expenses";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    setErrorMessage("");
    
    try {
      const payload = {
        paymentdescription: formData.paymentDescription === "Additional Expense"
          ? `${formData.paymentDescription}--${formData.additionalDetails}`
          : formData.paymentDescription,
        year: formData.year,
        paymentdate: formData.dueDate,
        modeofpayment: formData.modeOfPayment,
        amount: formData.amount,
        estatus: "Pending"
      };
      
      const response = await axios.post("http://localhost:9000/api/Raisedemand", payload);
      
      if (response.data.message === "Duplicate year detected in Maintainance field.") {
        setErrorMessage("Duplicate year detected! Please check and try again.");
      } else if (response.data.message === "Demands submitted successfully") {
        setIsSuccess(true);
        // Reset form after successful submission
        setTimeout(() => {
          setFormData({
            paymentDescription: "Annual Maintenance",
            additionalDetails: "",
            year: "",
            dueDate: "",
            amount: "",
            modeOfPayment: ""
          });
          setIsSuccess(false);
        }, 3000);
      } else {
        setErrorMessage(response.data.message);
      }
    } catch (err) {
      console.error(err);
      setErrorMessage(
        err.response?.data?.message
          ? `Error: ${err.response.data.message}`
          : `An unexpected error occurred: ${err.message}`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-6">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-blue-600">Raise Payment Demand</h1>
          <p className="text-gray-500 mt-1">Submit a new payment request</p>
        </div>
        
        {isSuccess && (
          <div className="mb-6 p-3 bg-green-50 border border-green-200 rounded-md flex items-center">
            <Check className="text-green-500 mr-2" size={20} />
            <span className="text-green-700">Demand successfully raised!</span>
          </div>
        )}
        
        {errorMessage && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-md flex items-center">
            <AlertCircle className="text-red-500 mr-2" size={20} />
            <span className="text-red-700">{errorMessage}</span>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-700 mb-1 text-sm font-medium">Payment Type</label>
            <div className="flex items-center">
              <FileText className="text-gray-500 mr-2" size={18} />
              <select
                name="paymentDescription"
                value={formData.paymentDescription}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 bg-white text-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="Annual Maintenance">Annual Maintenance</option>
                <option value="Additional Expense">Additional Expense</option>
              </select>
            </div>
          </div>
          
          {formData.paymentDescription === "Additional Expense" && (
            <div>
              <label className="block text-gray-700 mb-1 text-sm font-medium">Additional Details</label>
              <input
                name="additionalDetails"
                value={formData.additionalDetails}
                onChange={handleChange}
                type="text"
                placeholder="Describe the expense"
                className={`w-full px-4 py-2 border ${
                  errors.additionalDetails ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'
                } text-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
              />
              {errors.additionalDetails && (
                <p className="mt-1 text-sm text-red-600">{errors.additionalDetails}</p>
              )}
            </div>
          )}
          
          <div>
            <label className="block text-gray-700 mb-1 text-sm font-medium">Financial Year</label>
            <div className="flex items-center">
              <Calendar className="text-gray-500 mr-2" size={18} />
              <select
                name="year"
                value={formData.year}
                onChange={handleChange}
                className={`w-full px-4 py-2 border ${
                  errors.year ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'
                } text-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
              >
                <option value="" disabled>Choose Year</option>
                {yearOptions.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
            {errors.year && (
              <p className="mt-1 text-sm text-red-600">{errors.year}</p>
            )}
          </div>
          
          <div>
            <label className="block text-gray-700 mb-1 text-sm font-medium">Due Date</label>
            <div className="flex items-center">
              <Calendar className="text-gray-500 mr-2" size={18} />
              <input
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                type="date"
                className={`w-full px-4 py-2 border ${
                  errors.dueDate ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'
                } text-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
              />
            </div>
            {errors.dueDate && (
              <p className="mt-1 text-sm text-red-600">{errors.dueDate}</p>
            )}
          </div>
          
          <div>
            <label className="block text-gray-700 mb-1 text-sm font-medium">Amount</label>
            <div className="flex items-center">
              <DollarSign className="text-gray-500 mr-2" size={18} />
              <input
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                type="text"
                placeholder="0.00"
                className={`w-full px-4 py-2 border ${
                  errors.amount ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'
                } text-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
              />
            </div>
            {errors.amount && (
              <p className="mt-1 text-sm text-red-600">{errors.amount}</p>
            )}
          </div>
          
          <div>
            <label className="block text-gray-700 mb-1 text-sm font-medium">Payment Mode</label>
            <div className="flex items-center">
              <CreditCard className="text-gray-500 mr-2" size={18} />
              <select
                name="modeOfPayment"
                value={formData.modeOfPayment}
                onChange={handleChange}
                className={`w-full px-4 py-2 border ${
                  errors.modeOfPayment ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'
                } text-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
              >
                <option value="" disabled>Select Payment Mode</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Cash">Cash</option>
                <option value="Check">Check</option>
                <option value="UPI">UPI</option>
              </select>
            </div>
            {errors.modeOfPayment && (
              <p className="mt-1 text-sm text-red-600">{errors.modeOfPayment}</p>
            )}
          </div>
          
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full flex items-center justify-center py-2.5 px-4 rounded-md ${
              isSubmitting 
                ? 'bg-blue-300 text-blue-800 cursor-not-allowed' 
                : 'bg-blue-600 text-white hover:bg-blue-700'
            } transition-colors font-medium mt-2`}
          >
            {isSubmitting ? 'Processing...' : 'Raise Demand'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default RaiseDemand;