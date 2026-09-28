import { useEffect, useRef, useState } from "react";
import "./Hero.css";
import { Link } from "react-router-dom";

function Hero() {
  const [activeSlide, setActiveSlide] = useState(0);
  const touchStartX = useRef(0);

  const slides = [
    {
      number: "01",
      label: "PURE HONEY",
      title: "Pure from",
      highlight: "nature.",
      description:
        "Naturally sourced honey, carefully packed to bring pure goodness to your everyday life.",
      button: "Shop Honey",
      image: "/images/hero.png",
      sideTitle: "Pure Honey",
      sideText: "100% Natural",
    },
    {
      number: "02",
      label: "HONEY & NUTS",
      title: "Nature's",
      highlight: "perfect crunch.",
      description:
        "Premium nuts blended with natural honey for a delicious and wholesome experience.",
      button: "Shop Honey Nuts",
      image: "/images/hero2.png",
      sideTitle: "Honey & Nuts",
      sideText: "Premium Selection",
    },
  ];

  const slide = slides[activeSlide];

  const nextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setActiveSlide((prev) =>
      prev === 0 ? slides.length - 1 : prev - 1
    );
  };

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 6000);

    return () => clearInterval(timer);
  }, []);

  /* =========================
     MOBILE SWIPE
  ========================= */

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    const touchEndX = e.changedTouches[0].clientX;

    const difference =
      touchStartX.current - touchEndX;

    if (difference > 50) {
      nextSlide();
    }

    if (difference < -50) {
      prevSlide();
    }
  };

  return (
    <section
      className="azza-hero"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >

      {/* =========================
          BACKGROUND SHAPES
      ========================= */}

      <div className="corner-circle corner-top"></div>

      <div className="corner-circle corner-bottom"></div>

      <div className="small-bg-circle"></div>


      {/* =========================
          MAIN CONTAINER
      ========================= */}

      <div className="azza-hero-container">

        {/* =========================
            PRODUCT
        ========================= */}

        <div
          className={`azza-product ${
            activeSlide === 1
              ? "nuts-product"
              : ""
          }`}
          key={`product-${activeSlide}`}
        >

          <div className="product-bg-circle"></div>

          <div className="product-inner-circle"></div>

          <div className="product-accent-line"></div>

          <div className="product-shadow"></div>

          <img
            src={slide.image}
            alt={
              activeSlide === 0
                ? "Azza Pure Honey"
                : "Azza Honey Mixed Nuts"
            }
          />

          {/* PRODUCT BADGE */}

          <div className="product-badge">

            <span className="badge-line"></span>

            <div>
              <small>
                {slide.sideTitle}
              </small>

              <strong>
                {slide.sideText}
              </strong>
            </div>

          </div>

        </div>


        {/* =========================
            LEFT CONTENT
        ========================= */}

        <div
          className="azza-hero-content"
          key={`content-${activeSlide}`}
        >

          <div className="hero-small-label">

            <span>
              {slide.number}
            </span>

            <i></i>

            {slide.label}

          </div>


          <h1>
            {slide.title}
            <br />
            <em>
              {slide.highlight}
            </em>
          </h1>


          <p>
            {slide.description}
          </p>


          {/* BUTTONS */}

          <div className="hero-actions">

            <Link to="/shop">
            <button className="azza-shop-btn">

              <span>
                {slide.button}
              </span>

              <b>
                →
              </b>

            </button>
            </Link>


            <Link to="/shop"><button className="discover-btn">

              Explore Products

              <span>
                →
              </span>

            </button></Link>

          </div>


          {/* FEATURES */}

          <div className="hero-mini-features">

            <div className="mini-feature">

              <strong>
                100%
              </strong>

              <span>
                Natural
              </span>

            </div>


            <div className="mini-feature">

              <strong>
                PURE
              </strong>

              <span>
                Ingredients
              </span>

            </div>


            <div className="mini-feature">

              <strong>
                FRESH
              </strong>

              <span>
                Every Pack
              </span>

            </div>

          </div>

        </div>


        {/* =========================
            RIGHT SIDE
        ========================= */}

        <div className="hero-right">

          <div className="vertical-label">
            NATURAL FOODSTUFF
          </div>


          <div className="hero-info-card">

            <div className="info-card-top">

              <span>
                AZZA
              </span>

              <span>
                0{activeSlide + 1}
              </span>

            </div>


            <div className="info-mark"></div>


            <h3>
              Made with
              <br />
              <em>
                care.
              </em>
            </h3>


            <p>
              Simple products,
              <br />
              naturally selected.
            </p>


            <div className="card-line"></div>

          </div>


          {/* NAVIGATION */}

          <div className="hero-navigation">

            <button
              onClick={prevSlide}
              aria-label="Previous slide"
            >
              ←
            </button>


            <div className="navigation-progress">

              {slides.map((_, index) => (

                <span
                  key={index}
                  className={
                    activeSlide === index
                      ? "active"
                      : ""
                  }
                ></span>

              ))}

            </div>


            <button
              onClick={nextSlide}
              aria-label="Next slide"
            >
              →
            </button>

          </div>

        </div>

      </div>


      {/* =========================
          DESKTOP BOTTOM
      ========================= */}

      <div className="hero-bottom">

        <div>

          <span>
            01
          </span>

          <p>
            FROM NATURE
          </p>

        </div>


        <div className="bottom-line"></div>


        <div>

          <span>
            02
          </span>

          <p>
            TO YOUR HOME
          </p>

        </div>

      </div>

    </section>
  );
}

export default Hero;