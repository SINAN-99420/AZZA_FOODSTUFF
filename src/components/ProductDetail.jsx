import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import "./ProductDetail.css";

function ProductDetail() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  const API = "https://azza-backend.onrender.com";


  // =========================================
  // GET PRODUCT
  // =========================================

  useEffect(() => {

    axios
      .get(`${API}/api/categories/`, {
        withCredentials: true,
      })
      .then((res) => {

        let foundProduct = null;

        res.data.forEach((category) => {

          category.products.forEach((item) => {

            if (item.id === Number(id)) {
              foundProduct = item;
            }

          });

        });


        setProduct(foundProduct);


        if (foundProduct) {

          // First variant

          if (
            foundProduct.variants &&
            foundProduct.variants.length > 0
          ) {

            setSelectedVariant(
              foundProduct.variants[0]
            );

          }


          // Main image

          if (foundProduct.image) {

            setSelectedImage(
              foundProduct.image
            );

          } else if (
            foundProduct.images &&
            foundProduct.images.length > 0
          ) {

            setSelectedImage(
              foundProduct.images[0].image
            );

          }

        }


        setLoading(false);

      })
      .catch((error) => {

        console.log(
          "Product error:",
          error
        );

        setLoading(false);

      });

  }, [id]);


  // =========================================
  // LOADING
  // =========================================

  if (loading) {

    return (
      <div className="product-loading">
        Loading product...
      </div>
    );

  }


  // =========================================
  // PRODUCT NOT FOUND
  // =========================================

  if (!product) {

    return (
      <div className="product-not-found">

        <h2>
          Product not found
        </h2>

        <Link to="/shop">
          Back to Shop
        </Link>

      </div>
    );

  }


  // =========================================
  // IMAGE LIST
  // =========================================

  const imageList = [];


  if (product.image) {
    imageList.push(product.image);
  }


  if (
    product.images &&
    product.images.length > 0
  ) {

    product.images.forEach((item) => {

      if (!imageList.includes(item.image)) {
        imageList.push(item.image);
      }

    });

  }


  // =========================================
  // IMAGE URL
  // =========================================

  const getImageUrl = (image) => {

    if (!image) {
      return "";
    }

    if (image.startsWith("http")) {
      return image;
    }

    return `${API}${image}`;

  };


  // =========================================
  // QUANTITY
  // =========================================

  const increaseQuantity = () => {

    setQuantity(
      (prev) => prev + 1
    );

  };


  const decreaseQuantity = () => {

    if (quantity > 1) {

      setQuantity(
        (prev) => prev - 1
      );

    }

  };


  // =========================================
  // ADD TO CART
  // =========================================

  const handleAddToCart = () => {

    if (!selectedVariant) {

      alert(
        "Please select a product variant."
      );

      return;
    }


    axios
      .post(
        `${API}/api/cart/add/`,
        {
          variant_id: selectedVariant.id,
          quantity: quantity,
        },
        {
          withCredentials: true,
        }
      )
      .then(() => {

        alert(
          "Product added to cart"
        );


        // Update Navbar cart count

        window.dispatchEvent(
          new Event("cartUpdated")
        );

      })
      .catch((error) => {

        console.log(
          "Cart error:",
          error
        );

        alert(
          "Something went wrong"
        );

      });

  };


  // =========================================
  // UI
  // =========================================

  return (

    <div className="product-detail-page">

      <div className="product-detail-container">


        {/* =====================================
            LEFT SIDE
        ===================================== */}

        <div className="product-gallery">


          {/* Main Image */}

          <div className="product-main-image">

            {selectedImage ? (

              <img
                src={getImageUrl(selectedImage)}
                alt={product.name}
              />

            ) : (

              <div className="no-image">
                No Image
              </div>

            )}

          </div>


          {/* Multiple Images */}

          {imageList.length > 1 && (

            <div className="product-thumbnails">

              {imageList.map(
                (image, index) => (

                  <button
                    key={index}
                    className={`thumbnail ${
                      selectedImage === image
                        ? "active"
                        : ""
                    }`}
                    onClick={() =>
                      setSelectedImage(image)
                    }
                  >

                    <img
                      src={getImageUrl(image)}
                      alt={`${product.name} ${
                        index + 1
                      }`}
                    />

                  </button>

                )
              )}

            </div>

          )}

        </div>


        {/* =====================================
            RIGHT SIDE
        ===================================== */}

        <div className="product-info">


          {/* Brand */}

          <p className="product-small-title">
            AZZA FOODSTUFF
          </p>


          {/* Product Name */}

          <h1>
            {product.name}
          </h1>


          {/* Description */}

          <p className="product-description">
            {product.description}
          </p>


          {/* =================================
              VARIANTS
          ================================= */}

          {product.variants &&
            product.variants.length > 0 && (

              <div className="variant-section">

                <h3>
                  Choose Quantity
                </h3>

                <div className="variant-buttons">

                  {product.variants.map(
                    (variant) => (

                      <button
                        key={variant.id}
                        className={
                          selectedVariant?.id ===
                          variant.id
                            ? "variant-btn active"
                            : "variant-btn"
                        }
                        onClick={() =>
                          setSelectedVariant(
                            variant
                          )
                        }
                      >

                        {variant.quantity}{" "}
                        {variant.unit}

                      </button>

                    )
                  )}

                </div>

              </div>

            )}


          {/* =================================
              PRICE
          ================================= */}

          {selectedVariant && (

            <div className="product-price">
              ₹{selectedVariant.price}
            </div>

          )}


          {/* =================================
              QUANTITY
          ================================= */}

          {selectedVariant && (

            <div className="quantity-section">

              <h3>
                Quantity
              </h3>

              <div className="quantity-control">

                <button
                  onClick={
                    decreaseQuantity
                  }
                >
                  −
                </button>

                <span>
                  {quantity}
                </span>

                <button
                  onClick={
                    increaseQuantity
                  }
                >
                  +
                </button>

              </div>

            </div>

          )}


          {/* =================================
              BUTTONS
          ================================= */}

          <div className="product-actions">

            <button
              className="add-cart-btn"
              onClick={
                handleAddToCart
              }
              disabled={!selectedVariant}
            >
              Add to Cart
            </button>


            <button
              className="buy-now-btn"
              disabled
            >
              Buy Now
            </button>

          </div>


          {/* =================================
              NOTES
          ================================= */}

          <div className="product-note">

            <span>✓</span>

            Natural & carefully packed

          </div>


          <div className="product-note">

            <span>✓</span>

            Freshly prepared products

          </div>


        </div>

      </div>

    </div>

  );
}

export default ProductDetail;