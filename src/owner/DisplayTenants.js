import React, { useEffect, useState } from 'react';
import axios from 'axios';

function DisplayTenants({ oid }) {
    const [tenants, setTenants] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect( () => {
        axios.get(`http://localhost:9000/api/owner/gettenants/${oid}`)
            .then(response => {
                setTenants(response.data);
                setIsLoading(false);
            })
            .catch(error => {
                console.error("Error fetching tenants:", error);
                setError("Failed to load tenants. Please try again later.");
                setIsLoading(false);
            });
    }, [oid,tenants]); 
    

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-4" role="alert">
                <strong className="font-bold">Error!</strong>
                <span className="block sm:inline"> {error}</span>
            </div>
        );
    }
    const changestatus=(tenant)=>{
        const payload={
            oid:oid,
            tenant:tenant
        }
        axios.post("http://localhost:9000/api/owner/updatetenantstatus",payload)
        .then(response=>{
            alert("Status updated !!")
        })
        .catch(error=>{
            console.log(error)
        })
    }

    return (
        <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Tenant Directory</h2>

            {tenants.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No tenants found.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white">
                        <thead>
                            <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                                <th className="py-3 px-6 text-left">Name</th>
                                <th className="py-3 px-6 text-left">Aadhar ID</th>
                                <th className="py-3 px-6 text-left">Address</th>
                                <th className="py-3 px-6 text-left">Contact Number</th>
                                <th className="py-3 px-6 text-left">Occupancy Status</th>
                                <th className="py-3 px-6 text-left">Occupancy Dates</th>
                                <th className="py-3 px-6 text-left">Change Status</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-600 text-sm">
                            {tenants.map((tenant, index) => (
                                <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                                    <td className="py-3 px-6 text-left">{tenant.tname}</td>
                                    <td className="py-3 px-6 text-left">{tenant.taadhar}</td>
                                    <td className="py-3 px-6 text-left">{tenant.taddress}</td>
                                    <td className="py-3 px-6 text-left">{tenant.tcell}</td>
                                    <td className="py-3 px-6 text-left">{tenant.tstatus}</td>
                                    <td className="py-3 px-6 text-left">
                                        {tenant.tod && (
                                            <span>
                                                {new Date(tenant.tod).toLocaleDateString()} -
                                                {tenant.tld ? new Date(tenant.tld).toLocaleDateString() : "Present"}
                                            </span>
                                        )}
                                    </td>
                                    <td className="py-3 px-6 text-left">
                                        <button onClick={()=>changestatus(tenant)} className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-3 rounded text-sm transition duration-150 ease-in-out">
                                            Change Status
                                        </button>
                                    </td>                
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default DisplayTenants;