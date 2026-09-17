import React from "react";
import "./WhyAzza.css";

function WhyAzza() {
  return (
    <section className="why-azza">
      <div className="why-azza-container">

        <div className="why-azza-heading">
          <p>WHY AZZA</p>
          <h2>Pure by Nature.<br />Made with Care.</h2>
          <span>
            We believe good honey should be simple — naturally sourced,
            carefully handled, and packed with care.
          </span>
        </div>

        <div className="why-azza-points">

          <div className="why-point">
            <div className="why-number">01</div>
            <div>
              <h3>Naturally Pure</h3>
              <p>
                Pure honey with no unnecessary additions.
              </p>
            </div>
          </div>

          <div className="why-point">
            <div className="why-number">02</div>
            <div>
              <h3>Carefully Selected</h3>
              <p>
                We choose our honey and ingredients with attention to quality.
              </p>
            </div>
          </div>

          <div className="why-point">
            <div className="why-number">03</div>
            <div>
              <h3>Freshly Packed</h3>
              <p>
                Every product is packed carefully to preserve its goodness.
              </p>
            </div>
          </div>

          <div className="why-point">
            <div className="why-number">04</div>
            <div>
              <h3>Made with Care</h3>
              <p>
                From our hands to your home, quality comes first.
              </p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

export default WhyAzza;