import React, { useState, useEffect } from "react";
import axios from "axios";
import { Bar, Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title,
  ArcElement,
  PointElement,
  LineElement,
} from "chart.js";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title,
  ArcElement,
  PointElement,
  LineElement
);

function VisitorsInfo() {
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [visitorCount, setVisitorCount] = useState([]);
  const [loading, setLoading] = useState(false);
  const [chartType, setChartType] = useState("bar");
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });
  const [totalVisitors, setTotalVisitors] = useState(0);
  const [averageVisitors, setAverageVisitors] = useState(0);
  const [highestDay, setHighestDay] = useState({ date: "", count: 0 });
  const [previousPeriodData, setPreviousPeriodData] = useState(null);
  const [showComparison, setShowComparison] = useState(false);
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;


  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => (currentYear - 2 + i).toString());

  useEffect(() => {
    // Calculate statistics when visitor data changes
    if (visitorCount.length > 0) {
      const total = visitorCount.reduce((sum, item) => sum + item.count, 0);
      setTotalVisitors(total);

      const avg = total / visitorCount.length;
      setAverageVisitors(avg);

      const highest = visitorCount.reduce((max, item) =>
        item.count > max.count ? { date: item.date, count: item.count } : max,
        { date: "", count: 0 }
      );
      setHighestDay(highest);
    }
  }, [visitorCount]);

  const showNotification = (message, type = "success") => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "" });
    }, 3000);
  };

  const fetchVisitorCount = async () => {
    if (!year || !month) {
      showNotification("Please select both year and month", "error");
      return;
    }

    setLoading(true);
    try {
      const payload = { year, month };
      const response = await axios.post(
        `${API_BASE_URL}/security/visitor-count`,
        payload
      );

      if (response.data.success) {
        setVisitorCount(response.data.data);
        showNotification("Visitor data loaded successfully");

        // If there's data, check if we can fetch previous period for comparison
        if (response.data.data.length > 0) {
          fetchPreviousPeriodData();
        }
      } else {
        showNotification("Error fetching visitor count", "error");
      }
    } catch (err) {
      console.error(err);
      showNotification("An error occurred while fetching visitor count", "error");
    } finally {
      setLoading(false);
    }
  };

  const fetchPreviousPeriodData = async () => {
    // Calculate previous month and year
    let prevMonth = parseInt(month) - 1;
    let prevYear = parseInt(year);

    if (prevMonth === 0) {
      prevMonth = 12;
      prevYear -= 1;
    }

    // Format month to ensure it has leading zero if needed
    const formattedPrevMonth = prevMonth.toString().padStart(2, '0');

    try {
      const payload = { year: prevYear.toString(), month: formattedPrevMonth };
      const response = await axios.post(
        `${API_BASE_URL}/visitor-count`,
        payload
      );

      if (response.data.success && response.data.data.length > 0) {
        setPreviousPeriodData(response.data.data);
      } else {
        setPreviousPeriodData(null);
      }
    } catch (err) {
      console.error("Error fetching previous period data:", err);
      setPreviousPeriodData(null);
    }
  };

  const toggleComparison = () => {
    setShowComparison(!showComparison);
  };

  const getMonthName = (monthNum) => {
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    return months[parseInt(monthNum) - 1];
  };

  // Chart colors
  const chartColors = {
    primary: {
      backgroundColor: "rgba(59, 130, 246, 0.5)",
      borderColor: "rgba(59, 130, 246, 1)",
    },
    secondary: {
      backgroundColor: "rgba(16, 185, 129, 0.5)",
      borderColor: "rgba(16, 185, 129, 1)",
    },
    tertiary: {
      backgroundColor: "rgba(249, 115, 22, 0.5)",
      borderColor: "rgba(249, 115, 22, 1)",
    },
    comparison: {
      backgroundColor: "rgba(190, 24, 93, 0.5)",
      borderColor: "rgba(190, 24, 93, 1)",
    }
  };

  // Dynamic chart data based on chartType and whether comparison is shown
  const getChartData = () => {
    if (!visitorCount.length) return { labels: [], datasets: [] };

    // Basic current period dataset
    const currentDataset = {
      label: `${getMonthName(month)} ${year} Visitors`,
      data: visitorCount.map((item) => item.count),
      backgroundColor: chartColors.primary.backgroundColor,
      borderColor: chartColors.primary.borderColor,
      borderWidth: 2,
      barThickness: 20, // smaller value = thinner bars
      // or use maxBarThickness if you want it to auto-fit but not exceed a width
    };


    // For pie chart, use different colors for each day
    if (chartType === "pie") {
      currentDataset.backgroundColor = visitorCount.map((_, index) => {
        const hue = (index * 25) % 360;
        return `hsla(${hue}, 70%, 60%, 0.7)`;
      });
      currentDataset.borderColor = visitorCount.map((_, index) => {
        const hue = (index * 25) % 360;
        return `hsla(${hue}, 70%, 50%, 1)`;
      });
    }

    const datasets = [currentDataset];

    // Add comparison dataset if enabled and data exists
    if (showComparison && previousPeriodData) {
      // Need to align dates - get just the day part
      const prevDataByDay = {};
      previousPeriodData.forEach(item => {
        const day = parseInt(item.date.split('-')[2]);
        prevDataByDay[day] = item.count;
      });

      // Create comparison dataset with aligned days
      const comparisonData = visitorCount.map(item => {
        const day = parseInt(item.date.split('-')[2]);
        return prevDataByDay[day] || 0;
      });

      // Figure out previous month name
      let prevMonth = parseInt(month) - 1;
      let prevYear = parseInt(year);
      if (prevMonth === 0) {
        prevMonth = 12;
        prevYear -= 1;
      }

      datasets.push({
        label: `${getMonthName(prevMonth.toString())} ${prevYear} Visitors`,
        data: comparisonData,
        backgroundColor: chartColors.comparison.backgroundColor,
        borderColor: chartColors.comparison.borderColor,
        borderWidth: 2,
      });
    }

    return {
      labels: visitorCount.map((item) => {
        const day = item.date.split('-')[2];
        return `Day ${day}`;
      }),
      datasets
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: `Visitor Statistics for ${year ? getMonthName(month) + ' ' + year : 'Selected Period'}`,
        font: {
          size: 16,
          weight: 'bold'
        }
      },
      tooltip: {
        callbacks: {
          title: function (context) {
            const index = context[0].dataIndex;
            return visitorCount[index]?.date || 'Unknown Date';
          }
        }
      }
    },
    scales: chartType !== "pie" ? {
      x: {
        title: {
          display: true,
          text: 'Date'
        }
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Number of Visitors'
        }
      }
    } : {}
  };
  const renderChart = () => {
    const chartData = getChartData();
    if (loading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      );
    }
    if (visitorCount.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-lg h-64">
          <svg className="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
          </svg>
          <p className="mt-4 text-gray-500">No visitor data available</p>
          <p className="text-sm text-gray-400">Select a year and month and click "Fetch Data"</p>
        </div>
      );
    }
    switch (chartType) {
      case "bar":
        return <Bar data={chartData} options={chartOptions} />;
      case "line":
        return <Line data={chartData} options={chartOptions} />;
      case "pie":
        return <Pie data={chartData} options={chartOptions} />;
      default:
        return <Bar data={chartData} options={chartOptions} />;
    }
  };

  // Calculate growth rate if previous data exists
  const calculateGrowth = () => {
    if (!previousPeriodData || !visitorCount.length) return null;

    const currentTotal = visitorCount.reduce((sum, item) => sum + item.count, 0);
    const prevTotal = previousPeriodData.reduce((sum, item) => sum + item.count, 0);

    if (prevTotal === 0) return { rate: 100, positive: true };

    const growthRate = ((currentTotal - prevTotal) / prevTotal) * 100;
    return {
      rate: Math.abs(growthRate).toFixed(1),
      positive: growthRate >= 0
    };
  };

  const growth = calculateGrowth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8 px-4">
      {/* Notification */}
      {notification.show && (
        <div
          className={`fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300 ${notification.type === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"
            }`}
        >
          {notification.message}
        </div>
      )}

      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 py-6 px-8">
            <h1 className="text-2xl font-bold text-white">Visitor Analytics Dashboard</h1>
            <p className="text-blue-100 mt-1">Track and analyze visitor statistics</p>
          </div>

          <div className="p-6">
            {/* Filter Controls */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              {/* Year Dropdown */}
              <div>
                <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1">
                  Year
                </label>
                <select
                  id="year"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option value="" disabled>
                    Select Year
                  </option>
                  {years.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="month" className="block text-sm font-medium text-gray-700 mb-1">
                  Month
                </label>
                <select
                  id="month"
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option value="" disabled>
                    Select Month
                  </option>
                  {Array.from({ length: 12 }, (_, i) => {
                    const monthNum = (i + 1).toString().padStart(2, '0');
                    return (
                      <option key={monthNum} value={monthNum}>
                        {getMonthName(monthNum)}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div>
                <label htmlFor="chartType" className="block text-sm font-medium text-gray-700 mb-1">
                  Chart Type
                </label>
                <select
                  id="chartType"
                  value={chartType}
                  onChange={(e) => setChartType(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option value="bar">Bar Chart</option>
                  <option value="line">Line Chart</option>
                  <option value="pie">Pie Chart</option>
                </select>
              </div>
              <div className="flex items-end">
                <button
                  onClick={fetchVisitorCount}
                  disabled={loading}
                  className={`w-full py-2 px-4 rounded-md text-white font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${loading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                    }`}
                >
                  {loading ? "Loading..." : "Fetch Data"}
                </button>
              </div>
            </div>
            {visitorCount.length > 0 && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-100 shadow-sm">
                    <h3 className="text-sm font-medium text-blue-700">Total Visitors</h3>
                    <p className="text-3xl font-bold text-blue-800 mt-1">{totalVisitors}</p>
                    {growth && (
                      <div className={`flex items-center mt-2 text-sm ${growth.positive ? 'text-green-600' : 'text-red-600'}`}>
                        <span>{growth.positive ? '↑' : '↓'} {growth.rate}% from previous month</span>
                      </div>
                    )}
                  </div>
                  <div className="bg-green-50 rounded-lg p-4 border border-green-100 shadow-sm">
                    <h3 className="text-sm font-medium text-green-700">Average Daily</h3>
                    <p className="text-3xl font-bold text-green-800 mt-1">{averageVisitors.toFixed(1)}</p>
                    <p className="text-sm text-green-600 mt-2">visitors per day</p>
                  </div>

                  {/* Peak Day Card */}
                  <div className="bg-amber-50 rounded-lg p-4 border border-amber-100 shadow-sm">
                    <h3 className="text-sm font-medium text-amber-700">Peak Day</h3>
                    <p className="text-3xl font-bold text-amber-800 mt-1">{highestDay.count}</p>
                    <p className="text-sm text-amber-600 mt-2">on {highestDay.date}</p>
                  </div>
                </div>

                {/* Comparison Toggle - Only show when we have previous period data */}
                {previousPeriodData && (
                  <div className="flex justify-end mb-4">
                    <button
                      onClick={toggleComparison}
                      className={`flex items-center px-3 py-1.5 rounded text-sm font-medium transition-colors ${showComparison
                          ? 'bg-indigo-100 text-indigo-700'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                    >
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                        ></path>
                      </svg>
                      {showComparison ? "Hide Comparison" : "Compare with Previous Month"}
                    </button>
                  </div>
                )}
              </>
            )}

            {/* Chart Section */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 h-80">
              {renderChart()}
            </div>

            {/* Data Table - Only show when we have data */}
            {visitorCount.length > 0 && (
              <div className="mt-8">
                <h2 className="text-lg font-semibold text-gray-800 mb-3">Detailed Data</h2>
                <div className="overflow-x-auto bg-white rounded-lg border border-gray-200">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Day of Week
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Visitors
                        </th>
                        {previousPeriodData && showComparison && (
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Previous Month
                          </th>
                        )}
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          % of Total
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {visitorCount.map((item, index) => {
                        const date = new Date(item.date);
                        const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });
                        const percentOfTotal = ((item.count / totalVisitors) * 100).toFixed(1);

                        // Find matching day from previous period if available
                        let prevDayData = null;
                        if (previousPeriodData && showComparison) {
                          const currentDay = parseInt(item.date.split('-')[2]);
                          prevDayData = previousPeriodData.find(p => {
                            const prevDay = parseInt(p.date.split('-')[2]);
                            return prevDay === currentDay;
                          });
                        }

                        return (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                              {item.date}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {dayOfWeek}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                {item.count}
                              </span>
                            </td>
                            {previousPeriodData && showComparison && (
                              <td className="px-6 py-4 whitespace-nowrap">
                                {prevDayData ? (
                                  <span className="px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                                    {prevDayData.count}
                                  </span>
                                ) : (
                                  <span className="text-sm text-gray-500">N/A</span>
                                )}
                              </td>
                            )}
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div
                                  className="bg-blue-600 h-2.5 rounded-full"
                                  style={{ width: `${percentOfTotal}%` }}
                                ></div>
                              </div>
                              <span className="text-xs text-gray-500 mt-1 block">{percentOfTotal}%</span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-gray-500 text-sm">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
}

export default VisitorsInfo;