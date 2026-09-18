import { useEffect, useState } from "react";
import axios from "axios";
import "./FeaturedProducts.css";

function FeaturedProducts() {
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);

  useEffect(() => {
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


        {/* Products */}
        {activeCategory && (
          <div className="featured-products">

            {activeCategory.products.map((product) => {

              // First variant price
              const price =
                product.variants.length > 0
                  ? product.variants[0].price
                  : null;

              return (
                <div className="featured-product" key={product.id}>

                  <a href={`/product/${product.id}`}>
                    <div className="featured-product-image">

                      <img
                        src={`https://azza-backend.onrender.com${product.image}`}
                        alt={product.name}
                      />
 
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
