import React, { useState, useEffect } from "react";
import ChairmanMessages, { ChairmanNotice } from "../chairman/ChairmanMessages";
import AcademicCalendar from "../chairman/ApartmentCalender";
import { Route, Routes, Link, useLocation,useNavigate } from "react-router-dom";
import {
  Bell, MessageSquare, Home, LogOut, User, Calendar, Settings,
  Users, ChevronRight, BarChart3, Layers, Menu, X, DollarSign
} from "lucide-react";
import OwnerandTenantDisplay from "../chairman/OwnerandTenantDisplay";
import axios from "axios";
import FinancialExpenses from "../admin/FinancialExpenses";

function Chairman({ setLoginStatus ,imageURL}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState(3);
  const [statsData, setStatsData] = useState({
    totalOwners: 0,
    totalTenants: 0,
    totalNotices: 0,
    totalMessages: 0
  });
  const [greeting, setGreeting] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  const navigate = useNavigate();
  const logout = () => {
    setLoginStatus(false);
    navigate('/login');
  };

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 18) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");
    fetchDashboardStats();

    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const [noticesRes, messagesRes, residentsRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/chairman/getNotices`),
        axios.get(`${API_BASE_URL}/chairman/getMessages`),
        axios.get(`${API_BASE_URL}/chairman/getownersandtenants`)
      ]);
      const uniqueOwners = [...new Map(residentsRes.data.map(owner =>
        [`${owner.ofname}-${owner.olname}-${owner.flatno}`, owner]
      )).values()];
      let tenantCount = 0;
      uniqueOwners.forEach(owner => {
        if (owner.tenant && Array.isArray(owner.tenant)) {
          tenantCount += owner.tenant.length;
        }
      });
      setStatsData({
        totalOwners: uniqueOwners.length,
        totalTenants: tenantCount,
        totalNotices: noticesRes.data.length,
        totalMessages: messagesRes.data.length
      });
    } catch (err) {
      console.error("Error fetching dashboard stats:", err);
    }
  };

  const navItems = [
    { to: "/", label: "Dashboard", icon: <Home size={18} />, color: "text-blue-500" },
    { to: "/message", label: "Messages", icon: <MessageSquare size={18} />, color: "text-purple-500" },
    { to: "/notice", label: "Notices", icon: <Bell size={18} />, color: "text-amber-500" },
    { to: "/calendar", label: "Calendar", icon: <Calendar size={18} />, color: "text-green-500" },
    { to: "/ownersdisplay", label: "Residents", icon: <Users size={18} />, color: "text-pink-500" },
    { to: "/financialexpenses", label: "Analytics", icon: <BarChart3 size={18} />, color: "text-indigo-500" },
    { to: "/settings", label: "Settings", icon: <Settings size={18} />, color: "text-gray-500" },
  ];

  const NavLink = ({ to, children, className = "" }) => {
    const location = useLocation();
    const isActive = location.pathname === to;
    return (
      <Link
        to={to}
        className={`flex items-center p-3 rounded-lg transition-all duration-200 ${isActive
          ? "bg-gradient-to-r from-gray-700 to-gray-600 text-white shadow-md"
          : "text-gray-200 hover:bg-gray-700 hover:text-white hover:translate-x-1"
          } ${className}`}
        onClick={() => setIsMenuOpen(false)}
      >
        {children}
      </Link>
    );
  };

  const formatDate = () => currentTime.toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });
  const quickActions = [
    { to: "/message", title: "Send Message", icon: <MessageSquare className="text-indigo-500" size={24} />, desc: "Send a message to all residents or specific flats", color: "bg-indigo-50", textColor: "text-indigo-800" },
    { to: "/notice", title: "Post Notice", icon: <Bell className="text-amber-500" size={24} />, desc: "Create an important notice for all residents", color: "bg-amber-50", textColor: "text-amber-800" },
    { to: "/calendar", title: "Schedule Event", icon: <Calendar className="text-green-500" size={24} />, desc: "Add new events to the apartment calendar", color: "bg-green-50", textColor: "text-green-800" },
    { to: "/ownersdisplay", title: "Residents", icon: <Users className="text-pink-500" size={24} />, desc: "View and manage owners and tenants", color: "bg-pink-50", textColor: "text-pink-800" },
    { to: "/financialexpenses", title: "Residents", icon: <BarChart3 className="text-pink-500" size={24} />, desc: "View and manage owners and tenants", color: "bg-pink-50", textColor: "text-pink-800" },
  ];

  function LocationDisplay() {
    const location = useLocation();
    const path = location.pathname;
    const formattedPath = path === "/" ? "Dashboard" : path.replace("/", "").replace(/([A-Z])/g, " $1").trim();

    return (
      <div className="flex items-center">
        <Link to="/" className="text-indigo-600 hover:text-indigo-800 flex items-center">
          <Home size={20} className="mr-1" /> <b>Dashboard</b>
        </Link>
        {path !== "/" && (
          <>
            <ChevronRight size={16} className="mx-2 text-gray-400" />
            <span className="text-gray-600 font-medium">{formattedPath}</span>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Desktop Sidebar - Fixed */}
      <aside className="hidden lg:block w-72 bg-gradient-to-b from-gray-900 to-gray-800 shadow-xl fixed h-screen overflow-y-auto">
        <div className="p-6">
          <h1 className="text-xl font-bold text-white flex items-center">
            <Layers className="mr-2 text-indigo-300" size={22} />
            <span className="text-indigo-300">GrihaMitra</span> Chairman
          </h1>
          <div className="mt-6 bg-gray-900 rounded-lg p-4 border border-gray-700 flex items-center space-x-3">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-full text-white">
              <User size={20} />
            </div>
            <div>
              <div className="text-white font-medium">Y.M.Patil</div>
              <div className="text-xs text-gray-400">Chairman</div>
            </div>
          </div>
        </div>
        <nav className="px-4 py-2">
          <ul className="space-y-1">
            {navItems.map(item => (
              <li key={item.to}>
                <NavLink to={item.to}>
                  <span className={`mr-3 ${item.color}`}>{item.icon}</span>
                  {item.label}
                </NavLink>
              </li>
            ))}
            <li className="pt-6 mt-6 border-t border-indigo-700">
              <button onClick={logout} className="w-full flex items-center p-3 text-red-400 hover:bg-indigo-700 hover:text-red-300 rounded-lg">
                <LogOut size={18} className="mr-3" />
                Logout
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Mobile Header */}
      <header className="bg-gradient-to-r from-indigo-900 to-indigo-800 shadow-lg lg:hidden fixed top-0 left-0 right-0 z-10">
        <div className="flex items-center justify-between p-4">
          <h1 className="text-xl font-bold text-white flex items-center">
            <Layers className="mr-2 text-indigo-300" size={20} />
            <span className="text-indigo-300">GrihaMitra</span> Chairman
          </h1>
          <div className="flex items-center space-x-4">
            <button className="relative text-gray-300">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                {notifications}
              </span>
            </button>
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white bg-indigo-700 p-1 rounded-md">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <nav className="bg-indigo-800 px-4 pb-4 shadow-lg animate-fade-in-down">
            <div className="py-3 px-4 border-b border-indigo-700 mb-2">
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-2 rounded-full text-white">
                  <User size={20} />
                </div>
                <div>
                  <div className="text-white font-medium">Y.M.Patil</div>
                  <div className="text-xs text-gray-400">Chairman</div>
                </div>
              </div>
            </div>
            <ul className="space-y-2">
              {navItems.map(item => (
                <li key={item.to}>
                  <NavLink to={item.to}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className={`mr-3 ${item.color}`}>{item.icon}</span>
                        {item.label}
                      </div>
                      <ChevronRight size={16} className="text-gray-500" />
                    </div>
                  </NavLink>
                </li>
              ))}
              <li className="pt-2 border-t border-indigo-700">
                <button onClick={() => setLoginStatus(false)} className="w-full flex items-center p-3 text-red-400 hover:bg-indigo-700 hover:text-red-300 rounded-lg">
                  <LogOut size={18} className="mr-3" />
                  Logout
                </button>
              </li>
            </ul>
          </nav>
        )}
      </header>

      {/* Main Content - Scrollable with proper spacing for fixed elements */}
      <div className="flex-1 flex flex-col lg:ml-72">
        {/* Desktop Header */}
        <div className="hidden lg:flex items-center justify-between bg-white p-4 shadow-sm border-b sticky top-0 z-10">
          <LocationDisplay />
          <div className="flex items-center space-x-4">
            <div className="text-gray-600 text-sm">{formatDate()}</div>
            <button className="relative text-gray-600 hover:text-gray-800">
              <Bell size={20} />
              {notifications > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  {notifications}
                </span>
              )}
            </button>
            <button className="text-gray-600 hover:text-gray-800">
              <Settings size={20} />
            </button>
            <div className="flex items-center border-l pl-4 ml-2">
              <div className="bg-indigo-100 text-indigo-800 p-2 rounded-full">
                <User size={18} />
              </div>
              <span className="ml-2 text-gray-700 font-medium">Y.M.Patil</span>
            </div>
          </div>
        </div>

        {/* Mobile spacing to account for fixed header */}
        <div className="lg:hidden h-16"></div>

        {/* Main content area - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6">
          <Routes>
            <Route path="/" element={
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-lg shadow-md border">
                  <div className="flex flex-col md:flex-row justify-between items-center">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800 mb-1">{greeting}, Y.M.Patil</h2>
                      <p className="text-gray-600">Here's what's happening in your apartment complex today.</p>
                    </div>
                    <div className="mt-4 md:mt-0 flex items-center bg-indigo-50 px-4 py-2 rounded-md text-indigo-800">
                      <Calendar size={18} className="text-indigo-600 mr-2" />
                      <p className="font-medium">{formatDate()}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-3">Summary</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-gradient-to-r from-blue-300 to-cyan-400 rounded-lg shadow-md p-5 text-white">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-white/80 text-sm">Total Owners</p>
                          <h3 className="text-3xl font-bold mt-1">{statsData.totalOwners}</h3>
                        </div>
                        <div className="p-3 bg-white/20 rounded-lg">
                          <Users size={24} />
                        </div>
                      </div>
                      <Link to="/ownersdisplay" className="flex items-center mt-4 text-sm text-white/90 hover:text-white">
                        <span>View Details</span>
                        <ChevronRight size={16} className="ml-1" />
                      </Link>
                    </div>

                    <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg shadow-md p-5 text-white">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-white/80 text-sm">Total Tenants</p>
                          <h3 className="text-3xl font-bold mt-1">{statsData.totalTenants}</h3>
                        </div>
                        <div className="p-3 bg-white/20 rounded-lg">
                          <User size={24} />
                        </div>
                      </div>
                      <Link to="/ownersdisplay" className="flex items-center mt-4 text-sm text-white/90 hover:text-white">
                        <span>View Details</span>
                        <ChevronRight size={16} className="ml-1" />
                      </Link>
                    </div>

                    <div className="bg-gradient-to-r from-amber-500 to-orange-600 rounded-lg shadow-md p-5 text-white">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-white/80 text-sm">Total Notices</p>
                          <h3 className="text-3xl font-bold mt-1">{statsData.totalNotices}</h3>
                        </div>
                        <div className="p-3 bg-white/20 rounded-lg">
                          <Bell size={24} />
                        </div>
                      </div>
                      <Link to="/notice" className="flex items-center mt-4 text-sm text-white/90 hover:text-white">
                        <span>View Details</span>
                        <ChevronRight size={16} className="ml-1" />
                      </Link>
                    </div>

                    <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg shadow-md p-5 text-white">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-white/80 text-sm">Total Messages</p>
                          <h3 className="text-3xl font-bold mt-1">{statsData.totalMessages}</h3>
                        </div>
                        <div className="p-3 bg-white/20 rounded-lg">
                          <MessageSquare size={24} />
                        </div>
                      </div>
                      <Link to="/message" className="flex items-center mt-4 text-sm text-white/90 hover:text-white">
                        <span>View Details</span>
                        <ChevronRight size={16} className="ml-1" />
                      </Link>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-3">Quick Actions</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {quickActions.map(action => (
                      <Link key={action.to} to={action.to} className={`${action.color} p-5 rounded-lg border hover:shadow-md transition hover:-translate-y-1`}>
                        <div className="mb-3">{action.icon}</div>
                        <h3 className={`font-medium ${action.textColor}`}>{action.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{action.desc}</p>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            } />
            <Route path="/message" element={<ChairmanMessages />} />
            <Route path="/notice" element={<ChairmanNotice />} />
            <Route path="/calendar" element={<AcademicCalendar />} />
            <Route path="/ownersdisplay" element={<OwnerandTenantDisplay imageURL={imageURL} />} />
            <Route path="/financialexpenses" element={<FinancialExpenses />} />
            <Route path="*" element={
              <div className="text-center py-16">
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 inline-block p-6 rounded-full mb-4 shadow-lg">
                  <Settings size={48} className="text-white" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">Page Coming Soon</h2>
                <p className="text-gray-600 max-w-md mx-auto">This feature is currently under development and will be available in the next update.</p>
                <Link to="/" className="mt-6 inline-block px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition-colors shadow-md">
                  Return to Dashboard
                </Link>
              </div>
            } />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default Chairman;