import axios from "axios";
import React, { useRef } from "react";

function AddFlatOwner() {
  const Oname = useRef("");
  const FlatNumber = useRef("");
  const contact = useRef("");

  const addFlatOwner = () => {
    const Oname1 = Oname.current.value;
    const FlatNumber1 = FlatNumber.current.value;
    const contact1 = contact.current.value;

    const payload = {
      Oname: Oname1,
      FlatNumber: FlatNumber1,
      contact: contact1,
    };

    axios
      .post(`${API_BASE_URL}/insertFlatOwner`, payload)
      .then((response) => {
        alert("Owner Inserted");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="max-w-lg mx-auto bg-gradient-to-r from-blue-500 to-blue-700 p-8 rounded-lg shadow-md">
      <h2 className="text-white text-2xl font-bold mb-6 text-center">
        Add Flat Owner
      </h2>
      <div className="space-y-5">
        {/* Owner Name Input */}
        <div className="relative">
          <input
            type="text"
            className="w-full px-4 py-3 text-gray-700 rounded-lg border border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-300 shadow-md"
            placeholder="Owner Name"
            name="name"
            ref={Oname}
          />
        </div>

        {/* Flat Number Input */}
        <div className="relative">
          <input
            type="text"
            className="w-full px-4 py-3 text-gray-700 rounded-lg border border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-300 shadow-md"
            placeholder="Flat Number"
            name="flatNumber"
            ref={FlatNumber}
          />
        </div>

        <div className="relative">
          <input
            type="text"
            className="w-full px-4 py-3 text-gray-700 rounded-lg border border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-300 shadow-md"
            placeholder="Contact Number"
            name="contact"
            ref={contact}
          />
        </div>

        {/* Submit Button */}
        <div className="text-center">
          <button
            className="w-full px-4 py-3 font-medium text-white bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg shadow-lg hover:from-blue-700 hover:to-blue-900 focus:outline-none focus:ring-4 focus:ring-blue-500"
            onClick={addFlatOwner}
          >
            Add Owner
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddFlatOwner;
