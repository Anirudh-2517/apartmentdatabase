import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Maintainance({ oid, username, login }) {
  const [maintainance, setMaintainance] = useState([]);
  const [amount, setAmount] = useState(15000);
  const [currency, setCurrency] = useState('INR');
  const [receipt, setReceipt] = useState('');
  const [orderId, setOrderId] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [selectedYear, setSelectedYear] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: 'year', direction: 'asc' });
  const [filterStatus, setFilterStatus] = useState('all');
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  const payNow = async (M) => {
    try {
      setProcessingPayment(true);
      setMessage("Processing payment...");

      const response = await axios.post(`${API_BASE_URL}/create-order`, {
        amount: parseFloat(M.amount),
        currency,
        receipt,
      });
      if (response.data.success) {
        setOrderId(response.data.orderId);
        launchRazorpay(response.data.orderId, response.data.amount);
      } else {
        setMessage('Failed to create order.');
      }
    } catch (error) {
      console.error('Error creating order:', error);
      setMessage('An error occurred while creating the order.');
    } finally {
      setProcessingPayment(false);
    }

    axios.post(`${API_BASE_URL}/getMaintainance`, { oid: oid, year: M.year, status: "Updated" })
      .then(response => {
        showNotification("Status updated successfully");
      })
      .catch(err => {
        console.log(err);
      });

    const payload1 = {
      amount: amount
    };
    const payload2 = {
      year: M.year,
      username: login
    };

    axios.post(`${API_BASE_URL}/owner/updatepaymentstatus`, payload2)
      .then(response => {
        showNotification("Payment status updated");
      })
      .catch(error => {
        console.log(error);
      });

    axios.post(`${API_BASE_URL}/owner/addamount`, payload1)
      .then(response => {
        showNotification("Amount added successfully");
      })
      .catch(error => {
        console.log(error);
      });
  };
  const showNotification = (msg) => {
    const notification = document.getElementById("notification");
    notification.innerText = msg;
    notification.classList.remove("hidden");
    setTimeout(() => {
      notification.classList.add("hidden");
    }, 3000);
  };
  const launchRazorpay = (orderId, amount) => {
    if (typeof window.Razorpay === 'undefined') {
      console.error('Razorpay SDK not loaded');
      setMessage('Razorpay SDK not loaded.');
      return;
    }

    const options = {
      key: 'rzp_test_FRoCXFr2FkZqrx',
      amount: amount,
      currency: currency,
      name: 'jFork Technology Services',
      description: 'Training and Project Guidance Services',
      order_id: orderId,
      handler: async (response) => {
        try {
          const captureResponse = await axios.post(`${API_BASE_URL}/capture-payment`, {
            paymentId: response.razorpay_payment_id,
            amount: parseFloat(amount),
          });

          if (captureResponse.data.success) {
            setMessage('Payment captured successfully.');
            showNotification('Payment completed successfully!');
          } else {
            setMessage('Payment captured successfully.');
            showNotification('Payment completed successfully!');
          }
        } catch (error) {
          console.error('Error capturing payment:', error);
          setMessage('An error occurred while capturing the payment.');
        }
      },
      prefill: {
        name: 'Sunil Rodd',
        email: 'sfroddjforkts@gmail.com',
        contact: '9480275919',
      },
      theme: {
        color: '#3498db',
      },
    };
    const razorpayInstance = new window.Razorpay(options);
    razorpayInstance.open();
  };
  useEffect(() => {
    setLoading(true);
    axios
      .get(`${API_BASE_URL}/getMaintainance/${oid}`)
      .then((response) => {
        setMaintainance(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching maintenance data:', err);
        setLoading(false);
      });
  }, [oid]);

  const confirmPayment = (M) => {
    setSelectedYear(M);
    setShowConfirmModal(true);
  };
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };
  const sortedMaintenance = [...maintainance].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });
  const filteredMaintenance = sortedMaintenance.filter(item => {
    if (filterStatus === 'all') return true;
    return item.estatus === filterStatus;
  });
  const renderSortIcon = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'asc' ? '↑' : '↓';
  };
  const getTotalAmount = () => {
    return maintainance
      .filter(item => item.estatus === 'Pending')
      .reduce((total, item) => total + parseFloat(item.amount), 0);
  };
  const isPastDue = (dateString) => {
    const dueDate = new Date(dateString);
    const today = new Date();
    return dueDate < today;
  };
  return (
    <div className="bg-white text-gray-800 min-h-screen">
      <div id="notification" className="fixed top-6 right-6 bg-green-500 text-white px-4 py-2 rounded shadow-lg z-50 hidden transition-opacity duration-300">
        Notification message
      </div>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-indigo-700">Maintenance Payments</h1>
          {!loading && (
            <div className="text-right">
              <p className="text-gray-600">Total pending: <span className="font-bold text-indigo-600">₹{getTotalAmount().toLocaleString()}</span></p>
              <p className="text-sm text-gray-500">{maintainance.filter(m => m.estatus === 'Pending').length} pending payments</p>
            </div>
          )}
        </div>
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-3">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-4 py-2 rounded-lg transition-all ${filterStatus === 'all' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            >
              All
            </button>
            <button
              onClick={() => setFilterStatus('Pending')}
              className={`px-4 py-2 rounded-lg transition-all ${filterStatus === 'Pending' ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            >
              Pending
            </button>
            <button
              onClick={() => setFilterStatus('Paid')}
              className={`px-4 py-2 rounded-lg transition-all ${filterStatus === 'Paid' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            >
              Paid
            </button>
          </div>
        </div>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : maintainance.length > 0 ? (
          <div className="overflow-x-auto bg-white rounded-xl shadow-lg">
            <table className="table-auto w-full border-collapse text-sm">
              <thead>
                <tr className="bg-gray-100 text-gray-700 uppercase text-xs">
                  <th className="p-4 text-left cursor-pointer" onClick={() => handleSort('year')}>
                    <div className="flex items-center gap-2">
                      Year {renderSortIcon('year')}
                    </div>
                  </th>
                  <th className="p-4 text-left">Description</th>
                  <th className="p-4 text-left cursor-pointer" onClick={() => handleSort('amount')}>
                    <div className="flex items-center gap-2">
                      Amount {renderSortIcon('amount')}
                    </div>
                  </th>
                  <th className="p-4 text-left cursor-pointer" onClick={() => handleSort('paymentdate')}>
                    <div className="flex items-center gap-2">
                      Due Date {renderSortIcon('paymentdate')}
                    </div>
                  </th>
                  <th className="p-4 text-left cursor-pointer" onClick={() => handleSort('estatus')}>
                    <div className="flex items-center gap-2">
                      Status {renderSortIcon('estatus')}
                    </div>
                  </th>
                  <th className="p-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredMaintenance.map((M, index) => (
                  <tr
                    key={index}
                    className={`border-t border-gray-200 hover:bg-gray-50 transition-colors duration-200`}
                  >
                    <td className="p-4">{M.year}</td>
                    <td className="p-4">{M.paymentdescription}</td>
                    <td className="p-4 font-medium">₹{parseFloat(M.amount).toLocaleString()}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {M.paymentdate}
                        {M.estatus === 'Pending' && isPastDue(M.paymentdate) && (
                          <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded">Overdue</span>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      {M.estatus === 'Pending' ? (
                        <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-medium">Pending</span>
                      ) : (
                        <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-xs font-medium">Paid</span>
                      )}
                    </td>
                    <td className="p-4">
                      {M.estatus === 'Pending' ? (
                        <button
                          disabled={processingPayment}
                          className={`bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition-all duration-300 ${processingPayment ? 'opacity-50 cursor-not-allowed' : ''}`}
                          onClick={() => confirmPayment(M)}
                        >
                          Pay Now
                        </button>
                      ) : (
                        <button className="bg-gray-200 text-gray-500 px-4 py-2 rounded cursor-not-allowed">
                          Paid
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {message && (
              <div className={`p-4 text-center ${message.includes('error') || message.includes('Failed') ? 'text-red-600' : 'text-green-600'}`}>
                {message}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center p-12 bg-gray-50 rounded-xl shadow-inner">
            <p className="text-gray-500 text-lg">No maintenance records available</p>
          </div>
        )}
        {maintainance.some(m => m.estatus === 'Paid') && (
          <div className="mt-12">
            <h2 className="text-xl font-bold text-gray-700 mb-4">Payment History</h2>
            <div className="bg-gray-50 p-4 rounded-xl">
              <ul className="space-y-3">
                {maintainance
                  .filter(m => m.estatus === 'Paid')
                  .map((payment, index) => (
                    <li key={index} className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm">
                      <div>
                        <p className="font-medium">{payment.year} Maintenance</p>
                        <p className="text-sm text-gray-500">{payment.paymentdescription}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600">₹{parseFloat(payment.amount).toLocaleString()}</p>
                        <p className="text-xs text-gray-400">Paid on {payment.paymentdate}</p>
                      </div>
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && selectedYear && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 shadow-xl w-full max-w-md">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Confirm Payment</h3>
            <p className="text-gray-600 mb-4">
              You are about to make a payment of <span className="font-bold text-indigo-600">₹{parseFloat(selectedYear.amount).toLocaleString()}</span> for {selectedYear.year} maintenance.
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Description: {selectedYear.paymentdescription}
            </p>
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                onClick={() => setShowConfirmModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                onClick={() => {
                  setShowConfirmModal(false);
                  payNow(selectedYear);
                }}
              >
                Proceed to Payment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Maintainance;