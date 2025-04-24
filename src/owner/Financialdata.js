import React, { useEffect, useState } from 'react';
import axios from 'axios';

function FinancialData() {
    const [financeData, setFinanceData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [yearFilter, setYearFilter] = useState('all');
    const [sortConfig, setSortConfig] = useState({ key: 'financialyear', direction: 'ascending' });

    useEffect(() => {
        setLoading(true);
        axios.get(`http://localhost:9000/api/owner/getfinancedata`)
            .then((response) => {
                setFinanceData(response.data);
                setLoading(false);
            })
            .catch((err) => {
                console.error('Error fetching finance data:', err);
                setError('Failed to load financial data');
                setLoading(false);
            });
    }, []);

    // Format currency values
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(value);
    };

    // Sort data
    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const getSortedData = () => {
        const sortableData = [...financeData];
        if (sortConfig.key) {
            sortableData.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableData;
    };

    // Calculate summary statistics
    const calculateSummary = () => {
        if (financeData.length === 0) return null;
        
        return financeData.reduce((acc, item) => {
            return {
                totalCollected: acc.totalCollected + Number(item.amountcollected),
                totalExpenses: acc.totalExpenses + Number(item.expenses),
                totalExpected: acc.totalExpected + Number(item.amountexpected),
                netBalance: acc.netBalance + Number(item.balance)
            };
        }, { totalCollected: 0, totalExpenses: 0, totalExpected: 0, netBalance: 0 });
    };

    const summary = calculateSummary();

    // Filter data by year
    const filteredData = yearFilter === 'all' 
        ? getSortedData() 
        : getSortedData().filter(item => item.financialyear === yearFilter);

    // Get unique years for filter
    const years = [...new Set(financeData.map(item => item.financialyear))];

    const getSortIcon = (key) => {
        if (sortConfig.key !== key) {
            return (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 opacity-40" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M5 12a1 1 0 102 0V6.414l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L5 6.414V12zM15 8a1 1 0 10-2 0v5.586l-1.293-1.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L15 13.586V8z" />
                </svg>
            );
        }
        return sortConfig.direction === 'ascending' ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
        ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex justify-center items-center">
                <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
                    <p className="mt-4 text-gray-600">Loading financial data...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex justify-center items-center p-4">
                <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg max-w-md text-center shadow-md">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto mb-3 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="text-lg font-bold mb-2">Error Loading Data</h3>
                    <p>{error}</p>
                    <button 
                        onClick={() => window.location.reload()} 
                        className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-150"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-6xl mx-auto">
                <div className="mb-8 text-center">
                    <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-gray-800">
                        Financial Summary
                    </h1>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Detailed breakdown of maintenance payments, expenses, and balances by financial year
                    </p>
                </div>

                {/* Summary Cards */}
                {summary && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
                            <div className="text-sm text-gray-500 mb-1">Total Collected</div>
                            <div className="text-2xl font-bold text-gray-800">{formatCurrency(summary.totalCollected)}</div>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-500">
                            <div className="text-sm text-gray-500 mb-1">Total Expected</div>
                            <div className="text-2xl font-bold text-gray-800">{formatCurrency(summary.totalExpected)}</div>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-red-500">
                            <div className="text-sm text-gray-500 mb-1">Total Expenses</div>
                            <div className="text-2xl font-bold text-gray-800">{formatCurrency(summary.totalExpenses)}</div>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
                            <div className="text-sm text-gray-500 mb-1">Net Balance</div>
                            <div className="text-2xl font-bold text-gray-800">{formatCurrency(summary.netBalance)}</div>
                        </div>
                    </div>
                )}

                {/* Filter and Controls */}
                <div className="flex flex-col sm:flex-row justify-between items-center bg-white p-4 rounded-t-lg shadow-sm border border-gray-200 mb-1">
                    <div className="mb-4 sm:mb-0">
                        <label htmlFor="yearFilter" className="text-sm font-medium text-gray-700 mr-2">
                            Filter by Year:
                        </label>
                        <select
                            id="yearFilter"
                            value={yearFilter}
                            onChange={(e) => setYearFilter(e.target.value)}
                            className="mt-1 block py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        >
                            <option value="all">All Years</option>
                            {years.map(year => (
                                <option key={year} value={year}>{year}</option>
                            ))}
                        </select>
                    </div>
                    <div className="text-gray-600 text-sm">
                        Showing {filteredData.length} of {financeData.length} records
                    </div>
                </div>

                {financeData.length > 0 ? (
                    <div className="bg-white rounded-b-lg shadow-md border border-gray-200 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="bg-gray-100">
                                        <th 
                                            className="p-4 text-left font-bold text-gray-600 border-b border-gray-200 cursor-pointer"
                                            onClick={() => requestSort('financialyear')}
                                        >
                                            <div className="flex items-center">
                                                Financial Year
                                                <span className="ml-1">{getSortIcon('financialyear')}</span>
                                            </div>
                                        </th>
                                        <th 
                                            className="p-4 text-left font-bold text-gray-600 border-b border-gray-200 cursor-pointer"
                                            onClick={() => requestSort('balancecarriedforward')}
                                        >
                                            <div className="flex items-center">
                                                Balance Carried Forward
                                                <span className="ml-1">{getSortIcon('balancecarriedforward')}</span>
                                            </div>
                                        </th>
                                        <th 
                                            className="p-4 text-left font-bold text-gray-600 border-b border-gray-200 cursor-pointer"
                                            onClick={() => requestSort('amountcollected')}
                                        >
                                            <div className="flex items-center">
                                                Amount Collected
                                                <span className="ml-1">{getSortIcon('amountcollected')}</span>
                                            </div>
                                        </th>
                                        <th 
                                            className="p-4 text-left font-bold text-gray-600 border-b border-gray-200 cursor-pointer"
                                            onClick={() => requestSort('amountexpected')}
                                        >
                                            <div className="flex items-center">
                                                Amount Expected
                                                <span className="ml-1">{getSortIcon('amountexpected')}</span>
                                            </div>
                                        </th>
                                        <th 
                                            className="p-4 text-left font-bold text-gray-600 border-b border-gray-200 cursor-pointer"
                                            onClick={() => requestSort('totalamount')}
                                        >
                                            <div className="flex items-center">
                                                Total Amount
                                                <span className="ml-1">{getSortIcon('totalamount')}</span>
                                            </div>
                                        </th>
                                        <th 
                                            className="p-4 text-left font-bold text-gray-600 border-b border-gray-200 cursor-pointer"
                                            onClick={() => requestSort('expenses')}
                                        >
                                            <div className="flex items-center">
                                                Expenses
                                                <span className="ml-1">{getSortIcon('expenses')}</span>
                                            </div>
                                        </th>
                                        <th 
                                            className="p-4 text-left font-bold text-gray-600 border-b border-gray-200 cursor-pointer"
                                            onClick={() => requestSort('balance')}
                                        >
                                            <div className="flex items-center">
                                                Balance
                                                <span className="ml-1">{getSortIcon('balance')}</span>
                                            </div>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredData.map((item, index) => (
                                        <tr 
                                            key={index} 
                                            className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50 transition-colors duration-150`}
                                        >
                                            <td className="p-4 border-b border-gray-100 font-medium">{item.financialyear}</td>
                                            <td className="p-4 border-b border-gray-100">{formatCurrency(item.balancecarriedforward)}</td>
                                            <td className="p-4 border-b border-gray-100 text-green-600 font-medium">{formatCurrency(item.amountcollected)}</td>
                                            <td className="p-4 border-b border-gray-100">{formatCurrency(item.amountexpected)}</td>
                                            <td className="p-4 border-b border-gray-100 font-medium">{formatCurrency(item.totalamount)}</td>
                                            <td className="p-4 border-b border-gray-100 text-red-600 font-medium">{formatCurrency(item.expenses)}</td>
                                            <td className="p-4 border-b border-gray-100 font-medium">{formatCurrency(item.balance)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="bg-gray-50 p-4 text-gray-500 text-sm border-t border-gray-200 flex justify-between items-center">
                            <p>Last updated: {new Date().toLocaleDateString()}</p>
                            <button 
                                className="text-blue-600 hover:text-blue-800 flex items-center"
                                onClick={() => window.print()}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                                </svg>
                                Print Report
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-12 text-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <h3 className="text-xl font-medium text-gray-500 mb-2">No Financial Records Available</h3>
                        <p className="text-gray-500 mb-4">There are no finance records in the system at this time.</p>
                        <button 
                            onClick={() => window.location.reload()} 
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Refresh Data
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default FinancialData;