import React from "react";
import { LayoutDashboard, ArrowLeftRight, Lightbulb, X } from "lucide-react";
import { useApp } from "../../context/AppContext";

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "transactions", label: "Transactions", icon: ArrowLeftRight },
  { id: "insights", label: "Insights", icon: Lightbulb },
];

export default function Sidebar({ activePage, setActivePage, isOpen, onClose }) {
  const { state, dispatch } = useApp();

  return (
    <>
      {isOpen && (
        <div
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 99 }}
          onClick={onClose}
        />
      )}
      <aside className={`sidebar ${isOpen ? "open" : ""}`}>
        <div className="brand">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div className="brand-name">FinTrack</div>
              <div className="brand-sub">Finance Dashboard</div>
            </div>
            <button className="btn-icon" style={{ display: "none" }} onClick={onClose}>
              <X size={16} />
            </button>
          </div>
        </div>

        <nav className="nav-section">
          <div className="nav-label">Menu</div>
          {navItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              className={`nav-item ${activePage === id ? "active" : ""}`}
              onClick={() => { setActivePage(id); onClose(); }}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </nav>

        <div className="role-section">
          <div className="nav-label" style={{ marginBottom: 8 }}>Role</div>
          <div className="role-badge">
            <div className={`role-dot ${state.role === "viewer" ? "viewer" : ""}`} />
            <select
              className="role-select"
              value={state.role}
              onChange={(e) => dispatch({ type: "SET_ROLE", payload: e.target.value })}
            >
              <option value="admin">Admin</option>
              <option value="viewer">Viewer</option>
            </select>
          </div>
          <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 6, paddingLeft: 4 }}>
            {state.role === "admin"
              ? "Can add, edit & delete transactions"
              : "Read-only access"}
          </div>
        </div>
      </aside>
    </>
  );
}
