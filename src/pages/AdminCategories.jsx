import { useEffect, useState } from "react";
import axios from "axios";
import AdminNavbar from "./AdminNavbar";
import "./AdminCategories.css";

const API = "https://azza-backend.onrender.com";

function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const getCSRFToken = async () => {
    try {
      const response = await axios.get(`${API}/api/csrf/`, {
        withCredentials: true,
      });

      return response.data.csrfToken;
    } catch (error) {
      console.error("CSRF Error:", error);
      return null;
    }
  };

  const loadCategories = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        `${API}/api/admin/categories/`,
        {
          withCredentials: true,
        }
      );

      setCategories(response.data.categories || []);
    } catch (error) {
      console.error("Category Error:", error);

      setError(
        error.response?.data?.message ||
        "Failed to load categories."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleAddCategory = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      setError("Please enter category name.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const csrfToken = await getCSRFToken();

      if (!csrfToken) {
        setError("CSRF token was not received.");
        return;
      }

      const response = await axios.post(
        `${API}/api/admin/categories/`,
        {
          name: name.trim(),
        },
        {
          withCredentials: true,
          headers: {
            "X-CSRFToken": csrfToken,
            "Content-Type": "application/json",
          },
        }
      );

      setCategories((prev) => [
        response.data.category,
        ...prev,
      ]);

      setName("");
      setShowForm(false);
    } catch (error) {
      console.error("Add Category Error:", error);

      setError(
        error.response?.data?.message ||
        "Failed to add category."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-categories-page">
      <AdminNavbar />

      <main className="admin-categories-content">

        <div className="admin-categories-heading">
          <div>
            <span className="admin-page-label">
              STORE MANAGEMENT
            </span>

            <h1>Categories</h1>

            <p>
              Manage the product categories in your store.
            </p>
          </div>

          <button
            className="admin-add-category-btn"
            onClick={() => {
              setShowForm(true);
              setError("");
            }}
          >
            + Add Category
          </button>
        </div>

        {error && (
          <div className="admin-category-error">
            {error}
          </div>
        )}

        {showForm && (
          <div className="admin-category-form-box">
            <div className="admin-form-heading">
              <div>
                <h2>Add Category</h2>
                <p>Create a new product category.</p>
              </div>

              <button
                type="button"
                className="admin-close-btn"
                onClick={() => {
                  setShowForm(false);
                  setName("");
                  setError("");
                }}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleAddCategory}>
              <label>Category Name</label>

              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter category name"
                autoFocus
              />

              <div className="admin-category-form-actions">
                <button
                  type="button"
                  className="admin-cancel-btn"
                  onClick={() => {
                    setShowForm(false);
                    setName("");
                    setError("");
                  }}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="admin-save-category-btn"
                  disabled={saving}
                >
                  {saving ? "Adding..." : "Add Category"}
                </button>
              </div>
            </form>
          </div>
        )}

        <section className="admin-category-list-section">
          <div className="admin-category-list-heading">
            <h2>All Categories</h2>

            <span>
              {categories.length}{" "}
              {categories.length === 1 ? "Category" : "Categories"}
            </span>
          </div>

          {loading ? (
            <div className="admin-category-loading">
              Loading categories...
            </div>
          ) : categories.length === 0 ? (
            <div className="admin-empty-category">
              <h3>No categories yet</h3>
              <p>Add your first product category.</p>
            </div>
          ) : (
            <div className="admin-category-list">
              {categories.map((category) => (
                <div
                  className="admin-category-card"
                  key={category.id}
                >
                  <div className="admin-category-icon">
                    C
                  </div>

                  <div className="admin-category-info">
                    <h3>{category.name}</h3>

                    <p>
                      {category.product_count}{" "}
                      {category.product_count === 1
                        ? "Product"
                        : "Products"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

      </main>
    </div>
  );
}

export default AdminCategories;