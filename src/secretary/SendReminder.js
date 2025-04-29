import axios from "axios";
import React,{ useEffect, useState } from "react";

function SendReminder() {
    const [reminder, setReminder] = useState({
      oid: "",
      reminder: "",
    });
    const [loading, setLoading] = useState(false);
    const [notification, setNotification] = useState({ show: false, type: "", message: "" });
    const [owners, setOwners] = useState([]);
    const [templates, setTemplates] = useState([
      "This is a gentle reminder that your maintenance payment is due.",
      "Please be informed that your maintenance payment for this month is pending.",
      "Kindly clear your pending maintenance payment at your earliest convenience."
    ]);
    const [selectedTemplate, setSelectedTemplate] = useState("");
    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  
    useEffect(() => {
      // Mock data for demonstration purposes
      setOwners([
        { id: "OWN001", name: "John Doe", flat: "A-101" },
        { id: "OWN002", name: "Jane Smith", flat: "B-202" },
        { id: "OWN003", name: "Robert Johnson", flat: "C-303" }
      ]);
    }, []);
  
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setReminder((prev) => ({ ...prev, [name]: value }));
    };
  
    const handleTemplateChange = (e) => {
      const value = e.target.value;
      setSelectedTemplate(value);
      setReminder(prev => ({ ...prev, reminder: value }));
    };
  
    const handleSendReminder = (event) => {
      event.preventDefault();
      setLoading(true);
  
      axios
        .post(`${API_BASE_URL}/secretary/sendReminder`, reminder)
        .then(() => {
          setNotification({
            show: true,
            type: "success",
            message: "Reminder sent successfully!"
          });
          setReminder({ oid: "", reminder: "" });
          setSelectedTemplate("");
        })
        .catch((err) => {
          console.error("Error sending reminder:", err);
          setNotification({
            show: true,
            type: "error",
            message: "Failed to send reminder. Please try again."
          });
        })
        .finally(() => {
          setLoading(false);
          setTimeout(() => setNotification({ show: false, type: "", message: "" }), 3000);
        });
    };
  
    return (
      <div className="container mx-auto px-4 py-8">
        {notification.show && (
          <div className={`mb-4 p-4 rounded-lg ${notification.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
            {notification.message}
          </div>
        )}
        <div className="max-w-2xl mx-auto bg-white text-gray-900 p-8 rounded-lg shadow-xl">
          <h2 className="text-center text-2xl font-semibold mb-6 text-teal-600 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
            </svg>
            Send Payment Reminder
          </h2>
          <form className="space-y-6" onSubmit={handleSendReminder}>
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Owner's ID
              </label>
              <select
                name="oid"
                value={reminder.oid}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 rounded-lg bg-gray-50 text-gray-700 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              >
                <option value="">Select Owner</option>
                {owners.map(owner => (
                  <option key={owner.id} value={owner.id}>
                    {owner.id} - {owner.name} ({owner.flat})
                  </option>
                ))}
              </select>
            </div>
  
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
                Message Template
              </label>
              <select
                value={selectedTemplate}
                onChange={handleTemplateChange}
                className="w-full px-4 py-2 rounded-lg bg-gray-50 text-gray-700 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              >
                <option value="">Select a template or write custom message</option>
                {templates.map((template, index) => (
                  <option key={index} value={template}>
                    {template.substring(0, 40)}...
                  </option>
                ))}
              </select>
            </div>
  
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Reminder Message
              </label>
              <textarea
                name="reminder"
                value={reminder.reminder}
                onChange={handleInputChange}
                placeholder="Type your reminder message here"
                required
                className="w-full px-4 py-2 rounded-lg bg-gray-50 text-gray-700 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                rows="4"
              />
            </div>
  
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition duration-300 ease-in-out flex items-center justify-center"
            >
              {loading ? (
                <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              )}
              {loading ? "Sending..." : "Send Reminder"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  export default SendReminder;