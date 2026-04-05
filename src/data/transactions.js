export const CATEGORIES = [
  "Food & Dining",
  "Shopping",
  "Transport",
  "Entertainment",
  "Health",
  "Utilities",
  "Salary",
  "Freelance",
  "Investment",
  "Rent",
];

export const CATEGORY_COLORS = {
  "Food & Dining": "#e07b54",
  Shopping: "#7b6ef6",
  Transport: "#54aee0",
  Entertainment: "#e0b654",
  Health: "#54e09f",
  Utilities: "#e05454",
  Salary: "#4caf7d",
  Freelance: "#4c9faf",
  Investment: "#af4caf",
  Rent: "#af7b4c",
};

let idCounter = 1;
const mkId = () => `txn_${idCounter++}`;

export const initialTransactions = [
  // January
  { id: mkId(), date: "2025-01-03", description: "Monthly Salary", amount: 85000, category: "Salary", type: "income" },
  { id: mkId(), date: "2025-01-05", description: "Rent Payment", amount: 22000, category: "Rent", type: "expense" },
  { id: mkId(), date: "2025-01-07", description: "Grocery Store", amount: 3200, category: "Food & Dining", type: "expense" },
  { id: mkId(), date: "2025-01-10", description: "Freelance Project A", amount: 15000, category: "Freelance", type: "income" },
  { id: mkId(), date: "2025-01-12", description: "Uber Ride", amount: 450, category: "Transport", type: "expense" },
  { id: mkId(), date: "2025-01-14", description: "Netflix Subscription", amount: 649, category: "Entertainment", type: "expense" },
  { id: mkId(), date: "2025-01-16", description: "Pharmacy", amount: 1200, category: "Health", type: "expense" },
  { id: mkId(), date: "2025-01-18", description: "Amazon Shopping", amount: 4500, category: "Shopping", type: "expense" },
  { id: mkId(), date: "2025-01-20", description: "Electricity Bill", amount: 1800, category: "Utilities", type: "expense" },
  { id: mkId(), date: "2025-01-22", description: "Restaurant Dinner", amount: 2100, category: "Food & Dining", type: "expense" },
  { id: mkId(), date: "2025-01-25", description: "Mutual Fund SIP", amount: 10000, category: "Investment", type: "expense" },
  { id: mkId(), date: "2025-01-28", description: "Coffee Shop", amount: 380, category: "Food & Dining", type: "expense" },

  // February
  { id: mkId(), date: "2025-02-03", description: "Monthly Salary", amount: 85000, category: "Salary", type: "income" },
  { id: mkId(), date: "2025-02-05", description: "Rent Payment", amount: 22000, category: "Rent", type: "expense" },
  { id: mkId(), date: "2025-02-07", description: "Zomato Orders", amount: 2800, category: "Food & Dining", type: "expense" },
  { id: mkId(), date: "2025-02-10", description: "Freelance Project B", amount: 20000, category: "Freelance", type: "income" },
  { id: mkId(), date: "2025-02-12", description: "Petrol", amount: 3000, category: "Transport", type: "expense" },
  { id: mkId(), date: "2025-02-14", description: "Valentine's Shopping", amount: 6500, category: "Shopping", type: "expense" },
  { id: mkId(), date: "2025-02-16", description: "Gym Membership", amount: 2500, category: "Health", type: "expense" },
  { id: mkId(), date: "2025-02-18", description: "Movie Tickets", amount: 1200, category: "Entertainment", type: "expense" },
  { id: mkId(), date: "2025-02-20", description: "Internet Bill", amount: 999, category: "Utilities", type: "expense" },
  { id: mkId(), date: "2025-02-22", description: "Dividend Income", amount: 5000, category: "Investment", type: "income" },
  { id: mkId(), date: "2025-02-25", description: "Mutual Fund SIP", amount: 10000, category: "Investment", type: "expense" },

  // March
  { id: mkId(), date: "2025-03-03", description: "Monthly Salary", amount: 85000, category: "Salary", type: "income" },
  { id: mkId(), date: "2025-03-05", description: "Rent Payment", amount: 22000, category: "Rent", type: "expense" },
  { id: mkId(), date: "2025-03-08", description: "Supermarket", amount: 4100, category: "Food & Dining", type: "expense" },
  { id: mkId(), date: "2025-03-10", description: "Freelance Project C", amount: 12000, category: "Freelance", type: "income" },
  { id: mkId(), date: "2025-03-12", description: "Ola Ride", amount: 600, category: "Transport", type: "expense" },
  { id: mkId(), date: "2025-03-14", description: "Clothing Store", amount: 7800, category: "Shopping", type: "expense" },
  { id: mkId(), date: "2025-03-16", description: "Doctor Visit", amount: 1500, category: "Health", type: "expense" },
  { id: mkId(), date: "2025-03-18", description: "Spotify Premium", amount: 119, category: "Entertainment", type: "expense" },
  { id: mkId(), date: "2025-03-20", description: "Water Bill", amount: 350, category: "Utilities", type: "expense" },
  { id: mkId(), date: "2025-03-22", description: "Electronics", amount: 15000, category: "Shopping", type: "expense" },
  { id: mkId(), date: "2025-03-25", description: "Mutual Fund SIP", amount: 10000, category: "Investment", type: "expense" },
  { id: mkId(), date: "2025-03-28", description: "Swiggy Orders", amount: 1900, category: "Food & Dining", type: "expense" },

  // April (current month)
  { id: mkId(), date: "2025-04-03", description: "Monthly Salary", amount: 90000, category: "Salary", type: "income" },
  { id: mkId(), date: "2025-04-05", description: "Rent Payment", amount: 22000, category: "Rent", type: "expense" },
  { id: mkId(), date: "2025-04-07", description: "Big Basket", amount: 3500, category: "Food & Dining", type: "expense" },
  { id: mkId(), date: "2025-04-10", description: "Freelance Project D", amount: 18000, category: "Freelance", type: "income" },
  { id: mkId(), date: "2025-04-12", description: "Bus Pass", amount: 800, category: "Transport", type: "expense" },
  { id: mkId(), date: "2025-04-15", description: "Amazon Prime", amount: 1499, category: "Entertainment", type: "expense" },
];

export const getNextId = () => `txn_${Date.now()}`;
