import React, { useState, useMemo } from "react";
import { Search, Plus, Pencil, Trash2, ChevronUp, ChevronDown, X } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { CATEGORIES, CATEGORY_COLORS } from "../../data/transactions";
import { applyFilters, applySort, formatCurrency, formatDate } from "../../utils/helpers";
import TransactionModal from "./TransactionModal";

export default function Transactions() {
  const { state, dispatch } = useApp();
  const { transactions, filters, sortBy, sortDir, role } = state;
  const isAdmin = role === "admin";

  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const filtered = useMemo(() => applyFilters(transactions, filters), [transactions, filters]);
  const sorted = useMemo(() => applySort(filtered, sortBy, sortDir), [filtered, sortBy, sortDir]);

  const setFilter = (key, value) => dispatch({ type: "SET_FILTER", key, value });
  const setSort = (col) => dispatch({ type: "SET_SORT", sortBy: col });

  const SortIcon = ({ col }) => {
    if (sortBy !== col) return <ChevronUp size={12} color="var(--text-muted)" />;
    return sortDir === "asc"
      ? <ChevronUp size={12} />
      : <ChevronDown size={12} />;
  };

  const handleDelete = (id) => {
    dispatch({ type: "DELETE_TRANSACTION", payload: id });
    setConfirmDelete(null);
  };

  const openEdit = (txn) => { setEditTarget(txn); setShowModal(true); };
  const openAdd = () => { setEditTarget(null); setShowModal(true); };
  const closeModal = () => { setShowModal(false); setEditTarget(null); };

  const hasFilters = filters.search || filters.type !== "all" || filters.category !== "all" || filters.dateFrom || filters.dateTo;

  return (
    <div className="animate-in">
      {/* Controls */}
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 20, alignItems: "center" }}>
        <div style={{ position: "relative", flex: "1 1 200px", minWidth: 180 }}>
          <Search size={14} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
          <input
            className="input"
            style={{ paddingLeft: 32 }}
            placeholder="Search transactions..."
            value={filters.search}
            onChange={(e) => setFilter("search", e.target.value)}
          />
        </div>

        <select className="select" value={filters.type} onChange={(e) => setFilter("type", e.target.value)}>
          <option value="all">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>

        <select className="select" value={filters.category} onChange={(e) => setFilter("category", e.target.value)}>
          <option value="all">All Categories</option>
          {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
        </select>

        <input className="input" type="date" style={{ width: "auto" }} value={filters.dateFrom} onChange={(e) => setFilter("dateFrom", e.target.value)} />
        <input className="input" type="date" style={{ width: "auto" }} value={filters.dateTo} onChange={(e) => setFilter("dateTo", e.target.value)} />

        {hasFilters && (
          <button className="btn btn-ghost btn-sm" onClick={() => dispatch({ type: "RESET_FILTERS" })}>
            <X size={12} /> Reset
          </button>
        )}

        <div style={{ marginLeft: "auto" }}>
          {isAdmin && (
            <button className="btn btn-primary" onClick={openAdd}>
              <Plus size={14} /> Add Transaction
            </button>
          )}
        </div>
      </div>

      {/* Count */}
      <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 12 }}>
        Showing <strong style={{ color: "var(--text-primary)" }}>{sorted.length}</strong> of {transactions.length} transactions
      </p>

      {/* Table */}
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        {sorted.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🔍</div>
            <div className="empty-state-title">No transactions found</div>
            <div className="empty-state-sub">Try adjusting your filters or adding a new transaction.</div>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th onClick={() => setSort("date")}>Date <SortIcon col="date" /></th>
                  <th>Description</th>
                  <th onClick={() => setSort("category")}>Category <SortIcon col="category" /></th>
                  <th>Type</th>
                  <th onClick={() => setSort("amount")} style={{ textAlign: "right" }}>Amount <SortIcon col="amount" /></th>
                  {isAdmin && <th style={{ textAlign: "center" }}>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {sorted.map((txn) => (
                  <tr key={txn.id}>
                    <td style={{ color: "var(--text-secondary)", fontFamily: "var(--font-mono)", fontSize: 12 }}>{formatDate(txn.date)}</td>
                    <td style={{ fontWeight: 500 }}>{txn.description}</td>
                    <td>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12 }}>
                        <span style={{ width: 8, height: 8, borderRadius: "50%", background: CATEGORY_COLORS[txn.category] || "#888", flexShrink: 0 }} />
                        {txn.category}
                      </span>
                    </td>
                    <td>
                      <span className={`badge badge-${txn.type}`}>{txn.type}</span>
                    </td>
                    <td style={{ textAlign: "right", fontFamily: "var(--font-mono)", fontWeight: 600, color: txn.type === "income" ? "var(--income)" : "var(--expense)" }}>
                      {txn.type === "income" ? "+" : "−"}{formatCurrency(txn.amount)}
                    </td>
                    {isAdmin && (
                      <td style={{ textAlign: "center" }}>
                        <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
                          <button className="btn-icon" onClick={() => openEdit(txn)} title="Edit">
                            <Pencil size={13} />
                          </button>
                          <button className="btn-icon" style={{ color: "#dc2626", borderColor: "#fecaca" }} onClick={() => setConfirmDelete(txn.id)} title="Delete">
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete confirm */}
      {confirmDelete && (
        <div className="modal-overlay" onClick={() => setConfirmDelete(null)}>
          <div className="modal animate-in" style={{ maxWidth: 360 }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Delete Transaction</h2>
              <button className="btn-icon" onClick={() => setConfirmDelete(null)}><X size={16} /></button>
            </div>
            <div className="modal-body">
              <p style={{ fontSize: 14, color: "var(--text-secondary)" }}>Are you sure you want to delete this transaction? This action cannot be undone.</p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setConfirmDelete(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={() => handleDelete(confirmDelete)}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && <TransactionModal onClose={closeModal} existing={editTarget} />}
    </div>
  );
}
