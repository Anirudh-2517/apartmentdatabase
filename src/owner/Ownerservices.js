import React, { useEffect, useState } from 'react';
import axios from 'axios';

const OwnerServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`http://localhost:9000/api/owner/getOwnerServices`)
      .then((response) => {
        setServices(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching owner services data:', err);
        setError('Failed to load services. Please try again later.');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto my-8 bg-red-50 border-l-4 border-red-500 rounded-md p-6 shadow-md">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-6 w-6 text-red-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-semibold text-red-800">Error</h3>
            <div className="mt-2 text-md text-red-700">
              <p>{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto my-8 bg-white shadow-xl rounded-xl overflow-hidden border border-gray-200">
      <div className="px-8 py-6 bg-gradient-to-r from-blue-600 to-indigo-700 border-b border-gray-200">
        <h2 className="text-2xl leading-8 font-bold text-white">Owner Services Directory</h2>
        <p className="mt-2 max-w-3xl text-md text-blue-100">
          Complete list of service providers registered in the system
        </p>
      </div>

      {services.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-gray-800 text-white">
                <th scope="col" className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider border-r border-gray-700">
                  Service ID
                </th>
                <th scope="col" className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider border-r border-gray-700">
                  Service Type
                </th>
                <th scope="col" className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider border-r border-gray-700">
                  Provider Name
                </th>
                <th scope="col" className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">
                  Contact Number
                </th>
                {/* <th scope="col" className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">
                  Actions
                </th> */}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {services.map((service, index) => (
                <tr
                  key={index}
                  className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50 transition-colors duration-150 ease-in-out`}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 border-r border-gray-200">
                    #{index + 1000}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 border-r border-gray-200">
                    {service.servicename}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 border-r border-gray-200">
                    {service.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    <div className="flex items-center">
                      <svg className="h-4 w-4 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      {service.cellno}
                    </div>
                  </td>
                  {/* <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-1 px-3 rounded text-sm transition duration-150 ease-in-out">
                        Contact
                      </button>
                      <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-1 px-3 rounded text-sm transition duration-150 ease-in-out">
                        Details
                      </button>
                    </div>
                  </td> */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="px-6 py-16 text-center bg-gray-50 border-t border-gray-200">
          <svg
            className="mx-auto h-16 w-16 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900">No services available</h3>
          <p className="mt-2 text-md text-gray-600">No service providers have been added to the system yet.</p>
          <button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-150">
            Add New Service Provider
          </button>
        </div>
      )}

      <div className="px-8 py-4 bg-gray-50 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Showing {services.length} service providers
          </div>
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium py-2 px-4 rounded-md transition-colors duration-150 flex items-center">
            <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add New Provider
          </button>
        </div>
      </div>
    </div>
  );
};

export default OwnerServices;