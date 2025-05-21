import axios from 'axios'
import React, { useEffect, useState } from 'react'
import CollectMaintainence from './CollectMaintainence'

function Paymentdue() {
  const [paymentdues, setPaymentdues] = useState([])
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    axios.get(`${API_BASE_URL}/secretary/paymentdues`)
      .then(response => {
        setPaymentdues(response.data)
      })
      .catch(error => {
        console.log(error)
      })
  }, [paymentdues])
  return (
    <div>
      {(paymentdues && paymentdues.length > 0) ? (paymentdues.map((owner, index) => (
        <div key={index} className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-blue-700 mb-4">
            Maintenance of :- {owner.ofname} {owner.olname} - {owner.oid}
          </h3>
          <div className="flex flex-wrap gap-6">
            {owner.maintainence && owner.maintainence.length > 0 ? (
              owner.maintainence.map((m, idx) => (
                <div
                  key={idx}
                  className="w-full p-4 border rounded-lg bg-gradient-to-br from-blue-100 to-blue-200 shadow-lg hover:scale-105 transition-transform"
                >
                  <h4 className="text-lg font-bold text-blue-600 mb-3">
                    Payment #{idx + 1}
                  </h4>
                  <div className="flex flex-wrap justify-between items-start text-center">
                    <div className="flex flex-col w-1/7">
                      <span className="font-medium text-gray-700">
                        Payment Date
                      </span>
                      <span className="text-gray-800">{m.paymentdate}</span>
                    </div>
                    <div className="flex flex-col w-1/7">
                      <span className="font-medium text-gray-700">Amount</span>
                      <span className="text-gray-800">{m.amount}</span>
                    </div>
                    <div className="flex flex-col w-1/7">
                      <span className="font-medium text-gray-700">Year</span>
                      <span className="text-gray-800">{m.year}</span>
                    </div>
                    <div className="flex flex-col w-1/7">
                      <span className="font-medium text-gray-700">
                        Mode of Payment
                      </span>
                      <span className="text-gray-800">{m.modeofpayment}</span>
                    </div>
                    <div className="flex flex-col w-1/7">
                      <span className="font-medium text-gray-700">Status</span>
                      <span
                        className={`px-2 py-1 rounded text-sm ${m.estatus === "Paid"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                          }`}
                      >
                        {m.estatus}
                      </span>
                    </div>
                    <div className="flex flex-col w-1/7">
                      <span className="font-medium text-gray-700">
                        Description
                      </span>
                      <span className="text-gray-800">{m.paymentdescription}</span>
                    </div>
                  </div>
                  <CollectMaintainence amount={m.amount} paymentdate={m.paymentdate} year={m.year} status={m.estatus} oid={owner.oid} />
                </div>
              ))
            ) : ""}
          </div>
        </div>
      ))
      ) : (
        <p className="text-gray-500 text-center">No owner data available.</p>
      )}
    </div>
  )
}

export default Paymentdue