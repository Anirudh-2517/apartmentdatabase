import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  useLocation,
  Navigate
} from "react-router-dom";
import {
  Bell,
  LogOut,
  Settings,
  User,
  Home,
  CreditCard,
  FileText,
  Mail,
  DollarSign,
  AlertCircle,
  PlusCircle,
  ChevronRight,
  Menu,
  X,
  Calendar,
  Clock,
  BarChart3,
  Building,
  Shield,
  Users,
  Sun,
  Moon,
  Coffee
} from "lucide-react";
import Employee from "./Employee";
import Paymentdue from "./Paymentdue";
import Raisedemand from "./Raisedemand";
import SendReminder from "./SendReminder";
import Viewcomplaints from "./Viewcomplaints";
import AddExpense from "./AddExpense";

function NavLink({ to, label, icon }) {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
        isActive
          ? "bg-gray-700 text-white shadow-lg transform scale-105"
          : "text-gray-300 hover:bg-gray-800 hover:text-white hover:transform hover:translate-x-1"
      }`}
    >
      <span className={`mr-3 ${isActive ? "text-yellow-400" : ""}`}>{icon}</span>
      {label}
    </Link>
  );
}

// Card component for the home dashboard
function DashboardCard({ title, icon, description, linkTo, count, color = "blue" }) {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-600 border-blue-100 hover:border-blue-300",
    green: "bg-green-50 text-green-600 border-green-100 hover:border-green-300",
    purple: "bg-purple-50 text-purple-600 border-purple-100 hover:border-purple-300",
    orange: "bg-orange-50 text-amber-600 border-orange-100 hover:border-orange-300",
    red: "bg-red-50 text-red-600 border-red-100 hover:border-red-300",
    indigo: "bg-indigo-50 text-indigo-600 border-indigo-100 hover:border-indigo-300"
  };
  
  const iconBgClass = colorClasses[color].split(' ')[0];
  const iconTextClass = colorClasses[color].split(' ')[1];
  const borderClass = colorClasses[color].split(' ')[2];
  const hoverClass = colorClasses[color].split(' ')[3];

  return (
    <Link 
      to={linkTo} 
      className={`bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border ${borderClass} ${hoverClass} flex flex-col h-full transform hover:scale-105`}
    >
      <div className="p-5">
        <div className="flex items-center justify-between mb-3">
          <div className={`${iconBgClass} p-3 rounded-lg`}>
            {React.cloneElement(icon, { className: iconTextClass })}
          </div>
          {count !== undefined && (
            <div className={`${iconBgClass} px-3 py-1 rounded-full ${iconTextClass} text-sm font-medium`}>
              {count}
            </div>
          )}
        </div>
        <h3 className="font-semibold text-lg text-gray-800 mb-1">{title}</h3>
        <p className="text-gray-600 text-sm">{description}</p>
      </div>
      <div className="mt-auto p-4 border-t border-gray-100 flex items-center justify-end text-blue-600 text-sm font-medium">
        View Details <ChevronRight size={16} className="ml-1" />
      </div>
    </Link>
  );
}

// Function to get greeting based on time of day
function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

// Home dashboard component
function Dashboard() {
  return (
    <div className="space-y-6 pb-6">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl p-6 text-white shadow-lg">
        <div className="flex items-center space-x-2 mb-1">
          {new Date().getHours() < 12 ? (
            <Sun size={24} className="text-yellow-300" />
          ) : new Date().getHours() < 17 ? (
            <Sun size={24} className="text-yellow-300" />
          ) : (
            <Moon size={24} className="text-blue-300" />
          )}
          <h2 className="text-xl font-medium text-blue-100">{getGreeting()}, Secretary!</h2>
        </div>
        <h1 className="text-2xl font-bold mb-2">Welcome to Your Dashboard</h1>
        <p className="opacity-90">Manage society finances, communications, and operations efficiently from one place.</p>
        <div className="flex items-center mt-4 text-sm">
          <div className="flex items-center mr-4">
            <Clock size={16} className="mr-1" />
            <span>{new Date().toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</span>
          </div>
          <div className="flex items-center">
            <Calendar size={16} className="mr-1" />
            <span>5 tasks pending today</span>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <DashboardCard 
          title="Add Expense" 
          icon={<PlusCircle size={24} />} 
          description="Record and categorize new society expenses"
          linkTo="/add-expense"
          color="blue"
        />
        
        <DashboardCard 
          title="Send Reminders" 
          icon={<Mail size={24} />} 
          description="Send payment reminders to residents"
          linkTo="/send-reminder"
          count="5"
          color="purple"
        />
        
        <DashboardCard 
          title="Process Salaries" 
          icon={<DollarSign size={24} />} 
          description="Manage and process staff salary payments"
          linkTo="/make-salary"
          color="green"
        />
        
        <DashboardCard 
          title="Raise Demands" 
          icon={<FileText size={24} />} 
          description="Create payment requests for society members"
          linkTo="/raise-demand"
          color="orange"
        />
        
        <DashboardCard 
          title="Payment Dues" 
          icon={<CreditCard size={24} />} 
          description="Track outstanding payments and dues"
          linkTo="/view-paymentdues"
          count="12"
          color="red"
        />
        
        <DashboardCard 
          title="Complaints" 
          icon={<AlertCircle size={24} />} 
          description="View and manage resident complaints"
          linkTo="/view-lodgedcomplaints"
          count="3"
          color="indigo"
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-md p-5 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg text-gray-800 flex items-center">
              <Clock size={18} className="mr-2 text-blue-500" /> Recent Activities
            </h3>
            <button className="text-blue-600 text-sm font-medium hover:underline">
              View All
            </button>
          </div>
          <div className="space-y-3">
            {[
              { text: "Payment reminder sent to Flat 203", time: "10 minutes ago", icon: <Mail size={16} className="text-purple-500" /> },
              { text: "New complaint registered from Flat 108", time: "1 hour ago", icon: <AlertCircle size={16} className="text-red-500" /> },
              { text: "Maintenance expense of ₹12,500 added", time: "3 hours ago", icon: <PlusCircle size={16} className="text-green-500" /> },
              { text: "Salary processed for security staff", time: "Yesterday", icon: <DollarSign size={16} className="text-blue-500" /> }
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <div className="flex items-center">
                  <div className="bg-gray-100 p-2 rounded-full mr-3">
                    {activity.icon}
                  </div>
                  <span className="text-gray-700">{activity.text}</span>
                </div>
                <span className="text-xs text-gray-500">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-5 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg text-gray-800 flex items-center">
              <BarChart3 size={18} className="mr-2 text-blue-500" /> Quick Stats
            </h3>
            <div className="bg-blue-50 text-blue-600 px-2 py-1 rounded text-xs font-medium">
              This Month
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Total Revenue", value: "₹2,45,000", change: "+5.2%", icon: <DollarSign size={20} className="text-green-500" /> },
              { label: "Pending Dues", value: "₹32,750", change: "-2.1%", icon: <CreditCard size={20} className="text-red-500" /> },
              { label: "Expenses", value: "₹1,18,300", change: "+1.8%", icon: <FileText size={20} className="text-orange-500" /> },
              { label: "Active Complaints", value: "7", change: "-3", icon: <AlertCircle size={20} className="text-purple-500" /> }
            ].map((stat, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors duration-200">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm text-gray-500 flex items-center">
                    {stat.icon}
                    <span className="ml-2">{stat.label}</span>
                  </div>
                </div>
                <div className="flex items-end justify-between">
                  <div className="text-lg font-semibold text-gray-900">{stat.value}</div>
                  <div className={`text-xs font-medium px-2 py-1 rounded ${stat.change.startsWith('+') ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                    {stat.change}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl shadow-lg p-6 text-white">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
            <div className="space-y-2 mb-4 md:mb-0">
              <h3 className="text-xl font-semibold flex items-center">
                <Building size={20} className="mr-2 text-yellow-400" />
                Society Overview
              </h3>
              <p className="text-gray-300 text-sm">Update society information and settings</p>
            </div>
            <div className="flex space-x-4">
              <div className="bg-gray-800 p-3 rounded-lg border border-gray-700 text-center flex flex-col justify-center min-w-16">
                <span className="text-sm text-gray-400">Buildings</span>
                <span className="text-xl font-bold">3</span>
              </div>
              <div className="bg-gray-800 p-3 rounded-lg border border-gray-700 text-center flex flex-col justify-center min-w-16">
                <span className="text-sm text-gray-400">Units</span>
                <span className="text-xl font-bold">124</span>
              </div>
              <div className="bg-gray-800 p-3 rounded-lg border border-gray-700 text-center flex flex-col justify-center min-w-16">
                <span className="text-sm text-gray-400">Staff</span>
                <span className="text-xl font-bold">18</span>
              </div>
            </div>
          </div>
          <div className="flex space-x-4 mt-6">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm flex items-center transition-colors duration-200">
              <Shield size={16} className="mr-1" /> Security Staff
            </button>
            <button className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm flex items-center transition-colors duration-200">
              <Users size={16} className="mr-1" /> Society Members
            </button>
            <button className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm flex items-center transition-colors duration-200">
              <Settings size={16} className="mr-1" /> Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Secretary({ setLoginStatus }) {
  const [userName] = useState("Secretary");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = () =>
    currentTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const formatDate = () =>
    currentTime.toLocaleDateString([], {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    });

  const getPageTitle = () => {
    const titles = {
      "/": "Dashboard Overview",
      "/add-expense": "Add Expense",
      "/send-reminder": "Send Reminder",
      "/make-salary": "Process Salaries",
      "/raise-demand": "Raise Demand",
      "/view-paymentdues": "Payment Dues",
      "/view-lodgedcomplaints": "Complaints Management"
    };
    return titles[location.pathname] || "Secretary Dashboard";
  };

  const navigationItems = [
    {
      path: "/",
      label: "Dashboard",
      icon: <Home size={18} />
    },
    {
      path: "/add-expense",
      label: "Add Expense",
      icon: <PlusCircle size={18} />
    },
    {
      path: "/send-reminder",
      label: "Send Reminder",
      icon: <Mail size={18} />
    },
    {
      path: "/make-salary",
      label: "Process Salaries",
      icon: <DollarSign size={18} />
    },
    {
      path: "/raise-demand",
      label: "Raise Demand",
      icon: <FileText size={18} />
    },
    {
      path: "/view-paymentdues",
      label: "Payment Dues",
      icon: <CreditCard size={18} />
    },
    {
      path: "/view-lodgedcomplaints",
      label: "Complaints",
      icon: <AlertCircle size={18} />
    }
  ];
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        ></div>
      )}
      <aside 
        className={`${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        } fixed top-0 left-0 h-full z-50 lg:z-0 lg:static lg:translate-x-0 w-72 bg-gradient-to-b from-gray-900 to-gray-800 shadow-xl transition-transform duration-300 ease-in-out flex flex-col`}
      >
        <div className="p-6">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-white flex items-center">
              <Coffee className="mr-2 text-yellow-400" size={22} />
              <span className="text-yellow-400">Secretary</span>
              <span className="ml-1 text-white">Dashboard</span>
            </h1>
            <button 
              className="lg:hidden text-gray-400 hover:text-white"
              onClick={() => setMobileMenuOpen(false)}
            >
              <X size={20} />
            </button>
          </div>
          <div className="mt-6 bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-full text-white">
                <User size={20} />
              </div>
              <div>
                <div className="text-white font-medium">{userName}</div>
                <div className="text-xs text-gray-400">Society Secretary</div>
              </div>
            </div>
          </div>
        </div>
        <div className="px-4 py-2">
          <div className="text-xs uppercase text-gray-500 font-semibold tracking-wider pl-4 mb-2">
            Main Menu
          </div>
        </div>
        <nav className="px-4 space-y-1 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
          {navigationItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              label={item.label}
              icon={item.icon}
            />
          ))}
        </nav>
        <div className="p-4 border-t border-gray-700 mt-auto">
          <button
            onClick={() => setLoginStatus(false)}
            className="w-full flex items-center p-3 rounded-lg text-red-400 hover:bg-gray-700 hover:text-red-300 transition-all duration-200"
          >
            <LogOut size={18} className="mr-3" />
            Logout
          </button>
        </div>
      </aside>
      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="bg-white p-4 shadow-sm border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center">
            <button 
              className="mr-4 text-gray-500 hover:text-gray-700 lg:hidden"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu size={24} />
            </button>
            <div className="flex items-center">
              <div className="text-lg font-semibold text-gray-800">
                {getPageTitle()}
              </div>
              <div className="ml-4 px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-600 flex items-center">
                <Clock size={14} className="mr-1" />
                {formatTime()}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="hidden md:block text-gray-600 text-sm">
              <span className="font-medium text-blue-600">{getGreeting()}</span>, {userName}
            </div>
            <button 
              className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors duration-200"
              aria-label="Notifications"
            >
              <Bell size={20} />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            </button>
            <button 
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors duration-200"
              aria-label="Settings"
            >
              <Settings size={20} />
            </button>
            <div className="hidden md:flex items-center border-l pl-4 ml-2 border-gray-200">
              <div className="bg-blue-100 text-blue-800 p-2 rounded-full">
                <User size={18} />
              </div>
              <span className="ml-2 text-gray-700 font-medium">
                {userName}
              </span>
            </div>
          </div>
        </div>
        <div className="bg-white px-6 py-2 text-sm border-b border-gray-100">
          <div className="flex items-center text-gray-500">
            <Link to="/" className="hover:text-blue-600 flex items-center">
              <Home size={14} className="mr-1" /> Home
            </Link>
            {location.pathname !== "/" && (
              <>
                <ChevronRight size={16} className="mx-2" />
                <span className="text-gray-800">{getPageTitle()}</span>
              </>
            )}
          </div>
        </div>
        <div className="flex-1 overflow-y-auto bg-gray-50 p-6">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/add-expense" element={<AddExpense />} />
            <Route path="/send-reminder" element={<SendReminder />} />
            <Route path="/make-salary" element={<Employee />} />
            <Route path="/raise-demand" element={<Raisedemand />} />
            <Route path="/view-paymentdues" element={<Paymentdue />} />
            <Route path="/view-lodgedcomplaints" element={<Viewcomplaints />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

export default function SecretaryWrapper({ setLoginStatus }) {
  return (
    <Router>
      <Secretary setLoginStatus={setLoginStatus} />
    </Router>
  );
}