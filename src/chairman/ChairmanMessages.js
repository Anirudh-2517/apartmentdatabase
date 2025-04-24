import axios from 'axios';
import React, { useRef, useState } from 'react';

function ChairmanMessages() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const msgRef = useRef("");
  const flatnoRef = useRef("");

  const sendMessage = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setError(null);

    try {
      const payload = {
        msg: msgRef.current.value,
        flatno: flatnoRef.current.value,
      };

      if (!payload.msg.trim() || !payload.flatno.trim()) {
        throw new Error("Please fill in all fields");
      }

      await axios.post("http://localhost:9000/api/chairman/postmessage", payload);
      setSuccess(true);
      msgRef.current.value = "";
      flatnoRef.current.value = "";
    } catch (error) {
      setError(error.message || "Failed to send message");
      console.error(error);
    } finally {
      setLoading(false);
      setTimeout(() => setSuccess(false), 3000);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg max-w-md mx-auto">
      <div className="flex items-center mb-6">
        <div className="bg-blue-500 p-2 rounded-full mr-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Send Resident Message</h2>
      </div>

      <form onSubmit={sendMessage}>
        <div className="mb-4">
          <label htmlFor="flatno" className="block text-sm font-medium text-gray-700 mb-1">Flat Number</label>
          <input
            id="flatno"
            type="text"
            ref={flatnoRef}
            placeholder="e.g. A-101"
            className="p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>
        
        <div className="mb-6">
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
          <textarea
            id="message"
            ref={msgRef}
            rows="3"
            placeholder="Type your message here..."
            className="p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
            Message sent successfully!
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white py-3 px-4 rounded-md hover:bg-blue-600 transition duration-300 flex justify-center items-center font-medium"
        >
          {loading ? (
            <span className="inline-flex items-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Sending...
            </span>
          ) : (
            "Send Message"
          )}
        </button>
      </form>
    </div>
  );
}

export function ChairmanNotice() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const noticeRef = useRef("");

  const postNotice = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setError(null);

    try {
      const notice = noticeRef.current.value;
      
      if (!notice.trim()) {
        throw new Error("Please enter a notice");
      }

      await axios.post("http://localhost:9000/api/chairman/postnotice", { notice });
      setSuccess(true);
      noticeRef.current.value = "";
    } catch (error) {
      setError(error.message || "Failed to post notice");
      console.error(error);
    } finally {
      setLoading(false);
      setTimeout(() => setSuccess(false), 3000);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg max-w-md mx-auto mt-8">
      <div className="flex items-center mb-6">
        <div className="bg-green-500 p-2 rounded-full mr-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Post Community Notice</h2>
      </div>

      <form onSubmit={postNotice}>
        <div className="mb-6">
          <label htmlFor="notice" className="block text-sm font-medium text-gray-700 mb-1">Notice Content</label>
          <textarea
            id="notice"
            ref={noticeRef}
            rows="4"
            placeholder="Type your notice announcement here..."
            className="p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            required
          />
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
            Notice posted successfully!
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-500 text-white py-3 px-4 rounded-md hover:bg-green-600 transition duration-300 flex justify-center items-center font-medium"
        >
          {loading ? (
            <span className="inline-flex items-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Posting...
            </span>
          ) : (
            "Post Notice"
          )}
        </button>
      </form>
    </div>
  );
}

export default ChairmanMessages;