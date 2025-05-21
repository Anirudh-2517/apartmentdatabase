import React, { useState, useEffect } from 'react';
import axios from 'axios';
function AddExpense() {
  const [expense, setExpense] = useState({
    date: "",
    amount: "",
    description: "",
    status: "",
    modeOfPayment: "",
    personOrAgencyName: "",
    monthOfPayment: "",
    year: ""
  });
  const [loading, setLoading] = useState(false);
  const [agencyList, setAgencyList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newExpenseHead, setNewExpenseHead] = useState("");
  const [notification, setNotification] = useState({ show: false, type: "", message: "" });
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  function getFinancialYear(dateInput) {
    const date = new Date(dateInput); // Convert to Date object if it's a string
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // getMonth() is 0-indexed

    if (month >= 4 && month <= 12) {
      // April to December
      return `${year}-${year + 1}`;
    } else {
      // January to March
      return `${year - 1}-${year}`;
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "personOrAgencyName" && value === "Add New ExpenseHead") {
      setShowModal(true);
    } else {
      setExpense((prev) => ({ ...prev, [name]: value }));
    }
  };
  const handleAddNewExpenseHead = () => {
    if (!newExpenseHead.trim()) return;

    axios.post(`${API_BASE_URL}/secretary/add-expense-head`, {
      newExpenseHead: newExpenseHead.trim()
    })
      .then(() => {
        setAgencyList(prev => [...prev, newExpenseHead.trim()]);
        setExpense(prev => ({ ...prev, personOrAgencyName: newExpenseHead.trim() }));
        setShowModal(false);
        setNewExpenseHead("");
      })
      .catch(err => {
        console.error("Failed to add new expense head:", err);
        alert("Error adding new expense head.");
      });
  };


  useEffect(() => {
    axios.get(`${API_BASE_URL}/secretary/expense-heads`)
      .then((response) => {
        setAgencyList(response.data.expenseheads); // Assuming response = { expenseheads: [...] }
      })
      .catch((error) => {
        console.error("Failed to fetch agency list:", error);
      });
  }, []);

  const handleAddExpense = (event) => {
    event.preventDefault();
    setLoading(true);
    const year = getFinancialYear(expense.date)
    setExpense(prev => ({
      ...prev,
      year: year
    }));
    axios.post(`${API_BASE_URL}/secretary/addExpense`, expense)
      .then(() => {
        setNotification({
          show: true,
          type: "success",
          message: "Expense added successfully!"
        });
        setExpense({
          date: "",
          amount: "",
          description: "",
          status: "",
          modeOfPayment: "",
          personOrAgencyName: "",
          monthOfPayment: "",
          year: year
        });
      })
      .catch((err) => {
        console.error("Error adding expense:", err);
        setNotification({
          show: true,
          type: "error",
          message: "Failed to add expense. Please try again."
        });
      })
      .finally(() => {
        setLoading(false);
        setTimeout(() => setNotification({ show: false, type: "", message: "" }), 3000);
      });
  };

  const paymentModes = ["Cash", "Card", "UPI", "Bank Transfer", "Check", "Other"];
  const statuses = ["Paid", "Pending", "Partially Paid", "Cancelled"];
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {notification.show && (
        <div className={`mb-4 p-4 rounded-lg ${notification.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
          {notification.message}
        </div>
      )}
      <div className="max-w-2xl mx-auto bg-white text-gray-900 p-8 rounded-lg shadow-xl">
        <h2 className="text-center text-2xl font-semibold mb-6 text-blue-600 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z" />
          </svg>
          Add New Expense
        </h2>
        <form className="space-y-6" onSubmit={handleAddExpense}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Expense Date
              </label>
              <input
                type="date"
                name="date"
                value={expense.date}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 rounded-lg bg-gray-50 text-gray-700 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Expense Amount
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">₹</span>
                <input
                  type="number"
                  name="amount"
                  value={expense.amount}
                  onChange={handleInputChange}
                  placeholder="Enter amount"
                  required
                  className="w-full pl-8 px-4 py-2 rounded-lg bg-gray-50 text-gray-700 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
              </svg>
              Description
            </label>
            <textarea
              name="description"
              value={expense.description}
              onChange={handleInputChange}
              placeholder="Describe the expense"
              required
              className="w-full px-4 py-2 rounded-lg bg-gray-50 text-gray-700 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows="3"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Status
              </label>
              <select
                name="status"
                value={expense.status}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 rounded-lg bg-gray-50 text-gray-700 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select status</option>
                {statuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                Mode of Payment
              </label>
              <select
                name="modeOfPayment"
                value={expense.modeOfPayment}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 rounded-lg bg-gray-50 text-gray-700 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select payment mode</option>
                {paymentModes.map(mode => (
                  <option key={mode} value={mode}>{mode}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Person/Agency Name
              </label>
              <select
                name="personOrAgencyName"
                value={expense.personOrAgencyName}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 rounded-lg bg-gray-50 text-gray-700 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select agency/person</option>
                {agencyList.map((name, index) => (
                  <option key={index} value={name}>{name}</option>
                ))}
                <option value="Add New ExpenseHead">➕ Add New ExpenseHead</option>
              </select>

            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Payment Month
              </label>
              <select
                name="monthOfPayment"
                value={expense.monthOfPayment}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 rounded-lg bg-gray-50 text-gray-700 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select month</option>
                {months.map(month => (
                  <option key={month} value={month}>{month}</option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition duration-300 ease-in-out flex items-center justify-center"
          >
            {loading ? (
              <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            )}
            {loading ? "Processing..." : "Add Expense"}
          </button>
        </form>
        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
              <h2 className="text-lg font-semibold mb-4">Add New Expense Head</h2>
              <input
                type="text"
                value={newExpenseHead}
                onChange={(e) => setNewExpenseHead(e.target.value)}
                placeholder="Enter new expense head"
                className="w-full mb-4 px-4 py-2 border rounded-lg"
              />
              <div className="flex justify-end gap-2">
                <button
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                  onClick={() => {
                    setShowModal(false);
                    setNewExpenseHead("");
                  }}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  onClick={handleAddNewExpenseHead}
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default AddExpense;