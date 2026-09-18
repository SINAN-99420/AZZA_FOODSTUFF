import { useEffect, useState } from "react";
import axios from "axios";
import AdminNavbar from "./AdminNavbar";
import "./AdminProducts.css";

const API = "https://azza-backend.onrender.com/";

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);

  const [deleteProduct, setDeleteProduct] = useState(null);

  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);

  const [variants, setVariants] = useState([
    {
      id: null,
      quantity: "",
      unit: "g",
      price: "",
    },
  ]);

  // --------------------------------
  // GET CSRF TOKEN
  // --------------------------------

  const getCSRFToken = async () => {
    const response = await axios.get(
      `${API}/api/csrf/`,
      {
        withCredentials: true,
      }
    );

    return response.data.csrfToken;
  };

  // --------------------------------
  // LOAD PRODUCTS
  // --------------------------------

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        `${API}/api/admin/products/`,
        {
          withCredentials: true,
        }
      );

      setProducts(response.data.products || []);

    } catch (error) {
      console.error(error);

      if (
        error.response?.status === 401 ||
        error.response?.status === 403
      ) {
        setError("Admin access required.");
      } else {
        setError("Failed to load products.");
      }

    } finally {
      setLoading(false);
    }
  };

  // --------------------------------
  // LOAD CATEGORIES
  // --------------------------------

  const loadCategories = async () => {
    try {
      const response = await axios.get(
        `${API}/api/admin/categories/`,
        {
          withCredentials: true,
        }
      );

      setCategories(
        response.data.categories || []
      );

    } catch (error) {
      console.error(error);
    }
  };

  // --------------------------------
  // INITIAL LOAD
  // --------------------------------

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  // --------------------------------
  // RESET FORM
  // --------------------------------

  const resetForm = () => {
    setName("");
    setCategoryId("");
    setDescription("");
    setImage(null);

    setVariants([
      {
        id: null,
        quantity: "",
        unit: "g",
        price: "",
      },
    ]);

    setEditMode(false);
    setEditingProductId(null);
  };

  // --------------------------------
  // OPEN ADD FORM
  // --------------------------------

  const openAddForm = () => {
    resetForm();

    setError("");
    setMessage("");

    setShowForm(true);
  };

  // --------------------------------
  // OPEN EDIT FORM
  // --------------------------------

  const openEditForm = (product) => {
    setEditMode(true);
    setEditingProductId(product.id);

    setName(product.name);
    setCategoryId(String(product.category_id));
    setDescription(product.description || "");
    setImage(null);

    if (
      product.variants &&
      product.variants.length > 0
    ) {
      setVariants(
        product.variants.map((variant) => ({
          id: variant.id,
          quantity: variant.quantity,
          unit: variant.unit,
          price: variant.price,
        }))
      );
    } else {
      setVariants([
        {
          id: null,
          quantity: "",
          unit: "g",
          price: "",
        },
      ]);
    }

    setError("");
    setMessage("");
    setShowForm(true);
  };

  // --------------------------------
  // CLOSE FORM
  // --------------------------------

  const closeForm = () => {
    setShowForm(false);
    resetForm();
    setError("");
  };

  // --------------------------------
  // ADD VARIANT
  // --------------------------------

  const addVariant = () => {
    setVariants([
      ...variants,
      {
        id: null,
        quantity: "",
        unit: "g",
        price: "",
      },
    ]);
  };

  // --------------------------------
  // REMOVE VARIANT
  // --------------------------------

  const removeVariant = (index) => {
    if (variants.length === 1) {
      return;
    }

    const updatedVariants = variants.filter(
      (_, i) => i !== index
    );

    setVariants(updatedVariants);
  };

  // --------------------------------
  // UPDATE VARIANT
  // --------------------------------

  const updateVariant = (
    index,
    field,
    value
  ) => {
    const updatedVariants = [...variants];

    updatedVariants[index][field] = value;

    setVariants(updatedVariants);
  };

  // --------------------------------
  // SAVE / UPDATE PRODUCT
  // --------------------------------

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    if (!name.trim()) {
      setError("Product name is required.");
      return;
    }

    if (!categoryId) {
      setError("Please select a category.");
      return;
    }

    if (variants.length === 0) {
      setError("Add at least one variant.");
      return;
    }

    for (const variant of variants) {
      if (
        !variant.quantity ||
        !variant.price
      ) {
        setError(
          "Quantity and price are required."
        );
        return;
      }
    }

    try {
      setSaving(true);

      const csrfToken =
        await getCSRFToken();

      const formData = new FormData();

      formData.append(
        "name",
        name.trim()
      );

      formData.append(
        "category_id",
        categoryId
      );

      formData.append(
        "description",
        description.trim()
      );

      if (image) {
        formData.append(
          "image",
          image
        );
      }

      formData.append(
        "variants",
        JSON.stringify(variants)
      );

      let response;

      // UPDATE
      if (editMode) {
        response = await axios.patch(
          `${API}/api/admin/products/${editingProductId}/`,
          formData,
          {
            withCredentials: true,
            headers: {
              "X-CSRFToken": csrfToken,
            },
          }
        );
      }

      // CREATE
      else {
        response = await axios.post(
          `${API}/api/admin/products/`,
          formData,
          {
            withCredentials: true,
            headers: {
              "X-CSRFToken": csrfToken,
            },
          }
        );
      }

      setMessage(
        response.data.message ||
          (editMode
            ? "Product updated successfully."
            : "Product created successfully.")
      );

      setShowForm(false);
      resetForm();

      await loadProducts();

    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          error.response?.data?.detail ||
          "Something went wrong."
      );

    } finally {
      setSaving(false);
    }
  };

  // --------------------------------
  // OPEN DELETE CONFIRMATION
  // --------------------------------

  const openDeleteConfirm = (product) => {
    setDeleteProduct(product);
    setError("");
    setMessage("");
  };

  // --------------------------------
  // CLOSE DELETE CONFIRMATION
  // --------------------------------

  const closeDeleteConfirm = () => {
    if (deleting) {
      return;
    }

    setDeleteProduct(null);
  };

  // --------------------------------
  // DELETE PRODUCT
  // --------------------------------

  const handleDelete = async () => {
    if (!deleteProduct) {
      return;
    }

    try {
      setDeleting(true);
      setError("");

      const csrfToken =
        await getCSRFToken();

      const response = await axios.delete(
        `${API}/api/admin/products/${deleteProduct.id}/delete/`,
        {
          withCredentials: true,
          headers: {
            "X-CSRFToken": csrfToken,
          },
        }
      );

      setMessage(
        response.data.message ||
          "Product deleted successfully."
      );

      setDeleteProduct(null);

      await loadProducts();

    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          error.response?.data?.detail ||
          "Product could not be deleted."
      );

      setDeleteProduct(null);

    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="admin-products-page">

      <AdminNavbar />

      <main className="admin-products-container">

        {/* HEADER */}

        <div className="admin-products-header">

          <div>
            <span className="admin-products-label">
              STORE MANAGEMENT
            </span>

            <h1>Products</h1>

            <p>
              Add and manage your store products.
            </p>
          </div>

          <button
            type="button"
            className="add-product-btn"
            onClick={openAddForm}
          >
            + Add Product
          </button>

        </div>

        {/* MESSAGE */}

        {message && (
          <div className="admin-success-message">
            {message}
          </div>
        )}

        {error && (
          <div className="admin-error-message">
            {error}
          </div>
        )}

        {/* =================================
            ADD / EDIT MODAL
        ================================= */}

        {showForm && (
          <div className="product-form-overlay">

            <div className="product-form-modal">

              <div className="product-form-header">

                <div>
                  <span>
                    {editMode
                      ? "UPDATE PRODUCT"
                      : "NEW PRODUCT"}
                  </span>

                  <h2>
                    {editMode
                      ? "Edit Product"
                      : "Add Product"}
                  </h2>
                </div>

                <button
                  type="button"
                  className="close-form-btn"
                  onClick={closeForm}
                >
                  ×
                </button>

              </div>

              <form onSubmit={handleSubmit}>

                {/* NAME */}

                <div className="form-field">

                  <label>
                    Product Name
                  </label>

                  <input
                    type="text"
                    value={name}
                    onChange={(e) =>
                      setName(e.target.value)
                    }
                    placeholder="Enter product name"
                    required
                  />

                </div>

                {/* CATEGORY */}

                <div className="form-field">

                  <label>
                    Category
                  </label>

                  <select
                    value={categoryId}
                    onChange={(e) =>
                      setCategoryId(
                        e.target.value
                      )
                    }
                    required
                  >

                    <option value="">
                      Select category
                    </option>

                    {categories.map(
                      (category) => (
                        <option
                          key={category.id}
                          value={category.id}
                        >
                          {category.name}
                        </option>
                      )
                    )}

                  </select>

                </div>

                {/* DESCRIPTION */}

                <div className="form-field">

                  <label>
                    Description
                  </label>

                  <textarea
                    value={description}
                    onChange={(e) =>
                      setDescription(
                        e.target.value
                      )
                    }
                    placeholder="Enter product description"
                    rows="4"
                  />

                </div>

                {/* IMAGE */}

                <div className="form-field">

                  <label>
                    Product Image
                  </label>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setImage(
                        e.target.files[0]
                      )
                    }
                  />

                  {editMode && (
                    <small>
                      Leave empty to keep the
                      existing image.
                    </small>
                  )}

                </div>

                {/* VARIANTS */}

                <div className="variants-section">

                  <div className="variants-header">

                    <div>
                      <label>
                        Product Variants
                      </label>

                      <p>
                        Add quantity and price
                        options.
                      </p>
                    </div>

                    <button
                      type="button"
                      className="add-variant-btn"
                      onClick={addVariant}
                    >
                      + Add Variant
                    </button>

                  </div>

                  {variants.map(
                    (variant, index) => (

                      <div
                        className="variant-row"
                        key={
                          variant.id ||
                          `new-${index}`
                        }
                      >

                        <div className="variant-number">
                          {index + 1}
                        </div>

                        <div className="variant-input">

                          <label>
                            Quantity
                          </label>

                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={
                              variant.quantity
                            }
                            onChange={(e) =>
                              updateVariant(
                                index,
                                "quantity",
                                e.target.value
                              )
                            }
                            placeholder="250"
                            required
                          />

                        </div>

                        <div className="variant-input">

                          <label>
                            Unit
                          </label>

                          <select
                            value={variant.unit}
                            onChange={(e) =>
                              updateVariant(
                                index,
                                "unit",
                                e.target.value
                              )
                            }
                          >

                            <option value="g">
                              g
                            </option>

                            <option value="kg">
                              kg
                            </option>

                            <option value="ml">
                              ml
                            </option>

                            <option value="L">
                              L
                            </option>

                          </select>

                        </div>

                        <div className="variant-input">

                          <label>
                            Price
                          </label>

                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={
                              variant.price
                            }
                            onChange={(e) =>
                              updateVariant(
                                index,
                                "price",
                                e.target.value
                              )
                            }
                            placeholder="350"
                            required
                          />

                        </div>

                        <button
                          type="button"
                          className="remove-variant-btn"
                          onClick={() =>
                            removeVariant(index)
                          }
                          disabled={
                            variants.length === 1
                          }
                        >
                          ×
                        </button>

                      </div>

                    )
                  )}

                </div>

                {/* ACTIONS */}

                <div className="product-form-actions">

                  <button
                    type="button"
                    className="cancel-product-btn"
                    onClick={closeForm}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="save-product-btn"
                    disabled={saving}
                  >
                    {saving
                      ? "Saving..."
                      : editMode
                      ? "Update Product"
                      : "Save Product"}
                  </button>

                </div>

              </form>

            </div>

          </div>
        )}

        {/* =================================
            DELETE CONFIRMATION
        ================================= */}

        {deleteProduct && (
          <div className="delete-overlay">

            <div className="delete-modal">

              <div className="delete-icon">
                !
              </div>

              <h2>
                Delete Product?
              </h2>

              <p>
                Are you sure you want to delete
                <strong>
                  {" "}
                  {deleteProduct.name}
                </strong>
                ?
              </p>

              <span className="delete-warning">
                This action cannot be undone.
              </span>

              <div className="delete-actions">

                <button
                  type="button"
                  className="delete-cancel-btn"
                  onClick={
                    closeDeleteConfirm
                  }
                  disabled={deleting}
                >
                  Cancel
                </button>

                <button
                  type="button"
                  className="delete-confirm-btn"
                  onClick={handleDelete}
                  disabled={deleting}
                >
                  {deleting
                    ? "Deleting..."
                    : "Delete Product"}
                </button>

              </div>

            </div>

          </div>
        )}

        {/* =================================
            PRODUCT LIST
        ================================= */}

        <section className="products-section">

          <div className="products-section-title">

            <div>
              <span>
                YOUR STORE
              </span>

              <h2>
                All Products
              </h2>
            </div>

            <div className="product-count">
              {products.length} Products
            </div>

          </div>

          {loading ? (

            <div className="products-loading">
              Loading products...
            </div>

          ) : products.length === 0 ? (

            <div className="products-empty">

              <h3>
                No products yet
              </h3>

              <p>
                Add your first product
                to get started.
              </p>

              <button
                type="button"
                onClick={openAddForm}
              >
                + Add Product
              </button>

            </div>

          ) : (

            <div className="admin-products-grid">

              {products.map(
                (product) => (

                  <article
                    className="admin-product-card"
                    key={product.id}
                  >

                    {/* IMAGE */}

                    <div className="admin-product-image">

                      {product.image ? (

                        <img
                          src={product.image}
                          alt={product.name}
                        />

                      ) : (

                        <div className="no-product-image">
                          No Image
                        </div>

                      )}

                    </div>

                    {/* CONTENT */}

                    <div className="admin-product-content">

                      <div className="product-category">
                        {product.category}
                      </div>

                      <h3>
                        {product.name}
                      </h3>

                      {product.description && (
                        <p className="product-description">
                          {product.description}
                        </p>
                      )}

                      {/* VARIANTS */}

                      <div className="product-variants">

                        {product.variants?.map(
                          (variant) => (

                            <div
                              className="product-variant"
                              key={variant.id}
                            >

                              <span>
                                {variant.quantity}
                                {variant.unit}
                              </span>

                              <strong>
                                ₹{variant.price}
                              </strong>

                            </div>

                          )
                        )}

                      </div>

                      {/* ACTION BUTTONS */}

                      <div className="product-card-actions">

                        <button
                          type="button"
                          className="edit-product-btn"
                          onClick={() =>
                            openEditForm(
                              product
                            )
                          }
                        >
                          ✎ Edit
                        </button>

                        <button
                          type="button"
                          className="delete-product-btn"
                          onClick={() =>
                            openDeleteConfirm(
                              product
                            )
                          }
                        >
                          Delete
                        </button>

                      </div>

                    </div>

                  </article>

                )
              )}

            </div>

          )}

        </section>

      </main>

    </div>
  );
}

export default AdminProducts;