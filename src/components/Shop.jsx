import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Shop.css";

const API = "https://azza-backend.onrender.com";

function Shop() {
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    axios
      .get(`${API}/api/categories/`)
      .then((res) => {
        setCategories(res.data);
      })
      .catch((error) => {
        console.log("Shop error:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const allProducts = categories.flatMap((category) =>
    (category.products || []).map((product) => ({
      ...product,
      categoryName: category.name,
    }))
  );

  const products =
    activeCategory === "All"
      ? allProducts
      : allProducts.filter(
          (product) => product.categoryName === activeCategory
        );

  const getImageUrl = (image) => {
    if (!image) return null;

    if (image.startsWith("https")) {
      return image;
    }

    return `${API}${image}`;
  };

  const getStartingPrice = (product) => {
    if (!product.variants || product.variants.length === 0) {
      return null;
    }

    const prices = product.variants.map((variant) =>
      Number(variant.price)
    );

    return Math.min(...prices);
  };

  return (
    <main className="shop-page">

      {/* =========================
          HEADER
      ========================= */}

      <section className="shop-header">
      </section>


      {/* =========================
          PRODUCTS
      ========================= */}

      <section className="shop-section">

        <div className="shop-container">

          {loading ? (

            /* =========================
               LOADING SKELETON
            ========================= */

            <>
              <div className="shop-filter shop-filter-skeleton">

                <div className="filter-skeleton-item skeleton-pulse"></div>
                <div className="filter-skeleton-item skeleton-pulse"></div>
                <div className="filter-skeleton-item short skeleton-pulse"></div>

              </div>

              <div className="shop-result-info">
                <div className="result-skeleton skeleton-pulse"></div>
              </div>

              <div className="shop-grid">

                {[1, 2, 3].map((item) => (
                  <article
                    className="shop-card shop-skeleton-card"
                    key={item}
                  >

                    {/* Image skeleton */}

                    <div className="shop-image shop-skeleton-image">
                      <div className="skeleton-shimmer"></div>
                    </div>


                    {/* Details skeleton */}

                    <div className="shop-details">

                      <div className="skeleton-category skeleton-pulse"></div>

                      <div className="skeleton-title skeleton-pulse"></div>

                      <div className="skeleton-description skeleton-pulse"></div>
                      <div className="skeleton-description short skeleton-pulse"></div>


                      <div className="product-footer">

                        <div className="product-price">

                          <div className="skeleton-price skeleton-pulse"></div>

                          <div className="skeleton-price-large skeleton-pulse"></div>

                        </div>

                        <div className="skeleton-link skeleton-pulse"></div>

                      </div>

                    </div>

                  </article>
                ))}

              </div>
            </>

          ) : (

            /* =========================
               REAL SHOP CONTENT
            ========================= */

            <>

              {/* Category navigation */}

              <div className="shop-filter">

                <button
                  className={
                    activeCategory === "All"
                      ? "filter-item active"
                      : "filter-item"
                  }
                  onClick={() => setActiveCategory("All")}
                >
                  All
                </button>

                {categories.map((category) => (
                  <button
                    key={category.id}
                    className={
                      activeCategory === category.name
                        ? "filter-item active"
                        : "filter-item"
                    }
                    onClick={() =>
                      setActiveCategory(category.name)
                    }
                  >
                    {category.name}
                  </button>
                ))}

              </div>


              {/* Product count */}

              <div className="shop-result-info">
                <span>
                  {products.length}{" "}
                  {products.length === 1
                    ? "product"
                    : "products"}
                </span>
              </div>


              {/* Product grid */}

              {products.length === 0 ? (

                <div className="shop-empty">

                  <h2>No products available</h2>

                  <p>
                    Our collection will appear here once
                    products are added.
                  </p>

                </div>

              ) : (

                <div className="shop-grid">

                  {products.map((product) => {

                    const price = getStartingPrice(product);

                    return (
                      <article
                        className="shop-card"
                        key={product.id}
                      >

                        {/* Image */}

                        <Link
                          to={`/product/${product.id}`}
                          className="shop-image"
                        >

                          {product.image ? (
                            <img
                              src={getImageUrl(product.image)}
                              alt={product.name}
                            />
                          ) : (
                            <div className="shop-no-image">
                              No image
                            </div>
                          )}

                          <span className="image-link">
                            View
                          </span>

                        </Link>


                        {/* Details */}

                        <div className="shop-details">

                          <span className="product-category">
                            {product.categoryName}
                          </span>

                          <h2>
                            {product.name}
                          </h2>

                          {product.description && (
                            <p className="product-description">
                              {product.description}
                            </p>
                          )}


                          <div className="product-footer">

                            <div className="product-price">

                              {price !== null ? (
                                <>
                                  <span>From</span>

                                  <strong>
                                    ₹{price.toFixed(0)}
                                  </strong>
                                </>
                              ) : (
                                <span>
                                  View product
                                </span>
                              )}

                            </div>


                            <Link
                              to={`/product/${product.id}`}
                              className="product-link"
                            >
                              View Details
                              <span>→</span>
                            </Link>

                          </div>

                        </div>

                      </article>
                    );
                  })}

                </div>

              )}

            </>

          )}

        </div>

      </section>

    </main>
  );
}

export default Shop;