import React, { useState, useEffect } from "react";
import axios from "axios";

function Information() {
  const [info, setInfo] = useState([]);
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;


  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/getinfo`)
      .then((response) => {
        setInfo(response.data);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 flex flex-col justify-between">
      <main className="flex-grow flex justify-center items-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-6xl p-4 sm:p-6 bg-white shadow-lg rounded-lg">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-teal-600 text-center mb-6">
            Our recent projects
          </h1>
          <p className="text-gray-700 text-center mb-6 sm:mb-8">
            Explore comprehensive details about your apartment management system.
          </p>
          {info.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {info.map((apartment) => (
                <div
                  key={apartment._id}
                  className="bg-white shadow-md rounded-lg p-4 sm:p-6 hover:shadow-lg hover:scale-105 transition-transform"
                >
                  <h2 className="text-lg sm:text-xl font-bold text-teal-600 mb-2">
                    {apartment.Apartmentname}
                  </h2>
                  <p className="text-gray-600 mb-1">
                    <strong>Address:</strong> {apartment.Address}
                  </p>
                  <p className="text-gray-600 mb-1">
                    <strong>Area Name:</strong> {apartment.AreaName}
                  </p>
                  <p className="text-gray-600 mb-1">
                    <strong>City:</strong> {apartment.City}
                  </p>
                  <p className="text-gray-600 mb-1">
                    <strong>Builder:</strong> {apartment.Buildername}
                  </p>
                  <p className="text-gray-600 mb-1">
                    <strong>Number of Wings:</strong> {apartment.NumberOfWings}
                  </p>
                  <p className="text-gray-600">
                    <strong>Society Name:</strong> {apartment.SocietyName}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center mt-12">
              <p className="text-gray-600 text-lg">Loading apartment data...</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Information;