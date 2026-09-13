import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./Cart.css";

const API = "http://localhost:8000";

function Cart() {
  const [cart, setCart] = useState({
    items: [],
    total: 0,
  });

  const [loading, setLoading] = useState(true);

  // =========================================
  // GET CART
  // =========================================

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


  // =========================================
  // UPDATE QUANTITY
  // =========================================

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

        // Update Navbar
        window.dispatchEvent(
          new Event("cartUpdated")
        );
      })
      .catch((error) => {
        console.log("Update error:", error);
      });
  };


  // =========================================
  // REMOVE ITEM
  // =========================================

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

        // Update Navbar
        window.dispatchEvent(
          new Event("cartUpdated")
        );
      })
      .catch((error) => {
        console.log("Remove error:", error);
      });
  };


  // =========================================
  // LOADING
  // =========================================

  if (loading) {
    return (
      <div className="cart-loading">
        Loading cart...
      </div>
    );
  }


  // =========================================
  // UI
  // =========================================

  return (
    <div className="cart-page">

      <div className="cart-container">

        {/* Heading */}

        <div className="cart-heading">

          <p>AZZA FOODSTUFF</p>

          <h1>
            Your Cart
          </h1>

        </div>


        {/* =================================
            EMPTY CART
        ================================= */}

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

          <div className="cart-content">


            {/* =================================
                CART ITEMS
            ================================= */}

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
                      ₹{Number(item.price).toFixed(2)}
                    </span>

                  </div>


                  {/* Actions */}

                  <div className="cart-item-actions">


                    {/* Quantity */}

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


                    {/* Subtotal */}

                    <p className="cart-subtotal">
                      ₹{Number(item.subtotal).toFixed(2)}
                    </p>


                    {/* Remove */}

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


            {/* =================================
                ORDER SUMMARY
            ================================= */}

            <div className="cart-summary">

              <h2>
                Order Summary
              </h2>


              <div className="summary-row">

                <span>
                  Subtotal
                </span>

                <span>
                  ₹{Number(cart.total).toFixed(2)}
                </span>

              </div>


              <div className="summary-row">

                <span>
                  Delivery
                </span>

                <span>
                  Calculated at checkout
                </span>

              </div>


              <div className="summary-line"></div>


              <div className="summary-total">

                <span>
                  Total
                </span>

                <strong>
                  ₹{Number(cart.total).toFixed(2)}
                </strong>

              </div>


              <button className="checkout-btn">
                Proceed to Checkout
              </button>


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

    </div>
  );
}

export default Cart;