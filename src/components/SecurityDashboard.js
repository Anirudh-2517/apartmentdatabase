import React, { useState } from 'react';
import { Home, Users, UserPlus, List, LogOut, Bell } from 'lucide-react';
import AddVisitors from '../security/AddVisitor';
import DisplayVisitors from '../security/DisplayVisitors';
import VisitorsInfo from '../security/VisitorsInfo';

function SecurityDashboard({ setLoginStatus,setScannedData,scannedData,formData,setFormData}) {
    const [activeTab, setActiveTab] = useState('home');
    const userName = "Security";
    const currentTime = new Date();
    const hours = currentTime.getHours();

    let greeting = "Good morning";
    if (hours >= 12 && hours < 17) {
        greeting = "Good afternoon";
    } else if (hours >= 17) {
        greeting = "Good evening";
    }

    const navItems = [
        { id: 'home', icon: <Home className="h-5 w-5" />, label: 'Dashboard' },
        { id: 'add-visitors', icon: <UserPlus className="h-5 w-5" />, label: 'Add Visitors' },
        { id: 'display-visitors', icon: <List className="h-5 w-5" />, label: 'Visitor Records' },
        { id: 'visitors-info', icon: <Users className="h-5 w-5" />, label: 'Visitors Info' }
    ];

    const renderComponent = () => {
        switch (activeTab) {
            case 'home':
                return <HomePage greeting={greeting} userName={userName} setActiveTab={setActiveTab} />;
            case 'add-visitors':
                return <AddVisitors formData={formData} setFormData={setFormData} setScannedData={setScannedData} scannedData={scannedData}/>;
            case 'display-visitors':
                return <DisplayVisitors />;
            case 'visitors-info':
                return <VisitorsInfo />;
            default:
                return <HomePage greeting={greeting} userName={userName} setActiveTab={setActiveTab} />;
        }
    };

    return (
        <div className="flex h-screen bg-gray-100">
            <div className="w-64 bg-white shadow-lg">
                <div className="flex items-center justify-center h-16 border-b">
                    <h1 className="text-xl font-bold text-blue-600">Secured Site</h1>
                </div>
                <div className="py-4">
                    <ul>
                        {navItems.map((item) => (
                            <li key={item.id}>
                                <button
                                    onClick={() => setActiveTab(item.id)}
                                    className={`flex items-center w-full px-6 py-3 text-left transition duration-150 ease-in-out ${activeTab === item.id
                                        ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600'
                                        : 'text-gray-600 hover:bg-gray-100'
                                        }`}
                                >
                                    <span className="mr-3">{item.icon}</span>
                                    <span>{item.label}</span>
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="absolute bottom-0 w-64 border-t">
                    <button
                        onClick={() => setLoginStatus(false)}
                        className="flex items-center w-full px-6 py-4 text-left text-red-600 hover:bg-red-50"
                    >
                        <LogOut className="h-5 w-5 mr-3" />
                        <span>Logout</span>
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-auto">
                <div className="bg-white shadow-sm sticky top-0 z-10">
                    <div className="flex justify-between items-center px-6 py-3">
                        <h2 className="text-lg font-semibold text-gray-800">Security Dashboard</h2>
                        <div className="flex items-center space-x-4">
                            <button className="relative p-2 rounded-full hover:bg-gray-100">
                                <Bell className="h-5 w-5 text-gray-600" />
                                <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                                    3
                                </span>
                            </button>
                            <div className="flex items-center">
                                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
                                    {userName.split(' ').map(name => name[0]).join('')}
                                </div>
                                <span className="ml-2 text-sm font-medium text-gray-700">{userName}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-6">
                    {renderComponent()}
                </div>
            </div>
        </div>
    );
}

function HomePage({ greeting, userName, setActiveTab }) {
    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800">{greeting}, {userName}!</h1>
                <p className="text-gray-600 mt-1">Welcome to your security dashboard. Use the menu to navigate.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                    <div className="text-gray-500 text-sm font-medium">Total Visitors Today</div>
                    <div className="text-3xl font-bold text-gray-800 mt-2">24</div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                    <div className="text-gray-500 text-sm font-medium">Expected Visitors</div>
                    <div className="text-3xl font-bold text-gray-800 mt-2">12</div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                    <div className="text-gray-500 text-sm font-medium">System Status</div>
                    <div className="flex items-center mt-2">
                        <div className="h-3 w-3 rounded-full bg-green-500 mr-2"></div>
                        <div className="text-sm">All systems operational</div>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-medium text-gray-800 mb-4">Quick Access</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button
                        onClick={() => setActiveTab('add-visitors')}
                        className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-200"
                    >
                        <UserPlus className="h-8 w-8 text-blue-600 mb-2" />
                        <span className="text-gray-700">Add Visitor</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('visitors-info')}
                        className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-200"
                    >
                        <Users className="h-8 w-8 text-blue-600 mb-2" />
                        <span className="text-gray-700">Visitor Info</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('display-visitors')}
                        className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-200"
                    >
                        <List className="h-8 w-8 text-blue-600 mb-2" />
                        <span className="text-gray-700">View Records</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default SecurityDashboard;
