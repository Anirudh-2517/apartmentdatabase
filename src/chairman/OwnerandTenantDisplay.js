import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Search, Home, Phone, Users, UserPlus, Filter, ChevronDown, X, AlertCircle, ArrowUp, ArrowDown, Eye } from 'lucide-react';

function OwnerandTenantDisplay({ imageURL }) {
    const [ownersntenants, setownersntenants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterBy, setFilterBy] = useState('all');
    const [sortBy, setSortBy] = useState('flatno');
    const [sortDirection, setSortDirection] = useState('asc');
    const [expandedCards, setExpandedCards] = useState({});
    const [filterMenuOpen, setFilterMenuOpen] = useState(false);
    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

    useEffect(() => {
        setLoading(true);
        axios.get(`${API_BASE_URL}/chairman/getownersandtenants`)
            .then(response => {
                setownersntenants(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.log(error);
                setError("Failed to load residents data");
                setLoading(false);
            });
    }, []);

    // Get unique owners
    const uniqueOwners = [...new Map(ownersntenants.map(owner =>
        [`${owner.ofname}-${owner.olname}-${owner.flatno}`, owner]
    )).values()];

    // Toggle card expansion
    const toggleCardExpansion = (ownerId) => {
        setExpandedCards(prev => ({
            ...prev,
            [ownerId]: !prev[ownerId]
        }));
    };

    // Apply filters and search
    const filteredOwners = uniqueOwners.filter(owner => {
        const matchesSearch =
            (owner.ofname?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
            (owner.olname?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
            (owner.flatno?.toString() || '').includes(searchTerm) ||
            (owner.tenant?.some(t =>
                (t.tname?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                (t.tcellno?.toString() || '').includes(searchTerm)
            ));

        if (filterBy === 'all') return matchesSearch;
        if (filterBy === 'withTenant') return matchesSearch && owner.tenant && owner.tenant.length > 0;
        if (filterBy === 'withoutTenant') return matchesSearch && (!owner.tenant || owner.tenant.length === 0);
        return matchesSearch;
    });

    // Toggle sort direction
    const toggleSort = (sortType) => {
        if (sortBy === sortType) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(sortType);
            setSortDirection('asc');
        }
    };

    // Sort owners
    const sortedOwners = [...filteredOwners].sort((a, b) => {
        let comparison = 0;

        if (sortBy === 'flatno') {
            comparison = (parseInt(a.flatno) || 0) - (parseInt(b.flatno) || 0);
        } else if (sortBy === 'name') {
            comparison = `${a.ofname} ${a.olname}`.localeCompare(`${b.ofname} ${b.olname}`);
        } else if (sortBy === 'tenants') {
            comparison = (a.tenant?.length || 0) - (b.tenant?.length || 0);
        }

        return sortDirection === 'asc' ? comparison : -comparison;
    });

    // Status badges with color coding
    const getStatusBadge = (owner) => {
        if (owner.tenant && owner.tenant.length > 0) {
            return (
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                    Occupied
                </span>
            );
        }
        return null; // Don't show anything if no tenants
    };


    // Loading state
    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <div className="relative">
                <div className="h-16 w-16 rounded-full border-t-4 border-b-4 border-blue-500 animate-spin"></div>
                <div className="h-10 w-10 rounded-full border-t-4 border-b-4 border-blue-700 animate-spin absolute top-3 left-3"></div>
            </div>
            <p className="ml-4 text-gray-600 font-medium">Loading residents...</p>
        </div>
    );

    // Error state
    if (error) return (
        <div className="bg-red-50 border-l-4 border-red-500 p-5 rounded-lg shadow-md">
            <div className="flex items-center">
                <AlertCircle className="h-6 w-6 text-red-500 mr-3" />
                <div>
                    <p className="font-semibold text-red-800">Unable to load data</p>
                    <p className="text-red-700 text-sm mt-1">{error}</p>
                </div>
            </div>
            <button
                className="mt-3 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-800 rounded-md transition-colors text-sm font-medium"
                onClick={() => window.location.reload()}
            >
                Try Again
            </button>
        </div>
    );

    return (
        <div className="container mx-auto px-4 py-6 bg-gray-50 min-h-screen">
            {/* Header with title and stats */}
            <div className="mb-6">
                <div className="flex flex-col md:flex-row md:items-end justify-between">
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-700 to-purple-600 bg-clip-text text-transparent">
                            Residents Directory
                        </h1>
                        <p className="text-gray-600 mt-2">
                            Manage and view all property owners and their tenants
                        </p>
                    </div>
                    <div className="mt-4 md:mt-0 flex items-center gap-3">
                        <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg flex items-center">
                            <Home size={18} className="mr-2" />
                            <span className="font-medium">{uniqueOwners.length}</span>
                            <span className="ml-1 text-blue-600">Total Flats</span>
                        </div>
                        <div className="bg-green-50 text-green-700 px-4 py-2 rounded-lg flex items-center">
                            <Users size={18} className="mr-2" />
                            <span className="font-medium">
                                {uniqueOwners.reduce((sum, owner) => sum + (owner.tenant?.length || 0), 0)}
                            </span>
                            <span className="ml-1 text-green-600">Tenants</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Search and filters */}
            <div className="bg-white rounded-xl shadow-md p-4 mb-6">
                <div className="flex flex-col lg:flex-row gap-4">
                    <div className="relative flex-grow">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search by name, flat number, or phone..."
                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        {searchTerm && (
                            <button
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                onClick={() => setSearchTerm('')}
                            >
                                <X size={18} />
                            </button>
                        )}
                    </div>

                    <div className="flex flex-col md:flex-row gap-3">
                        {/* Filter dropdown */}
                        <div className="relative">
                            <button
                                className="w-full md:w-auto flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg transition-colors"
                                onClick={() => setFilterMenuOpen(!filterMenuOpen)}
                            >
                                <div className="flex items-center">
                                    <Filter size={18} className="text-gray-500 mr-2" />
                                    <span className="text-gray-700">
                                        {filterBy === 'all' ? 'All Residents' :
                                            filterBy === 'withTenant' ? 'With Tenants' : 'Without Tenants'}
                                    </span>
                                </div>
                                <ChevronDown size={18} className={`ml-2 text-gray-500 transition-transform ${filterMenuOpen ? 'transform rotate-180' : ''}`} />
                            </button>

                            {filterMenuOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20 border border-gray-100">
                                    <ul className="py-1">
                                        <li>
                                            <button
                                                className={`flex items-center px-4 py-2 w-full text-left hover:bg-gray-50 ${filterBy === 'all' ? 'text-blue-600 font-medium' : 'text-gray-700'}`}
                                                onClick={() => {
                                                    setFilterBy('all');
                                                    setFilterMenuOpen(false);
                                                }}
                                            >
                                                All Residents
                                            </button>
                                        </li>
                                        <li>
                                            <button
                                                className={`flex items-center px-4 py-2 w-full text-left hover:bg-gray-50 ${filterBy === 'withTenant' ? 'text-blue-600 font-medium' : 'text-gray-700'}`}
                                                onClick={() => {
                                                    setFilterBy('withTenant');
                                                    setFilterMenuOpen(false);
                                                }}
                                            >
                                                With Tenants
                                            </button>
                                        </li>
                                        <li>
                                            <button
                                                className={`flex items-center px-4 py-2 w-full text-left hover:bg-gray-50 ${filterBy === 'withoutTenant' ? 'text-blue-600 font-medium' : 'text-gray-700'}`}
                                                onClick={() => {
                                                    setFilterBy('withoutTenant');
                                                    setFilterMenuOpen(false);
                                                }}
                                            >
                                                Without Tenants
                                            </button>
                                        </li>
                                    </ul>
                                </div>
                            )}
                        </div>

                        {/* Sort buttons */}
                        <div className="flex gap-2">
                            <button
                                className={`px-4 py-3 rounded-lg border ${sortBy === 'flatno' ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'} transition-colors flex items-center`}
                                onClick={() => toggleSort('flatno')}
                            >
                                <Home size={16} className="mr-2" />
                                <span>Flat</span>
                                {sortBy === 'flatno' && (
                                    sortDirection === 'asc' ?
                                        <ArrowUp size={16} className="ml-1" /> :
                                        <ArrowDown size={16} className="ml-1" />
                                )}
                            </button>

                            <button
                                className={`px-4 py-3 rounded-lg border ${sortBy === 'name' ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'} transition-colors flex items-center`}
                                onClick={() => toggleSort('name')}
                            >
                                <span>Name</span>
                                {sortBy === 'name' && (
                                    sortDirection === 'asc' ?
                                        <ArrowUp size={16} className="ml-1" /> :
                                        <ArrowDown size={16} className="ml-1" />
                                )}
                            </button>

                            <button
                                className={`px-4 py-3 rounded-lg border ${sortBy === 'tenants' ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'} transition-colors flex items-center`}
                                onClick={() => toggleSort('tenants')}
                            >
                                <Users size={16} className="mr-2" />
                                <span>Tenants</span>
                                {sortBy === 'tenants' && (
                                    sortDirection === 'asc' ?
                                        <ArrowUp size={16} className="ml-1" /> :
                                        <ArrowDown size={16} className="ml-1" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Results count */}
            <div className="flex items-center justify-between mb-4">
                <div className="text-gray-600">
                    Showing <span className="font-semibold text-gray-800">{sortedOwners.length}</span> of <span className="font-semibold text-gray-800">{uniqueOwners.length}</span> residents
                </div>

                {searchTerm && (
                    <div className="flex items-center bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm">
                        <span>Search results for: </span>
                        <span className="font-medium ml-1">{searchTerm}</span>
                        <button
                            className="ml-2 text-blue-500 hover:text-blue-700"
                            onClick={() => setSearchTerm('')}
                        >
                            <X size={14} />
                        </button>
                    </div>
                )}
            </div>

            {/* Owners & tenants cards */}
            <div className="space-y-6">
                {sortedOwners.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-md p-12 flex flex-col items-center justify-center text-center">
                        <div className="bg-gray-100 rounded-full p-4 mb-4">
                            <AlertCircle size={32} className="text-gray-400" />
                        </div>
                        <h3 className="text-xl font-medium text-gray-800 mb-2">No residents found</h3>
                        <p className="text-gray-500 max-w-md">
                            We couldn't find any residents matching your search criteria. Try adjusting your filters or search terms.
                        </p>
                        <button
                            className="mt-6 px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            onClick={() => {
                                setSearchTerm('');
                                setFilterBy('all');
                            }}
                        >
                            Clear Filters
                        </button>
                    </div>
                ) : (
                    sortedOwners.map((owner, index) => {
                        const ownerId = `${owner.ofname}-${owner.olname}-${owner.flatno}`;
                        const isExpanded = expandedCards[ownerId] || false;
                        const hasMultipleTenants = owner.tenant && owner.tenant.length > 1;

                        return (
                            <div
                                key={index}
                                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100 overflow-hidden"
                            >
                                {/* Owner header */}
                                <div className="p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-100">
                                    <div className="flex items-center">
                                        <div className="h-14 w-14 rounded-full bg-gradient-to-r from-blue-600 to-purple-500 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                                            <img src={owner.imageURL} width="40px" height="40px" alt="ownersimages" style={{ borderRadius: "25px" }}></img>
                                        </div>
                                        <div className="ml-4">
                                            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                                                <h3 className="text-lg font-semibold text-gray-800">
                                                    {owner.ofname} {owner.olname}
                                                </h3>
                                                <div className="flex items-center gap-2">
                                                    <span className="px-2.5 py-0.5 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                                                        Owner
                                                    </span>
                                                    {getStatusBadge(owner)}
                                                </div>
                                            </div>
                                            <div className="flex flex-col sm:flex-row gap-4 mt-2">
                                                <div className="flex items-center text-gray-600">
                                                    <Home size={16} className="mr-2 text-gray-500" />
                                                    <span>Flat {owner.flatno}</span>
                                                </div>
                                                {owner.ocellno && (
                                                    <div className="flex items-center text-gray-600">
                                                        <Phone size={16} className="mr-2 text-gray-500" />
                                                        <span>{owner.ocellno}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center mt-4 sm:mt-0">
                                        <div className="flex items-center bg-gray-100 rounded-lg px-3 py-1 text-gray-600">
                                            <Users size={16} className="mr-1" />
                                            <span className="text-sm font-medium">{owner.tenant?.length || 0}</span>
                                        </div>
                                        <button
                                            className="ml-4 px-3 py-1 text-sm text-blue-600 hover:text-blue-800 flex items-center border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
                                            onClick={() => toggleCardExpansion(ownerId)}
                                        >
                                            <Eye size={16} className="mr-1" />
                                            {isExpanded ? "Hide Details" : "View Details"}
                                        </button>
                                    </div>
                                </div>

                                {/* Tenants section - always visible if no tenants or only one tenant */}
                                {(!hasMultipleTenants || isExpanded) && (
                                    <div className="p-5 bg-gray-50">
                                        <div className="flex justify-between items-center mb-3">
                                            <h4 className="font-medium text-gray-700 flex items-center">
                                                <UserPlus size={18} className="mr-2 text-blue-600" />
                                                Tenants Information
                                            </h4>
                                        </div>

                                        {(!owner.tenant || owner.tenant.length === 0) ? (
                                            <div className="flex flex-col items-center justify-center h-24 text-gray-500 bg-gray-100 rounded-lg border border-dashed border-gray-300">
                                                <Users size={24} className="text-gray-400 mb-2" />
                                                <span className="text-sm">No tenants registered for this flat</span>
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                {owner.tenant.map((t, i) => (
                                                    <div key={i} className="flex items-start p-4 bg-white rounded-lg border border-gray-200 hover:shadow-sm transition-shadow">
                                                        <div className="h-12 w-12 rounded-full bg-gradient-to-r from-teal-500 to-green-400 flex items-center justify-center text-white font-medium shadow-md">
                                                            {t.tname?.charAt(0).toUpperCase()}
                                                        </div>
                                                        <div className="ml-3">
                                                            <p className="text-gray-800 font-medium">{t.tname}</p>
                                                            {t.tcellno && (
                                                                <div className="flex items-center mt-1">
                                                                    <Phone size={14} className="text-gray-500 mr-1" />
                                                                    <p className="text-gray-600 text-sm">{t.tcell}</p>
                                                                </div>
                                                            )}
                                                            <div className="mt-2">
                                                                <span className="px-2 py-0.5 bg-teal-50 text-teal-700 text-xs rounded-full border border-teal-100">
                                                                    Tenant
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Show expand button only if multiple tenants */}
                                {hasMultipleTenants && !isExpanded && (
                                    <div className="px-5 py-3 bg-gray-50 border-t border-gray-200 flex justify-center">
                                        <button
                                            className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                                            onClick={() => toggleCardExpansion(ownerId)}
                                        >
                                            <ChevronDown size={18} className="mr-1" />
                                            Show all {owner.tenant.length} tenants
                                        </button>
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}

export default OwnerandTenantDisplay;