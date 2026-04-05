export function formatCurrency(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

export function formatMonth(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-IN", { month: "short", year: "numeric" });
}

export function getMonthKey(dateStr) {
  return dateStr.slice(0, 7); // "YYYY-MM"
}

export function applyFilters(transactions, filters) {
  return transactions.filter((t) => {
    if (filters.search) {
      const q = filters.search.toLowerCase();
      if (
        !t.description.toLowerCase().includes(q) &&
        !t.category.toLowerCase().includes(q)
      )
        return false;
    }
    if (filters.type !== "all" && t.type !== filters.type) return false;
    if (filters.category !== "all" && t.category !== filters.category) return false;
    if (filters.dateFrom && t.date < filters.dateFrom) return false;
    if (filters.dateTo && t.date > filters.dateTo) return false;
    return true;
  });
}

export function applySort(transactions, sortBy, sortDir) {
  return [...transactions].sort((a, b) => {
    let cmp = 0;
    if (sortBy === "date") cmp = a.date.localeCompare(b.date);
    else if (sortBy === "amount") cmp = a.amount - b.amount;
    else if (sortBy === "category") cmp = a.category.localeCompare(b.category);
    return sortDir === "asc" ? cmp : -cmp;
  });
}

export function getMonthlyData(transactions) {
  const map = {};
  transactions.forEach((t) => {
    const key = getMonthKey(t.date);
    if (!map[key]) map[key] = { month: key, income: 0, expenses: 0, balance: 0 };
    if (t.type === "income") map[key].income += t.amount;
    else map[key].expenses += t.amount;
    map[key].balance = map[key].income - map[key].expenses;
  });
  return Object.values(map).sort((a, b) => a.month.localeCompare(b.month));
}

export function getCategoryBreakdown(transactions) {
  const map = {};
  transactions
    .filter((t) => t.type === "expense")
    .forEach((t) => {
      map[t.category] = (map[t.category] || 0) + t.amount;
    });
  return Object.entries(map)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
}

export function getSummary(transactions) {
  let totalIncome = 0;
  let totalExpenses = 0;
  transactions.forEach((t) => {
    if (t.type === "income") totalIncome += t.amount;
    else totalExpenses += t.amount;
  });
  return { totalIncome, totalExpenses, balance: totalIncome - totalExpenses };
}

export function exportToCSV(transactions) {
  const headers = ["Date", "Description", "Category", "Type", "Amount"];
  const rows = transactions.map((t) => [
    t.date,
    `"${t.description}"`,
    t.category,
    t.type,
    t.amount,
  ]);
  const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "transactions.csv";
  a.click();
  URL.revokeObjectURL(url);
}
