import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Users, Search, Printer, Filter, RefreshCw, Calendar, Download, ChevronDown, ChevronUp } from 'lucide-react';

const DisplayVisitors = () => {
    const [visitors, setVisitors] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [sortField, setSortField] = useState('vdate');
    const [sortDirection, setSortDirection] = useState('desc');
    const [filterDate, setFilterDate] = useState('');
    const [filterFlat, setFilterFlat] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const printRef = useRef();
    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;


    const fetchVisitors = () => {
        setIsLoading(true);
        axios.get(`${API_BASE_URL}/security/getallvisitors`)
            .then(response => {
                setVisitors(response.data);
                setIsLoading(false);
            })
            .catch(error => {
                console.log(error);
                setIsLoading(false);
            });
    };

    useEffect(() => {
        fetchVisitors();
    }, []);

    // Get unique flat numbers for filter dropdown
    const uniqueFlats = [...new Set(visitors.map(visitor => visitor.flatno))].sort();

    // Filtered visitors based on search term and filters
    const filteredVisitors = visitors.filter(visitor => {
        const matchesSearch = 
            visitor.vname.toLowerCase().includes(searchTerm.toLowerCase()) ||
            visitor.flatno.includes(searchTerm) ||
            visitor.vpurpose.toLowerCase().includes(searchTerm.toLowerCase()) ||
            visitor.vcellno.includes(searchTerm);
            
        const matchesDateFilter = filterDate ? visitor.vdate === filterDate : true;
        const matchesFlatFilter = filterFlat ? visitor.flatno === filterFlat : true;
        
        return matchesSearch && matchesDateFilter && matchesFlatFilter;
    });

    // Sort visitors
    const sortedVisitors = [...filteredVisitors].sort((a, b) => {
        if (a[sortField] < b[sortField]) return sortDirection === 'asc' ? -1 : 1;
        if (a[sortField] > b[sortField]) return sortDirection === 'asc' ? 1 : -1;
        return 0;
    });

    // Handle sort toggle
    const handleSort = (field) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    // Handle print function
    const handlePrint = () => {
        const printContent = document.getElementById('printable-area');
        const originalContents = document.body.innerHTML;
        
        document.body.innerHTML = `
            <div style="padding: 20px;">
                <h1 style="text-align: center; margin-bottom: 20px;">Visitors Log</h1>
                ${printContent.innerHTML}
            </div>
        `;
        
        window.print();
        document.body.innerHTML = originalContents;
        window.location.reload();
    };

    // Export to CSV
    const exportToCSV = () => {
        const headers = ['Name', 'Contact', 'Flat', 'Purpose', 'Check In', 'Check Out', 'Date'];
        
        const csvRows = [
            headers.join(','),
            ...sortedVisitors.map(visitor => [
                `"${visitor.vname}"`, 
                `"${visitor.vcellno}"`, 
                `"${visitor.flatno}"`, 
                `"${visitor.vpurpose}"`,
                `"${visitor.intime}"`,
                `"${visitor.outtime}"`,
                `"${visitor.vdate}"`
            ].join(','))
        ];
        
        const csvString = csvRows.join('\n');
        const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `visitors_log_${new Date().toLocaleDateString()}.csv`);
        link.style.visibility = 'hidden';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Clear all filters
    const clearFilters = () => {
        setSearchTerm("");
        setFilterDate("");
        setFilterFlat("");
    };

    return (
        <div className="bg-white rounded-lg shadow-lg border border-gray-100">
            {/* Header with gradient background */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-t-lg">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
                    <div className="flex items-center space-x-3">
                        <div className="bg-white p-2 rounded-full">
                            <Users className="h-6 w-6 text-blue-600" />
                        </div>
                        <h2 className="text-xl font-semibold">Visitors Log</h2>
                    </div>
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="flex items-center space-x-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded"
                        >
                            <Filter className="h-4 w-4" />
                            <span>Filters</span>
                        </button>
                        <button
                            onClick={handlePrint}
                            className="flex items-center space-x-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded"
                            title="Print Visitor Log"
                        >
                            <Printer className="h-4 w-4" />
                            <span className="hidden sm:inline">Print</span>
                        </button>
                        <button
                            onClick={exportToCSV}
                            className="flex items-center space-x-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded"
                            title="Export to CSV"
                        >
                            <Download className="h-4 w-4" />
                            <span className="hidden sm:inline">Export</span>
                        </button>
                        <button
                            onClick={fetchVisitors}
                            className="flex items-center space-x-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded"
                            title="Refresh Data"
                        >
                            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                            <span className="hidden sm:inline">Refresh</span>
                        </button>
                    </div>
                </div>
            </div>
            
            <div className="p-4">
                {/* Search and filters */}
                <div className="mb-4">
                    <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
                        <div className="relative flex-grow">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by name, flat, purpose or phone..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        {searchTerm || filterDate || filterFlat ? (
                            <button
                                onClick={clearFilters}
                                className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center"
                            >
                                Clear Filters
                            </button>
                        ) : null}
                    </div>
                </div>

                {/* Advanced filters */}
                {showFilters && (
                    <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Date</label>
                                <div className="flex items-center">
                                    <span className="bg-gray-100 p-2 rounded-l-md border border-r-0 border-gray-300">
                                        <Calendar className="h-5 w-5 text-gray-500" />
                                    </span>
                                    <input
                                        type="date"
                                        value={filterDate}
                                        onChange={(e) => setFilterDate(e.target.value)}
                                        className="flex-grow border border-gray-300 rounded-r-md p-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Flat</label>
                                <select
                                    value={filterFlat}
                                    onChange={(e) => setFilterFlat(e.target.value)}
                                    className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="">All Flats</option>
                                    {uniqueFlats.map(flat => (
                                        <option key={flat} value={flat}>{flat}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                )}

                {/* Table */}
                <div className="overflow-x-auto border border-gray-200 rounded-lg shadow-sm" ref={printRef}>
                    <div id="printable-area">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th 
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                        onClick={() => handleSort('vname')}
                                    >
                                        <div className="flex items-center space-x-1">
                                            <span>Name</span>
                                            {sortField === 'vname' && (
                                                sortDirection === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                                            )}
                                        </div>
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Contact
                                    </th>
                                    <th 
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                        onClick={() => handleSort('flatno')}
                                    >
                                        <div className="flex items-center space-x-1">
                                            <span>Flat</span>
                                            {sortField === 'flatno' && (
                                                sortDirection === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                                            )}
                                        </div>
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Purpose
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Time
                                    </th>
                                    <th 
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                        onClick={() => handleSort('vdate')}
                                    >
                                        <div className="flex items-center space-x-1">
                                            <span>Date</span>
                                            {sortField === 'vdate' && (
                                                sortDirection === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                                            )}
                                        </div>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {isLoading ? (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-4 text-center">
                                            <div className="flex justify-center items-center">
                                                <RefreshCw className="animate-spin h-5 w-5 mr-2 text-blue-500" />
                                                <span>Loading visitors...</span>
                                            </div>
                                        </td>
                                    </tr>
                                ) : sortedVisitors.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                                            No visitors found matching your criteria
                                        </td>
                                    </tr>
                                ) : (
                                    sortedVisitors.map((visitor, index) => (
                                        <tr key={index} className="hover:bg-blue-50 transition-colors duration-150">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {visitor.vname}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {visitor.vcellno}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {visitor.flatno}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {visitor.vpurpose}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                <span className="text-green-600">{visitor.intime}</span> - <span className="text-red-600">{visitor.outtime}</span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {visitor.vdate}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
                
                {/* Footer with summary */}
                <div className="mt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center text-sm text-gray-600">
                    <div>
                        <span className="font-medium">{filteredVisitors.length}</span> visitors {filterDate || filterFlat || searchTerm ? "matching filters" : "found"}
                        {filteredVisitors.length !== visitors.length && (
                            <span> out of <span className="font-medium">{visitors.length}</span> total</span>
                        )}
                    </div>
                    <div className="mt-2 sm:mt-0">
                        Last updated: {new Date().toLocaleString()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DisplayVisitors;