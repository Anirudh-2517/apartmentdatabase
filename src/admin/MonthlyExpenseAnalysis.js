import React, { useState, useEffect } from 'react';
import { Bar, Doughnut, Line, PolarArea } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend, ArcElement, PointElement, LineElement, RadialLinearScale, Filler } from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend, ArcElement, PointElement, LineElement, RadialLinearScale, Filler);

const MonthlyExpenseAnalysis = () => {
  const [agency, setAgency] = useState('');
  const [year, setYear] = useState('');
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('summary');
  const [showFormInMobile, setShowFormInMobile] = useState(false);
  const [animateCharts, setAnimateCharts] = useState(false);
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    if (chartData) setTimeout(() => setAnimateCharts(true), 500);
  }, [chartData]);

  const handleSubmit = async () => {
    if (!agency || !year) {
      alert('Please select both agency and year.');
      return;
    }

    setLoading(true);
    setAnimateCharts(false);

    try {
      const response = await fetch(`${API_BASE_URL}/admin/getmonthlyexpenses/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agency, year })
      });

      if (!response.ok) throw new Error('Network response was not ok');

      const data = await response.json();
      const labels = data.map((item, index) => item.monthOfPayment || `Entry ${index + 1}`);
      const amounts = data.map(item => parseFloat(item.totalAmount));

      const colors = [
        'rgba(66, 133, 244, 0.8)',  // Google Blue
        'rgba(52, 168, 83, 0.8)',   // Google Green
        'rgba(251, 188, 5, 0.8)',   // Google Yellow
        'rgba(234, 67, 53, 0.8)',   // Google Red
        'rgba(109, 76, 219, 0.8)',  // Purple
        'rgba(26, 115, 232, 0.8)',  // Lighter Blue
        'rgba(0, 184, 217, 0.8)'    // Cyan
      ];

      const borderColors = colors.map(c => c.replace('0.8', '1'));

      const dataset = {
        labels,
        datasets: [{
          label: `${agency} - ${year}`,
          data: amounts,
          backgroundColor: colors,
          borderColor: borderColors,
          borderWidth: 1,
        }]
      };
      setChartData(dataset);
      setActiveTab('summary');
      setShowFormInMobile(false);
    } catch (error) {
      console.error('Error fetching data', error);
      alert('Failed to fetch expense data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = value => new Intl.NumberFormat('en-IN', {
    style: 'currency', currency: 'INR', maximumFractionDigits: 0
  }).format(value);

  const calculateTotal = () => chartData?.datasets[0].data.reduce((sum, val) => sum + val, 0) || 0;

  const getHighestCategory = () => {
    if (!chartData) return null;
    const max = Math.max(...chartData.datasets[0].data);
    const index = chartData.datasets[0].data.indexOf(max);
    return {
      category: chartData.labels[index],
      amount: max,
      percentage: ((max / calculateTotal()) * 100).toFixed(1)
    };
  };

  const getLowestCategory = () => {
    if (!chartData) return null;
    const min = Math.min(...chartData.datasets[0].data);
    const index = chartData.datasets[0].data.indexOf(min);
    return {
      category: chartData.labels[index],
      amount: min,
      percentage: ((min / calculateTotal()) * 100).toFixed(1)
    };
  };

  // Tab button component for DRY code
  const TabButton = ({ tabName, label }) => (
    <button
      className={`py-3 text-sm font-medium transition-colors ${activeTab === tabName ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}
      onClick={() => setActiveTab(tabName)}
    >
      {label}
    </button>
  );

  // Chart options for reuse
  const getTooltipCallback = () => ({
    callbacks: {
      label: context => {
        let label = context.dataset.label || '';
        if (label) label += ': ';
        if (context.parsed.y !== null || context.raw !== null) {
          const value = context.parsed?.y ?? context.raw;
          label += formatCurrency(value);
          if (context.chart.config.type === 'doughnut' || context.chart.config.type === 'polarArea') {
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = Math.round((value / total) * 100);
            label += ` (${percentage}%)`;
          }
        }
        return label;
      }
    }
  });

  return (
    <div className="bg-gradient-to-br from-blue-50 to-blue-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-blue-800">Expense Analytics Dashboard</h1>
            <p className="text-blue-600 mt-1">Visualize and analyze yearly expenses by agency</p>
          </div>
          <div className="mt-4 md:mt-0">
            <button
              onClick={() => setShowFormInMobile(!showFormInMobile)}
              className="md:hidden px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
              </svg>
              {showFormInMobile ? 'Hide Controls' : 'Show Controls'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Controls Panel */}
          <div className={`lg:col-span-1 ${showFormInMobile || window.innerWidth >= 1024 ? 'block' : 'hidden'}`}>
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-4">
                <h2 className="text-white text-lg font-semibold">Data Controls</h2>
              </div>
              <div className="p-6">
                {/* Agency Selection */}
                <div className="mb-5">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Agency</label>
                  <div className="relative">
                    <select
                      value={agency}
                      onChange={e => setAgency(e.target.value)}
                      className="w-full p-3 pl-4 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm text-gray-700"
                    >
                      <option value="">Choose an agency</option>
                      <option value="Hescom">Electricity (Hescom)</option>
                      <option value="L&T">Water (L&T)</option>
                      <option value="AMC">Lift Charges (AMC)</option>
                      <option value="Repair and Maintainence">Repair and Maintainence</option>
                      <option value="Cleaning">Cleaning</option>
                      <option value="Garbage Collection">Garbage Collection</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Financial Year</label>
                  <div className="relative">
                    <select
                      value={year}
                      onChange={e => setYear(e.target.value)}
                      className="w-full p-3 pl-4 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm text-gray-700"
                    >
                      <option value="">Select a year</option>
                      <option value="2022-2023">2022-2023</option>
                      <option value="2023-2024">2023-2024</option>
                      <option value="2024-2025">2024-2025</option>
                      <option value="2025-2026">2025-2026</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full p-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-medium rounded-lg shadow-md transition duration-200 ease-in-out transform hover:-translate-y-0.5 flex justify-center items-center disabled:opacity-70 disabled:transform-none"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Analyzing Data...
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
                      </svg>
                      Generate Reports
                    </>
                  )}
                </button>

                {/* Quick Insights */}
                {chartData && (
                  <div className="mt-6 pt-5 border-t border-gray-200">
                    <h3 className="text-sm font-medium text-gray-600 mb-3">QUICK INSIGHTS</h3>
                    <div className="space-y-3">
                      <div className="bg-blue-50 rounded-lg p-3">
                        <div className="text-xs text-blue-600 font-medium mb-1">HIGHEST EXPENSE</div>
                        <div className="font-semibold">{getHighestCategory().category}</div>
                        <div className="flex justify-between items-center mt-1">
                          <span className="text-sm text-gray-600">{formatCurrency(getHighestCategory().amount)}</span>
                          <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                            {getHighestCategory().percentage}%
                          </span>
                        </div>
                      </div>
                      <div className="bg-blue-50 rounded-lg p-3">
                        <div className="text-xs text-blue-600 font-medium mb-1">LOWEST EXPENSE</div>
                        <div className="font-semibold">{getLowestCategory().category}</div>
                        <div className="flex justify-between items-center mt-1">
                          <span className="text-sm text-gray-600">{formatCurrency(getLowestCategory().amount)}</span>
                          <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                            {getLowestCategory().percentage}%
                          </span>
                        </div>
                      </div>
                      <div className="bg-blue-50 rounded-lg p-3">
                        <div className="text-xs text-blue-600 font-medium mb-1">TOTAL EXPENSES</div>
                        <div className="font-semibold">{formatCurrency(calculateTotal())}</div>
                        <div className="flex justify-between items-center mt-1">
                          <span className="text-sm text-gray-600">{chartData.labels.length} Categories</span>
                          <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                            100%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            {chartData ? (
              <div className="space-y-6">
                {/* Tab Navigation */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                  <div className="grid grid-cols-2 md:grid-cols-5 divide-x divide-gray-200">
                    <TabButton tabName="summary" label="Summary" />
                    <TabButton tabName="bar" label="Bar Chart" />
                    <TabButton tabName="doughnut" label="Doughnut" />
                    <TabButton tabName="line" label="Line Chart" />
                    <TabButton tabName="polar" label="Polar Area" />
                  </div>
                </div>

                {/* Chart Display Area */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-800">
                      {activeTab === 'summary' ? 'Expense Analysis' :
                        activeTab === 'bar' ? 'Expense Distribution by Category' :
                          activeTab === 'doughnut' ? 'Expense Proportion' :
                            activeTab === 'line' ? 'Expense Trend by Category' :
                              'Polar Distribution of Expenses'}
                    </h2>
                    <div className="text-sm text-gray-500 bg-blue-50 px-3 py-1 rounded-full">
                      {agency} • {year}
                    </div>
                  </div>

                  <div className={`transition-opacity duration-500 ${animateCharts ? 'opacity-100' : 'opacity-0'}`}>
                    <div className="h-96">
                      {/* Summary View */}
                      {activeTab === 'summary' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
                          <div className="h-full flex items-center justify-center">
                            <div className="w-full h-full">
                              <Doughnut
                                data={chartData}
                                options={{
                                  responsive: true,
                                  maintainAspectRatio: false,
                                  plugins: {
                                    legend: { position: 'bottom' },
                                    tooltip: getTooltipCallback()
                                  }
                                }}
                              />
                            </div>
                          </div>
                          <div className="h-full overflow-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                              <thead className="bg-gray-50">
                                <tr>
                                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">%</th>
                                </tr>
                              </thead>
                              <tbody className="bg-white divide-y divide-gray-200">
                                {chartData.labels.map((label, index) => {
                                  const amount = chartData.datasets[0].data[index];
                                  const percentage = ((amount / calculateTotal()) * 100).toFixed(1);
                                  return (
                                    <tr key={index} className="hover:bg-gray-50">
                                      <td className="px-6 py-3 whitespace-nowrap">
                                        <div className="flex items-center">
                                          <div className="h-3 w-3 rounded-full mr-2" style={{ backgroundColor: chartData.datasets[0].backgroundColor[index] }}></div>
                                          <div className="text-sm font-medium text-gray-900">{label}</div>
                                        </div>
                                      </td>
                                      <td className="px-6 py-3 whitespace-nowrap text-right text-sm text-gray-700">
                                        {formatCurrency(amount)}
                                      </td>
                                      <td className="px-6 py-3 whitespace-nowrap text-right">
                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                          {percentage}%
                                        </span>
                                      </td>
                                    </tr>
                                  );
                                })}
                                <tr className="bg-blue-50">
                                  <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-900">Total</td>
                                  <td className="px-6 py-3 whitespace-nowrap text-right text-sm font-medium text-gray-900">
                                    {formatCurrency(calculateTotal())}
                                  </td>
                                  <td className="px-6 py-3 whitespace-nowrap text-right">
                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                      100%
                                    </span>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}

                      {/* Bar Chart */}
                      {activeTab === 'bar' && (
                        <Bar
                          data={{
                            ...chartData,
                            datasets: chartData.datasets.map(dataset => ({
                              ...dataset,
                              barThickness: 24,      // Reduce width
                              borderRadius: 8        // Rounded edges
                            }))
                          }}
                          options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            animations: {
                              y: {
                                easing: 'easeInOutElastic',
                                from: ctx => ctx.type === 'data' ? 0 : undefined
                              }
                            },
                            plugins: {
                              legend: { display: false },
                              tooltip: getTooltipCallback()
                            },
                            scales: {
                              y: {
                                beginAtZero: true,
                                ticks: {
                                  callback: value => formatCurrency(value)
                                }
                              }
                            }
                          }}
                        />

                      )}

                      {/* Doughnut Chart */}
                      {activeTab === 'doughnut' && (
                        <div className="h-full flex justify-center items-center">
                          <div className="w-3/4 h-full">
                            <Doughnut
                              data={chartData}
                              options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: {
                                  legend: { position: 'right' },
                                  tooltip: getTooltipCallback()
                                },
                                cutout: '65%'
                              }}
                            />
                          </div>
                        </div>
                      )}

                      {/* Line Chart */}
                      {activeTab === 'line' && (
                        <Line
                          data={{
                            ...chartData,
                            datasets: [{
                              ...chartData.datasets[0],
                              fill: { target: 'origin', above: 'rgba(66, 133, 244, 0.1)' },
                              borderWidth: 3,
                              pointRadius: 5,
                              pointHoverRadius: 8,
                              tension: 0.3
                            }]
                          }}
                          options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                              legend: { display: false },
                              tooltip: getTooltipCallback()
                            },
                            scales: {
                              y: {
                                beginAtZero: true,
                                ticks: { callback: value => formatCurrency(value) }
                              }
                            }
                          }}
                        />
                      )}

                      {/* Polar Area Chart */}
                      {activeTab === 'polar' && (
                        <div className="h-full flex justify-center items-center">
                          <div className="w-3/4 h-full">
                            <PolarArea
                              data={chartData}
                              options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: {
                                  legend: { position: 'right' },
                                  tooltip: getTooltipCallback()
                                },
                                scales: { r: { ticks: { display: false } } }
                              }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Summary Cards */}
                {activeTab === 'summary' && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {chartData.labels.map((label, index) => {
                      const amount = chartData.datasets[0].data[index];
                      const percentage = ((amount / calculateTotal()) * 100).toFixed(1);
                      const bgColor = chartData.datasets[0].backgroundColor[index];
                      return (
                        <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden">
                          <div className="h-2" style={{ backgroundColor: bgColor.replace('0.8', '1') }}></div>
                          <div className="p-4">
                            <h3 className="font-medium text-gray-800">{label}</h3>
                            <div className="mt-2 flex justify-between items-end">
                              <div className="text-xl font-bold text-gray-900">{formatCurrency(amount)}</div>
                              <div className="text-sm px-2 py-1 bg-blue-50 text-blue-700 rounded-full">
                                {percentage}% of total
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                {loading ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <svg className="animate-spin h-12 w-12 text-blue-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="text-lg font-medium text-gray-600">Loading data...</p>
                    <p className="text-sm text-gray-500 mt-2">This may take a moment</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-blue-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h10a2 2 0 012 2v14a2 2 0 01-2 2z" />
                    </svg>
                    <h3 className="text-xl font-medium text-gray-800 mb-2">No Data to Display</h3>
                    <p className="text-gray-600 mb-6">Please select an agency and year to generate expense analytics</p>
                    <p className="text-sm text-gray-500">The dashboard will display various visualizations to help you analyze expenses.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonthlyExpenseAnalysis;