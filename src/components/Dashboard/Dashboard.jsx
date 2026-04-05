import React, { useMemo } from "react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { TrendingUp, TrendingDown, Wallet, Plus } from "lucide-react";
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
          <span style={{ color: p.color }}>{p.name}</span>
          <span style={{ fontWeight: 600, color: "var(--text-primary)", fontFamily: "var(--font-mono)" }}>{formatCurrency(p.value)}</span>
        </div>
      ))}
    </div>
  );
}

function PieTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const p = payload[0];
  return (
    <div className="custom-tooltip">
      <div className="tooltip-label">{p.name}</div>
      <div style={{ fontWeight: 600, color: "var(--text-primary)", fontFamily: "var(--font-mono)" }}>{formatCurrency(p.value)}</div>
    </div>
  );
}

export default function Dashboard({ setActivePage }) {
  const { state, dispatch } = useApp();
  const { transactions, role } = state;
  const isAdmin = role === "admin";

  const { totalIncome, totalExpenses, balance } = useMemo(() => getSummary(transactions), [transactions]);
  const monthly = useMemo(() => getMonthlyData(transactions), [transactions]);
  const categoryData = useMemo(() => getCategoryBreakdown(transactions), [transactions]);

  const monthlyFormatted = monthly.map((m) => ({
    ...m,
    label: new Date(m.month + "-01").toLocaleDateString("en-IN", { month: "short", year: "2-digit" }),
  }));

  const savingsRate = totalIncome > 0 ? Math.round(((totalIncome - totalExpenses) / totalIncome) * 100) : 0;
  const recentTxns = [...transactions].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5);

  return (
    <div className="animate-in">
      {/* Summary cards */}
      <div className="grid-4" style={{ marginBottom: 24 }}>
        <div className="stat-card">
          <div className="stat-label">Net Balance</div>
          <div className={`stat-value ${balance >= 0 ? "income" : "expense"}`}>{formatCurrency(balance)}</div>
          <div className="stat-sub">All time</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Income</div>
          <div className="stat-value income">{formatCurrency(totalIncome)}</div>
          <div className="stat-sub" style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <TrendingUp size={11} color="var(--income)" /> All time earnings
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Expenses</div>
          <div className="stat-value expense">{formatCurrency(totalExpenses)}</div>
          <div className="stat-sub" style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <TrendingDown size={11} color="var(--expense)" /> All time spending
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Savings Rate</div>
          <div className="stat-value" style={{ color: savingsRate >= 20 ? "var(--income)" : "var(--expense)" }}>
            {savingsRate}%
          </div>
          <div className="stat-sub">{savingsRate >= 20 ? "Great job!" : "Try to save more"}</div>
        </div>
      </div>

      {/* Charts row 1 */}
      <div className="grid-chart" style={{ marginBottom: 24 }}>
        <div className="card">
          <div className="section-title">Monthly Balance Trend</div>
          <div className="section-sub">Income vs expenses over time</div>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={monthlyFormatted} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="incGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2a7d4f" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#2a7d4f" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="expGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#c8622a" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#c8622a" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="income" name="Income" stroke="#2a7d4f" strokeWidth={2} fill="url(#incGrad)" />
              <Area type="monotone" dataKey="expenses" name="Expenses" stroke="#c8622a" strokeWidth={2} fill="url(#expGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <div className="section-title">Spending by Category</div>
          <div className="section-sub">Where your money goes</div>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={categoryData.slice(0, 6)} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
                {categoryData.slice(0, 6).map((entry) => (
                  <Cell key={entry.name} fill={CATEGORY_COLORS[entry.name] || "#888"} />
                ))}
              </Pie>
              <Tooltip content={<PieTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 14px", marginTop: 4 }}>
            {categoryData.slice(0, 6).map((d) => (
              <div key={d.name} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11 }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: CATEGORY_COLORS[d.name], flexShrink: 0 }} />
                <span style={{ color: "var(--text-secondary)" }}>{d.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Monthly bar + Recent transactions */}
      <div className="grid-2">
        <div className="card">
          <div className="section-title">Monthly Overview</div>
          <div className="section-sub">Income vs expenses per month</div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={monthlyFormatted} barSize={18} barGap={4}>
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="income" name="Income" fill="#2a7d4f" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expenses" name="Expenses" fill="#c8622a" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
            <div>
              <div className="section-title">Recent Transactions</div>
              <div className="section-sub" style={{ marginBottom: 0 }}>Last 5 entries</div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              {isAdmin && (
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => {
                    dispatch({ type: "SET_FILTER", key: "search", value: "" });
                    setActivePage("transactions");
                  }}
                >
                  <Plus size={12} /> Add
                </button>
              )}
              <button className="btn btn-secondary btn-sm" onClick={() => setActivePage("transactions")}>
                View all
              </button>
            </div>
          </div>

          {recentTxns.length === 0 ? (
            <div className="empty-state" style={{ padding: "30px 20px" }}>
              <div className="empty-state-title">No transactions yet</div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {recentTxns.map((t) => (
                <div key={t.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid var(--border)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: "var(--bg-input)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ width: 10, height: 10, borderRadius: "50%", background: CATEGORY_COLORS[t.category] }} />
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 500 }}>{t.description}</div>
                      <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{t.category}</div>
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 13, fontWeight: 600, fontFamily: "var(--font-mono)", color: t.type === "income" ? "var(--income)" : "var(--expense)" }}>
                      {t.type === "income" ? "+" : "−"}{formatCurrency(t.amount)}
                    </div>
                    <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{t.date}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
