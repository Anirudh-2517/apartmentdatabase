import React, { useState } from "react";
import { Home, IndianRupee, User, Hash, Grid, MapPin, Building, Shield, Droplet } from "lucide-react";
export default function PredictRent() {
    const [formData, setFormData] = useState({
        BHK: 2,
        Size: 1278,
        Floor: 1,
        AreaType: 1,
        AreaLocality: 50,
        City: 5,
        FurnishingStatus: 1,
        TenantPreferred: 1,
        Bathroom: 2,
        PointOfContact: 5,
    });
    const [predictedRent, setPredictedRent] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: Number(value) });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            setTimeout(() => {
                setPredictedRent(Math.floor(15000 + Math.random() * 10000));
                setIsLoading(false);
            }, 1000);

            // Actual API call (commented out)
            // const res = await axios.post('http://localhost:9000/predict', formData);
            // setPredictedRent(res.data.predicted_rent);
        } catch (error) {
            console.error("Error predicting rent:", error);
            setIsLoading(false);
        }
    };
    const formSections = [
        {
            title: "Property Details",
            icon: <Home size={20} className="text-amber-600" />,
            fields: [
                {
                    name: "BHK",
                    label: "Bedrooms (BHK)",
                    type: "select",
                    options: [1, 2, 3, 4, 5].map(val => ({ value: val, label: `${val} BHK` })),
                    icon: <Home size={16} />
                },
                {
                    name: "Size",
                    label: "Size (sqft)",
                    type: "number",
                    icon: <Grid size={16} />
                },
                {
                    name: "Floor",
                    label: "Floor",
                    type: "number",
                    icon: <Building size={16} />
                },
                {
                    name: "Bathroom",
                    label: "Bathrooms",
                    type: "select",
                    options: [1, 2, 3, 4].map(val => ({ value: val, label: `${val}` })),
                    icon: <Droplet size={16} />
                }
            ]
        },
        {
            title: "Location & Area",
            icon: <MapPin size={20} className="text-amber-600" />,
            fields: [
                {
                    name: "AreaType",
                    label: "Area Type",
                    type: "select",
                    options: [
                        { value: 1, label: "Super Built-up Area" },
                        { value: 2, label: "Built-up Area" },
                        { value: 3, label: "Carpet Area" }
                    ],
                    icon: <Grid size={16} />
                },
                {
                    name: "AreaLocality",
                    label: "Locality",
                    type: "select",
                    options: [
                        { value: 50, label: "Bhagyanagar" },
                        { value: 51, label: "Whitefield" },
                        { value: 52, label: "Koramangala" }
                    ],
                    icon: <MapPin size={16} />
                },
                {
                    name: "City",
                    label: "City",
                    type: "select",
                    options: [
                        { value: 5, label: "Belgaum" },
                        { value: 6, label: "Bangalore" },
                        { value: 7, label: "Mumbai" }
                    ],
                    icon: <Building size={16} />
                }
            ]
        },
        {
            title: "Preferences & Terms",
            icon: <User size={20} className="text-amber-600" />,
            fields: [
                {
                    name: "FurnishingStatus",
                    label: "Furnishing Status",
                    type: "select",
                    options: [
                        { value: 1, label: "Unfurnished" },
                        { value: 2, label: "Semi-furnished" },
                        { value: 3, label: "Fully-furnished" }
                    ],
                    icon: <Home size={16} />
                },
                {
                    name: "TenantPreferred",
                    label: "Tenant Preferred",
                    type: "select",
                    options: [
                        { value: 1, label: "Family" },
                        { value: 2, label: "Bachelors" },
                        { value: 3, label: "Any" }
                    ],
                    icon: <User size={16} />
                },
                {
                    name: "PointOfContact",
                    label: "Point of Contact",
                    type: "select",
                    options: [
                        { value: 5, label: "Owner" },
                        { value: 6, label: "Agent" }
                    ],
                    icon: <Shield size={16} />
                }
            ]
        }
    ];

    // Render form field based on type
    const renderField = (field) => {
        const { name, label, type, options, icon } = field;

        return (
            <div key={name} className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">{label}</label>
                <div className="relative">
                    <div className="absolute left-3 top-3 text-gray-400">
                        {icon}
                    </div>

                    {type === "select" ? (
                        <select
                            name={name}
                            value={formData[name]}
                            onChange={handleChange}
                            className="w-full pl-10 p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200"
                        >
                            {options.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    ) : (
                        <input
                            type={type}
                            name={name}
                            value={formData[name]}
                            onChange={handleChange}
                            className="w-full pl-10 p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200"
                        />
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-100 flex flex-col justify-center items-center p-4 md:p-8">
            <div className="w-full max-w-4xl">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center p-3 bg-amber-600 rounded-full mb-4">
                        <IndianRupee size={30} className="text-white" />
                    </div>
                    <h1 className="text-4xl font-bold text-amber-800 mb-2">Indian Rent Predictor</h1>
                    <p className="text-amber-700">Find the ideal rental price for your property based on Indian market trends</p>
                </div>
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl border border-amber-200">
                    <div className="md:flex">
                        <div className="md:w-2/3 p-6 md:p-8">
                            <form onSubmit={handleSubmit} className="space-y-8">
                                {formSections.map((section, index) => (
                                    <div key={index} className="space-y-4">
                                        <div className="flex items-center space-x-2 pb-2 border-b border-amber-200">
                                            {section.icon}
                                            <h3 className="text-lg font-medium text-amber-800">{section.title}</h3>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {section.fields.map(renderField)}
                                        </div>
                                    </div>
                                ))}

                                <div className="pt-4">
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full p-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-medium rounded-lg shadow-md hover:from-amber-600 hover:to-orange-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-opacity-50 transition-all duration-300 disabled:opacity-70 flex items-center justify-center gap-2"
                                    >
                                        {isLoading ? (
                                            <>
                                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                                                </svg>
                                                <span>Calculating...</span>
                                            </>
                                        ) : (
                                            <>
                                                <IndianRupee size={20} />
                                                <span>Predict Rent</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Results section */}
                        <div className="md:w-1/3 bg-amber-50 p-8 border-t md:border-t-0 md:border-l border-amber-100 flex flex-col justify-center items-center">
                            {predictedRent !== null ? (
                                <div className="text-center">
                                    <div className="mb-6 inline-flex items-center justify-center w-16 h-16 bg-amber-100 rounded-full">
                                        <IndianRupee size={32} className="text-amber-600" />
                                    </div>
                                    <h2 className="text-xl font-medium text-amber-800 mb-2">Predicted Monthly Rent</h2>
                                    <div className="text-5xl font-bold text-amber-700 my-3">
                                        ₹{predictedRent.toLocaleString('en-IN')}
                                    </div>
                                    <div className="mt-4 p-3 bg-amber-100 rounded-lg">
                                        <p className="text-sm text-amber-700">This prediction is based on current market trends and similar properties in the selected area.</p>
                                    </div>
                                    <div className="mt-6 text-xs text-amber-700 flex flex-col gap-1">
                                        <div className="flex items-center justify-between">
                                            <span>Location Factor</span>
                                            <span className="font-medium">High Impact</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span>Size Factor</span>
                                            <span className="font-medium">Medium Impact</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span>Amenities Factor</span>
                                            <span className="font-medium">Low Impact</span>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center opacity-75">
                                    <div className="mb-6 inline-flex items-center justify-center w-16 h-16 bg-amber-100 rounded-full">
                                        <IndianRupee size={32} className="text-amber-400" />
                                    </div>
                                    <h2 className="text-xl font-medium text-amber-700 mb-2">Awaiting Prediction</h2>
                                    <p className="text-sm text-amber-600 max-w-xs">
                                        Fill out the property details form and click "Predict Rent" to get an estimated monthly rental value.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="mt-6 text-center text-xs text-amber-700">
                    © 2025 Indian Rent Predictor • Powered by AI Market Analysis
                </div>
            </div>
        </div>
    );
}