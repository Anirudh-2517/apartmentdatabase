import React, { useRef } from 'react'
import axios from 'axios'

function Raisecomplaint({ oid }) {
    const cdescription = useRef("")
    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

    const lodgecomplaint = () => {
        let cdescription1 = cdescription.current.value
        let date1 = getCurrentDate()
        let oid1 = oid

        const payload = {
            cdescription: cdescription1,
            date: date1,
            oid: oid1,
            cstatus: "Pending"
        }
        axios.post(`${API_BASE_URL}/owner/lodgecomplaint`, payload)
            .then(response => {
                alert("Your complaint has been sent !!")
            })
            .catch(error => {
                console.log(error)
            })
    }

    const getCurrentDate = () => {
        const today = new Date();
        const day = String(today.getDate()).padStart(2, '0'); // Ensure 2 digits for day
        const month = String(today.getMonth() + 1).padStart(2, '0'); // Ensure 2 digits for month
        const year = today.getFullYear();
        return `${day}-${month}-${year}`;
    }
    var todaysdate = getCurrentDate()
    return (
        <div className="flex flex-col items-center gap-4 p-6 bg-gray-100 rounded-lg shadow-md">
            <h2 className="text-lg font-bold text-gray-700">Raise Complaint</h2>
            <input
                className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your complaint"
                ref={cdescription}
            />
            <button
                className="px-6 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onClick={lodgecomplaint}
            >
                Send Complaint
            </button>
        </div>

    )
}

export default Raisecomplaint