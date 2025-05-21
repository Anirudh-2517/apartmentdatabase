import React, { useState } from 'react';
import axios from 'axios';
import { AlertCircle, Check, ChevronRight, ArrowLeft, Home, Calendar, User, Mail, Phone, Briefcase, CreditCard, MapPin, DollarSign } from 'lucide-react';

const BookFlat = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    panCard: '',
    aadharNumber: '',
    address: '',
    occupation: '',
    income: '',
    bookingDate: '',
    bhk: '',
    flatType: '',
    pricePerSqft: '',
  });

  const [step, setStep] = useState(1); // 1 = personal info, 2 = property details, 3 = confirmation
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Labels for better presentation in confirmation
  const fieldLabels = {
    fullName: 'Full Name',
    email: 'Email Address',
    phone: 'Phone Number',
    panCard: 'PAN Card Number',
    aadharNumber: 'Aadhaar Number',
    address: 'Current Address',
    occupation: 'Occupation',
    income: 'Monthly Income',
    bookingDate: 'Booking Date',
    bhk: 'BHK',
    flatType: 'Flat Type',
    pricePerSqft: 'Price per Sqft',
  };

  const validateForm = (data, currentStep) => {
    const newErrors = {};

    if (currentStep === 1) {
      if (!data.fullName.trim()) newErrors.fullName = 'Name is required';
      if (!data.email.trim()) newErrors.email = 'Email is required';
      else if (!/\S+@\S+\.\S+/.test(data.email)) newErrors.email = 'Email is invalid';

      if (!data.phone.trim()) newErrors.phone = 'Phone number is required';
      else if (!/^\d{10}$/.test(data.phone)) newErrors.phone = 'Please enter a valid 10-digit number';

      if (!data.panCard.trim()) newErrors.panCard = 'PAN card number is required';
      else if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(data.panCard)) newErrors.panCard = 'Invalid PAN card format';

      if (!data.aadharNumber.trim()) newErrors.aadharNumber = 'Aadhaar number is required';
      else if (!/^\d{12}$/.test(data.aadharNumber)) newErrors.aadharNumber = 'Aadhaar must be 12 digits';

      if (!data.address.trim()) newErrors.address = 'Address is required';
      if (!data.occupation.trim()) newErrors.occupation = 'Occupation is required';

      if (!data.income.trim()) newErrors.income = 'Income is required';
      else if (isNaN(Number(data.income))) newErrors.income = 'Please enter a valid number';
    } else if (currentStep === 2) {
      if (!data.bookingDate) newErrors.bookingDate = 'Booking date is required';
      if (!data.bhk) newErrors.bhk = 'Please select BHK';
      if (!data.flatType) newErrors.flatType = 'Please select flat type';

      if (!data.pricePerSqft.trim()) newErrors.pricePerSqft = 'Price per sqft is required';
      else if (isNaN(Number(data.pricePerSqft))) newErrors.pricePerSqft = 'Please enter a valid number';
    }

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear error for this field when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const nextStep = () => {
    const validationErrors = validateForm(formData, step);

    if (Object.keys(validationErrors).length === 0) {
      setStep(prev => prev + 1);
      window.scrollTo(0, 0);
    } else {
      setErrors(validationErrors);
    }
  };

  const prevStep = () => {
    setStep(prev => prev - 1);
    window.scrollTo(0, 0);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    nextStep();
  };

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    try {
      await axios.post(`${process.env.REACT_APP_API_BASE_URL}/owner/book-flat`, formData);
      setSubmitSuccess(true);
      setTimeout(() => {
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          panCard: '',
          aadharNumber: '',
          address: '',
          occupation: '',
          income: '',
          bookingDate: '',
          bhk: '',
          flatType: '',
          pricePerSqft: '',
        });
        setStep(1);
        setSubmitSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Error submitting booking:', error);
      setErrors({ submit: 'Failed to submit booking. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Improved Form Step 1 with two inputs per row where appropriate
  const renderFormStep1 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-800 mb-4">Personal Information</h3>

      {/* Full Name (Single row) */}
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">Full Name</label>
        <div className="flex relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
            <User size={16} />
          </div>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className={`pl-10 w-full border rounded-md p-2 shadow-sm ${errors.fullName ? 'border-red-500' : 'border-gray-300'}`}
          />
        </div>
        {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
      </div>

      {/* Email and Phone in one row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">Email Address</label>
          <div className="flex relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
              <Mail size={16} />
            </div>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`pl-10 w-full border rounded-md p-2 shadow-sm ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
            />
          </div>
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">Phone Number</label>
          <div className="flex relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
              <Phone size={16} />
            </div>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={`pl-10 w-full border rounded-md p-2 shadow-sm ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
            />
          </div>
          {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
        </div>
      </div>

      {/* PAN and Aadhaar in one row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">PAN Card Number</label>
          <div className="flex relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
              <CreditCard size={16} />
            </div>
            <input
              type="text"
              name="panCard"
              value={formData.panCard}
              onChange={handleChange}
              className={`pl-10 w-full border rounded-md p-2 shadow-sm ${errors.panCard ? 'border-red-500' : 'border-gray-300'}`}
            />
          </div>
          {errors.panCard && <p className="text-red-500 text-xs mt-1">{errors.panCard}</p>}
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">Aadhaar Number</label>
          <div className="flex relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
              <CreditCard size={16} />
            </div>
            <input
              type="text"
              maxLength="12"
              name="aadharNumber"
              value={formData.aadharNumber}
              onChange={handleChange}
              className={`pl-10 w-full border rounded-md p-2 shadow-sm ${errors.aadharNumber ? 'border-red-500' : 'border-gray-300'}`}
            />
          </div>
          {errors.aadharNumber && <p className="text-red-500 text-xs mt-1">{errors.aadharNumber}</p>}
        </div>
      </div>

      {/* Current Address (Single row) */}
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">Current Address</label>
        <div className="flex relative">
          <div className="absolute top-3 left-0 pl-3 flex items-start pointer-events-none text-gray-500">
            <MapPin size={16} />
          </div>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            rows="3"
            className={`pl-10 w-full border rounded-md p-2 shadow-sm ${errors.address ? 'border-red-500' : 'border-gray-300'}`}
          ></textarea>
        </div>
        {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
      </div>

      {/* Occupation and Income in one row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">Occupation</label>
          <div className="flex relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
              <Briefcase size={16} />
            </div>
            <input
              type="text"
              name="occupation"
              value={formData.occupation}
              onChange={handleChange}
              className={`pl-10 w-full border rounded-md p-2 shadow-sm ${errors.occupation ? 'border-red-500' : 'border-gray-300'}`}
            />
          </div>
          {errors.occupation && <p className="text-red-500 text-xs mt-1">{errors.occupation}</p>}
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">Monthly Income (₹)</label>
          <div className="flex relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
              <DollarSign size={16} />
            </div>
            <input
              type="text"
              name="income"
              value={formData.income}
              onChange={handleChange}
              className={`pl-10 w-full border rounded-md p-2 shadow-sm ${errors.income ? 'border-red-500' : 'border-gray-300'}`}
            />
          </div>
          {errors.income && <p className="text-red-500 text-xs mt-1">{errors.income}</p>}
        </div>
      </div>
    </div>
  );

  // Improved Form Step 2 with two inputs per row
  const renderFormStep2 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-800 mb-4">Property Details</h3>

      {/* Date and Price in one row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">Booking Date</label>
          <div className="flex relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
              <Calendar size={16} />
            </div>
            <input
              type="date"
              name="bookingDate"
              value={formData.bookingDate}
              onChange={handleChange}
              className={`pl-10 w-full border rounded-md p-2 shadow-sm ${errors.bookingDate ? 'border-red-500' : 'border-gray-300'}`}
            />
          </div>
          {errors.bookingDate && <p className="text-red-500 text-xs mt-1">{errors.bookingDate}</p>}
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">Price per Sqft (₹)</label>
          <div className="flex relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
              <DollarSign size={16} />
            </div>
            <input
              type="text"
              name="pricePerSqft"
              value={formData.pricePerSqft}
              onChange={handleChange}
              className={`pl-10 w-full border rounded-md p-2 shadow-sm ${errors.pricePerSqft ? 'border-red-500' : 'border-gray-300'}`}
            />
          </div>
          {errors.pricePerSqft && <p className="text-red-500 text-xs mt-1">{errors.pricePerSqft}</p>}
        </div>
      </div>

      {/* BHK and Flat Type in one row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">BHK Type</label>
          <div className="flex relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
              <Home size={16} />
            </div>
            <select
              name="bhk"
              value={formData.bhk}
              onChange={handleChange}
              className={`pl-10 w-full border rounded-md p-2 shadow-sm appearance-none bg-white ${errors.bhk ? 'border-red-500' : 'border-gray-300'}`}
            >
              <option value="">Select BHK</option>
              <option value="1 BHK">1 BHK</option>
              <option value="2 BHK">2 BHK</option>
              <option value="3 BHK">3 BHK</option>
              <option value="4+ BHK">4+ BHK</option>
            </select>
          </div>
          {errors.bhk && <p className="text-red-500 text-xs mt-1">{errors.bhk}</p>}
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">Flat Type</label>
          <div className="flex relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
              <Home size={16} />
            </div>
            <select
              name="flatType"
              value={formData.flatType}
              onChange={handleChange}
              className={`pl-10 w-full border rounded-md p-2 shadow-sm appearance-none bg-white ${errors.flatType ? 'border-red-500' : 'border-gray-300'}`}
            >
              <option value="">Select Flat Type</option>
              <option value="Built-up">Built-up</option>
              <option value="Furnished">Furnished</option>
              <option value="Semi-Furnished">Semi-Furnished</option>
              <option value="Unfurnished">Unfurnished</option>
            </select>
          </div>
          {errors.flatType && <p className="text-red-500 text-xs mt-1">{errors.flatType}</p>}
        </div>
      </div>
    </div>
  );

  // Success view
  if (submitSuccess) {
    return (
      <div className="container mx-auto p-4 max-w-2xl">
        <div className="bg-green-50 border border-green-200 p-6 rounded-lg text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-green-100 p-3 rounded-full">
              <Check className="text-green-600" size={32} />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-green-800">Booking Successful!</h2>
          <p className="text-green-700 mt-2">Your flat booking has been submitted successfully.</p>
          <p className="text-green-600 mt-6">You will receive a confirmation email shortly.</p>
        </div>
      </div>
    );
  }

  // Confirmation view
  if (step === 3) {
    const formatValue = (key, value) => {
      if (key === 'income' || key === 'pricePerSqft') {
        return `₹${value}`;
      }
      return value || '—';
    };

    return (
      <div className="container mx-auto p-4 max-w-2xl">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Confirm Your Details</h2>
          <p className="text-gray-600">Please review your information before submitting</p>
        </div>

        {errors.submit && (
          <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg mb-6 flex items-center gap-2">
            <AlertCircle size={20} className="text-red-500" />
            <p>{errors.submit}</p>
          </div>
        )}

        <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-200">
          <div className="divide-y divide-gray-200">
            <div className="p-4 bg-gray-50">
              <h3 className="text-lg font-medium text-gray-800">Personal Information</h3>
            </div>

            {/* Two column layout for confirmation details . */}
            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-200">
              <div>
                {['fullName', 'email', 'phone', 'panCard'].map(key => (
                  <div key={key} className="flex p-4">
                    <div className="w-1/3 text-gray-600">{fieldLabels[key]}</div>
                    <div className="w-2/3 font-medium">{formatValue(key, formData[key])}</div>
                  </div>
                ))}
              </div>
              <div>
                {['aadharNumber', 'occupation', 'income', 'address'].map(key => (
                  <div key={key} className="flex p-4">
                    <div className="w-1/3 text-gray-600">{fieldLabels[key]}</div>
                    <div className="w-2/3 font-medium">{formatValue(key, formData[key])}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 bg-gray-50">
              <h3 className="text-lg font-medium text-gray-800">Property Details</h3>
            </div>

            {/* Two column layout for property details */}
            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-200">
              <div>
                {['bookingDate', 'bhk'].map(key => (
                  <div key={key} className="flex p-4">
                    <div className="w-1/3 text-gray-600">{fieldLabels[key]}</div>
                    <div className="w-2/3 font-medium">{formatValue(key, formData[key])}</div>
                  </div>
                ))}
              </div>
              <div>
                {['flatType', 'pricePerSqft'].map(key => (
                  <div key={key} className="flex p-4">
                    <div className="w-1/3 text-gray-600">{fieldLabels[key]}</div>
                    <div className="w-2/3 font-medium">{formatValue(key, formData[key])}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-between">
          <button
            onClick={prevStep}
            className="flex items-center gap-2 bg-white border border-gray-300 text-gray-800 px-4 py-2 rounded-md shadow-sm hover:bg-gray-50 transition-colors"
            disabled={isSubmitting}
          >
            <ArrowLeft size={16} />
            Edit Details
          </button>
          <button
            onClick={handleFinalSubmit}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md shadow-sm hover:bg-blue-700 transition-colors"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Processing...' : 'Confirm & Submit'}
            {isSubmitting ? null : <ChevronRight size={16} />}
          </button>
        </div>
      </div>
    );
  }

  // Main form view
  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Book Your Dream Flat</h2>
        <p className="text-gray-600 mt-1">Please fill out the form to book your flat</p>
      </div>

      {/* Progress indicator */}
      <div className="mb-8">
        <div className="relative">
          <div className="flex justify-between mb-2">
            <div className={`text-sm font-medium ${step >= 1 ? 'text-blue-600' : 'text-gray-500'}`}>Personal Info</div>
            <div className={`text-sm font-medium ${step >= 2 ? 'text-blue-600' : 'text-gray-500'}`}>Property Details</div>
            <div className={`text-sm font-medium ${step >= 3 ? 'text-blue-600' : 'text-gray-500'}`}>Confirmation</div>
          </div>
          <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
            <div className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-600 transition-all"
              style={{ width: `${((step - 1) / 2) * 100}%` }}></div>
          </div>
        </div>
      </div>

      <form onSubmit={handleFormSubmit} className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        {step === 1 && renderFormStep1()}
        {step === 2 && renderFormStep2()}

        <div className="mt-8 flex justify-between">
          {step > 1 && (
            <button
              type="button"
              onClick={prevStep}
              className="flex items-center gap-2 bg-white border border-gray-300 text-gray-800 px-4 py-2 rounded-md shadow-sm hover:bg-gray-50 transition-colors"
            >
              <ArrowLeft size={16} />
              Previous
            </button>
          )}

          <button
            type={step < 2 ? "button" : "submit"}
            onClick={step < 2 ? nextStep : undefined}
            className={`flex items-center gap-2 ${step === 1 && !step > 1 ? 'w-full justify-center' : 'ml-auto'} bg-blue-600 text-white px-4 py-2 rounded-md shadow-sm hover:bg-blue-700 transition-colors`}
          >
            {step < 2 ? 'Next' : 'Review Information'}
            <ChevronRight size={16} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default BookFlat;