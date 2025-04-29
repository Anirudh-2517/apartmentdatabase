import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

function Apartment() {
  const Aname = useRef("");
  const Address = useRef("");
  const Area = useRef("");
  const City = useRef("");
  const Buildername = useRef("");
  const NumWings = useRef("");
  const SocietyName = useRef("");

  const [apartmentData, setApartmentData] = useState(null); // State to store fetched data
  const [isLoading, setIsLoading] = useState(true); // State to show loading indicator

  // Fetch apartment data for updating (if needed)
  useEffect(() => {
    const fetchApartmentData = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/getAptname`);
        setApartmentData(response.data[0]);
        Aname.current.value = response.data[0].Apartmentname;
        Address.current.value = response.data[0].Address;
        Area.current.value = response.data[0].AreaName;
        City.current.value = response.data[0].City;
        Buildername.current.value = response.data[0].Buildername;
        NumWings.current.value = response.data[0].NumberOfWings;
        SocietyName.current.value = response.data[0].SocietyName;
      } catch (err) {
        console.error("Error fetching apartment data:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchApartmentData();
  }, []);

  const handleFormSubmit = async () => {
    const payload = {
      Apartmentname: Aname.current.value,
      Address: Address.current.value,
      AreaName: Area.current.value,
      City: City.current.value,
      Buildername: Buildername.current.value,
      NumberOfWings: NumWings.current.value,
      SocietyName: SocietyName.current.value,
    };

    if (Object.values(payload).some((field) => field === "")) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      if (!apartmentData) {
        // Add new apartment data
        const response = await axios.post(`${API_BASE_URL}/insertApartmentData`, payload);
        alert("Apartment data inserted successfully!");
      } else {
        // Update existing apartment data
        const response = await axios.post(`${API_BASE_URL}/updateApartmentData`, payload);
        alert("Apartment details updated successfully!");
      }
    } catch (err) {
      console.error("Error handling form submission:", err);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
        {apartmentData ? "Update Apartment Details" : "Add Apartment Details"}
      </h2>

      {isLoading ? (
        <div className="text-center text-gray-500">Loading...</div>
      ) : (
        <form className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Apartment Name:</label>
            <input
              type="text"
              ref={Aname}
              placeholder="Enter apartment name"
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Address:</label>
            <input
              type="text"
              ref={Address}
              placeholder="Enter address"
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Area Name:</label>
            <input
              type="text"
              ref={Area}
              placeholder="Enter area name"
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">City:</label>
            <input
              type="text"
              ref={City}
              placeholder="Enter city"
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Builder Name:</label>
            <input
              type="text"
              ref={Buildername}
              placeholder="Enter builder name"
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Number of Wings:</label>
            <input
              type="number"
              ref={NumWings}
              placeholder="Enter number of wings"
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Society Name:</label>
            <input
              type="text"
              ref={SocietyName}
              placeholder="Enter society name"
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <button
            type="button"
            onClick={handleFormSubmit}
            className="w-full px-4 py-2 font-semibold text-white bg-gradient-to-r from-teal-500 to-teal-600 rounded-md shadow-lg hover:from-teal-600 hover:to-teal-700 focus:outline-none focus:ring-4 focus:ring-teal-300"
          >
            {apartmentData ? "Update Apartment Details" : "Submit Apartment Details"}
          </button>
        </form>
      )}
    </div>
  );
}

export default Apartment;
