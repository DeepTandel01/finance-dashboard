import React, { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { useApp } from "../../context/AppContext";
import { getSummary, getMonthlyData, getCategoryBreakdown, formatCurrency } from "../../utils/helpers";
import { CATEGORY_COLORS } from "../../data/transactions";

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="custom-tooltip">
      <div className="tooltip-label">{label}</div>
      {payload.map((p) => (
        <div key={p.name} className="tooltip-row">
          <span>{p.name}</span>
          <span style={{ fontWeight: 600, fontFamily: "var(--font-mono)" }}>{formatCurrency(p.value)}</span>
        </div>
      ))}
    </div>
  );
}

export default function Insights() {
  const { state } = useApp();
  const { transactions } = state;

  const summary = useMemo(() => getSummary(transactions), [transactions]);
  const monthly = useMemo(() => getMonthlyData(transactions), [transactions]);
  const categoryBreakdown = useMemo(() => getCategoryBreakdown(transactions), [transactions]);

  const topCategory = categoryBreakdown[0];
  const savingsRate = summary.totalIncome > 0
    ? Math.round(((summary.totalIncome - summary.totalExpenses) / summary.totalIncome) * 100)
    : 0;

  // Month-over-month comparison
  const lastTwo = monthly.slice(-2);
  const prevMonth = lastTwo[0];
  const currMonth = lastTwo[1];
  const expenseChange = prevMonth && currMonth
    ? Math.round(((currMonth.expenses - prevMonth.expenses) / (prevMonth.expenses || 1)) * 100)
    : 0;

  // Monthly avg
  const avgIncome = monthly.length ? Math.round(monthly.reduce((s, m) => s + m.income, 0) / monthly.length) : 0;
  const avgExpense = monthly.length ? Math.round(monthly.reduce((s, m) => s + m.expenses, 0) / monthly.length) : 0;

  // Best month (highest savings)
  const bestMonth = monthly.reduce((best, m) => (!best || m.balance > best.balance ? m : best), null);

  const monthlyFormatted = monthly.map((m) => ({
    ...m,
    label: new Date(m.month + "-01").toLocaleDateString("en-IN", { month: "short", year: "2-digit" }),
  }));

  const totalExpenses = summary.totalExpenses || 1;

  return (
    <div className="animate-in">
      {/* Key Insights */}
      <div className="section-title" style={{ marginBottom: 4 }}>Key Insights</div>
      <div className="section-sub">Observations derived from your financial data</div>

      <div className="grid-3" style={{ marginBottom: 28 }}>
        {topCategory && (
          <div className="insight-card">
            <div className="insight-icon" style={{ background: "#f2e9e3" }}>🏆</div>
            <div>
              <div className="insight-title">Top Spending Category</div>
              <div className="insight-val" style={{ color: "var(--expense)" }}>{topCategory.name}</div>
              <div className="insight-sub">{formatCurrency(topCategory.value)} spent in total</div>
            </div>
          </div>
        )}

        <div className="insight-card">
          <div className="insight-icon" style={{ background: savingsRate >= 20 ? "var(--income-light)" : "var(--expense-light)" }}>
            {savingsRate >= 20 ? "💚" : "⚠️"}
          </div>
          <div>
            <div className="insight-title">Savings Rate</div>
            <div className="insight-val" style={{ color: savingsRate >= 20 ? "var(--income)" : "var(--expense)" }}>{savingsRate}%</div>
            <div className="insight-sub">{savingsRate >= 20 ? "Healthy savings habit" : "Below the 20% recommendation"}</div>
          </div>
        </div>

        {prevMonth && currMonth && (
          <div className="insight-card">
            <div className="insight-icon" style={{ background: expenseChange <= 0 ? "var(--income-light)" : "var(--expense-light)" }}>
              {expenseChange <= 0 ? "📉" : "📈"}
            </div>
            <div>
              <div className="insight-title">Expense Change</div>
              <div className="insight-val" style={{ color: expenseChange <= 0 ? "var(--income)" : "var(--expense)" }}>
                {expenseChange > 0 ? "+" : ""}{expenseChange}%
              </div>
              <div className="insight-sub">vs previous month</div>
            </div>
          </div>
        )}

        <div className="insight-card">
          <div className="insight-icon" style={{ background: "var(--accent-light)" }}>📊</div>
          <div>
            <div className="insight-title">Monthly Avg Income</div>
            <div className="insight-val" style={{ color: "var(--income)" }}>{formatCurrency(avgIncome)}</div>
            <div className="insight-sub">Across {monthly.length} months</div>
          </div>
        </div>

        <div className="insight-card">
          <div className="insight-icon" style={{ background: "#f2e9e3" }}>💸</div>
          <div>
            <div className="insight-title">Monthly Avg Expense</div>
            <div className="insight-val" style={{ color: "var(--expense)" }}>{formatCurrency(avgExpense)}</div>
            <div className="insight-sub">Across {monthly.length} months</div>
          </div>
        </div>

        {bestMonth && (
          <div className="insight-card">
            <div className="insight-icon" style={{ background: "var(--income-light)" }}>⭐</div>
            <div>
              <div className="insight-title">Best Savings Month</div>
              <div className="insight-val" style={{ color: "var(--income)" }}>
                {new Date(bestMonth.month + "-01").toLocaleDateString("en-IN", { month: "short", year: "numeric" })}
              </div>
              <div className="insight-sub">Saved {formatCurrency(bestMonth.balance)}</div>
            </div>
          </div>
        )}
      </div>

      {/* Charts */}
      <div className="grid-2" style={{ marginBottom: 28 }}>
        <div className="card">
          <div className="section-title">Monthly Comparison</div>
          <div className="section-sub">Savings balance per month</div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={monthlyFormatted}>
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="balance" name="Net Savings" radius={[4, 4, 0, 0]}>
                {monthlyFormatted.map((entry) => (
                  <Cell key={entry.label} fill={entry.balance >= 0 ? "#2a7d4f" : "#c8622a"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <div className="section-title">Spending Breakdown</div>
          <div className="section-sub">Category-wise expense distribution</div>
          <div style={{ marginTop: 8 }}>
            {categoryBreakdown.map((cat) => {
              const pct = Math.round((cat.value / totalExpenses) * 100);
              return (
                <div key={cat.name} className="progress-bar-wrap">
                  <div className="progress-bar-header">
                    <span className="progress-bar-label">{cat.name}</span>
                    <span className="progress-bar-val">{pct}% · {formatCurrency(cat.value)}</span>
                  </div>
                  <div className="progress-track">
                    <div
                      className="progress-fill"
                      style={{ width: `${pct}%`, background: CATEGORY_COLORS[cat.name] || "var(--accent)" }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Month over month table */}
      <div className="card">
        <div className="section-title">Month-over-Month Summary</div>
        <div className="section-sub">Income, expenses and net savings for each month</div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Month</th>
                <th style={{ textAlign: "right" }}>Income</th>
                <th style={{ textAlign: "right" }}>Expenses</th>
                <th style={{ textAlign: "right" }}>Net Balance</th>
                <th style={{ textAlign: "right" }}>Savings Rate</th>
              </tr>
            </thead>
            <tbody>
              {[...monthly].reverse().map((m) => {
                const rate = m.income > 0 ? Math.round((m.balance / m.income) * 100) : 0;
                const label = new Date(m.month + "-01").toLocaleDateString("en-IN", { month: "long", year: "numeric" });
                return (
                  <tr key={m.month}>
                    <td style={{ fontWeight: 500 }}>{label}</td>
                    <td style={{ textAlign: "right", color: "var(--income)", fontFamily: "var(--font-mono)" }}>+{formatCurrency(m.income)}</td>
                    <td style={{ textAlign: "right", color: "var(--expense)", fontFamily: "var(--font-mono)" }}>−{formatCurrency(m.expenses)}</td>
                    <td style={{ textAlign: "right", color: m.balance >= 0 ? "var(--income)" : "var(--expense)", fontFamily: "var(--font-mono)", fontWeight: 600 }}>
                      {formatCurrency(m.balance)}
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <span className={`badge ${rate >= 20 ? "badge-income" : "badge-expense"}`}>{rate}%</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
