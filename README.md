# FinTrack — Finance Dashboard

A clean, interactive finance dashboard built with React. Track your income, expenses, and spending patterns with a polished UI.

---

## Quick Start

```bash
# 1. Go into the project folder
cd finance-dashboard

# 2. Install dependencies
npm install

# 3. Start the development server
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Project Structure

```
finance-dashboard/
├── public/
│   └── index.html
└── src/
    ├── index.js                  # React entry point
    ├── index.css                 # Global styles + design system
    ├── App.jsx                   # Root component, routing logic
    │
    ├── context/
    │   └── AppContext.jsx        # Global state (useReducer + Context)
    │
    ├── data/
    │   └── transactions.js       # Mock transaction data + categories
    │
    ├── utils/
    │   └── helpers.js            # Formatting, filtering, sorting, CSV export
    │
    └── components/
        ├── Layout/
        │   ├── Sidebar.jsx       # Navigation + role switcher
        │   └── Topbar.jsx        # Header with dark mode + export
        ├── Dashboard/
        │   └── Dashboard.jsx     # Overview: stat cards + charts
        ├── Transactions/
        │   ├── Transactions.jsx  # Transaction list, filter, sort, CRUD
        │   └── TransactionModal.jsx  # Add / edit modal form
        └── Insights/
            └── Insights.jsx      # Insights: category breakdown, monthly comparison
```

---

## Features

### Dashboard Overview
- **4 Summary Cards**: Net Balance, Total Income, Total Expenses, Savings Rate
- **Area Chart**: Monthly income vs expense trend
- **Pie/Donut Chart**: Spending by category
- **Bar Chart**: Month-over-month comparison
- **Recent Transactions**: Quick-view of the last 5 entries

### Transactions
- Full transaction list with date, description, category, type, and amount
- **Search** by description or category
- **Filter** by type (income/expense), category, date range
- **Sort** by date, amount, or category (click column headers)
- **Add / Edit / Delete** (Admin role only)
- **Export to CSV** from the top bar

### Role-Based UI
Switch roles via the sidebar dropdown:
- **Admin**: Full CRUD — can add, edit, and delete transactions
- **Viewer**: Read-only — all edit/delete controls are hidden

### Insights
- Top spending category with total
- Savings rate assessment (healthy = 20%+)
- Month-over-month expense change percentage
- Monthly average income and expense
- Best savings month
- Spending breakdown with progress bars per category
- Full month-by-month summary table with savings rates

### State Management
- **React Context + useReducer** for global state
- State slices: `transactions`, `role`, `filters`, `sortBy`, `sortDir`, `darkMode`
- **localStorage persistence** — data survives page refresh

### Optional Features Implemented
- ✅ Dark mode toggle (with localStorage persistence)
- ✅ Data persistence via localStorage
- ✅ CSV export
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Smooth animations and transitions
- ✅ Empty state handling

---

## Tech Stack

| Tool | Purpose |
|------|---------|
| React 18 | UI framework |
| Recharts | Charts (Area, Bar, Pie) |
| Lucide React | Icons |
| date-fns | Date utilities |
| CSS Custom Properties | Theming + dark mode |

---

## Design Decisions

- **DM Sans + DM Mono** font pairing for a clean, modern financial feel
- **Warm neutral palette** — avoids the generic blue finance cliché
- **CSS variables** for instant dark/light mode switching
- **No external UI library** — all components are hand-crafted for full control
- **Reducer pattern** makes state transitions predictable and traceable

---

## Extending the Project

- Connect a real API: replace mock data in `src/data/transactions.js` and update `AppContext.jsx` to fetch on mount
- Add more roles: extend the role check (`isAdmin`) in components
- Add charts: Recharts is already installed — drop new chart components into `Dashboard.jsx`
