// components/MonthlyExpenseAnalysis.jsx
import React from "react";
import { Bar } from "react-chartjs-2";

const MonthlyExpenseAnalysis = ({ selectedYear, selectedDescription,
  setSelectedYear,
  setSelectedDescription,
  fetchMonthWiseExpenses,
  chartLoading,
  monthWiseData,
  monthWiseChartData,
  chartOptions,
  getMonthName,
}) => {
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  return (
    <div className="bg-white shadow-xl rounded-2xl p-8 border border-gray-100">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Monthly Expense Analysis</h2>

      <div className="bg-white p-4 rounded-xl h-96">
        {chartLoading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : monthWiseData ? (
          monthWiseData.length > 0 ? (
            <Bar data={monthWiseChartData} options={chartOptions} />
          ) : (
            <div className="flex flex-col justify-center items-center h-full bg-gray-50 rounded-xl">
              <p className="text-gray-500 text-lg">No data available</p>
            </div>
          )
        ) : (
          <div className="flex flex-col justify-center items-center h-full bg-gray-50 rounded-xl">
            <p className="text-gray-500 text-lg">Select filters to view report</p>
          </div>
        )}
      </div>

      {/* Summary Info */}
      {monthWiseData && monthWiseData.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Data Summary</h3>
          {/* Same summary cards – reuse as-is */}
        </div>
      )}
    </div>
  );
};

export default MonthlyExpenseAnalysis;
