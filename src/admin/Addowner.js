import React, { useEffect, useRef, useState } from "react";
import UpdateFlatOwner from "./UpdateFlatOwner";
import axios from "axios";
import "../output.css";

const AddOwner = () => {
  const oidcount = useRef(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [addedOwner, setAddedOwner] = useState(null);
  const [loading, setLoading] = useState(false);
  const [worb, setWorb] = useState(false)
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  const [formData, setFormData] = useState({
    oid: "",
    ofname: "",
    olname: "",
    ogender: "",
    ocellno: "",
    oemail: "",
    Login: "",
    Password: "",
    Adesignation: "Owner",
    famcount: "",
    flatno: "",
    floorno: "",
    wing: "",
    maintainence: [],
    Messages: [],
  });

  const blocknames = [];


  if (worb === true) {
    for (let i = 1; i < 5; i++)
      blocknames.push("Block -" + i)
  }
  else {
    for (let i = 1; i < 5; i++)
      blocknames.push("Wing - " + i)
  }
  useEffect(() => {
    setLoading(true);
    axios
      .get(`${API_BASE_URL}/admin/getoidcount`)
      .then((response) => {
        setFormData((prevData) => ({
          ...prevData,
          oid: response.data[0].oidcounter + 1,
        }));
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching OID count:", error);
        setLoading(false);
      });

    axios.get(`${API_BASE_URL}/admin/getblocksorwings`)
      .then(response => {
        console.log("im here")
        setWorb(response.data[0].Blocks)
        // console.log("im here" + response.data[0].Blocks)
      })
      .catch(error => {
        console.log(error)
      })

  }, []);

  useEffect(() => {

  }, [worb]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const resetForm = () => {
    // Keep the OID increment but reset other fields
    const currentOid = formData.oid;
    setFormData({
      oid: parseInt(currentOid) + 1,
      ofname: "",
      olname: "",
      ogender: "",
      ocellno: "",
      oemail: "",
      Login: "",
      Password: "",
      Adesignation: "Owner",
      famcount: "",
      flatno: "",
      floorno: "",
      wing: "",
      maintainence: [],
      Messages: [],
    });
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>New Owner Details</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              max-width: 800px;
              margin: 0 auto;
              padding: 20px;
            }
            h1 {
              color: #4f46e5;
              text-align: center;
              margin-bottom: 20px;
              border-bottom: 2px solid #4f46e5;
              padding-bottom: 10px;
            }
            .detail-card {
              border: 1px solid #e5e7eb;
              border-radius: 8px;
              padding: 20px;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            .detail-row {
              display: flex;
              border-bottom: 1px solid #e5e7eb;
              padding: 10px 0;
            }
            .detail-label {
              font-weight: bold;
              width: 200px;
            }
            .detail-value {
              flex: 1;
            }
            .footer {
              margin-top: 30px;
              text-align: center;
              font-size: 0.8em;
              color: #6b7280;
            }
          </style>
        </head>
        <body>
          <h1>New Owner Details</h1>
          <div class="detail-card">
            <div class="detail-row">
              <div class="detail-label">Owner ID:</div>
              <div class="detail-value">${addedOwner.oid}</div>
            </div>
            <div class="detail-row">
              <div class="detail-label">Name:</div>
              <div class="detail-value">${addedOwner.ofname} ${addedOwner.olname}</div>
            </div>
            <div class="detail-row">
              <div class="detail-label">Gender:</div>
              <div class="detail-value">${addedOwner.ogender === 'M' ? 'Male' : addedOwner.ogender === 'F' ? 'Female' : 'Other'}</div>
            </div>
            <div class="detail-row">
              <div class="detail-label">Contact:</div>
              <div class="detail-value">${addedOwner.ocellno}</div>
            </div>
            <div class="detail-row">
              <div class="detail-label">Email:</div>
              <div class="detail-value">${addedOwner.oemail}</div>
            </div>
            <div class="detail-row">
              <div class="detail-label">Login ID:</div>
              <div class="detail-value">${addedOwner.Login}</div>
            </div>
            <div class="detail-row">
              <div class="detail-label">Family Members:</div>
              <div class="detail-value">${addedOwner.famcount}</div>
            </div>
            <div class="detail-row">
              <div class="detail-label">Flat Details:</div>
              <div class="detail-value">Wing ${addedOwner.wing}, Flat ${addedOwner.flatno}, Floor ${addedOwner.floorno}</div>
            </div>
          </div>
          <div class="footer">
            <p>Generated on ${new Date().toLocaleString()}</p>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
      const response = await axios.post(`${API_BASE_URL}/admin/addowner`,
        formData
      );
      setAddedOwner(formData);
      setShowSuccess(true);
      setLoading(false);
    } catch (error) {
      console.error("Error adding owner:", error);
      alert("Failed to add owner. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-t from-blue-600 to-white px-4 sm:px-6 lg:px-8 py-12">
      {showSuccess ? (
        <div className="bg-white shadow-2xl rounded-xl p-8 sm:p-10 max-w-4xl w-full">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-green-100 rounded-full p-2">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 ml-2">Owner Added Successfully!</h2>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg mb-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">Owner Details:</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Owner ID</p>
                <p className="font-medium">{addedOwner.oid}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-medium">{addedOwner.ofname} {addedOwner.olname}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Gender</p>
                <p className="font-medium">{addedOwner.ogender === 'M' ? 'Male' : addedOwner.ogender === 'F' ? 'Female' : 'Other'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Contact</p>
                <p className="font-medium">{addedOwner.ocellno}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{addedOwner.oemail}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Login ID</p>
                <p className="font-medium">{addedOwner.Login}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Family Members</p>
                <p className="font-medium">{addedOwner.famcount}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Flat Details</p>
                <p className="font-medium">Wing {addedOwner.wing}, Flat {addedOwner.flatno}, Floor {addedOwner.floorno}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handlePrint}
              className="flex-1 bg-indigo-600 text-white font-medium py-3 px-4 rounded-lg shadow hover:bg-indigo-700 transition-colors flex items-center justify-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path>
              </svg>
              Print Details
            </button>
            <button
              onClick={() => {
                setShowSuccess(false);
                resetForm();
              }}
              className="flex-1 bg-white text-indigo-600 font-medium border border-indigo-600 py-3 px-4 rounded-lg shadow hover:bg-indigo-50 transition-colors flex items-center justify-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              Add Another Owner
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white shadow-2xl rounded-xl p-8 sm:p-10 max-w-4xl w-full relative">
          {loading && (
            <div className="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center rounded-xl z-10">
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                <p className="mt-2 text-indigo-600 font-medium">Loading...</p>
              </div>
            </div>
          )}

          <div className="flex items-center justify-center mb-6">
            <svg className="w-10 h-10 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
            </svg>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-indigo-600 ml-2 text-center">
              Add New Owner
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="col-span-1 sm:col-span-2 bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h3 className="font-medium text-blue-800 mb-2 flex items-center">
                  <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  Personal Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Owner ID (OID)
                    </label>
                    <input
                      type="text"
                      name="oid"
                      value={formData.oid}
                      onChange={handleChange}
                      disabled
                      className="mt-1 p-3 block w-full border border-gray-300 rounded-lg shadow-sm bg-gray-100 focus:ring-indigo-500 focus:border-indigo-500 text-gray-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">Auto-generated ID</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Gender
                    </label>
                    <select
                      name="ogender"
                      value={formData.ogender}
                      onChange={handleChange}
                      required
                      className="mt-1 p-3 block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="">Select Gender</option>
                      <option value="M">Male</option>
                      <option value="F">Female</option>
                      <option value="O">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="ofname"
                      value={formData.ofname}
                      onChange={handleChange}
                      required
                      placeholder="Enter first name"
                      className="mt-1 p-3 block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="olname"
                      value={formData.olname}
                      onChange={handleChange}
                      required
                      placeholder="Enter last name"
                      className="mt-1 p-3 block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>

              <div className="col-span-1 sm:col-span-2 bg-indigo-50 p-4 rounded-lg border border-indigo-200">
                <h3 className="font-medium text-indigo-800 mb-2 flex items-center">
                  <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                  Contact Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Cell No
                    </label>
                    <input
                      type="text"
                      name="ocellno"
                      value={formData.ocellno}
                      onChange={handleChange}
                      required
                      placeholder="Enter phone number"
                      className="mt-1 p-3 block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <input
                      type="email"
                      name="oemail"
                      placeholder="Enter email address"
                      value={formData.oemail}
                      onChange={handleChange}
                      required
                      className="mt-1 p-3 block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>

              <div className="col-span-1 sm:col-span-2 bg-green-50 p-4 rounded-lg border border-green-200">
                <h3 className="font-medium text-green-800 mb-2 flex items-center">
                  <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                  </svg>
                  Account Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Login
                    </label>
                    <input
                      type="text"
                      name="Login"
                      placeholder="Enter login ID"
                      value={formData.Login}
                      onChange={handleChange}
                      required
                      className="mt-1 p-3 block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">Typically the flat number</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Password
                    </label>
                    <input
                      type="password"
                      name="Password"
                      value={formData.Password}
                      onChange={handleChange}
                      required
                      className="mt-1 p-3 block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>

              <div className="col-span-1 sm:col-span-2 bg-purple-50 p-4 rounded-lg border border-purple-200">
                <h3 className="font-medium text-purple-800 mb-2 flex items-center">
                  <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                  </svg>
                  Residence Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Wing or Block
                    </label>
                    <select className="mt-1 p-3 block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500">
                      {blocknames.map(b => <option>{b}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Floor Number
                    </label>
                    <input
                      type="text"
                      name="floorno"
                      value={formData.floorno}
                      onChange={handleChange}
                      required
                      placeholder="e.g., 1, 2, 3"
                      className="mt-1 p-3 block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Flat No
                    </label>
                    <input
                      type="text"
                      name="flatno"
                      value={formData.flatno}
                      onChange={handleChange}
                      required
                      placeholder="e.g., 101, 204"
                      className="mt-1 p-3 block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Family Count
                    </label>
                    <input
                      type="number"
                      name="famcount"
                      value={formData.famcount}
                      min="1"
                      onChange={handleChange}
                      required
                      placeholder="Number of family members"
                      className="mt-1 p-3 block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <button
                type="submit"
                disabled={loading}
                className="w-full max-w-md bg-gradient-to-r from-green-400 via-blue-500 to-purple-500 text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center"
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                    </svg>
                    Add Owner
                  </span>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
      <div className="w-full max-w-4xl mt-8">
        <UpdateFlatOwner />
      </div>
    </div>
  );
};

export default AddOwner;