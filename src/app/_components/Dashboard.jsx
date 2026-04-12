"use client";

import React, { useContext, useMemo } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BriefcaseBusiness,
  Clock3,
  IndianRupee,
  PackageCheck,
  WalletCards,
} from "lucide-react";
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from "chart.js";
import { Line } from "react-chartjs-2";
import { useTheme } from "next-themes";
import DashTableDemo from "./DashTable";
import { CustomerContext } from "./CustomerContext";
import { Button } from "@/components/ui/button";

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const chartViews = [
  { label: "Yearly", value: "yearly" },
  { label: "Monthly", value: "monthly" },
  { label: "Weekly", value: "weekly" },
  { label: "Daily", value: "daily" },
];

const formatAmount = (value) =>
  new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);

const formatDate = (value) =>
  new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));

const today = new Date();
today.setHours(0, 0, 0, 0);

const processSales = (customers) => {
  const monthlySales = {};
  const weeklySales = {};
  const yearlySales = {};
  const dailySales = {};

  customers.forEach((sale) => {
    if (sale.isCompleted === "canceled") {
      return;
    }

    const date = new Date(sale.date);
    const year = String(date.getFullYear());
    const month = date.toLocaleString("en-US", { month: "short" });
    const dayOfMonth = date.getDate();
    
    // Calculate week of the month (Week 1, Week 2, etc.)
    const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const pastDays = date.getDate() - 1;
    const weekNum = Math.ceil((pastDays + startOfMonth.getDay() + 1) / 7);
    const weekOfMonth = `Week ${weekNum}`;

    const amount = Number(sale.totalAmount) || 0;

    yearlySales[year] = (yearlySales[year] || 0) + amount;
    monthlySales[`${year}-${month}`] = (monthlySales[`${year}-${month}`] || 0) + amount;
    weeklySales[`${year}-${month}-${weekOfMonth}`] = (weeklySales[`${year}-${month}-${weekOfMonth}`] || 0) + amount;
    dailySales[`${year}-${month}-${dayOfMonth}`] = (dailySales[`${year}-${month}-${dayOfMonth}`] || 0) + amount;
  });

  const monthOrder = { Jan: 1, Feb: 2, Mar: 3, Apr: 4, May: 5, Jun: 6, Jul: 7, Aug: 8, Sep: 9, Oct: 10, Nov: 11, Dec: 12 };

  const toEntries = (record, type) =>
    Object.entries(record)
      .map(([x, y]) => ({ x, y }))
      .sort((a, b) => {
        if (type === "yearly") return a.x.localeCompare(b.x);
        
        const partsA = a.x.split('-');
        const partsB = b.x.split('-');
        
        if (partsA[0] !== partsB[0]) return partsA[0].localeCompare(partsB[0]);
        
        if (type === "monthly") {
          return (monthOrder[partsA[1]] || 0) - (monthOrder[partsB[1]] || 0);
        }
        
        if (type === "weekly") {
          if (partsA[1] !== partsB[1]) return (monthOrder[partsA[1]] || 0) - (monthOrder[partsB[1]] || 0);
          return partsA[2].localeCompare(partsB[2]);
        }
        
        if (type === "daily") {
          if (partsA[1] !== partsB[1]) return (monthOrder[partsA[1]] || 0) - (monthOrder[partsB[1]] || 0);
          return parseInt(partsA[2]) - parseInt(partsB[2]);
        }

        return 0;
      });

  return {
    dailySales: toEntries(dailySales, "daily"),
    weeklySales: toEntries(weeklySales, "weekly"),
    monthlySales: toEntries(monthlySales, "monthly"),
    yearlySales: toEntries(yearlySales, "yearly"),
  };
};

const Dashboard = () => {
  const { customers } = useContext(CustomerContext);
  const { resolvedTheme } = useTheme();
  const theme = resolvedTheme === "dark" ? "dark" : "light";

  const aggregates = useMemo(
    () =>
      customers.reduce(
        (acc, customer) => {
          const totalAmount = Number(customer.totalAmount) || 0;
          const advance = Number(customer.advance) || 0;
          const expectedDate = new Date(customer.expectedDeliveryDate);

          if (customer.isCompleted !== "canceled") {
            acc.totalSales += totalAmount;
            acc.totalBalance += totalAmount - advance;
            acc.totalCustomers += 1;
          }

          if (customer.isCompleted === "progress") {
            acc.activeJobs += 1;
          }

          if (customer.isCompleted === "completed") {
            acc.completedJobs += 1;
          }

          if (customer.isCompleted === "progress" && expectedDate < today) {
            acc.overdueJobs += 1;
          }

          return acc;
        },
        {
          totalSales: 0,
          totalBalance: 0,
          totalCustomers: 0,
          activeJobs: 0,
          completedJobs: 0,
          overdueJobs: 0,
        },
      ),
    [customers],
  );

  const sales = useMemo(() => processSales(customers), [customers]);
  const yearOptions = useMemo(() => [...new Set(sales.yearlySales.map(({ x }) => x))], [sales.yearlySales]);
  const currentYear = yearOptions.at(-1) || String(new Date().getFullYear());
  const currentMonth = new Date().toLocaleString("default", { month: "short" });

  const [chartType, setChartType] = React.useState("monthly");
  const [selectedYear, setSelectedYear] = React.useState("");
  const [selectedMonth, setSelectedMonth] = React.useState(currentMonth);
  const activeYear = selectedYear || currentYear;

  const chartDataSource = useMemo(() => {
    if (chartType === "daily") {
      return sales.dailySales.filter((item) => item.x.startsWith(`${activeYear}-${selectedMonth}`));
    }

    if (chartType === "weekly") {
      return sales.weeklySales.filter((item) => item.x.startsWith(`${activeYear}-${selectedMonth}`));
    }

    if (chartType === "monthly") {
      return sales.monthlySales.filter((item) => item.x.startsWith(activeYear));
    }

    return sales.yearlySales;
  }, [activeYear, chartType, sales.dailySales, sales.monthlySales, sales.weeklySales, sales.yearlySales, selectedMonth]);

  const chartData = useMemo(
    () => ({
      labels: chartDataSource.map((item) => item.x),
      datasets: [
        {
          label: "Sales",
          data: chartDataSource.map((item) => item.y),
          borderColor: theme === "dark" ? "rgba(56, 189, 248, 1)" : "rgba(3, 105, 161, 1)",
          backgroundColor: theme === "dark" ? "rgba(56, 189, 248, 0.18)" : "rgba(3, 105, 161, 0.12)",
          fill: true,
          tension: 0.35,
          pointRadius: 3,
          pointHoverRadius: 5,
        },
      ],
    }),
    [chartDataSource, theme],
  );

  const chartOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          backgroundColor: theme === "dark" ? "rgba(15, 23, 42, 0.96)" : "rgba(255, 255, 255, 0.98)",
          titleColor: theme === "dark" ? "#e2e8f0" : "#0f172a",
          bodyColor: theme === "dark" ? "#cbd5e1" : "#334155",
          borderColor: theme === "dark" ? "rgba(148, 163, 184, 0.2)" : "rgba(148, 163, 184, 0.35)",
          borderWidth: 1,
        },
      },
      scales: {
        x: {
          ticks: {
            color: theme === "dark" ? "#94a3b8" : "#64748b",
          },
          grid: {
            color: theme === "dark" ? "rgba(51, 65, 85, 0.6)" : "rgba(226, 232, 240, 0.8)",
          },
        },
        y: {
          ticks: {
            color: theme === "dark" ? "#94a3b8" : "#64748b",
            callback: (value) => formatAmount(value),
          },
          grid: {
            color: theme === "dark" ? "rgba(51, 65, 85, 0.6)" : "rgba(226, 232, 240, 0.8)",
          },
        },
      },
    }),
    [theme],
  );

  const recentJobs = useMemo(() => customers.slice(0, 1), [customers]);
  const monthOptions = useMemo(
    () =>
      [...new Set(
        sales.monthlySales
          .filter(({ x }) => x.startsWith(activeYear))
          .map(({ x }) => x.split("-")[1]),
      )],
    [activeYear, sales.monthlySales],
  );

  const chartKey = `${theme}-${chartType}-${activeYear}-${selectedMonth}`;

  return (
    <div className="space-y-6">
      <section className="page-hero">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <h1 className="page-title">Dashboard Overview</h1>
            <p className="page-copy">Key metrics and recent activity for your printing operations.</p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/add">
                New Job
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/customers">Browse All Jobs</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <article className="metric-card">
          <p className="metric-label">Total Revenue</p>
          <div className="mt-4 flex items-center gap-3">
            <div className="rounded-2xl bg-sky-100 p-3 text-sky-700 dark:bg-sky-400/10 dark:text-sky-200">
              <IndianRupee className="h-5 w-5" />
            </div>
            <div>
              <p className="metric-value mt-0">{formatAmount(aggregates.totalSales)}</p>
              <p className="metric-footnote">Gross earnings across all jobs</p>
            </div>
          </div>
        </article>

        <article className="metric-card">
          <p className="metric-label">Outstanding Balance</p>
          <div className="mt-4 flex items-center gap-3">
            <div className="rounded-2xl bg-amber-100 p-3 text-amber-700 dark:bg-amber-400/10 dark:text-amber-200">
              <WalletCards className="h-5 w-5" />
            </div>
            <div>
              <p className="metric-value mt-0">{formatAmount(aggregates.totalBalance)}</p>
              <p className="metric-footnote">Pending payments to collect</p>
            </div>
          </div>
        </article>

        <article className="metric-card">
          <p className="metric-label">Active Projects</p>
          <div className="mt-4 flex items-center gap-3">
            <div className="rounded-2xl bg-emerald-100 p-3 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-200">
              <BriefcaseBusiness className="h-5 w-5" />
            </div>
            <div>
              <p className="metric-value mt-0">{aggregates.activeJobs}</p>
              <p className="metric-footnote">{aggregates.completedJobs} projects completed</p>
            </div>
          </div>
        </article>

        <article className="metric-card">
          <p className="metric-label">Overdue Deliveries</p>
          <div className="mt-4 flex items-center gap-3">
            <div className="rounded-2xl bg-rose-100 p-3 text-rose-700 dark:bg-rose-400/10 dark:text-rose-200">
              <Clock3 className="h-5 w-5" />
            </div>
            <div>
              <p className="metric-value mt-0">{aggregates.overdueJobs}</p>
              <p className="metric-footnote">Requires immediate attention</p>
            </div>
          </div>
        </article>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.35fr_0.9fr]">
        <div className="surface-card p-5 md:p-6 min-w-0">
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <h2 className="section-heading">Revenue Trends</h2>
                <p className="section-copy">Track financial performance across multiple timeframes.</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {chartViews.map((view) => (
                  <button
                    key={view.value}
                    type="button"
                    onClick={() => setChartType(view.value)}
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                      chartType === view.value
                        ? "bg-slate-900 text-white dark:bg-sky-400 dark:text-slate-950"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                    }`}
                  >
                    {view.label}
                  </button>
                ))}
              </div>
            </div>

            {["monthly", "weekly", "daily"].includes(chartType) && (
              <div className="flex flex-col gap-3 md:flex-row">
                <select
                  className="h-11 rounded-2xl border border-white/70 bg-white/80 px-4 text-sm shadow-sm dark:border-white/10 dark:bg-slate-950/70"
                  onChange={(event) => setSelectedYear(event.target.value)}
                    value={activeYear}
                >
                  <option value="">Select year</option>
                  {yearOptions.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>

                {["weekly", "daily"].includes(chartType) && (
                  <select
                    className="h-11 rounded-2xl border border-white/70 bg-white/80 px-4 text-sm shadow-sm dark:border-white/10 dark:bg-slate-950/70"
                    onChange={(event) => setSelectedMonth(event.target.value)}
                    value={selectedMonth}
                    disabled={!activeYear}
                  >
                    <option value="">Select month</option>
                    {monthOptions.map((month) => (
                      <option key={month} value={month}>
                        {month}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            )}

            <div className="h-[320px] min-w-0 overflow-hidden">
              {chartDataSource.length ? (
                <div className="h-full w-full">
                  <Line key={chartKey} data={chartData} options={chartOptions} />
                </div>
              ) : (
                <div className="surface-card-muted flex h-full items-center justify-center p-6 text-center text-sm text-slate-500 dark:text-slate-400">
                  No sales data is available for the selected view yet.
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="surface-card p-5 md:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="section-heading">Operational Summary</h2>
                <p className="section-copy">Quick view of your system resources.</p>
              </div>
              <PackageCheck className="h-5 w-5 text-slate-400" />
            </div>

            <div className="mt-5 space-y-3">
              <div className="surface-card-muted flex items-center justify-between p-4">
                <span className="text-sm text-slate-500 dark:text-slate-400">Total Active Jobs</span>
                <span className="text-lg font-semibold text-slate-900 dark:text-white">{aggregates.activeJobs}</span>
              </div>
              <div className="surface-card-muted flex items-center justify-between p-4">
                <span className="text-sm text-slate-500 dark:text-slate-400">Total Completed</span>
                <span className="text-lg font-semibold text-slate-900 dark:text-white">{aggregates.completedJobs}</span>
              </div>
              <div className="surface-card-muted flex items-center justify-between p-4">
                <span className="text-sm text-slate-500 dark:text-slate-400">Total Customers</span>
                <span className="text-lg font-semibold text-slate-900 dark:text-white">{aggregates.totalCustomers}</span>
              </div>
            </div>
          </div>

          <div className="surface-card p-5 md:p-6">
<h2 className="section-heading">Recent Job</h2>
          <p className="section-copy mt-1">Latest printing order added to the system.</p>

            <div className="mt-5 space-y-3">
              {recentJobs.length ? recentJobs.map((job) => (
                <Link
                  key={job._id}
                  href={`/customers/${job._id}`}
                  className="surface-card-muted flex items-center justify-between gap-4 p-4 transition hover:-translate-y-0.5"
                >
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">{job.partyName || "Untitled job"}</p>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      {formatDate(job.date)} · {job.billNumber ? `Bill ${job.billNumber}` : "Bill pending"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-slate-900 dark:text-white">{formatCurrency(job.totalAmount)}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.14em] text-slate-400">{job.isCompleted}</p>
                  </div>
                </Link>
              )) : (
                <div className="surface-card-muted p-4 text-sm text-slate-500 dark:text-slate-400">
                  No jobs created yet.
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <DashTableDemo />
    </div>
  );
};

export default Dashboard;
