import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';

function Employee() {
    const [employees, setEmployee] = useState([]);
    const [financialyear, setFinancialyear] = useState();
    const [expandedEmployee, setExpandedEmployee] = useState(null);
    const [selectedEmpId, setSelectedEmpId] = useState(null);
    const month = useRef("");
    const year = useRef("");
    const amount = useRef("");
    const sstatus = useRef("");
    const saldate = useRef("");

    useEffect(() => {
        axios.get("http://localhost:9000/api/secretary/getfinancialyear")
            .then(response => {
                setFinancialyear(response.data);
            })
            .catch(error => {
                console.log(error);
            });
    }, [financialyear]);

    useEffect(() => {
        axios.get("http://localhost:9000/api/secretary/getallemployees/" + financialyear)
            .then(response => {
                setEmployee(response.data);
            })
            .catch(error => {
                console.log(error);
            });
    }, [employees]);

    const makesalary = (empid) => {
        let month1 = month.current.value;
        let year1 = year.current.value;
        let amount1 = amount.current.value;
        let sstatus1 = sstatus.current.value;
        let saldate1 = saldate.current.value;
        
        if (month1 === "Enter salary month" || year1 === "Enter salary year" || 
            amount1 === "" || sstatus1 === "Enter salary status" || saldate1 === "") {
            alert("All fields are compulsory");
        } else {
            const payload = {
                month: month1,
                year: year1,
                amount: amount1,
                sstatus: sstatus1,
                saldate: saldate1
            };
            
            axios.post("http://localhost:9000/api/secretary/generatesalarydetails", { payload, empid })
                .then(response => {
                    alert("Salary details added successfully!");
                    // Reset form fields
                    month.current.value = "Enter salary month";
                    year.current.value = "Enter salary year";
                    amount.current.value = "";
                    sstatus.current.value = "Enter salary status";
                    saldate.current.value = "";
                    setSelectedEmpId(null);
                })
                .catch(error => {
                    console.log(error);
                    alert("Error adding salary details. Please try again.");
                });
        }
    };

    const toggleEmployeeDetails = (empId) => {
        if (expandedEmployee === empId) {
            setExpandedEmployee(null);
        } else {
            setExpandedEmployee(empId);
        }
    };

    const selectEmployee = (empid) => {
        setSelectedEmpId(empid);
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-center text-blue-800 mb-8">Employee Management System</h1>
            
            {/* Enter Salary Details Section */}
            <div className="bg-white rounded-lg shadow-lg mb-8 overflow-hidden">
                <div className="bg-blue-600 text-white px-6 py-4">
                    <h2 className="text-xl font-semibold">Enter Salary Details</h2>
                    {selectedEmpId && (
                        <span className="text-sm bg-blue-800 px-3 py-1 rounded-full ml-2">
                            Selected Employee ID: {selectedEmpId}
                        </span>
                    )}
                </div>
                
                <div className="p-6 bg-gray-50">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Salary Month</label>
                            <select 
                                ref={month} 
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <option>Enter salary month</option>
                                <option>January</option>
                                <option>February</option>
                                <option>March</option>
                                <option>April</option>
                                <option>May</option>
                                <option>June</option>
                                <option>July</option>
                                <option>August</option>
                                <option>September</option>
                                <option>October</option>
                                <option>November</option>
                                <option>December</option>
                            </select>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Financial Year</label>
                            <select 
                                ref={year} 
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <option>Enter salary year</option>
                                <option>2020-21</option>
                                <option>2021-22</option>
                                <option>2022-23</option>
                                <option>2023-24</option>
                                <option>2024-25</option>
                                <option>2025-26</option>
                                <option>2026-27</option>
                                <option>2027-28</option>
                            </select>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
                            <input
                                type="text"
                                ref={amount}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter salary amount"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                            <select 
                                ref={sstatus} 
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <option>Enter salary status</option>
                                <option>Pending</option>
                                <option>Paid</option>
                            </select>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Salary Date</label>
                            <input
                                type="date"
                                ref={saldate}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        
                        <div className="flex items-end">
                            <button
                                onClick={() => selectedEmpId && makesalary(selectedEmpId)}
                                disabled={!selectedEmpId}
                                className={`px-4 py-2 rounded-md text-white font-medium ${
                                    selectedEmpId 
                                    ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500' 
                                    : 'bg-gray-400 cursor-not-allowed'
                                } focus:outline-none focus:ring-2 focus:ring-offset-2`}
                            >
                                {selectedEmpId ? 'Make Salary' : 'Select Employee'}
                            </button>
                        </div>
                    </div>
                    
                    {!selectedEmpId && (
                        <div className="mt-4 bg-blue-50 border-l-4 border-blue-400 p-4 text-sm text-blue-700">
                            Select an employee from the table below to process salary.
                        </div>
                    )}
                </div>
            </div>
            
            {/* Employee Details Section - Tabular Format */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="bg-blue-600 text-white px-6 py-4">
                    <h2 className="text-xl font-semibold">Employee Details</h2>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-100">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                    Emp ID
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                    Name
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                    Gender
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                    Cell Number
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                    Aadhaar Number
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                    Address
                                </th>
                                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {employees.length > 0 ? (
                                employees.map((employee) => (
                                    <React.Fragment key={employee.empid}>
                                        <tr className={`${selectedEmpId === employee.empid ? 'bg-blue-50' : ''} hover:bg-gray-50`}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {employee.empid}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                                {employee.empname}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                                {employee.empgender}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                                {employee.empcellno}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                                {employee.empaadhaarno}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                                {employee.empaddress}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                                <div className="flex justify-center space-x-2">
                                                    <button
                                                        onClick={() => selectEmployee(employee.empid)}
                                                        className={`px-3 py-1 rounded text-xs font-medium ${
                                                            selectedEmpId === employee.empid
                                                            ? 'bg-blue-600 text-white'
                                                            : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                                                        }`}
                                                    >
                                                        {selectedEmpId === employee.empid ? 'Selected' : 'Select'}
                                                    </button>
                                                    <button
                                                        onClick={() => toggleEmployeeDetails(employee.empid)}
                                                        className="px-3 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700 hover:bg-gray-200"
                                                    >
                                                        {expandedEmployee === employee.empid ? 'Hide' : 'View'} Details
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                        
                                        {/* Expanded Salary Details */}
                                        {expandedEmployee === employee.empid && (
                                            <tr>
                                                <td colSpan="7" className="px-6 py-4 bg-gray-50">
                                                    <div className="border-t border-b border-gray-200 py-3">
                                                        <h4 className="font-medium text-gray-700 mb-3">Salary History</h4>
                                                        
                                                        {employee.empsalarydet.length > 0 ? (
                                                            <table className="min-w-full divide-y divide-gray-200">
                                                                <thead className="bg-blue-600">
                                                                    <tr>
                                                                        <th scope="col" className="px-6 py-2 text-left text-xs font-medium text-white uppercase tracking-wider">
                                                                            Month
                                                                        </th>
                                                                        <th scope="col" className="px-6 py-2 text-left text-xs font-medium text-white uppercase tracking-wider">
                                                                            Year
                                                                        </th>
                                                                        <th scope="col" className="px-6 py-2 text-left text-xs font-medium text-white uppercase tracking-wider">
                                                                            Status
                                                                        </th>
                                                                        <th scope="col" className="px-6 py-2 text-left text-xs font-medium text-white uppercase tracking-wider">
                                                                            Salary Date
                                                                        </th>
                                                                        <th scope="col" className="px-6 py-2 text-left text-xs font-medium text-white uppercase tracking-wider">
                                                                            Amount
                                                                        </th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody className="bg-white divide-y divide-gray-200">
                                                                    {employee.empsalarydet.map((salary) => (
                                                                        <tr key={salary.month + salary.year}>
                                                                            <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-700">
                                                                                {salary.month}
                                                                            </td>
                                                                            <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-700">
                                                                                {salary.year}
                                                                            </td>
                                                                            <td className="px-6 py-3 whitespace-nowrap text-sm">
                                                                                <span className={`px-2 py-1 rounded-full text-xs ${
                                                                                    salary.sstatus === 'Approved' 
                                                                                    ? 'bg-green-100 text-green-800' 
                                                                                    : 'bg-yellow-100 text-yellow-800'
                                                                                }`}>
                                                                                    {salary.sstatus}
                                                                                </span>
                                                                            </td>
                                                                            <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-700">
                                                                                {salary.saldate}
                                                                            </td>
                                                                            <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-700">
                                                                                ₹{salary.amount}
                                                                            </td>
                                                                        </tr>
                                                                    ))}
                                                                </tbody>
                                                            </table>
                                                        ) : (
                                                            <div className="text-sm text-gray-500 italic py-3">
                                                                No salary records found
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                                        No employee records found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default Employee;