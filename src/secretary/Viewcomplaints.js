import React, { useEffect, useState } from 'react'
import axios from 'axios'

function Viewcomplaints() {
  const [complaints, setComplaints] = useState([])
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    axios.get(`${API_BASE_URL}/secretary/getlodgedcomplaints`)
      .then(response => {
        setComplaints(response.data)
      })
      .catch(error => {
        console.log(error)
      })
  }, [])
  

  return (
    <div className="p-6 bg-gray-100 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold p-3 text-center">
        View Complaints
      </h1>

      <ul className="space-y-6">
        {/* Outer List Item (Heading Row) */}
        <li className="p-4 bg-blue-600 text-white rounded-lg shadow-sm">
          <div className="grid grid-cols-12 gap-4">
            <span className="col-span-3 text-sm font-semibold">Date</span>
            <span className="col-span-5 text-sm font-semibold">Description</span>
            <span className="col-span-2 text-sm font-semibold">Status</span>
            <span className="col-span-2 text-sm font-semibold">Action</span>
          </div>
        </li>

        {/* Complaints List */}
        {complaints.map((c, index) => (
          <li
            key={index}
            className="p-4 bg-white border border-gray-300 rounded-lg shadow-sm hover:shadow-md"
          >
            <div className="grid grid-cols-12 gap-4">
              {/* Date */}
              <span className="col-span-3 text-sm text-gray-700">{c.date}</span>

              {/* Description */}
              <span className="col-span-5 text-sm text-gray-700 truncate">
                {c.cdescription}
              </span>

              {/* Status */}
              <span
                className={`col-span-2 text-sm font-semibold px-3 py-1 rounded-lg ${c.cstatus === "Resolved"
                    ? "bg-green-200 text-green-600"
                    : "bg-red-100 text-red-600"
                  }`}
              >
                {c.cstatus}
              </span>

              {/* Resolve Button */}
              <button
                className="col-span-2 px-4 py-2 text-sm font-medium text-white bg-green-500 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400"
                // onClick={() => handleResolve(index)}
              >
                Resolve
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>


  )
}

export default Viewcomplaints