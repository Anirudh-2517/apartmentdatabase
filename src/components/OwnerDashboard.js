import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Link, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import {
  Home, FileText, DollarSign, BarChart2, Thermometer, Wind,
  Menu, X, LogOut, User, ChevronRight, Settings, Bell,
  IndianRupee,
  HomeIcon
} from 'lucide-react';
import ComplaintFeedback from "../owner/Complaint";
import Maintainance from "../owner/Maintainance";
import FinancialExpenses from "../admin/FinancialExpenses";
import Financialdata from "../owner/Financialdata";
import OwnerServices from "../owner/Ownerservices";
import TempDisplay from "../owner/TempDisplay";
import AddTenant from "../owner/AddTenant";
import MonthlyExpenseAnalysis from '../admin/MonthlyExpenseAnalysis'
import Gassensorinfo from "../owner/Gassensorinfo";
import DisplayTenants from "../owner/DisplayTenants";
import PredictRent from "./PredictRent";
import BookFlat from "./BookFlat";

function Owner({ oid, username, setLoginStatus, login, imageURL }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState(3);
  const [currentTime, setCurrentTime] = useState(new Date());
  const navigate = useNavigate();
  const logout = () => {
    setLoginStatus(false);
    navigate('/login');
  };

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const navItems = [
    { to: "/", label: "Dasboard Home", icon: <HomeIcon size={18} />, color: "text-blue-500" },
    { to: "/viewexpenses", label: "View Expenses", icon: <IndianRupee size={18} />, color: "text-blue-500" },
    { to: "/lodgecomplaint", label: "Lodge Complaint", icon: <FileText size={18} />, color: "text-green-500" },
    { to: "/expensegraphicview", label: "Expense Graphics(Yearly)", icon: <BarChart2 size={18} />, color: "text-indigo-500" },
    { to: "/paymaintainence", label: "Pay Maintenance", icon: <IndianRupee size={18} />, color: "text-amber-500" },
    { to: "/expensemonthlyview", label: "Expense Graphics(Monthly)", icon: <BarChart2 size={18} />, color: "text-blue-500" },
    { to: "/viewtemp", label: "Temperature", icon: <Thermometer size={18} />, color: "text-red-500" },
    { to: "/gasinfo", label: "Gas Info", icon: <Wind size={18} />, color: "text-cyan-500" },
    { to: "/predictrent", label: "Predict Rent", icon: <IndianRupee size={18} />, color: "text-indigo-500" },
    { to: "/addtenant", label: "Add New Tenant", icon: <User size={18} />, color: "text-pink-500" },
    { to: "/tenantview", label: "View Tenant Info", icon: <User size={18} />, color: "text-orange-500" },
    { to: "/ownerservices", label: "Owner Services", icon: <User size={18} />, color: "text-purple-500" },
  ];

  const NavLink = ({ to, children, className = "" }) => {
    const location = useLocation();
    const isActive = location.pathname === to;
    return (
      <Link
        to={to}
        className={`flex items-center p-3 rounded-lg transition-all duration-200 ${isActive
          ? "bg-gradient-to-r from-blue-700 to-blue-600 text-white shadow-md"
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

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Mobile Header */}
      <header className="bg-gradient-to-r from-gray-900 to-gray-800 shadow-lg lg:hidden">
        <div className="flex items-center justify-between p-4">
          <h1 className="text-xl font-bold text-white flex items-center">
            <Home className="mr-2 text-yellow-400" size={20} />
            <span className="text-yellow-400">Owner</span> Dashboard
          </h1>
          <div className="flex items-center space-x-4">
            <button className="relative text-gray-300">
              <Bell size={20} />
              {notifications > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  {notifications}
                </span>
              )}
            </button>
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white bg-gray-700 p-1 rounded-md">
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
              <li className="pt-2 border-t border-gray-700">
                <button onClick={logout} className="w-full flex items-center p-3 text-red-400 hover:bg-gray-700 hover:text-red-300 rounded-lg">
                  <LogOut size={18} className="mr-3" />
                  Logout
                </button>
              </li>
            </ul>
          </nav>
        )}
      </header>

      {/* Layout */}
      <div className="flex flex-1">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-72 bg-gradient-to-b from-gray-900 to-gray-800 shadow-xl">
          <div className="p-6">
            <h1 className="text-xl font-bold text-white flex items-center">
              <Home className="mr-2 text-yellow-400" size={22} />
              <span className="text-yellow-400">Owner</span> Dashboard
            </h1>
            <div className="mt-6 bg-gray-800 rounded-lg p-4 border border-gray-700 flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-full text-white">
                <img src={imageURL} width="40px" height="40px" alt="ownersimages" style={{ borderRadius: "25px" }}></img>
              </div>
              <div>
                <div className="text-white font-medium">{username || "Owner"}</div>
                <div className="text-xs text-gray-400">Property Owner</div>
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
              <li className="pt-6 mt-6 border-t border-gray-700">
                <button onClick={logout} className="w-full flex items-center p-3 text-red-400 hover:bg-gray-700 hover:text-red-300 rounded-lg">
                  <LogOut size={18} className="mr-3" />
                  Logout
                </button>
              </li>
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col">
          <div className="hidden lg:flex items-center justify-between bg-white p-4 shadow-sm border-b">
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
                <div className="bg-blue-100 text-blue-800 p-2 rounded-full">
                  <User size={18} />
                </div>
                <span className="ml-2 text-gray-700 font-medium">{username || "Owner"}</span>
              </div>
            </div>
          </div>

          {/* Routes */}
          <div className="p-6 flex-1 overflow-auto">
            <Routes>
              <Route path="/" element={<WelcomeDashboard username={username} />} />
              <Route path="/viewexpenses" element={<Financialdata />} />
              <Route path="/lodgecomplaint" element={<ComplaintFeedback oid={oid} />} />
              <Route path="/addtenant" element={<AddTenant oid={oid} />} />
              <Route path="/expensemonthlyview" element={<MonthlyExpenseAnalysis />} />
              <Route path="/ownerservices" element={<OwnerServices />} />
              <Route path="/tenantview" element={<DisplayTenants oid={oid} />} />
              <Route path="/paymaintainence" element={<Maintainance oid={oid} login={login} />} />
              <Route path="/expensegraphicview" element={<FinancialExpenses />} />
              <Route path="/viewtemp" element={<TempDisplay />} />
              <Route path="/gasinfo" element={<Gassensorinfo />} />
              <Route path="/predictrent" element={<PredictRent />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
}
function LocationDisplay() {
  const location = useLocation();
  const path = location.pathname;
  const formattedPath = path === "/" ? "Home" : path.replace("/", "").replace(/([A-Z])/g, " $1").trim();

  return (
    <div className="flex items-center">
      <Link to="/" className="text-blue-600 hover:text-blue-800 flex items-center">
        <Home size={20} className="mr-1" /> <b>Home</b>
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

function WelcomeDashboard({ username }) {
  const [greeting, setGreeting] = useState("");
  useEffect(() => {
    const hour = new Date().getHours();
    setGreeting(hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening");
  }, []);

  const quickLinks = [
    { to: "/viewexpenses", title: "View Expenses", icon: <IndianRupee className="text-blue-500" size={24} />, desc: "Review financial records", color: "bg-blue-50", textColor: "text-blue-800" },
    { to: "/lodgecomplaint", title: "Complaint", icon: <FileText className="text-green-500" size={24} />, desc: "Submit issues", color: "bg-green-50", textColor: "text-green-800" },
    { to: "/addtenant", title: "Add Tenant", icon: <User className="text-pink-500" size={24} />, desc: "Add a new tenant", color: "bg-pink-50", textColor: "text-pink-800" },
    { to: "/tenantview", title: "Tenants", icon: <User className="text-orange-500" size={24} />, desc: "View tenants", color: "bg-orange-50", textColor: "text-orange-800" },
    { to: "/paymaintainence", title: "Maintenance", icon: <DollarSign className="text-purple-500" size={24} />, desc: "Pay dues", color: "bg-purple-50", textColor: "text-purple-800" },
    { to: "/expensegraphicview", title: "Graphs", icon: <BarChart2 className="text-indigo-500" size={24} />, desc: "Visualize expenses", color: "bg-indigo-50", textColor: "text-indigo-800" },
    { to: "/viewtemp", title: "Temperature", icon: <Thermometer className="text-red-500" size={24} />, desc: "Monitor temperature", color: "bg-red-50", textColor: "text-red-800" },
    { to: "/gasinfo", title: "Gas Info", icon: <Wind className="text-cyan-500" size={24} />, desc: "Check gas levels", color: "bg-cyan-50", textColor: "text-cyan-800" },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md border">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-1">{greeting}, {username || "Owner"}</h2>
            <p className="text-gray-600">Welcome to your property dashboard</p>
          </div>
          <Link to="/ownerservices" className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            <Settings size={16} className="mr-2" />
            Manage Services
          </Link>
        </div>
      </div>
      <div>
        <h3 className="text-lg font-medium text-gray-800 mb-3">Quick Access</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickLinks.map(link => (
            <Link key={link.to} to={link.to} className={`${link.color} p-5 rounded-lg border hover:shadow-md transition hover:-translate-y-1`}>
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