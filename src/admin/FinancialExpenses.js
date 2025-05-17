import React, { useState, useEffect } from "react";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from "chart.js";
import axios from "axios";
import { ChevronDown } from "lucide-react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

const FinancialExpenses = () => {
  const [expenseData, setExpenseData] = useState([]);
  const [comparisonYears, setComparisonYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState("2022-2023");
  const [loading, setLoading] = useState(true);
  const [chartType, setChartType] = useState("bar");
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationType, setNotificationType] = useState("success");
  const [totalExpenseAmount, setTotalExpenseAmount] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  const years = [
    "2022-2023",
    "2023-2024",
    "2024-2025",
    "2025-2026",
    "2026-2027",
    "2027-2028",
    "2028-2029",
    "2029-2030",
  ];

  const displayNotification = (message, type = "success") => {
    setNotificationMessage(message);
    setNotificationType(type);
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  };

  useEffect(() => {
    fetchExpenseData(selectedYear);
  }, []);

  const fetchExpenseData = (year) => {
    setLoading(true);
    axios
      .get(`${API_BASE_URL}/admin/getsummaryexpenses/` + year)
      .then((response) => {
        const data = response.data || [];

        // Extract years present in data (excluding name field)
        const detectedYears = [...new Set(
          data.flatMap((item) => Object.keys(item).filter((key) => key !== "personOrAgencyName"))
        )];

        setComparisonYears(detectedYears);
        setExpenseData(data);

        const total = data.reduce((sum, item) =>
          detectedYears.reduce((acc, y) => acc + (item[y] || 0), sum), 0
        );
        setTotalExpenseAmount(total);

        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching summary expenses:", error);
        displayNotification("Failed to load expense data. Please try again later.", "error");
        setLoading(false);
      });
  };

  const handleYearSelect = (year) => {
    setSelectedYear(year);
    fetchExpenseData(year);
    setDropdownOpen(false);
    sendSelectedYearData(year);
  };

  const sendSelectedYearData = (year) => {
    setLoading(true);
    axios
      .post(`${API_BASE_URL}/admin/setyear`, { selectedYear: year })
      .then(() => {
        displayNotification(`Year ${year} selected successfully`);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error sending selected year:", error);
        setLoading(false);
      });
  };

  const chartColors = {
    doughnut: {
      backgroundColor: expenseData.map((_, index) => `hsla(${(index * 60) % 360}, 70%, 60%, 0.8)`),
      borderColor: expenseData.map((_, index) => `hsla(${(index * 60) % 360}, 70%, 50%, 1)`),
    }
  };

  const overallChartData = {
    labels: expenseData.map((item) => item.personOrAgencyName || "Unknown"),
    datasets: comparisonYears.map((year, index) => ({
      label: `Expenses ${year}`,
      data: expenseData.map((item) => item[year] || 0),
      backgroundColor: chartType === "doughnut"
        ? chartColors.doughnut.backgroundColor[index % chartColors.doughnut.backgroundColor.length]
        : `hsl(${(index * 60) % 360}, 70%, 60%)`,
      borderColor: chartType === "doughnut"
        ? chartColors.doughnut.borderColor[index % chartColors.doughnut.borderColor.length]
        : `hsl(${(index * 60) % 360}, 70%, 50%)`,
      borderWidth: 2,
      barThickness: chartType === "bar" ? 40 : undefined,
      borderRadius: chartType === "bar" ? 8 : 0,
      tension: 0.4,
    })),
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true, position: "top" },
      title: {
        display: true,
        text:
          chartType === "doughnut"
            ? "Expense Distribution"
            : `Financial Overview: ${comparisonYears.join(" vs ")}`,
        font: { size: 18, weight: "bold" },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.dataset.label || "";
            const value = context.raw || 0;
            return `${label}: ₹${value.toLocaleString()}`;
          },
        },
      },
    },
    scales: chartType !== "doughnut"
      ? {
        x: { grid: { display: false } },
        y: {
          grid: { color: "rgba(209, 213, 219, 0.2)" },
          ticks: {
            callback: function (value) {
              return "₹" + value.toLocaleString();
            },
          },
        },
      }
      : {},
  };

  const renderChart = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      );
    }
    if (expenseData.length === 0) {
      return (
        <div className="flex justify-center items-center h-96 bg-gray-50 rounded-xl">
          <p className="text-center text-gray-500 text-lg">No expense data available</p>
        </div>
      );
    }
    switch (chartType) {
      case "bar":
        return <Bar data={overallChartData} options={chartOptions} />;
      case "doughnut":
        return <Doughnut data={overallChartData} options={chartOptions} />;
      case "line":
        return <Line data={overallChartData} options={chartOptions} />;
      default:
        return <Bar data={overallChartData} options={chartOptions} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-10">
      {showNotification && (
        <div
          className={`fixed top-6 right-6 px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300 ${notificationType === "success"
            ? "bg-green-500 text-white"
            : "bg-red-500 text-white"
            }`}
        >
          {notificationMessage}
        </div>
      )}
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-white shadow-xl rounded-2xl mb-8 p-8 border border-gray-100">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6">
            <h1 className="text-4xl font-bold text-indigo-800 mb-4 md:mb-0">
              Financial Expenses
            </h1>
            <div className="flex items-center space-x-3">
              <div className="px-4 py-2 bg-indigo-50 rounded-lg">
                <span className="text-sm text-indigo-600 font-medium">Total Expenses</span>
                <div className="text-2xl font-bold text-indigo-800">
                  ₹{totalExpenseAmount.toLocaleString()}
                </div>
              </div>
              <div className="px-4 py-2 bg-green-50 rounded-lg">
                <span className="text-sm text-green-600 font-medium">Categories</span>
                <div className="text-2xl font-bold text-green-800">{expenseData.length}</div>
              </div>
            </div>
          </div>
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center space-x-4" role="group">
              <div className="relative w-48">
                <label htmlFor="year-select" className="block text-sm font-medium text-gray-700 mb-1">
                  Financial Year
                </label>
                <button
                  type="button"
                  className="relative w-full bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  aria-haspopup="listbox"
                  aria-expanded={dropdownOpen}
                  aria-labelledby="year-select"
                >
                  <span className="block truncate">{selectedYear || "Select a year"}</span>
                  <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  </span>
                </button>
                {dropdownOpen && (
                  <ul
                    className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm"
                    tabIndex="-1"
                    role="listbox"
                    aria-labelledby="year-select"
                  >
                    {years.map((year) => (
                      <li
                        key={year}
                        className={`cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-indigo-100 ${selectedYear === year
                          ? "bg-indigo-50 text-indigo-700 font-medium"
                          : "text-gray-900"
                          }`}
                        onClick={() => handleYearSelect(year)}
                        role="option"
                        aria-selected={selectedYear === year}
                      >
                        {year}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <button
                type="button"
                onClick={() => setChartType("bar")}
                className={`px-4 py-2 text-sm font-medium rounded-l-lg ${chartType === "bar"
                  ? "bg-indigo-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
                  }`}
              >
                Bar Chart
              </button>
              <button
                type="button"
                onClick={() => setChartType("line")}
                className={`px-4 py-2 text-sm font-medium ${chartType === "line"
                  ? "bg-indigo-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
                  }`}
              >
                Line Chart
              </button>
              <button
                type="button"
                onClick={() => setChartType("doughnut")}
                className={`px-4 py-2 text-sm font-medium rounded-r-lg ${chartType === "doughnut"
                  ? "bg-indigo-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
                  }`}
              >
                Doughnut Chart
              </button>
            </div>
          </div>
          <div className="h-96 mb-12">{renderChart()}</div>
        </div>
      </div>
    </div>
  );
};

export default FinancialExpenses;
