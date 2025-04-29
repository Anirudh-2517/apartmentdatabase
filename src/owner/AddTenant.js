import React, { useRef, useState } from 'react';
import axios from 'axios';


function AddTenant({oid}) {
    // References for form inputs
    const tname = useRef("");
    const taadhar = useRef("");
    const taddress = useRef("");
    const tcell = useRef("");
    const tod = useRef("");
    const tld = useRef("");
    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
    
    // Form state management
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({});
    const [notification, setNotification] = useState({ show: false, message: '', type: '' });

    // Validate form fields
    const validateForm = () => {
        const newErrors = {};
        
        if (!tname.current.value.trim()) newErrors.tname = "Tenant name is required";
        if (!taadhar.current.value.trim()) newErrors.taadhar = "Aadhar number is required";
        else if (!/^\d{12}$/.test(taadhar.current.value.trim())) newErrors.taadhar = "Aadhar should be 12 digits";
        
        if (!taddress.current.value.trim()) newErrors.taddress = "Address is required";
        
        if (!tcell.current.value.trim()) newErrors.tcell = "Cell number is required";
        else if (!/^\d{10}$/.test(tcell.current.value.trim())) newErrors.tcell = "Enter a valid 10-digit number";
        
        if (!tod.current.value) newErrors.tod = "Occupation date is required";
        
        // Leaving date is optional but if provided, should be after occupation date
        if (tod.current.value && tld.current.value && new Date(tld.current.value) <= new Date(tod.current.value)) {
            newErrors.tld = "Leaving date must be after occupation date";
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Show notification message
    const showNotification = (message, type = 'success') => {
        setNotification({ show: true, message, type });
        setTimeout(() => {
            setNotification({ show: false, message: '', type: '' });
        }, 5000);
    };

    const addtenant = async () => {
        if (!validateForm()) return;
        
        setIsSubmitting(true);
        
        const payload = {
            oid:oid,
            tname: tname.current.value,
            taadhar: taadhar.current.value,
            taddress: taddress.current.value,
            tcell: tcell.current.value,
            tod: tod.current.value,
            tld: tld.current.value,
            tstatus: "Occupied"
        };
        
        try {
            await axios.post(`${API_BASE_URL}/owner/addtenant`, payload);
            showNotification("Tenant added successfully");
            
            // Reset form
            tname.current.value = "";
            taadhar.current.value = "";
            taddress.current.value = "";
            tcell.current.value = "";
            tod.current.value = "";
            tld.current.value = "";
        } catch (error) {
            console.log(error);
            showNotification(error.response?.data?.message || "Failed to add tenant", "error");
        } finally {
            setIsSubmitting(false);
        }
    };

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
                    <h3 className="text-xl font-bold text-white">Add New Tenant</h3>
                    <p className="mt-1 text-sm text-blue-100">
                        Please complete all required fields to register a new tenant
                    </p>
                </div>

                <div className="px-6 py-6">
                    <div className="grid grid-cols-1 gap-5">
                        {/* Tenant Name */}
                        <div>
                            <label htmlFor="tname" className="block text-sm font-medium text-gray-700 mb-1">
                                Tenant Name *
                            </label>
                            <input
                                type="text"
                                id="tname"
                                ref={tname}
                                placeholder="Enter full name"
                                className={`block w-full px-4 py-3 rounded-lg border ${
                                    errors.tname ? 'border-red-300 ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                                } shadow-sm focus:outline-none focus:ring-2 focus:border-transparent transition duration-150`}
                            />
                            {errors.tname && <p className="mt-1 text-sm text-red-600">{errors.tname}</p>}
                        </div>

                        {/* Two fields in one row */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            {/* Aadhar Number */}
                            <div>
                                <label htmlFor="taadhar" className="block text-sm font-medium text-gray-700 mb-1">
                                    Aadhar Number *
                                </label>
                                <input
                                    type="text"
                                    id="taadhar"
                                    ref={taadhar}
                                    placeholder="12-digit number"
                                    maxLength="12"
                                    className={`block w-full px-4 py-3 rounded-lg border ${
                                        errors.taadhar ? 'border-red-300 ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                                    } shadow-sm focus:outline-none focus:ring-2 focus:border-transparent transition duration-150`}
                                />
                                {errors.taadhar && <p className="mt-1 text-sm text-red-600">{errors.taadhar}</p>}
                            </div>

                            {/* Cell Number */}
                            <div>
                                <label htmlFor="tcell" className="block text-sm font-medium text-gray-700 mb-1">
                                    Cell Number *
                                </label>
                                <input
                                    type="tel"
                                    id="tcell"
                                    ref={tcell}
                                    placeholder="10-digit number"
                                    maxLength="10"
                                    className={`block w-full px-4 py-3 rounded-lg border ${
                                        errors.tcell ? 'border-red-300 ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                                    } shadow-sm focus:outline-none focus:ring-2 focus:border-transparent transition duration-150`}
                                />
                                {errors.tcell && <p className="mt-1 text-sm text-red-600">{errors.tcell}</p>}
                            </div>
                        </div>

                        {/* Previous Address */}
                        <div>
                            <label htmlFor="taddress" className="block text-sm font-medium text-gray-700 mb-1">
                                Previous Address *
                            </label>
                            <textarea
                                id="taddress"
                                ref={taddress}
                                rows="2"
                                placeholder="Enter complete previous address"
                                className={`block w-full px-4 py-3 rounded-lg border ${
                                    errors.taddress ? 'border-red-300 ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                                } shadow-sm focus:outline-none focus:ring-2 focus:border-transparent transition duration-150`}
                            ></textarea>
                            {errors.taddress && <p className="mt-1 text-sm text-red-600">{errors.taddress}</p>}
                        </div>

                        {/* Date fields */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div>
                                <label htmlFor="tod" className="block text-sm font-medium text-gray-700 mb-1">
                                    Occupation Date *
                                </label>
                                <input
                                    type="date"
                                    id="tod"
                                    ref={tod}
                                    className={`block w-full px-4 py-3 rounded-lg border ${
                                        errors.tod ? 'border-red-300 ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                                    } shadow-sm focus:outline-none focus:ring-2 focus:border-transparent transition duration-150`}
                                />
                                {errors.tod && <p className="mt-1 text-sm text-red-600">{errors.tod}</p>}
                            </div>

                            <div>
                                <label htmlFor="tld" className="block text-sm font-medium text-gray-700 mb-1">
                                    Leaving Date <span className="text-gray-500 text-xs">(Optional)</span>
                                </label>
                                <input
                                    type="date"
                                    id="tld"
                                    ref={tld}
                                    className={`block w-full px-4 py-3 rounded-lg border ${
                                        errors.tld ? 'border-red-300 ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                                    } shadow-sm focus:outline-none focus:ring-2 focus:border-transparent transition duration-150`}
                                />
                                {errors.tld && <p className="mt-1 text-sm text-red-600">{errors.tld}</p>}
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="px-6 py-4 bg-gray-50 flex justify-between items-center">
                    <p className="text-xs text-gray-500">* Required fields</p>
                    <button
                        onClick={addtenant}
                        disabled={isSubmitting}
                        className={`px-6 py-3 bg-blue-600 rounded-lg shadow-md text-sm font-medium text-white 
                        ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-700'} 
                        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150`}
                    >
                        {isSubmitting ? (
                            <div className="flex items-center">
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Processing...
                            </div>
                        ) : "Add Tenant"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AddTenant;