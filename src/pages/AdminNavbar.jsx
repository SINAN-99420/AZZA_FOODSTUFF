import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminNavbar.css";

function AdminNavbar({ onLogout }) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const goTo = (path) => {
    navigate(path);
    setMenuOpen(false);
  };

  const handleLogout = () => {
    setMenuOpen(false);

    if (onLogout) {
      onLogout();
    } else {
      navigate("/admin/login");
    }
  };

  return (
    <nav className="admin-navbar">
      <div className="admin-navbar-top">
        <button
          type="button"
          className="admin-navbar-logo"
          onClick={() => goTo("/admin/dashboard")}
        >
          <img src="/images/azza-logo.png" alt="Azza Foodstuff" />
        </button>

        <button
          type="button"
          className="admin-menu-btn"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle admin menu"
          aria-expanded={menuOpen}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      <div className={`admin-navbar-links ${menuOpen ? "open" : ""}`}>
        <button type="button" onClick={() => goTo("/admin/dashboard")}>
          Dashboard
        </button>

        <button type="button" onClick={() => goTo("/admin/products")}>
          Products
        </button>

        <button type="button" onClick={() => goTo("/admin/categories")}>
          Categories
        </button>

        <button
          type="button"
          className="admin-nav-logout"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

export default AdminNavbar;
