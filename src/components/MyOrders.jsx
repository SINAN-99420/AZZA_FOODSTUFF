import { useState } from "react";
import axios from "axios";
import "./MyOrders.css";
import { toast } from "./Toast";

const API = "https://azza-backend.onrender.com";

function MyOrders() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const getMyOrders = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.warning("Please enter your name.");
      return;
    }

    if (!phone.trim()) {
      toast.warning("Please enter your phone number.");
      return;
    }

    setLoading(true);
    setSearched(true);

    try {
      const response = await axios.get(
        `${API}/api/my-orders/?name=${encodeURIComponent(
          name.trim()
        )}&phone=${encodeURIComponent(phone.trim())}`,
        {
          withCredentials: true,
        }
      );

      setOrders(response.data.orders || []);
    } catch (error) {
      console.log("My Orders error:", error);

      setOrders([]);

      if (error.response?.data?.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "pending":
        return "status-pending";

      case "confirmed":
        return "status-confirmed";

      case "shipped":
        return "status-shipped";

      case "delivered":
        return "status-delivered";

      case "cancelled":
        return "status-cancelled";

      default:
        return "";
    }
  };

  const formatStatus = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="my-orders-page">
      <div className="my-orders-container">

        {/* HEADER */}

        <div className="my-orders-header">
          <p className="my-orders-label">
            ORDER HISTORY
          </p>

          <h1>My Orders</h1>

          <p>
            Enter your name and phone number to view
            your orders and track their status.
          </p>
        </div>


        {/* SEARCH */}

        <form
          className="order-search"
          onSubmit={getMyOrders}
        >

          {/* NAME */}

          <div className="phone-input">
            <label>
              Name
            </label>

            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>


          {/* PHONE */}

          <div className="phone-input">
            <label>
              Phone Number
            </label>

            <input
              type="tel"
              placeholder="Enter your phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>


          <button
            type="submit"
            disabled={loading}
          >
            {loading ? "Checking..." : "View Orders"}
          </button>

        </form>


        {/* LOADING */}

        {loading && (
          <div className="orders-loading">
            Loading your orders...
          </div>
        )}


        {/* NO ORDERS */}

        {!loading &&
          searched &&
          orders.length === 0 && (
            <div className="no-orders">

              <div className="no-orders-icon">
                📦
              </div>

              <h2>
                No orders found
              </h2>

              <p>
                Please enter the exact name and phone number
                you used while placing the order.
              </p>

            </div>
          )}


        {/* ORDERS */}

        {!loading && orders.length > 0 && (
          <div className="orders-list">

            {orders.map((order) => (
              <div
                className="order-card"
                key={order.order_id}
              >

                {/* ORDER HEADER */}

                <div className="order-card-header">

                  <div>
                    <span>
                      ORDER
                    </span>

                    <h2>
                      #{order.order_id}
                    </h2>
                  </div>

                  <div className="order-date">
                    <span>
                      ORDERED ON
                    </span>

                    <p>
                      {formatDate(order.created_at)}
                    </p>
                  </div>

                </div>


                {/* STATUS */}

                <div className="order-status-row">

                  <span>
                    Status
                  </span>

                  <strong
                    className={getStatusClass(
                      order.status
                    )}
                  >
                    {formatStatus(order.status)}
                  </strong>

                </div>


                {/* ITEMS */}

                <div className="order-items">

                  <h3>
                    Items
                  </h3>

                  {order.items.map((item, index) => (
                    <div
                      className="order-item"
                      key={index}
                    >

                      <div className="order-item-info">

                        <h4>
                          {item.product}
                        </h4>

                        <p>
                          {item.weight} {item.unit} ×{" "}
                          {item.quantity}
                        </p>

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


                {/* TOTAL */}

                <div className="order-total">

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


                {/* ADDRESS */}

                <div className="order-address">

                  <span>
                    DELIVERY ADDRESS
                  </span>

                  <p>
                    {order.address}
                  </p>

                  <p>
                    Pincode: {order.pincode}
                  </p>

                </div>

              </div>
            ))}

          </div>
        )}

      </div>
    </div>
  );
}

export default MyOrders;