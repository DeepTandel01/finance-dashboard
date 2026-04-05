import React from "react";
import { Moon, Sun, Menu, Download } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { exportToCSV } from "../../utils/helpers";

const pageTitles = {
  dashboard: "Overview",
  transactions: "Transactions",
  insights: "Insights",
};

export default function Topbar({ activePage, onMenuClick }) {
  const { state, dispatch } = useApp();

  return (
    <header className="topbar">
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <button className="btn-icon hamburger" onClick={onMenuClick} style={{ display: "flex" }}>
          <Menu size={18} />
        </button>
        <div>
          <h1 style={{ fontSize: 17, fontWeight: 600, letterSpacing: "-0.3px" }}>
            {pageTitles[activePage]}
          </h1>
          <p style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
            {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
          </p>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {activePage === "transactions" && (
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => exportToCSV(state.transactions)}
          >
            <Download size={13} />
            Export CSV
          </button>
        )}

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Sun size={13} color="var(--text-muted)" />
          <button
            className={`dark-toggle ${state.darkMode ? "on" : ""}`}
            onClick={() => dispatch({ type: "TOGGLE_DARK_MODE" })}
            title="Toggle dark mode"
          >
            <div className="dark-toggle-thumb" />
          </button>
          <Moon size={13} color="var(--text-muted)" />
        </div>

        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            background: "var(--accent-light)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 12,
            fontWeight: 600,
            color: "var(--accent)",
          }}
        >
          {state.role === "admin" ? "A" : "V"}
        </div>
      </div>
    </header>
  );
}
