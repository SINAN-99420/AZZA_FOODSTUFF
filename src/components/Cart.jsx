import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./Cart.css";

const API = "https://azza-backend.onrender.com";

function Cart() {
  const [cart, setCart] = useState({
    items: [],
    total: 0,
  });

  const [loading, setLoading] = useState(true);
  const [showOrderForm, setShowOrderForm] = useState(false);

  const [customer, setCustomer] = useState({
    name: "",
    phone: "",
    address: "",
    pincode: "",
  });

  /* =========================
     GET CART
  ========================= */

  const getCart = () => {
    axios
      .get(`${API}/api/cart/`, {
        withCredentials: true,
      })
      .then((res) => {
        setCart(res.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log("Cart error:", error);
        setLoading(false);
      });
  };

  useEffect(() => {
    getCart();
  }, []);

  /* =========================
     UPDATE QUANTITY
  ========================= */

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) return;

    axios
      .patch(
        `${API}/api/cart/update/${itemId}/`,
        {
          quantity: newQuantity,
        },
        {
          withCredentials: true,
        }
      )
      .then(() => {
        getCart();

        window.dispatchEvent(
          new Event("cartUpdated")
        );
      })
      .catch((error) => {
        console.log("Update error:", error);
      });
  };

  /* =========================
     REMOVE ITEM
  ========================= */

  const removeItem = (itemId) => {
    axios
      .delete(
        `${API}/api/cart/remove/${itemId}/`,
        {
          withCredentials: true,
        }
      )
      .then(() => {
        getCart();

        window.dispatchEvent(
          new Event("cartUpdated")
        );
      })
      .catch((error) => {
        console.log("Remove error:", error);
      });
  };

  /* =========================
     FORM INPUT
  ========================= */

  const handleCustomerChange = (e) => {
    const { name, value } = e.target;

    setCustomer((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* =========================
     OPEN ORDER FORM
  ========================= */

  const openOrderForm = () => {
    if (cart.items.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    setShowOrderForm(true);
  };

  /* =========================
     CLOSE ORDER FORM
  ========================= */

  const closeOrderForm = () => {
    setShowOrderForm(false);
  };

  /* =========================
     CREATE ORDER + WHATSAPP
  ========================= */

  const sendWhatsAppOrder = async (e) => {
    e.preventDefault();

    if (
      !customer.name ||
      !customer.phone ||
      !customer.address ||
      !customer.pincode
    ) {
      alert("Please fill all customer details.");
      return;
    }

    if (cart.items.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    try {
      /* =========================
         CREATE ORDER IN DJANGO
      ========================= */

      const orderResponse = await axios.post(
        `${API}/api/orders/create/`,
        {
          name: customer.name,
          phone: customer.phone,
          address: customer.address,
          pincode: customer.pincode,

          email: "",
          city: "",
          district: "",
        },
        {
          withCredentials: true,
        }
      );

      const orderId = orderResponse.data.order_id;

      /* =========================
         WHATSAPP MESSAGE
      ========================= */

      const whatsappNumber = "919495987283";

      let message =
        "AZZA FOODSTUFF\n\n" +
        `Order ID: #${orderId}\n\n` +
        "Hello, I would like to place an order.\n\n" +
        "ORDER DETAILS\n\n";

      cart.items.forEach((item, index) => {
        message +=
          `${index + 1}. ${item.product}\n` +
          `   ${item.weight} ${item.unit} × ${item.quantity} — ₹${Number(
            item.subtotal
          ).toFixed(2)}\n\n`;
      });

      message +=
        `Subtotal: ₹${Number(cart.total).toFixed(2)}\n` +
        "Delivery: To be confirmed\n\n" +
        "CUSTOMER DETAILS\n\n" +
        `Name: ${customer.name}\n` +
        `Phone: ${customer.phone}\n` +
        `Address: ${customer.address}\n` +
        `Pincode: ${customer.pincode}\n\n` +
        "Please confirm my order and delivery details.\n\n" +
        "Thank you.";

      const whatsappUrl =
        `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
          message
        )}`;

      /* =========================
         OPEN WHATSAPP
      ========================= */

      window.open(
        whatsappUrl,
        "_blank",
        "noopener,noreferrer"
      );

      /* =========================
         CLOSE FORM + REFRESH CART
      ========================= */

      setShowOrderForm(false);

      getCart();

      window.dispatchEvent(
        new Event("cartUpdated")
      );

    } catch (error) {
      console.log("Order creation error:", error);

      if (error.response) {
        alert(
          error.response.data?.error ||
          "Failed to create order."
        );
      } else {
        alert("Could not connect to the server.");
      }
    }
  };

  /* =========================
     LOADING
  ========================= */

  if (loading) {
    return (
      <div className="cart-loading">
        Loading cart...
      </div>
    );
  }

  return (
    <div className="cart-page">

      <div className="cart-container">

        {/* =========================
            EMPTY CART
        ========================= */}

        {cart.items.length === 0 ? (

          <div className="empty-cart">

            <div className="empty-cart-icon">
              🛒
            </div>

            <h2>
              Your cart is empty
            </h2>

            <p>
              Looks like you haven't added
              anything to your cart yet.
            </p>

            <Link
              to="/shop"
              className="continue-shopping"
            >
              Continue Shopping
            </Link>

          </div>

        ) : (

          /* =========================
             CART CONTENT
          ========================= */

          <div className="cart-content">

            {/* =========================
                ITEMS
            ========================= */}

            <div className="cart-items">

              {cart.items.map((item) => (

                <div
                  className="cart-item"
                  key={item.id}
                >

                  {/* Image */}

                  <div className="cart-item-image">

                    <div className="cart-image-placeholder">
                      🍯
                    </div>

                  </div>


                  {/* Details */}

                  <div className="cart-item-details">

                    <h3>
                      {item.product}
                    </h3>

                    <p>
                      {item.weight} {item.unit}
                    </p>

                    <span>
                      ₹
                      {Number(item.price).toFixed(2)}
                    </span>

                  </div>


                  {/* Actions */}

                  <div className="cart-item-actions">

                    <div className="cart-quantity">

                      <button
                        onClick={() =>
                          updateQuantity(
                            item.id,
                            item.quantity - 1
                          )
                        }
                      >
                        −
                      </button>

                      <span>
                        {item.quantity}
                      </span>

                      <button
                        onClick={() =>
                          updateQuantity(
                            item.id,
                            item.quantity + 1
                          )
                        }
                      >
                        +
                      </button>

                    </div>


                    <p className="cart-subtotal">
                      ₹
                      {Number(
                        item.subtotal
                      ).toFixed(2)}
                    </p>


                    <button
                      className="remove-btn"
                      onClick={() =>
                        removeItem(item.id)
                      }
                    >
                      Remove
                    </button>

                  </div>

                </div>

              ))}

            </div>


            {/* =========================
                SUMMARY
            ========================= */}

            <div className="cart-summary">

              <h2>
                Order Summary
              </h2>


              <div className="summary-row">

                <span>
                  Subtotal
                </span>

                <span>
                  ₹
                  {Number(
                    cart.total
                  ).toFixed(2)}
                </span>

              </div>


              <div className="summary-row">

                <span>
                  Delivery
                </span>

                <span>
                  Confirm on WhatsApp
                </span>

              </div>


              <div className="summary-line"></div>


              <div className="summary-total">

                <span>
                  Total
                </span>

                <strong>
                  ₹
                  {Number(
                    cart.total
                  ).toFixed(2)}
                </strong>

              </div>


              {/* WhatsApp */}

              <button
                className="whatsapp-order-btn"
                onClick={openOrderForm}
              >

                <span>
                  Order on WhatsApp
                </span>

                <strong>
                  →
                </strong>

              </button>


              <p className="whatsapp-note">
                Your order details will be
                sent to Azza Foodstuff on WhatsApp.
              </p>


              <Link
                to="/shop"
                className="back-shop"
              >
                ← Continue Shopping
              </Link>

            </div>

          </div>

        )}

      </div>


      {/* =====================================
          ORDER FORM OVERLAY
      ===================================== */}

      {showOrderForm && (

        <div
          className="order-overlay"
          onClick={closeOrderForm}
        >

          <div
            className="order-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            {/* Header */}

            <div className="order-modal-header">

              <div>

                <p>
                  AZZA FOODSTUFF
                </p>

                <h2>
                  Complete Your Order
                </h2>

              </div>

              <button
                className="order-close"
                onClick={closeOrderForm}
              >
                ×
              </button>

            </div>


            {/* Form */}

            <form
              onSubmit={sendWhatsAppOrder}
              className="order-form"
            >

              {/* Name */}

              <div className="form-field">

                <label>
                  Full Name
                </label>

                <input
                  type="text"
                  name="name"
                  placeholder="Enter your name"
                  value={customer.name}
                  onChange={handleCustomerChange}
                  required
                />

              </div>


              {/* Phone */}

              <div className="form-field">

                <label>
                  Phone Number
                </label>

                <input
                  type="tel"
                  name="phone"
                  placeholder="Enter your phone number"
                  value={customer.phone}
                  onChange={handleCustomerChange}
                  required
                />

              </div>


              {/* Address */}

              <div className="form-field">

                <label>
                  Delivery Address
                </label>

                <textarea
                  name="address"
                  placeholder="Enter your complete delivery address"
                  value={customer.address}
                  onChange={handleCustomerChange}
                  rows="3"
                  required
                ></textarea>

              </div>


              {/* Pincode */}

              <div className="form-field">

                <label>
                  Pincode
                </label>

                <input
                  type="text"
                  name="pincode"
                  placeholder="Enter pincode"
                  value={customer.pincode}
                  onChange={handleCustomerChange}
                  required
                />

              </div>


              {/* Total */}

              <div className="order-form-total">

                <span>
                  Order Total
                </span>

                <strong>
                  ₹
                  {Number(
                    cart.total
                  ).toFixed(2)}
                </strong>

              </div>


              {/* Submit */}

              <button
                type="submit"
                className="send-whatsapp-btn"
              >

                <span>
                  Send Order on WhatsApp
                </span>

                <strong>
                  →
                </strong>

              </button>


              <p className="form-note">
                Your order will be saved and the
                order details will open in WhatsApp.
              </p>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}

export default Cart;