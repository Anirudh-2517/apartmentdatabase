import axios from 'axios';
import React, { useRef, useState } from 'react';
import { FaCalendarAlt, FaMoneyBillWave, FaCheck, FaBuilding, FaHome } from 'react-icons/fa';

function AdminSettings() {
  const financialYearRef = useRef("");
  const annualMaintenanceRef = useRef("");
  const apartmentNameRef = useRef("");
  const [selectedWingOrBlock, setSelectedWingOrBlock] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState({ show: false, message: "" });

  const showSuccess = (message) => {
    setSuccessMessage({ show: true, message });
    setTimeout(() => {
      setSuccessMessage({ show: false, message: "" });
    }, 3000);
  };

  const handleWingOrBlockChange = (event) => {
    setSelectedWingOrBlock(event.target.value);
  };

  const setMaintenanceAmount = async () => {
    const amount = annualMaintenanceRef.current.value;
    if (!amount || isNaN(amount)) {
      alert("Please enter a valid maintenance amount");
      return;
    }

    setLoading(true);
    try {
      const payload = { annualmaintainence: amount };
      await axios.post("http://localhost:9000/api/admin/setannualmaintainence", payload);
      showSuccess("Annual maintenance amount set successfully!");
      annualMaintenanceRef.current.value = "";
    } catch (error) {
      console.error("Error setting maintenance amount:", error);
      alert("Failed to set maintenance amount. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const setWingsOrBlocks = async () => {
    if (!selectedWingOrBlock) {
      alert("Please select Wings or Blocks");
      return;
    }

    setLoading(true);
    try {
      const payload = { Blocks: selectedWingOrBlock };
      await axios.post("http://localhost:9000/api/admin/setblocksorwings", payload);
      showSuccess("Wings/Blocks setting updated successfully!");
      setSelectedWingOrBlock("");
    } catch (error) {
      console.error("Error setting wings/blocks:", error);
      alert("Failed to update wings/blocks setting. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const setFinancialYear = async () => {
    const year = financialYearRef.current.value;
    if (!year) {
      alert("Please enter a financial year");
      return;
    }

    setLoading(true);
    try {
      const payload = { financialyear: year };
      await axios.post("http://localhost:9000/api/admin/setfinancialyear", payload);
      showSuccess("Financial year set successfully!");
      financialYearRef.current.value = "";
    } catch (error) {
      console.error("Error setting financial year:", error);
      alert("Failed to set financial year. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const setApartmentName = async () => {
    const aptName = apartmentNameRef.current.value;
    if (!aptName) {
      alert("Please enter an apartment name");
      return;
    }

    setLoading(true);
    try {
      const payload = { Apartmentname: aptName };
      await axios.post("http://localhost:9000/api/admin/setapartmentname", payload);
      showSuccess("Apartment name set successfully!");
      apartmentNameRef.current.value = "";
    } catch (error) {
      console.error("Error setting apartment name:", error);
      alert("Failed to set apartment name. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-50">
      {/* Success Message */}
      {successMessage.show && (
        <div className="fixed top-4 right-4 z-50 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded shadow-md flex items-center transition-all duration-500">
          <FaCheck className="mr-2" />
          {successMessage.message}
        </div>
      )}

      <h1 className="text-2xl font-bold text-gray-800 mb-6">Administrative Settings</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Financial Year Card - Blue */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-blue-700 px-6 py-4">
            <div className="flex items-center space-x-3">
              <div className="bg-white p-2 rounded-full">
                <FaCalendarAlt className="text-blue-600 text-xl" />
              </div>
              <h2 className="text-xl font-semibold text-white">Financial Year</h2>
            </div>
          </div>

          <div className="p-6">
            <p className="text-gray-600 mb-4">
              Set the current financial year for all accounting and reporting purposes.
            </p>

            <div className="mb-4">
              <label htmlFor="financialyear" className="block text-sm font-medium text-gray-700 mb-2">
                Financial Year Format
              </label>
              <input
                ref={financialYearRef}
                id="financialyear"
                placeholder="e.g., 2024-25"
                className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-700"
              />
              <p className="mt-1 text-xs text-gray-500">Enter the financial year in YYYY-YY format</p>
            </div>

            <button
              onClick={setFinancialYear}
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white py-3 px-4 rounded-md shadow hover:from-blue-600 hover:to-blue-800 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 focus:outline-none flex items-center justify-center space-x-2 transition-all"
            >
              {loading ? (
                <span className="animate-pulse">Processing...</span>
              ) : (
                <>
                  <FaCalendarAlt className="text-white" />
                  <span>Set Financial Year</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Maintenance Amount Card - Pink and Purple */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-pink-500 to-purple-600 px-6 py-4">
            <div className="flex items-center space-x-3">
              <div className="bg-white p-2 rounded-full">
                <FaMoneyBillWave className="text-pink-500 text-xl" />
              </div>
              <h2 className="text-xl font-semibold text-white">Maintenance Fee</h2>
            </div>
          </div>

          <div className="p-6">
            <p className="text-gray-600 mb-4">
              Set the annual maintenance amount that will be charged to all residents.
            </p>

            <div className="mb-4">
              <label htmlFor="maintenanceAmount" className="block text-sm font-medium text-gray-700 mb-2">
                Annual Maintenance Amount
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">₹</span>
                </div>
                <input
                  ref={annualMaintenanceRef}
                  id="maintenanceAmount"
                  type="text"
                  placeholder="0.00"
                  className="block w-full pl-8 pr-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500 text-gray-700"
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">Enter amount in Rupees</p>
            </div>

            <button
              onClick={setMaintenanceAmount}
              disabled={loading}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 px-4 rounded-md shadow hover:from-pink-600 hover:to-purple-700 focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 focus:outline-none flex items-center justify-center space-x-2 transition-all"
            >
              {loading ? (
                <span className="animate-pulse">Processing...</span>
              ) : (
                <>
                  <FaMoneyBillWave className="text-white" />
                  <span>Set Maintenance Amount</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Apartment Name Card - Dark Blue and Purple */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-800 to-purple-800 px-6 py-4">
            <div className="flex items-center space-x-3">
              <div className="bg-white p-2 rounded-full">
                <FaBuilding className="text-indigo-700 text-xl" />
              </div>
              <h2 className="text-xl font-semibold text-white">Set Apartment Name</h2>
            </div>
          </div>

          <div className="p-6">
            <p className="text-gray-600 mb-4">
              Set the apartment name that will be displayed throughout the system.
            </p>

            <div className="mb-4">
              <label htmlFor="apartmentName" className="block text-sm font-medium text-gray-700 mb-2">
                Apartment Name Setting
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaBuilding className="text-gray-400" />
                </div>
                <input
                  ref={apartmentNameRef}
                  id="apartmentName"
                  type="text"
                  placeholder="Enter apartment name"
                  className="block w-full pl-8 pr-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-gray-700"
                />
              </div>
            </div>

            <button
              onClick={setApartmentName}
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-800 to-purple-800 text-white py-3 px-4 rounded-md shadow hover:from-indigo-900 hover:to-purple-900 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 focus:outline-none flex items-center justify-center space-x-2 transition-all"
            >
              {loading ? (
                <span className="animate-pulse">Processing...</span>
              ) : (
                <>
                  <FaBuilding className="text-white" />
                  <span>Set Apartment Name</span>
                </>
              )}
            </button>
          </div>
        </div>
        
        {/* Wings/Blocks Card - Dark Blue and Dark Green */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-blue-800 to-green-800 px-6 py-4">
            <div className="flex items-center space-x-3">
              <div className="bg-white p-2 rounded-full">
                <FaHome className="text-blue-700 text-xl" />
              </div>
              <h2 className="text-xl font-semibold text-white">Set Wings/Blocks</h2>
            </div>
          </div>

          <div className="p-6">
            <p className="text-gray-600 mb-4">
              Choose whether your apartment uses Wings or Blocks for organization.
            </p>

            <div className="mb-4">
              <label htmlFor="wingsBlocks" className="block text-sm font-medium text-gray-700 mb-2">
                Wings/Blocks Setting
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaHome className="text-gray-400" />
                </div>
                <select
                  id="wingsBlocks"
                  className="block w-full pl-8 pr-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-700"
                  value={selectedWingOrBlock}
                  onChange={handleWingOrBlockChange}
                >
                  <option value="" disabled>Select Wings or Blocks</option>
                  <option value="Wings">Wings</option>
                  <option value="Blocks">Blocks</option>
                </select>
              </div>
            </div>
            
            <button
              onClick={setWingsOrBlocks}
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-800 to-green-800 text-white py-3 px-4 rounded-md shadow hover:from-blue-900 hover:to-green-900 focus:ring-2 focus:ring-green-700 focus:ring-opacity-50 focus:outline-none flex items-center justify-center space-x-2 transition-all"
            >
              {loading ? (
                <span className="animate-pulse">Processing...</span>
              ) : (
                <>
                  <FaHome className="text-white" />
                  <span>Set Wings or Blocks</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminSettings;