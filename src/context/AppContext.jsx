import React, { createContext, useContext, useReducer, useEffect } from "react";
import { initialTransactions, getNextId } from "../data/transactions";

const AppContext = createContext(null);

const STORAGE_KEY = "finance_dashboard_state";

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch (_) {}
  return null;
}

function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (_) {}
}

const defaultState = {
  transactions: initialTransactions,
  role: "admin", // "admin" | "viewer"
  filters: {
    search: "",
    type: "all",     // "all" | "income" | "expense"
    category: "all",
    dateFrom: "",
    dateTo: "",
  },
  sortBy: "date",     // "date" | "amount" | "category"
  sortDir: "desc",    // "asc" | "desc"
  darkMode: false,
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_ROLE":
      return { ...state, role: action.payload };

    case "SET_FILTER":
      return { ...state, filters: { ...state.filters, [action.key]: action.value } };

    case "RESET_FILTERS":
      return { ...state, filters: defaultState.filters };

    case "SET_SORT":
      return {
        ...state,
        sortBy: action.sortBy,
        sortDir:
          state.sortBy === action.sortBy && state.sortDir === "asc" ? "desc" : "asc",
      };

    case "ADD_TRANSACTION": {
      const newTxn = { ...action.payload, id: getNextId() };
      return { ...state, transactions: [newTxn, ...state.transactions] };
    }

    case "EDIT_TRANSACTION":
      return {
        ...state,
        transactions: state.transactions.map((t) =>
          t.id === action.payload.id ? action.payload : t
        ),
      };

    case "DELETE_TRANSACTION":
      return {
        ...state,
        transactions: state.transactions.filter((t) => t.id !== action.payload),
      };

    case "TOGGLE_DARK_MODE":
      return { ...state, darkMode: !state.darkMode };

    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const saved = loadState();
  const [state, dispatch] = useReducer(reducer, saved || defaultState);

  useEffect(() => {
    saveState(state);
  }, [state]);

  useEffect(() => {
    if (state.darkMode) {
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
  }, [state.darkMode]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
