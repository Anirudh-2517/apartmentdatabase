import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Link, Routes, Route, useLocation } from 'react-router-dom';
import ComplaintFeedback from "./Complaint";
import Maintainance from "./Maintainance";
import FinancialExpenses from "./FinancialExpenses";
import Financialdata from "./Financialdata";
import OwnerServices from "./Ownerservices";
import TempDisplay from "./TempDisplay";
import AddTenant from "./AddTenant"
import Gassensorinfo from "./Gassensorinfo";
import {
  Home, FileText, DollarSign, BarChart2, Thermometer, Wind,
  Menu, X, LogOut, User, ChevronRight, Settings, Bell
} from 'lucide-react';
import DisplayTenants from "./DisplayTenants";

function Owner({ oid, username, setLoginStatus ,login }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState(3);
  const [currentTime, setCurrentTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);
  const navItems = [
    { to: "/viewexpenses", label: "View Expenses", icon: <DollarSign size={18} />, color: "text-blue-500" },
    { to: "/addtenant", label: "Add New Tenant", icon: <User size={18} />, color: "text-peachpuff-500" },
    { to: "/lodgecomplaint", label: "Lodge Complaint", icon: <FileText size={18} />, color: "text-green-500" },
    { to: "/ownerservices", label: "Owner Services", icon: <User size={18} />, color: "text-purple-500" },
    { to: "/tenantview", label: "View Tenant Info", icon: <User size={18} />, color: "text-white-500" },
    { to: "/paymaintainence", label: "Pay Maintenance", icon: <DollarSign size={18} />, color: "text-amber-500" },
    { to: "/expensegraphicview", label: "Expense Graphics", icon: <BarChart2 size={18} />, color: "text-indigo-500" },
    { to: "/viewtemp", label: "Temperature", icon: <Thermometer size={18} />, color: "text-red-500" },
    { to: "/gasinfo", label: "Gas Info", icon: <Wind size={18} />, color: "text-cyan-500" },
  ];

  const NavLink = ({ to, children, className, color }) => {
    const location = useLocation();
    const isActive = location.pathname === to;

    return (
      <Link
        to={to}
        className={`flex items-center p-3 rounded-lg transition-all duration-200 ${isActive
          ? "bg-gradient-to-r from-blue-700 to-blue-600 text-white shadow-md"
          : `text-gray-200 hover:bg-gray-700 hover:text-white hover:translate-x-1`
          } ${className}`}
        onClick={() => setIsMenuOpen(false)}
      >
        {children}
      </Link>
    );
  };

  const formatDate = () => {
    return currentTime.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <header className="bg-gradient-to-r from-gray-900 to-gray-800 shadow-lg lg:hidden">
          <div className="flex items-center justify-between p-4">
            <h1 className="text-xl font-bold text-white flex items-center">
              <Home className="mr-2 text-yellow-400" size={20} />
              <span className="text-yellow-400">Owner</span>
              <span className="ml-1">Dashboard</span>
            </h1>
            <div className="flex items-center space-x-4">
              <button className="text-gray-300 relative">
                <Bell size={20} />
                {notifications > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    {notifications}
                  </span>
                )}
              </button>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-white focus:outline-none bg-gray-700 p-1 rounded-md"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {isMenuOpen && (
            <nav className="bg-gray-800 px-4 pb-4 shadow-lg animate-fade-in-down">
              <div className="py-3 px-4 border-b border-gray-700 mb-2">
                <div className="flex items-center space-x-3">
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-full text-white">
                    <User size={20} />
                  </div>
                  <div>
                    <div className="text-white font-medium">{username || "Owner"}</div>
                    <div className="text-xs text-gray-400">Property Owner</div>
                  </div>
                </div>
              </div>
              <ul className="space-y-2">
                {navItems.map((item) => (
                  <li key={item.to}>
                    <NavLink to={item.to} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className={`mr-3 ${item.color}`}>{item.icon}</span>
                        {item.label}
                      </div>
                      <ChevronRight size={16} className="text-gray-500" />
                    </NavLink>
                  </li>
                ))}
                <li className="pt-2 border-t border-gray-700">
                  <button
                    onClick={() => setLoginStatus(false)}
                    className="w-full flex items-center p-3 rounded-lg text-red-400 hover:bg-gray-700 hover:text-red-300"
                  >
                    <LogOut size={18} className="mr-3" />
                    Logout
                  </button>
                </li>
              </ul>
            </nav>
          )}
        </header>

        <div className="flex flex-1">
          {/* Sidebar navigation for desktop */}
          <aside className="hidden lg:block w-72 bg-gradient-to-b from-gray-900 to-gray-800 shadow-xl">
            <div className="p-6">
              <h1 className="text-xl font-bold text-white flex items-center">
                <Home className="mr-2 text-yellow-400" size={22} />
                <span className="text-yellow-400">Owner</span>
                <span className="ml-1">Dashboard</span>
              </h1>
              <div className="mt-6 bg-gray-800 rounded-lg p-4 border border-gray-700">
                <div className="flex items-center space-x-3">
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-full text-white">
                    <User size={20} />
                  </div>
                  <div>
                    <div className="text-white font-medium">{username || "Owner"}</div>
                    <div className="text-xs text-gray-400">Property Owner</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="px-4 py-2">
              <div className="text-xs uppercase text-gray-500 font-semibold tracking-wider pl-4 mb-2">Main Menu</div>
            </div>
            <nav>
              <ul className="space-y-1 px-4">
                {navItems.map((item) => (
                  <li key={item.to}>
                    <NavLink to={item.to}>
                      <span className={`mr-3 ${item.color}`}>{item.icon}</span>
                      {item.label}
                    </NavLink>
                  </li>
                ))}
                <li className="pt-6 mt-6 border-t border-gray-700">
                  <button
                    onClick={() => setLoginStatus(false)}
                    className="w-full flex items-center p-3 rounded-lg text-red-400 hover:bg-gray-700 hover:text-red-300 transition-all duration-200"
                  >
                    <LogOut size={18} className="mr-3" />
                    Logout
                  </button>
                </li>
              </ul>
            </nav>
          </aside>

          {/* Main content area */}
          <main className="flex-1 flex flex-col">
            {/* Top bar for desktop */}
            <div className="hidden lg:flex items-center justify-between bg-white p-4 shadow-sm border-b">
              <div className="text-sm breadcrumbs">
                <LocationDisplay />
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-gray-600 text-sm">{formatDate()}</div>
                <div className="relative">
                  <button className="text-gray-600 hover:text-gray-800 transition-colors">
                    <Bell size={20} />
                    {notifications > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                        {notifications}
                      </span>
                    )}
                  </button>
                </div>
                <div className="relative">
                  <button className="text-gray-600 hover:text-gray-800 transition-colors">
                    <Settings size={20} />
                  </button>
                </div>
                <div className="flex items-center border-l pl-4 ml-2">
                  <div className="bg-blue-100 text-blue-800 p-2 rounded-full">
                    <User size={18} />
                  </div>
                  <span className="ml-2 text-gray-700 font-medium">{username || "Owner"}</span>
                </div>
              </div>
            </div>

            {/* Content area */}
            <div className="p-6 flex-1 overflow-auto">
              <Routes>
                <Route path="/viewexpenses" element={<Financialdata />} />
                <Route path="/lodgecomplaint" element={<ComplaintFeedback />} />
                <Route path="/addtenant" element={<AddTenant oid={oid}  />} />
                <Route path="/ownerservices" element={<OwnerServices />} />
                <Route path="/tenantview" element={<DisplayTenants oid={oid}/>} />
                <Route path="/paymaintainence" element={<Maintainance oid={oid} login={login} />} />
                <Route path="/expensegraphicview" element={<FinancialExpenses />} />
                <Route path="/viewtemp" element={<TempDisplay />} />
                <Route path="/gasinfo" element={<Gassensorinfo />} />
                <Route path="/" element={<WelcomeDashboard username={username} />} />
              </Routes>
            </div>
          </main>
        </div>
      </div>
    </Router>
  );
}

// Helper component to display current location path
function LocationDisplay() {
  const location = useLocation();
  const path = location.pathname;

  if (path === "/") return <span className="flex items-center text-blue-600"><Home size={16} className="mr-1" /> Home</span>;

  const pathName = path.substring(1);
  const formattedPath = pathName
    .split(/(?=[A-Z])/)
    .join(" ")
    .replace(/([a-z])(\w*)/g, (_, first, rest) => first.toUpperCase() + rest);

  return (
    <div className="flex items-center">
      <Link to="/" className="text-blue-600 hover:text-blue-800 flex items-center transition-colors">
        <Home size={20} className="mr-1" /><b> Home</b>
      </Link>
      <ChevronRight size={16} className="mx-2 text-gray-400" />
      <span className="text-gray-600 font-medium">{formattedPath}</span>
    </div>
  );
}

// Welcome dashboard component for the home page
function WelcomeDashboard({ username }) {
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

  const quickLinks = [
    {
      to: "/viewexpenses", title: "View Expenses", icon: <DollarSign className="text-blue-500" size={24} />,
      desc: "Review financial records and expenses", color: "bg-blue-50 hover:bg-blue-100", textColor: "text-blue-800"
    },
    {
      to: "/addtenant", title: "Add New Tenant", icon: <User className="text-red-500" size={24} />,
      desc: "Add new tenants at your home", color: "bg-red-50 hover:bg-purple-100", textColor: "text-green-800"
    },
    {
      to: "/lodgecomplaint", title: "Lodge Complaint", icon: <FileText className="text-green-500" size={24} />,
      desc: "Submit issues or feedback", color: "bg-green-50 hover:bg-green-100", textColor: "text-green-800"
    },
    {
      to: "/tenantview", title: "View Tenants", icon: <User className="text-orange-500" size={24} />,
      desc: "View your tenant Info", color: "bg-green-50 hover:bg-green-100", textColor: "text-green-800"
    },
    {
      to: "/paymaintainence", title: "Pay Maintenance", icon: <DollarSign className="text-purple-500" size={24} />,
      desc: "Handle maintenance fees and payments", color: "bg-purple-50 hover:bg-purple-100", textColor: "text-purple-800"
    },
    {
      to: "/expensegraphicview", title: "Expense Graphics", icon: <BarChart2 className="text-indigo-500" size={24} />,
      desc: "Visualize financial data and trends", color: "bg-indigo-50 hover:bg-indigo-100", textColor: "text-indigo-800"
    },
    {
      to: "/viewtemp", title: "Temperature", icon: <Thermometer className="text-red-500" size={24} />,
      desc: "Monitor property temperature readings", color: "bg-red-50 hover:bg-red-100", textColor: "text-red-800"
    },
    {
      to: "/gasinfo", title: "Gas Info", icon: <Wind className="text-cyan-500" size={24} />,
      desc: "View gas sensor information", color: "bg-cyan-50 hover:bg-cyan-100", textColor: "text-cyan-800"
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome header */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-1">{greeting}, {username || "Owner"}</h2>
            <p className="text-gray-600">
              Welcome to your property management dashboard
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <Link to="/ownerservices" className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
              <Settings size={16} className="mr-2" />
              Manage Services
            </Link>
          </div>
        </div>
      </div>

      {/* Quick access grid */}
      <div>
        <h3 className="text-lg font-medium text-gray-800 mb-3">Quick Access</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`${link.color} p-5 rounded-lg transition-all duration-200 hover:shadow-md border border-gray-100 transform hover:-translate-y-1`}
            >
              <div className="mb-3">{link.icon}</div>
              <h3 className={`font-medium ${link.textColor}`}>{link.title}</h3>
              <p className="text-sm text-gray-600 mt-1">{link.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Owner;