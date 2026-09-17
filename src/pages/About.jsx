import React from "react";
import { Link } from "react-router-dom";
import "./About.css";

function About() {
  return (
    <main className="about-page">

      {/* ================= HERO ================= */}

      <section className="about-hero">

        <div className="about-hero-decor decor-one"></div>
        <div className="about-hero-decor decor-two"></div>

        <div className="about-hero-inner">

          <div className="about-hero-top">
            <span>01</span>
            <p>ABOUT AZZA FOODSTUFF</p>
          </div>

          <h1>
            Nature,
            <br />
            <em>with intention.</em>
          </h1>

          <div className="about-hero-bottom">
            <div className="about-hero-line"></div>

            <p>
              A collection of honey and thoughtfully crafted
              honey nut products, brought together with
              simplicity and care.
            </p>
          </div>

        </div>

      </section>


      {/* ================= INTRO ================= */}

      <section className="about-introduction">

        <div className="about-wrap">

          <div className="about-section-number">
            <span>02</span>
            <p>THE IDEA</p>
          </div>

          <div className="about-intro-content">

            <h2>
              We believe
              <br />
              <span>good food</span>
              <br />
              starts simply.
            </h2>

            <div className="about-intro-copy">

              <p className="intro-lead">
                Azza Foodstuff was built around a simple
                idea — to bring natural products into
                everyday life without making them
                complicated.
              </p>

              <p>
                From honey to our honey nut creations,
                we focus on thoughtful selection,
                careful preparation and a product
                experience that feels honest from
                beginning to end.
              </p>

              <Link to="/shop" className="about-text-link">
                Explore our products
                <span>↗</span>
              </Link>

            </div>

          </div>

        </div>

      </section>


      {/* ================= STATEMENT ================= */}

      <section className="about-statement">

        <div className="about-statement-inner">

          <span className="statement-mark">“</span>

          <h2>
            Nothing unnecessary.
            <br />
            Just products made
            <br />
            <em>with care.</em>
          </h2>

          <div className="statement-bottom">
            <span>AZZA FOODSTUFF</span>
            <div></div>
          </div>

        </div>

      </section>


      {/* ================= APPROACH ================= */}

      <section className="about-approach">

        <div className="about-wrap">

          <div className="about-approach-head">

            <div className="about-section-number">
              <span>03</span>
              <p>OUR APPROACH</p>
            </div>

            <div>
              <p className="approach-small">
                HOW WE THINK
              </p>

              <h2>
                Simple choices.
                <br />
                Thoughtful products.
              </h2>
            </div>

          </div>


          <div className="approach-list">

            <div className="approach-row">

              <div className="approach-number">
                01
              </div>

              <div className="approach-title">
                <h3>Selection</h3>
              </div>

              <div className="approach-description">
                <p>
                  We pay attention to the ingredients
                  and products we choose to bring
                  into the Azza collection.
                </p>
              </div>

              <div className="approach-arrow">
                ↗
              </div>

            </div>


            <div className="approach-row">

              <div className="approach-number">
                02
              </div>

              <div className="approach-title">
                <h3>Simplicity</h3>
              </div>

              <div className="approach-description">
                <p>
                  We prefer a straightforward approach,
                  keeping the focus on the product
                  itself.
                </p>
              </div>

              <div className="approach-arrow">
                ↗
              </div>

            </div>


            <div className="approach-row">

              <div className="approach-number">
                03
              </div>

              <div className="approach-title">
                <h3>Care</h3>
              </div>

              <div className="approach-description">
                <p>
                  From preparation to packing, every
                  step deserves attention before
                  reaching your home.
                </p>
              </div>

              <div className="approach-arrow">
                ↗
              </div>

            </div>

          </div>

        </div>

      </section>


      {/* ================= VALUES ================= */}

      <section className="about-values">

        <div className="about-wrap">

          <div className="values-heading">

            <div className="about-section-number">
              <span>04</span>
              <p>WHAT MATTERS</p>
            </div>

            <h2>
              The things
              <br />
              we stand for.
            </h2>

          </div>


          <div className="values-grid">

            <article className="value-card">

              <div className="value-top">
                <span>01</span>
                <span>✦</span>
              </div>

              <h3>Purity</h3>

              <p>
                Staying close to the natural character
                of what we offer.
              </p>

            </article>


            <article className="value-card">

              <div className="value-top">
                <span>02</span>
                <span>✦</span>
              </div>

              <h3>Quality</h3>

              <p>
                Giving attention to the details that
                make a product worth choosing.
              </p>

            </article>


            <article className="value-card">

              <div className="value-top">
                <span>03</span>
                <span>✦</span>
              </div>

              <h3>Trust</h3>

              <p>
                Creating a simple and dependable
                experience for every customer.
              </p>

            </article>

          </div>

        </div>

      </section>


      {/* ================= FINAL CTA ================= */}

      <section className="about-final">

        <div className="about-final-circle"></div>

        <div className="about-final-content">

          <p>DISCOVER AZZA</p>

          <h2>
            Something natural,
            <br />
            waiting for you.
          </h2>

          <Link to="/shop">
            <span>Shop the collection</span>
            <strong>→</strong>
          </Link>

        </div>

      </section>

    </main>
  );
}

export default About;