import React, { useState, useEffect } from "react";
import axios from "axios";

const TempDisplay = () => {
  const [temperatureData, setTemperatureData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTemperature = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:9000/temperature"); // Replace with your backend URL
        setTemperatureData(response.data);
      } catch (err) {
        setError("Failed to fetch temperature data");
      } finally {
        setLoading(false);
      }
    };

    // Fetch data on component mount
    fetchTemperature();

    // Optional: Refresh data every 6 seconds
    const interval = setInterval(fetchTemperature, 6000);

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);

  // Determine circle color based on temperature
  const getCircleColor = (temperature) => {
    if (temperature <= 32) return "green";
    if (temperature > 32 && temperature <= 35) return "blue";
    return "red";
  };

  const getTemperatureStatus = (temperature) => {
    if (temperature <= 32) return "Optimal";
    if (temperature > 32 && temperature <= 35) return "Moderate";
    return "High";
  };

  // Improved Thermometer Icon
  const TemperatureIcon = ({ color }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 9.5V17a2 2 0 1 0 0-4" fill={color} stroke={color} />
      <path d="M12 13V3.5" stroke={color} />
      <path d="M12 3.5a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0z" fill={color} stroke={color} />
      <path d="M14.5 5.5a2.5 2.5 0 0 1 0 5h-5a2.5 2.5 0 0 1 0-5h5z" fill="none" stroke={color} />
      <circle cx="12" cy="17" r="4" fill="none" stroke={color} />
    </svg>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40 bg-gray-50 rounded-lg shadow p-6">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
          <p className="mt-3 text-gray-600 font-medium">Loading temperature data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded shadow">
        <div className="flex items-center">
          <div className="flex-shrink-0 text-red-500">
            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-red-700">{error}</p>
          </div>
        </div>
        <button 
          className="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    );
  }

  const currentTemp = temperatureData.length > 0 ? temperatureData[0].temperature : null;

  return (
    <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 text-white">
        <div className="flex items-center">
          <div className="mr-4">
            {currentTemp && (
              <div className="relative">
                <TemperatureIcon color="white" />
              </div>
            )}
          </div>
          <h1 className="text-2xl font-bold">Solar Heater Temperature</h1>
          {currentTemp && (
            <div className="ml-auto flex items-baseline">
              <span className="text-3xl font-bold">{currentTemp}°C</span>
              <span className="ml-2 text-lg opacity-80">{getTemperatureStatus(currentTemp)}</span>
            </div>
          )}
        </div>
      </div>

      <div className="p-4">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-semibold text-gray-700">Historical Readings</h2>
          <div className="text-sm text-gray-500">
            Auto-updates every 6 seconds
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-3 mb-4">
          <div className="flex space-x-4">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-green-500 mr-1"></div>
              <span className="text-sm text-gray-600">≤ 32°C (Optimal)</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-blue-500 mr-1"></div>
              <span className="text-sm text-gray-600">33-35°C (Moderate)</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-red-500 mr-1"></div>
              <span className="text-sm text-gray-600">&gt; 35°C (High)</span>
            </div>
          </div>
        </div>

        {temperatureData.length > 0 ? (
          <div className="max-h-48 overflow-y-auto pr-2">
            <div className="grid grid-cols-2 gap-3">
              {temperatureData.map((item, index) => (
                index > 0 && (
                  <div 
                    key={index} 
                    className="p-3 rounded-lg border-l-4 hover:bg-gray-50 transition-colors flex items-center"
                    style={{ borderLeftColor: getCircleColor(item.temperature) }}
                  >
                    <div 
                      className="w-8 h-8 rounded-full mr-3 flex items-center justify-center text-white"
                      style={{ backgroundColor: getCircleColor(item.temperature) }}
                    >
                      <TemperatureIcon color="white" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">{new Date(item.time).toLocaleString()}</div>
                      <div className="font-semibold">{item.temperature}°C</div>
                    </div>
                  </div>
                )
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-6 text-gray-500">
            <svg className="mx-auto h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="mt-2 font-medium">No data available</p>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-gray-200">
        <div className="flex justify-center">
          <img
            src='/solar.jpg'
            alt='Solar heater system'
            className="rounded-lg shadow-md"
            style={{
              height: '35vh',
              width: '100%',
              objectFit: 'cover'
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default TempDisplay;