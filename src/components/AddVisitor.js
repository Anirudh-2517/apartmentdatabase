import React, { useEffect, useState } from 'react';
import { UserPlus, Calendar, Clock, Building, Phone, FileText, AlertCircle, RefreshCw } from 'lucide-react';
import axios from 'axios';
import QRgenerator from './QRgenerator';
import UseQRReader from './UseQRReader';

const AddVisitors = ({ onVisitorAdded, setScannedData, scannedData, formData, setFormData }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Clear any errors when user starts typing
        if (error) setError(null);
        if (success) setSuccess(false);
    };

    useEffect(() => {
        // Effect when formData changes
        if (scannedData) {
            // Process scanned data if needed
        }
    }, [formData, scannedData]);

    const validateForm = () => {
        // Enhanced validation
        if (!formData.vname?.trim()) return "Visitor name is required";
        if (!formData.flatno?.trim()) return "Flat number is required";
        if (!formData.vcellno?.trim()) return "Contact number is required";
        if (!formData.vdate) return "Visit date is required";
        if (!formData.intime) return "Check-in time is required";
        return null;
    };

    const addVisitor = () => {
        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            return;
        }

        setIsLoading(true);
        setError(null);

        axios.post("http://localhost:9000/api/security/addvisitors", formData)
            .then(() => {
                setSuccess(true);
                if (onVisitorAdded) onVisitorAdded(); // Notify parent to refresh list

                // Reset form after successful submission
                setFormData({
                    vname: "",
                    vcellno: "",
                    flatno: "",
                    vdate: "",
                    vpurpose: "",
                    intime: "",
                    outtime: ""
                });

                // Clear success message after 3 seconds
                setTimeout(() => setSuccess(false), 3000);
            })
            .catch((err) => {
                setError(err.response?.data?.message || "Error adding visitor. Please try again.");
            })
            .finally(() => setIsLoading(false));
    };

    const resetForm = () => {
        setFormData({
            vname: "",
            vcellno: "",
            flatno: "",
            vdate: "",
            vpurpose: "",
            intime: "",
            outtime: ""
        });
        setError(null);
        setSuccess(false);
    };

    // Set today's date as default for date picker
    const today = new Date().toISOString().split('T')[0];

    return (
        <div className="bg-white rounded-lg shadow-lg border border-gray-100">
            {/* Enhanced Header with gradient background */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-t-lg p-5">
                <div className="flex items-center space-x-3">
                    <div className="bg-white p-2 rounded-full shadow-md">
                        <UserPlus className="h-6 w-6 text-blue-600" />
                    </div>
                    <h2 className="text-xl font-semibold text-white">Register New Visitor</h2>
                </div>
                <p className="text-blue-100 ml-11 mt-1 text-sm">Enter visitor details or scan QR code</p>
            </div>

            <div className="px-6 pb-6 pt-4">
                {/* Notification Area */}
                {(error || success) && (
                    <div className={`mb-6 p-4 rounded-lg ${error ? 'bg-red-50 border border-red-200' : 'bg-green-50 border border-green-200'} transition-all duration-300`}>
                        <div className="flex items-start">
                            {error ? (
                                <>
                                    <AlertCircle className="h-5 w-5 mr-3 flex-shrink-0 mt-0.5 text-red-500" />
                                    <span className="text-red-700">{error}</span>
                                </>
                            ) : (
                                <div className="flex items-center text-green-700 w-full justify-between">
                                    <span>Visitor registered successfully!</span>
                                    <span className="text-xs bg-green-100 px-2 py-1 rounded">ID: {Math.floor(Math.random() * 10000)}</span>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                <div className="space-y-5">
                    {/* Form Sections */}
                    <div className="flex flex-col md:flex-row gap-6">
                        {/* Left Section: Inputs */}
                        <div className="md:w-2/3 bg-blue-50 p-4 rounded-lg">
                            <h3 className="text-md font-medium text-blue-700 mb-3">Personal Information</h3>

                            {/* Visitor name */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Visitor's Name</label>
                                <div className="flex shadow-sm">
                                    <span className="inline-flex items-center px-3 bg-gray-100 border border-r-0 border-gray-300 rounded-l-md text-gray-500">
                                        <UserPlus className="h-4 w-4" />
                                    </span>
                                    <input
                                        name="vname"
                                        value={formData.vname || ""}
                                        onChange={handleInputChange}
                                        placeholder="Enter visitor's full name"
                                        className="form-input rounded-r-md block w-full border border-gray-300 focus:ring-blue-500 focus:border-blue-500 px-3 py-2"
                                    />
                                </div>
                            </div>

                            {/* Flat number and Contact */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Flat Number</label>
                                    <div className="flex shadow-sm">
                                        <span className="inline-flex items-center px-3 bg-gray-100 border border-r-0 border-gray-300 rounded-l-md text-gray-500">
                                            <Building className="h-4 w-4" />
                                        </span>
                                        <input
                                            name="flatno"
                                            value={formData.flatno || ""}
                                            onChange={handleInputChange}
                                            placeholder="e.g. A-101"
                                            className="form-input rounded-r-md block w-full border border-gray-300 focus:ring-blue-500 focus:border-blue-500 px-3 py-2"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
                                    <div className="flex shadow-sm">
                                        <span className="inline-flex items-center px-3 bg-gray-100 border border-r-0 border-gray-300 rounded-l-md text-gray-500">
                                            <Phone className="h-4 w-4" />
                                        </span>
                                        <input
                                            name="vcellno"
                                            type="tel"
                                            value={formData.vcellno || ""}
                                            onChange={handleInputChange}
                                            placeholder="Enter contact number"
                                            className="form-input rounded-r-md block w-full border border-gray-300 focus:ring-blue-500 focus:border-blue-500 px-3 py-2"
                                        />
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Visit Date</label>
                                    <div className="flex shadow-sm">
                                        <span className="inline-flex items-center px-3 bg-gray-100 border border-r-0 border-gray-300 rounded-l-md text-gray-500">
                                            <Calendar className="h-4 w-4" />
                                        </span>
                                        <input
                                            name="vdate"
                                            type="date"
                                            value={formData.vdate || today}
                                            onChange={handleInputChange}
                                            className="form-input rounded-r-md block w-full border border-gray-300 focus:ring-blue-500 focus:border-blue-500 px-3 py-2"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Check-in Time</label>
                                        <div className="flex shadow-sm">
                                            <span className="inline-flex items-center px-3 bg-gray-100 border border-r-0 border-gray-300 rounded-l-md text-gray-500">
                                                <Clock className="h-4 w-4" />
                                            </span>
                                            <input
                                                name="intime"
                                                type="time"
                                                value={formData.intime || ""}
                                                onChange={handleInputChange}
                                                className="form-input rounded-r-md block w-full border border-gray-300 focus:ring-blue-500 focus:border-blue-500 px-3 py-2"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Check-out Time</label>
                                        <div className="flex shadow-sm">
                                            <span className="inline-flex items-center px-3 bg-gray-100 border border-r-0 border-gray-300 rounded-l-md text-gray-500">
                                                <Clock className="h-4 w-4" />
                                            </span>
                                            <input
                                                name="outtime"
                                                type="time"
                                                value={formData.outtime || ""}
                                                onChange={handleInputChange}
                                                className="form-input rounded-r-md block w-full border border-gray-300 focus:ring-blue-500 focus:border-blue-500 px-3 py-2"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Purpose of Visit</label>
                                    <div className="flex shadow-sm">
                                        <span className="inline-flex items-center px-3 bg-gray-100 border border-r-0 border-gray-300 rounded-l-md text-gray-500">
                                            <FileText className="h-4 w-4" />
                                        </span>
                                        <textarea
                                            name="vpurpose"
                                            value={formData.vpurpose || ""}
                                            onChange={handleInputChange}
                                            placeholder="Briefly describe the purpose of visit"
                                            rows="3"
                                            className="form-input rounded-r-md block w-full border border-gray-300 focus:ring-blue-500 focus:border-blue-500 px-3 py-2"
                                        />
                                    </div>
                                </div>
                                <div className="w-full sm:w-auto">
                                    <QRgenerator vcellno={formData.vcellno} />
                                </div>
                            </div>
                        </div>

                        {/* Right Section: QR Scanner */}
                        <div className="md:w-1/3">
                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 h-full">
                                <h3 className="text-md font-medium text-gray-700 mb-3 flex items-center">
                                    <span className="mr-2">📱</span> Quick Registration with QR Code
                                </h3>
                                <UseQRReader
                                    formData={formData}
                                    setFormData={setFormData}
                                    setScannedData={setScannedData}
                                    scannedData={scannedData}
                                />
                            </div>
                        </div>
                    </div>
                    {/* Action buttons */}
                    <div className="flex flex-col sm:flex-row items-center gap-3 pt-4">
                        <button
                            onClick={addVisitor}
                            disabled={isLoading}
                            className="w-full sm:flex-1 py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 flex items-center justify-center transition-colors duration-200 shadow-sm"
                        >
                            {isLoading ? (
                                <>
                                    <RefreshCw className="animate-spin h-4 w-4 mr-2" />
                                    Processing...
                                </>
                            ) : (
                                <>
                                    <UserPlus className="h-5 w-5 mr-2" />
                                    Register Visitor
                                </>
                            )}
                        </button>
                        <button
                            onClick={resetForm}
                            className="w-full sm:w-auto py-3 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 flex items-center justify-center"
                        >
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Clear Form
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddVisitors;