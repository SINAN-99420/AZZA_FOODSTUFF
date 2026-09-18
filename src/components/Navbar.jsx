import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../styles/Navbar.css";

function Navbar() {

  const [menuOpen, setMenuOpen] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const [cartCount, setCartCount] = useState(0);

  const API = "https://azza-backend.onrender.com/";


  // =========================================
  // GET CART COUNT
  // =========================================

  const getCartCount = () => {

    axios
      .get(`${API}/api/cart/`, {
        withCredentials: true,
      })
      .then((res) => {

        const items =
          res.data.items || [];


        const totalQuantity =
          items.reduce(
            (total, item) =>
              total +
              Number(item.quantity),
            0
          );


        setCartCount(
          totalQuantity
        );

      })
      .catch((error) => {

        console.log(
          "Cart count error:",
          error
        );

      });

  };


  // =========================================
  // CART UPDATE LISTENER
  // =========================================

  useEffect(() => {

    getCartCount();


    const handleCartUpdate = () => {
      getCartCount();
    };


    window.addEventListener(
      "cartUpdated",
      handleCartUpdate
    );


    return () => {

      window.removeEventListener(
        "cartUpdated",
        handleCartUpdate
      );

    };

  }, []);


  // =========================================
  // NAVBAR SCROLL
  // =========================================

  useEffect(() => {

    let lastScrollY =
      window.scrollY;


    const handleScroll = () => {

      const currentScrollY =
        window.scrollY;


      if (currentScrollY < 30) {

        setShowNavbar(true);

      } else if (
        currentScrollY >
        lastScrollY + 5
      ) {

        setShowNavbar(false);
        setMenuOpen(false);

      } else if (
        currentScrollY <
        lastScrollY - 5
      ) {

        setShowNavbar(true);

      }


      lastScrollY =
        currentScrollY;

    };


    window.addEventListener(
      "scroll",
      handleScroll,
      {
        passive: true,
      }
    );


    return () => {

      window.removeEventListener(
        "scroll",
        handleScroll
      );

    };

  }, []);


  // =========================================
  // CLOSE MENU
  // =========================================

  const closeMenu = () => {
    setMenuOpen(false);
  };


  // =========================================
  // UI
  // =========================================

  return (

    <nav
      className={`navbar ${
        showNavbar
          ? "navbar-show"
          : "navbar-hide"
      }`}
    >


      {/* =====================================
          LOGO
      ===================================== */}

      <Link
        to="/"
        className="navbar-logo"
        onClick={closeMenu}
      >

        <img
          src="/images/azza-logo.png"
          alt="Azza Foodstuff"
        />

      </Link>


      {/* =====================================
          LINKS
      ===================================== */}

      <div
        className={`nav-links ${
          menuOpen ? "open" : ""
        }`}
      >

        <Link
          to="/"
          onClick={closeMenu}
        >
          Home
        </Link>


        <Link
          to="/shop"
          onClick={closeMenu}
        >
          Shop
        </Link>


        <Link
          to="/about"
          onClick={closeMenu}
        >
          About Us
        </Link>


      
          
        <a onClick={closeMenu} href="/#contact">Contact</a>

      </div>


      {/* =====================================
          ACTIONS
      ===================================== */}

      <div className="nav-actions">


      


      <Link to="/my-orders">
  My Orders
</Link>

        {/* Cart */}

        <Link
          to="/cart"
          className="cart-btn"
          aria-label="Cart"
          onClick={closeMenu}
        >

          <span>
            🛒
          </span>


          {cartCount > 0 && (

            <i>
              {cartCount}
            </i>

          )}

        </Link>


      </div>


      {/* =====================================
          MOBILE MENU
      ===================================== */}

      <button
        className={`menu-btn ${
          menuOpen ? "active" : ""
        }`}
        onClick={() =>
          setMenuOpen(!menuOpen)
        }
        aria-label="Toggle menu"
      >

        <span></span>
        <span></span>
        <span></span>

      </button>


    </nav>

  );
}

export default Navbar;