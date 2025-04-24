import axios from 'axios';
import React, { useRef, useState } from 'react';

function CollectMaintenance({ amount, paymentdate, year, status, oid }) {
  const modeofpayment = useRef("");
  const paymentdescription = useRef("");
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });

  const receivepayment = () => {
    setIsLoading(true);
    let modeofpayment1 = modeofpayment.current.value;
    let paymentdescription1 = paymentdescription.current.value;

    if (!modeofpayment1) {
      setNotification({ show: true, message: "Please enter mode of payment", type: "error" });
      setIsLoading(false);
      return;
    }
    const payload = {
      oid: oid,
      year:year,
      modeofpayment: modeofpayment1,
      paymentdescription: paymentdescription1,
      estatus: "Paid"
    };
    axios.post("http://localhost:9000/api/secretary/recievepayment", payload)
      .then(response => {
        const { message, data } = response.data;
        setNotification({ show: true, message: message, type: "success" });
        console.log("Updated data:", data);
        
        modeofpayment.current.value = "";
        paymentdescription.current.value = "";
      })
      .catch(error => {
        if (error.response) {
          setNotification({ 
            show: true, 
            message: error.response.data.message || "Something went wrong", 
            type: "error" 
          });
        }
        // Network error or no response
        else if (error.request) {
          setNotification({ 
            show: true, 
            message: "Server not responding. Please try again later.", 
            type: "error" 
          });
        }
        // Other errors
        else {
          setNotification({ 
            show: true, 
            message: "Unexpected error occurred.", 
            type: "error" 
          });
        }
      })
      .finally(() => {
        setIsLoading(false);
        // Auto-hide notification after 5 seconds
        setTimeout(() => {
          setNotification({ show: false, message: "", type: "" });
        }, 5000);
      });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4 border border-gray-200">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Payment Details</h2>
        <div className="text-xs font-medium px-2 py-1 rounded-full bg-blue-100 text-blue-800">
          {status}
        </div>
      </div>

      {/* Payment Info Grid */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="col-span-1">
          <div className="grid grid-cols-1 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Payment Date</label>
              <input 
                value={paymentdate} 
                disabled 
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-700"
              />
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Amount</label>
              <input 
                value={amount} 
                disabled 
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-700"
              />
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Year</label>
              <input 
                value={year} 
                disabled 
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-700"
              />
            </div>
          </div>
        </div>
        
        <div className="col-span-1">
          <div className="grid grid-cols-1 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Mode of Payment*</label>
              <select
                ref={modeofpayment}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                defaultValue=""
              >
                <option value="" disabled>Select payment mode</option>
                <option value="Cash">Cash</option>
                <option value="Credit Card">Credit Card</option>
                <option value="Debit Card">Debit Card</option>
                <option value="UPI">UPI</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Check">Check</option>
              </select>
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Payment Description</label>
              <textarea
                ref={paymentdescription}
                placeholder="Enter payment details, reference number, etc."
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows="3"
              ></textarea>
            </div>
          </div>
        </div>
      </div>

      {/* Notification banner */}
      {notification.show && (
        <div className={`p-3 mb-4 rounded-md ${
          notification.type === "success" ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"
        }`}>
          <div className="flex">
            <div className="flex-shrink-0">
              {notification.type === "success" ? (
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <div className="ml-3">
              <p className="text-sm">{notification.message}</p>
            </div>
          </div>
        </div>
      )}

      {/* Action Button */}
      <div className="flex justify-end mt-2">
        <button
          onClick={receivepayment}
          disabled={isLoading}
          className={`flex items-center px-4 py-2 ${
            isLoading ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
          } text-white font-medium rounded-lg shadow transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500`}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </>
          ) : (
            <>
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              Receive Payment
            </>
          )}
        </button>
      </div>
    </div>
  );
}

// Component to display multiple maintenance entries in a parent component
export function MaintenanceEntries({ entries }) {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Maintenance Collection</h1>
      
      {entries && entries.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {entries.map((entry) => (
            <div key={entry.oid} className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center">
                    <span className="text-lg font-semibold text-gray-900">₹{entry.amount}</span>
                    <span className={`ml-3 px-2 py-1 text-xs font-medium rounded-full ${
                      entry.status === "Paid" 
                        ? "bg-green-100 text-green-800" 
                        : "bg-yellow-100 text-yellow-800"
                    }`}>
                      {entry.status}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500">{entry.year}</span>
                </div>
                
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>Due: {entry.paymentdate}</span>
                </div>
                
                {entry.status !== "Paid" && (
                  <CollectMaintenance 
                    amount={entry.amount}
                    paymentdate={entry.paymentdate}
                    year={entry.year}
                    status={entry.status}
                    oid={entry.oid}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <p className="text-gray-500">No maintenance entries found</p>
        </div>
      )}
    </div>
  );
}

export default CollectMaintenance;