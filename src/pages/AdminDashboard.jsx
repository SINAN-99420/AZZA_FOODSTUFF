import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";
import AdminNavbar from "./AdminNavbar";

const API = "https://azza-backend.onrender.com/";

function AdminDashboard() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);
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

  const checkAdmin = async () => {
    try {
      await axios.get(`${API}/api/admin/check/`, {
        withCredentials: true,
      });

      return true;
    } catch (error) {
      if (
        error.response?.status === 401 ||
        error.response?.status === 403
      ) {
        navigate("/admin/login");
      }

      return false;
    }
  };

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        `${API}/api/admin/orders/`,
        {
          withCredentials: true,
        }
      );

      setOrders(response.data.orders || []);
    } catch (error) {
      console.error("Orders Error:", error);

      if (
        error.response?.status === 401 ||
        error.response?.status === 403
      ) {
        navigate("/admin/login");
        return;
      }

      setError(
        error.response?.data?.message ||
        "Failed to load orders."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      const authenticated = await checkAdmin();

      if (authenticated) {
        await loadOrders();
      }
    };

    init();
  }, []);

  const updateStatus = async (orderId, newStatus) => {
    try {
      setUpdating(orderId);
      setError("");

      const csrfToken = await getCSRFToken();

      if (!csrfToken) {
        setError("CSRF token was not received.");
        return;
      }

      const response = await axios.patch(
        `${API}/api/admin/orders/${orderId}/status/`,
        {
          status: newStatus,
        },
        {
          withCredentials: true,
          headers: {
            "X-CSRFToken": csrfToken,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Status Update:", response.data);

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.order_id === orderId
            ? {
                ...order,
                status: newStatus,
              }
            : order
        )
      );
    } catch (error) {
      console.error("Status Update Error:", error);
      console.log("Response:", error.response?.data);

      if (
        error.response?.status === 401 ||
        error.response?.status === 403
      ) {
        navigate("/admin/login");
        return;
      }

      setError(
        error.response?.data?.detail ||
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Failed to update order status."
      );
    } finally {
      setUpdating(null);
    }
  };

  const handleLogout = async () => {
    try {
      const csrfToken = await getCSRFToken();

      await axios.post(
        `${API}/api/admin/logout/`,
        {},
        {
          withCredentials: true,
          headers: {
            "X-CSRFToken": csrfToken,
          },
        }
      );

      navigate("/admin/login");
    } catch (error) {
      console.error("Logout Error:", error);
      navigate("/admin/login");
    }
  };

  const getCount = (status) => {
    return orders.filter(
      (order) => order.status === status
    ).length;
  };

  const formatStatus = (status) => {
    if (!status) return "";

    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const formatDate = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="admin-dashboard-page">
        <div className="admin-loading">
          Loading dashboard...
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard-page">

      <AdminNavbar onLogout={handleLogout} />

      <main className="admin-dashboard-content">

        {error && (
          <div className="admin-dashboard-error">
            {error}
          </div>
        )}

        <section className="admin-stats">

          <div className="admin-stat-card">
            <span>Total Orders</span>
            <strong>{orders.length}</strong>
          </div>

          <div className="admin-stat-card">
            <span>Pending</span>
            <strong>{getCount("pending")}</strong>
          </div>

          <div className="admin-stat-card">
            <span>Confirmed</span>
            <strong>{getCount("confirmed")}</strong>
          </div>

          <div className="admin-stat-card">
            <span>Shipped</span>
            <strong>{getCount("shipped")}</strong>
          </div>

          <div className="admin-stat-card">
            <span>Delivered</span>
            <strong>{getCount("delivered")}</strong>
          </div>

          <div className="admin-stat-card">
            <span>Cancelled</span>
            <strong>{getCount("cancelled")}</strong>
          </div>

        </section>

        <section className="admin-orders-section">

          <div className="admin-section-heading">
            <div>
              <h2>Orders</h2>
              <p>Manage and update customer orders</p>
            </div>

            <button
              className="admin-refresh-btn"
              onClick={loadOrders}
            >
              Refresh
            </button>
          </div>

          {orders.length === 0 ? (
            <div className="admin-no-orders">
              <h3>No orders yet</h3>
              <p>
                Customer orders will appear here.
              </p>
            </div>
          ) : (
            <div className="admin-orders-list">

              {orders.map((order) => (
                <div
                  className="admin-order-card"
                  key={order.order_id}
                >

                  <div className="admin-order-top">

                    <div>
                      <span className="admin-order-label">
                        Order
                      </span>

                      <h3>
                        #{order.order_id}
                      </h3>

                      <p>
                        {formatDate(order.created_at)}
                        {" · "}
                        {formatTime(order.created_at)}
                      </p>
                    </div>

                    <div className="admin-order-status">
                      <label>Status</label>

                      <select
                        value={order.status}
                        disabled={updating === order.order_id}
                        onChange={(e) =>
                          updateStatus(
                            order.order_id,
                            e.target.value
                          )
                        }
                      >
                        <option value="pending">
                          Pending
                        </option>

                        <option value="confirmed">
                          Confirmed
                        </option>

                        <option value="shipped">
                          Shipped
                        </option>

                        <option value="delivered">
                          Delivered
                        </option>

                        <option value="cancelled">
                          Cancelled
                        </option>
                      </select>

                      {updating === order.order_id && (
                        <small>
                          Updating...
                        </small>
                      )}
                    </div>

                  </div>

                  <div className="admin-order-body">

                    <div className="admin-customer-info">
                      <h4>Customer</h4>

                      <p>
                        <strong>Name:</strong>{" "}
                        {order.name}
                      </p>

                      <p>
                        <strong>Phone:</strong>{" "}
                        {order.phone}
                      </p>

                      {order.email && (
                        <p>
                          <strong>Email:</strong>{" "}
                          {order.email}
                        </p>
                      )}

                      <p>
                        <strong>Address:</strong>{" "}
                        {order.address}
                      </p>

                      {order.city && (
                        <p>
                          <strong>City:</strong>{" "}
                          {order.city}
                        </p>
                      )}

                      {order.district && (
                        <p>
                          <strong>District:</strong>{" "}
                          {order.district}
                        </p>
                      )}

                      <p>
                        <strong>Pincode:</strong>{" "}
                        {order.pincode}
                      </p>
                    </div>

                    <div className="admin-order-items">
                      <h4>Order Items</h4>

                      {order.items?.map((item, index) => (
                        <div
                          className="admin-order-item"
                          key={index}
                        >
                          <div>
                            <strong>
                              {item.product}
                            </strong>

                            <span>
                              {item.weight}
                              {item.unit} ×{" "}
                              {item.quantity}
                            </span>
                          </div>

                          <strong>
                            ₹
                            {Number(
                              item.subtotal
                            ).toFixed(2)}
                          </strong>
                        </div>
                      ))}
                    </div>

                  </div>

                  <div className="admin-order-bottom">

                    <span>
                      Order Total
                    </span>

                    <strong>
                      ₹
                      {Number(
                        order.total
                      ).toFixed(2)}
                    </strong>

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

export default AdminDashboard;