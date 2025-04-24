import React, { useState, useEffect } from "react";
import { Users, Building, DollarSign, Calendar } from "lucide-react";
import axios from "axios";

function DashboardOverview() {

  const [statss, setStats] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:9000/api/getstats")
      .then((response) => {
        setStats(response.data);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);
  // This would normally be populated from your API/backend
  const stats = {
    owners: 24,
    apartments: 1,
    employees: 2,
    pendingPayments: 5
  };

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Flat Owners"
          value={stats.owners}
          icon={<Users size={24} />}
          color="bg-blue-500"
        />
        <StatCard
          title="Apartments"
          value={stats.apartments}
          icon={<Building size={24} />}
          color="bg-green-500"
        />
        <StatCard
          title="Employees"
          value={stats.employees}
          icon={<Users size={24} />}
          color="bg-purple-500"
        />
        <StatCard
          title="Pending Payments"
          value={stats.pendingPayments}
          icon={<DollarSign size={24} />}
          color="bg-amber-500"
        />
      </div>

      {/* Recent Activity and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h2>
          <div className="space-y-4">
            <ActivityItem
              title="Maintenance Fee Payment"
              description="Shashikala Bandivadekar (Apt 302) paid ₹20000"
              time="Today, 2:30 PM"
              icon={<DollarSign size={16} />}
              color="bg-green-100 text-green-600"
            />
            <ActivityItem
              title="New Owner Registered"
              description="Manorama Kshirsagar added as owner of Apt 205"
              time="Yesterday, 10:15 AM"
              icon={<Users size={16} />}
              color="bg-blue-100 text-blue-600"
            />
            <ActivityItem
              title="Expense Recorded"
              description="₹1,200 for lobby renovation"
              time="Feb 24, 2025, 4:45 PM"
              icon={<DollarSign size={16} />}
              color="bg-purple-100 text-purple-600"
            />
            <ActivityItem
              title="New Employee Added"
              description="P.Dhyamanna - Security Guard"
              time="Feb 22, 2025, 9:30 AM"
              icon={<Users size={16} />}
              color="bg-blue-100 text-blue-600"
            />
          </div>
          {/* <button className="mt-4 text-sm text-indigo-600 hover:text-indigo-800 font-medium">
            View All Activity →
          </button> */}
        </div>

        {/* Quick Actions */}
        {/* <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <ActionButton label="Record New Payment" icon={<DollarSign size={18} />} />
            <ActionButton label="Add New Owner"  icon={<Users size={18} />} />
            <ActionButton label="Register Apartment" icon={<Building size={18} />} />
            <ActionButton label="Record Expense" icon={<DollarSign size={18} />} />
            <ActionButton label="Generate Monthly Report" icon={<Calendar size={18} />} />
          </div>
        </div> */}
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center">
        <div className={`rounded-full p-3 ${color} text-white mr-4`}>
          {icon}
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-3xl font-bold text-gray-800">{value}</p>
        </div>
      </div>
    </div>
  );
}

function ActivityItem({ title, description, time, icon, color }) {
  return (
    <div className="flex">
      <div className={`rounded-full p-2 ${color} mr-4 h-10 w-10 flex items-center justify-center flex-shrink-0`}>
        {icon}
      </div>
      <div className="flex-1">
        <p className="font-medium text-gray-800">{title}</p>
        <p className="text-sm text-gray-600">{description}</p>
        <p className="text-xs text-gray-400 mt-1">{time}</p>
      </div>
    </div>
  );
}

function ActionButton({ label, icon }) {
  return (
    <button className="w-full flex items-center px-4 py-3 text-left text-gray-700 rounded-lg hover:bg-gray-100 transition-colors duration-200">
      <span className="mr-3 text-indigo-600">{icon}</span>
      <span>{label}</span>
    </button>
  );
}

export default DashboardOverview;