import React, { useState } from "react";
import { BrowserRouter as Router, Routes, useNavigate, Route, Link, useLocation } from "react-router-dom";
import { Home, Users, UserPlus, Building, DollarSign, Settings, LogOut, Menu, X } from "lucide-react";
import AddOwner from "../admin/Addowner";
import Addemployee from "../admin/Addemployee";
import FinancialExpenses from "../admin/FinancialExpenses";
import AddApartmentDetails from "../admin/AddApartmentDetails";
import AddFlatDetails from '../admin/AddFlatDetails'
import Adminsettings from "../admin/Adminsettings";
import DashboardOverview from "../admin/DashboardOverview"; // You'll need to create this component
import MonthlyExpenseAnalysis from "../admin/MonthlyExpenseAnalysis";

function AdminDashboard({ setLoginStatus }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const logout = () => {
    setLoginStatus(false);
    navigate('/login');
  };
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Mobile sidebar toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-md bg-white shadow-md"
        >
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <div className={`fixed lg:static inset-y-0 left-0 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition duration-300 ease-in-out bg-indigo-800 text-white w-64 z-40 overflow-y-auto`}>
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-6 text-center">Admin Dashboard</h1>
          <div className="space-y-4">
            <NavItem to="/" icon={<Home />} label="Home" />
            <NavItem to="/add-owner" icon={<Users />} label="Add Flat Owners" />
            <NavItem to="/addflatdetails" icon={<Users />} label="Add Flat Details" />
            <NavItem to="/add-employee" icon={<UserPlus />} label="Employees" />
            <NavItem to="/add-apartment" icon={<Building />} label="Apartments" />
            <NavItem to="/financial-expenses" icon={<DollarSign />} label="Expenses" />
            <NavItem to="/financial-year" icon={<Settings />} label="Settings" />

            <div className="pt-6 mt-6 border-t border-indigo-700">
              <button
                onClick={logout}
                className="flex items-center px-4 py-3 text-gray-100 hover:bg-indigo-700 rounded-md w-full transition-colors duration-200"
              >
                <div className="flex items-center text-red-500">
                  <LogOut className="mr-3" size={20} />
                  <span>Logout</span>
                </div>

              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm z-10">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
            <PageTitle />
          </div>
        </header>
        {/* Main content area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <Routes>
              <Route path="/" element={<DashboardOverview />} />
              <Route path="/monthlyexpenses" element={<MonthlyExpenseAnalysis />} />
              <Route path="/add-owner" element={<AddOwner />} />
              <Route path="/addflatdetails" element={<AddFlatDetails />} />
              <Route path="/add-employee" element={<Addemployee />} />
              <Route path="/add-apartment" element={<AddApartmentDetails />} />
              <Route path="/financial-expenses" element={<FinancialExpenses />} />
              <Route path="/financial-year" element={<Adminsettings />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
}

// Navigation Item Component
function NavItem({ to, icon, label }) {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`flex items-center px-4 py-3 rounded-md transition-colors duration-200 ${isActive
        ? 'bg-indigo-700 text-white'
        : 'text-indigo-100 hover:bg-indigo-700 hover:text-white'
        }`}
    >
      <span className="mr-3">{icon}</span>
      <span>{label}</span>
    </Link>
  );
}
// Dynamic Page Title based on current route
function PageTitle() {
  const location = useLocation();
  const path = location.pathname;

  const titles = {
    '/': 'Dashboard Overview',
    '/add-owner': 'Manage Flat Owners',
    '/add-employee': 'Manage Employees',
    '/add-apartment': 'Apartment Management',
    '/financial-expenses': 'Financial Expenses',
    '/financial-year': 'System Settings'
  };
  return (
    <h1 className="text-2xl font-semibold text-gray-800">
      {titles[path] || 'Admin Dashboard'}
    </h1>
  );
}

export default AdminDashboard;