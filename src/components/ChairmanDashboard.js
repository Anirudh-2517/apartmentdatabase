import axios from "axios";
import React, { useRef, useState, useEffect } from "react";
import ChairmanMessages, { ChairmanNotice, ChairmanRaiseMDemand } from "../chairman/ChairmanMessages";
import AcademicCalendar from "../chairman/ApartmentCalender";
import { Route, Routes, Link, useLocation } from "react-router-dom";
import { Bell, MessageSquare, Search, Home, LogOut, User, FileText, Calendar, Settings } from "lucide-react";

function Chairman({ setLoginStatus }) {
  const noticeRef = useRef("");
  const messageRef = useRef("");
  const [notices, setNotices] = useState([]);
  const [messages, setMessages] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  useEffect(() => {
    fetchNotices();
    fetchMessages();
    const interval = setInterval(() => {
      fetchNotices();
      fetchMessages();
    }, 10000); // Fetch data every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchNotices = async () => {
    try {
      const response = await axios.get("http://localhost:9000/api/chairman/getNotices");
      setNotices(response.data);
    } catch (err) {
      setError("Failed to fetch notices");
      console.error(err);
    }
  };

  const fetchMessages = async () => {
    try {
      const response = await axios.get("http://localhost:9000/api/chairman/getMessages");
      setMessages(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const filteredNotices = notices.filter((notice) =>
    (notice?.notice || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredMessages = messages.filter((message) =>
    (message?.message || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const NavItem = ({ to, icon, label }) => {
    const location = useLocation();
    const isActive = location.pathname === to;

    return (
      <li className={`w-full ${isActive ? "bg-blue-700" : "hover:bg-blue-700"} rounded-lg transition-colors`}>
        <Link to={to} className="flex items-center gap-3 p-3 text-white">
          {icon}
          <span>{label}</span>
        </Link>
      </li>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-600 text-white shadow-lg">
        <div className="p-4 border-b border-blue-500">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-md bg-white flex items-center justify-center">
              <Home size={20} className="text-blue-600" />
            </div>
            <div>
              <h1 className="font-bold text-xl">GrihaMitra</h1>
              <p className="text-xs text-blue-200">Chairman Dashboard</p>
            </div>
          </div>
        </div>

        <nav className="p-4">
          <ul className="space-y-2">
            <NavItem to="/" icon={<Home size={18} />} label="Overview" />
            <NavItem to="/message" icon={<MessageSquare size={18} />} label="Messages" />
            <NavItem to="/notice" icon={<Bell size={18} />} label="Notices" />
            <NavItem to="/calendar" icon={<Calendar size={18} />} label="Calendar" />
            {/* <NavItem to="/documents" icon={<FileText size={18} />} label="Documents" />
            <NavItem to="/profile" icon={<User size={18} />} label="Profile" /> */}
            <NavItem to="/settings" icon={<Settings size={18} />} label="Settings" />
          </ul>
        </nav>

        <div className="mt-auto p-4 border-t border-blue-500">
          <button
            onClick={() => setLoginStatus(false)}
            className="flex items-center gap-2 text-white hover:text-blue-200 transition-colors w-full"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Navbar */}
        <header className="bg-white shadow-sm p-4">
          <div className="flex justify-between items-center">
            <div className="relative w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={16} className={`${isSearchFocused ? "text-blue-500" : "text-gray-400"}`} />
              </div>
              <input
                type="text"
                placeholder="Search messages and notices..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
              />
            </div>
            <div className="flex items-center gap-3">
              <span className="text-gray-700">Welcome, Y.M.Patil</span>
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                <User size={16} className="text-blue-600" />
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-6">
          <div className="flex gap-6">
            {/* Left: Routed Components  */}
            <div className="w-2/3">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <Routes>
                  <Route path="/message" element={<ChairmanMessages />} />
                  <Route path="/notice" element={<ChairmanNotice />} />
                  <Route path="/calendar" element={<AcademicCalendar />} />
                  <Route path="/" element={
                    <div>
                      <h2 className="text-xl font-semibold text-gray-800 mb-4">Welcome to Your Dashboard</h2>
                      <p className="text-gray-600">Select an option from the navigation menu to get started.</p>
                    </div>
                  } />
                  <Route path="*" element={
                    <div className="text-center py-10">
                      <h2 className="text-xl font-semibold text-gray-800 mb-2">Page Coming Soon</h2>
                      <p className="text-gray-600">This feature is under development.</p>
                    </div>
                  } />
                </Routes>
              </div>
            </div>

            {/* Right: Messages and Notices */}
            <div className="w-1/3 space-y-6">
              {/* Notices Section */}
              <section className="bg-white rounded-lg shadow-sm p-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <Bell size={18} className="text-blue-600" />
                    Recent Notices
                  </h2>
                  <Link to="/notice" className="text-sm text-blue-600 hover:underline">View all</Link>
                </div>

                {error && <div className="p-3 bg-red-50 text-red-700 rounded-md mb-3">{error}</div>}

                <div className="space-y-3">
                  {filteredNotices.length > 0 ? (
                    filteredNotices.slice(0, 3).map((notice) => (
                      <div
                        key={notice._id}
                        className="p-3 bg-blue-50 rounded-md border-l-4 border-blue-500"
                      >
                        <p className="text-sm text-gray-800">{notice.notice}</p>
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-xs text-gray-500">
                            {notice.date ? formatDate(notice.date) : "No date"}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm p-2">No notices available.</p>
                  )}
                </div>
              </section>

              {/* Messages Section */}
              <section className="bg-white rounded-lg shadow-sm p-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <MessageSquare size={18} className="text-blue-600" />
                    Recent Messages
                  </h2>
                  <Link to="/message" className="text-sm text-blue-600 hover:underline">View all</Link>
                </div>

                <div className="space-y-3">
                  {filteredMessages.length > 0 ? (
                    filteredMessages.slice(0, 3).map((message) => (
                      <div
                        key={message._id}
                        className="p-3 bg-gray-50 rounded-md border border-gray-200"
                      >
                        <p className="text-sm text-gray-800">{message.message}</p>
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-xs text-gray-500">
                            {message.date ? formatDate(message.date) : "No date"}
                          </span>
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                            {message.from || "System"}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm p-2">No messages available.</p>
                  )}
                </div>
              </section>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Chairman;
