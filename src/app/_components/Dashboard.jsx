"use client";
import React, { useContext, useEffect, useState } from "react";
import { BadgeIndianRupee, IndianRupee, BookUser, User } from "lucide-react";
import DashTableDemo from "./DashTable";
import { CustomerContext } from "./CustomerContext";
import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const { customers } = useContext(CustomerContext);
  const [aggregateData, setAggregateData] = useState({
    totalSales: 0,
    totalCustomers: 0,
    totalBalance: 0,
  });
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.toLocaleString("default", { month: "short" });
  const [chartType, setChartType] = useState("monthly");
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    // Check for dark mode class on the document element
    const handleThemeChange = () => {
      if (document.documentElement.classList.contains('dark')) {
        setTheme('dark');
      } else {
        setTheme('light');
      }
    };

    handleThemeChange(); // Initial check
    // Listen for changes to the theme class
    const observer = new MutationObserver(handleThemeChange);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => {
      observer.disconnect();
    };
  }, []);
  useEffect(() => {
    const totalValues = async () => {
      let amount = 0;
      let balance = 0;
      let custNum = 0;;
      customers.map((customer) => {if(customer.isCompleted!=='canceled'){amount += Number(customer.totalAmount);balance += Number(customer.totalAmount) - Number(customer.advance);custNum++;}});
      const data = {
        totalSales: amount,
        totalCustomers: custNum,
        totalBalance: balance,
      };
      setAggregateData(data);
    };
    totalValues();
  }, [customers]);

  const processData = (data) => {
    const monthlySales = {};
    const weeklySales = {};
    const yearlySales = {};
    const dailySales = {};

    data.forEach((sale) => {
      const date = new Date(sale.date);
      const year = date.getFullYear();
      const month = date.toLocaleString("default", { month: "short" });
      const day = date.toLocaleString("default", { weekday: "long" });
      const dayOfMonth = date.getDate();
      const weekKey = `${year}-${month}-${day}`;

      if (!yearlySales[year]) yearlySales[year] = 0;
      yearlySales[year] += sale.totalAmount;

      if (!monthlySales[`${year}-${month}`])
        monthlySales[`${year}-${month}`] = 0;
      monthlySales[`${year}-${month}`] += sale.totalAmount;

      if (!weeklySales[weekKey]) weeklySales[weekKey] = 0;
      weeklySales[weekKey]+= sale.totalAmount;

      if (!dailySales[`${year}-${month}-${dayOfMonth}`])
        dailySales[`${year}-${month}-${dayOfMonth}`] = 0;
      dailySales[`${year}-${month}-${dayOfMonth}`] += sale.totalAmount;
    });

    return {
      dailySales: Object.entries(dailySales).map(([key, value]) => ({
        x: key,
        y: value,
      })).sort((a, b) => new Date(a.x) - new Date(b.x)),
      yearlySales: Object.entries(yearlySales).map(([key, value]) => ({
        x: key,
        y: value,
      })).sort((a, b) => new Date(a.x) - new Date(b.x)),
      monthlySales: Object.entries(monthlySales).map(([key, value]) => ({
        x: key,
        y: value,
      })).sort((a, b) => new Date(a.x) - new Date(b.x)),
      weeklySales: Object.entries(weeklySales).map(([key, value]) => ({
        x: key,
        y: value,
      })).sort((a, b) => new Date(a.x) - new Date(b.x)),
    };
  };

  const processedData = processData(customers);
  const { yearlySales = [], monthlySales = [], weeklySales = [], dailySales = [] } = processedData;

  const getChartData = () => {
    let data = [];
    if (chartType === 'daily' && selectedMonth && selectedYear) {
      data = dailySales.filter(d => d.x.startsWith(`${selectedYear}-${selectedMonth}`));
    } else if (chartType === 'weekly' && selectedMonth && selectedYear) {
      data = weeklySales.filter(d => d.x.startsWith(`${selectedYear}-${selectedMonth}`))
    } else if (chartType === 'monthly' && selectedYear) {
      data = monthlySales.filter(d => d.x.startsWith(`${selectedYear}`));
    } else {
      data = yearlySales;
    }
    return data;
  };

  const data = {
    labels: getChartData().flatMap(item => item.x),
    datasets: [
      {
        label: "Total Sales",
        data: getChartData().map((item) => item.y),
        fill: false,
        borderColor: "rgba(75,192,192,1)",
        tension: 0.1,
      },
    ],
  };
  const options = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: theme === 'dark' ? 'white' : 'black', // Change legend text color based on theme
        },
      },
      tooltip: {
        titleColor: 'white', // Change tooltip title color based on theme
        bodyColor: 'white', // Change tooltip body color based on theme
      },
    },
    scales: {
      x: {
        ticks: {
          color: theme === 'dark' ? 'white' : 'black', // Change X-axis ticks color based on theme
        },
        grid: {
          color: theme === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)', // Change X-axis grid color based on theme
        },
      },
      y: {
        ticks: {
          color: theme === 'dark' ? 'white' : 'black', // Change Y-axis ticks color based on theme
        },
        grid: {
          color: theme === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)', // Change Y-axis grid color based on theme
        },
      },
    },
  };

  const handleYearChange = (e) => {
    setSelectedYear(e.target.value);
  };

  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
  };
  const formatAmount=(amt)=>{
    const formatted = new Intl.NumberFormat("en-US", {
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        }).format(amt);
    return formatted;    
  }
  if (customers.length < 1) {
    <div className="w-full min-h-[calc(100vh-96px)] flex justify-center items-center">
      Loading...
    </div>;
  }
  return (
    <div>
      <div className="flex justify-around gap-2 md:gap-4 items-center mb-6">
        <div className="w-full shadow-md border border-black dark:border-white p-2 md:p-4 rounded-lg">
          <div className="flex justify-between w-full">
            <h2 className="text-sm sm:text-base">Total Revenue</h2>
            <span className="">
              <BadgeIndianRupee />
            </span>
          </div>
          <h3 className="font-bold text-base sm:text-xl md:text-3xl mt-3 flex items-center">
            <IndianRupee className="w-[12px] xs:w-[15px] md:w-[30px]" />
            {formatAmount(aggregateData.totalSales)}
          </h3>
        </div>
        <div className="w-full shadow-md border border-black dark:border-white p-2 md:p-4 rounded-lg">
          <div className="flex justify-between w-full">
            <h2 className="text-sm sm:text-base">Total Customers</h2>
            <span className="">
              <BookUser />
            </span>
          </div>
          <h3 className="font-bold text-base sm:text-xl md:text-3xl mt-3 flex gap-1 items-center">
            <User className="w-[12px] xs:w-[15px] md:w-[30px]"/>
            {aggregateData.totalCustomers}
          </h3>
        </div>
        <div className="w-full shadow-md border border-black dark:border-white p-2 md:p-4 rounded-lg">
          <div className="flex justify-between w-full">
            <h2 className="text-sm mr-1 sm:mr-0 sm:text-base">Total Balance</h2>
            <span className="">
              <BadgeIndianRupee />
            </span>
          </div>
          <h3 className="font-bold text-base sm:text-xl md:text-3xl mt-3 flex  items-center">
            <IndianRupee className="w-[12px] xs:w-[15px] md:w-[30px]"/>
            {formatAmount(aggregateData.totalBalance)}
          </h3>
        </div>
      </div>
      <DashTableDemo />
      { <div className="w-[100%] lg:w-[90%] xl:w-[80%] xlx:w-[80%] mx-auto my-6 rounded-lg border bg-white dark:bg-slate-900 dark:text-white p-3 shadow-md">
        <h1 className="text-2xl font-bold">Sales Statistics</h1>
        <div className="w-full flex flex-row justify-between flex-wrap">
          <div className="flex flex-row justify-start gap-3 md:gap-5 my-3 items-center">
            <div className="flex flex-row gap-1">
              <input
                className="form-check-input"
                type="radio"
                name="chartType"
                value="yearly"
                checked={chartType === "yearly"}
                onChange={() => setChartType("yearly")}
              />
              <label className="text-sm xs:text-base">Yearly</label>
            </div>
            <div className="flex flex-row gap-1">
              <input
                className="form-check-input"
                type="radio"
                name="chartType"
                value="monthly"
                checked={chartType === "monthly"}
                onChange={() => setChartType("monthly")}
              />
              <label className="text-sm sm:text-base">Monthly</label>
            </div>
            <div className="flex flex-row gap-1">
              <input
                className="form-check-input"
                type="radio"
                name="chartType"
                value="weekly"
                checked={chartType === "weekly"}
                onChange={() => setChartType("weekly")}
              />
              <label className="text-sm xs:text-base">Weekly</label>
            </div>
            <div className="flex flex-row gap-1">
              <input
                className="form-check-input"
                type="radio"
                name="chartType"
                value="daily"
                checked={chartType === "daily"}
                onChange={() => setChartType("daily")}
              />
              <label className="text-sm xs:text-base">Daily</label>
            </div>
          </div>
          {["monthly", "weekly", "daily"].includes(chartType) && (
            <div className="flex flex-row gap-3 flex-wrap">
              <div className="w-full md:w-auto flex justify-start md:justify-end gap-2">
                <label className="my-auto text-lg">Select Year</label>
                <select
                  className="form-select w-25 p-2 rounded-md border border-gray-300 dark:bg-slate-900"
                  onChange={handleYearChange}
                  value={selectedYear}
                >
                  <option value="">Select Year</option>
                  {yearlySales.map(({ x }) => (
                    <option key={x} value={x}>
                      {x}
                    </option>
                  ))}
                </select>
              </div>
              {["weekly", "daily"].includes(chartType) &&
              <div className="w-full md:w-auto flex justify-start md:justify-end gap-2">
                <label className="my-auto text-lg">Select Month</label>
                <select
                  className="form-select w-25 p-2 rounded-md border border-gray-300 dark:bg-slate-900"
                  onChange={handleMonthChange}
                  value={selectedMonth}
                  disabled={!selectedYear}
                >
                  <option value="">Select Month</option>
                  {selectedYear &&
                    monthlySales
                      .filter(({ x }) => x.startsWith(selectedYear))
                      .map(({ x }) => {
                        const month = x.split("-")[1];
                        return (
                          <option key={month} value={month}>
                            {month}
                          </option>
                        );
                      })}
                </select>
              </div>
              }
            </div>
          )}
        </div>
        <Line data={data} className="overflow-x-auto" options={options}/>
      </div>
      }
    </div>
  );
};

export default Dashboard;
