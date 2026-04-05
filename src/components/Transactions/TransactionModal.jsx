import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { CATEGORIES } from "../../data/transactions";

const empty = {
  description: "",
  amount: "",
  category: "Food & Dining",
  type: "expense",
  date: new Date().toISOString().split("T")[0],
};

export default function TransactionModal({ onClose, existing }) {
  const { dispatch } = useApp();
  const [form, setForm] = useState(existing || empty);
  const [error, setError] = useState("");

  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = () => {
    if (!form.description.trim()) return setError("Description is required");
    const amt = parseFloat(form.amount);
    if (!form.amount || isNaN(amt) || amt <= 0) return setError("Enter a valid amount");
    if (!form.date) return setError("Date is required");

    const payload = { ...form, amount: Math.round(amt) };
    if (existing) {
      dispatch({ type: "EDIT_TRANSACTION", payload });
    } else {
      dispatch({ type: "ADD_TRANSACTION", payload });
    }
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal animate-in">
        <div className="modal-header">
          <h2 className="modal-title">{existing ? "Edit Transaction" : "Add Transaction"}</h2>
          <button className="btn-icon" onClick={onClose}><X size={16} /></button>
        </div>

        <div className="modal-body">
          {error && (
            <div style={{ background: "#fee2e2", color: "#dc2626", padding: "8px 12px", borderRadius: 8, fontSize: 13, marginBottom: 14 }}>
              {error}
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Description</label>
            <input
              className="input"
              placeholder="e.g. Grocery Store"
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Amount (₹)</label>
              <input
                className="input"
                type="number"
                min="1"
                placeholder="0"
                value={form.amount}
                onChange={(e) => set("amount", e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Date</label>
              <input
                className="input"
                type="date"
                value={form.date}
                onChange={(e) => set("date", e.target.value)}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Type</label>
              <select className="select" style={{ width: "100%" }} value={form.type} onChange={(e) => set("type", e.target.value)}>
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Category</label>
              <select className="select" style={{ width: "100%" }} value={form.category} onChange={(e) => set("category", e.target.value)}>
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSubmit}>
            {existing ? "Save Changes" : "Add Transaction"}
          </button>
        </div>
      </div>
    </div>
  );
}
