import { useEffect, useState } from "react";
import axios from "axios";
import "./FeaturedProducts.css";

function FeaturedProducts() {
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    axios
      .get("https://azza-backend.onrender.com/api/categories/")
      .then((res) => {
        setCategories(res.data);

        if (res.data.length > 0) {
          setActiveCategory(res.data[0]);
        }
      })
      .catch((error) => {
        console.log("Category error:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <section className="featured-section">
      <div className="featured-container">

        {/* Heading */}
        <div className="featured-heading">
          <span>OUR COLLECTION</span>

          <h2>
            Something good,
            <br />
            for every moment.
          </h2>
        </div>


        {/* Categories */}
        {loading ? (
          <div className="featured-categories skeleton-categories">
            <div className="skeleton-category"></div>
            <div className="skeleton-category short"></div>
          </div>
        ) : (
          <div className="featured-categories">
            {categories.map((category) => (
              <button
                key={category.id}
                className={
                  activeCategory?.id === category.id
                    ? "category active"
                    : "category"
                }
                onClick={() => setActiveCategory(category)}
              >
                {category.name}
              </button>
            ))}
          </div>
        )}


        {/* Products */}
        {loading ? (
          <div className="featured-products">

            {[1, 2].map((item) => (
              <div
                className="featured-product skeleton-product"
                key={item}
              >

                <div className="featured-product-image skeleton-image">
                  <div className="skeleton-shimmer"></div>
                </div>

                <div className="featured-product-info skeleton-info">

                  <div>
                    <div className="skeleton-line skeleton-title"></div>
                    <div className="skeleton-line skeleton-price"></div>
                  </div>

                  <div className="skeleton-line skeleton-link"></div>

                </div>

              </div>
            ))}

          </div>
        ) : (
          activeCategory &&
          (
            activeCategory.products &&
            activeCategory.products.length > 0 ? (
              <div className="featured-products">

                {activeCategory.products.map((product) => {
                  const price =
                    product.variants &&
                    product.variants.length > 0
                      ? product.variants[0].price
                      : null;

                  return (
                    <div
                      className="featured-product"
                      key={product.id}
                    >

                      <a href={`/product/${product.id}`}>
                        <div className="featured-product-image">

                          {product.image ? (
                            <img
                              src={product.image}
                              alt={product.name}
                            />
                          ) : (
                            <div className="featured-image-placeholder">
                              No image
                            </div>
                          )}

                        </div>
                      </a>


                      <div className="featured-product-info">

                        <div>
                          <h3>{product.name}</h3>

                          {price && (
                            <p>From ₹{price}</p>
                          )}
                        </div>

                        <a href={`/product/${product.id}`}>
                          View product <span>→</span>
                        </a>

                      </div>

                    </div>
                  );
                })}

              </div>
            ) : (
              <div className="no-products">
                <p>No products found.</p>
              </div>
            )
          )
        )}


        {/* Bottom */}
        <div className="featured-bottom">

          <a href="/shop">
            Explore all products <span>→</span>
          </a>

        </div>

      </div>
    </section>
  );
}

export default FeaturedProducts;