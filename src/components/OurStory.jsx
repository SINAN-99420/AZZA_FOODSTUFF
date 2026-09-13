import "./OurStory.css";
import { useEffect } from "react";
function OurStory() {

  useEffect(() => {
    const video = document.querySelector(".story-video video");

    if (video) {
      video.playbackRate = 0.55;
    }
  }, []);
  return (
    <section className="our-story">
      <div className="our-story-container">

        {/* Video */}
        <div className="story-video">
          <video
            src="images/vedio.mp4"
            poster="images/azza-image.jpg"
            autoPlay
            muted
            loop
            playsInline
          />

          <div className="story-video-label">
            <span>AZZA</span>
            <small>FOODSTUFF</small>
          </div>
        </div>

        {/* Content */}
        <div className="story-content">

          <div className="story-label">
            <span></span>
            OUR STORY
          </div>

          <h2>
            From Nature,
            <br />
            <i>With Care.</i>
          </h2>

          <p>
            At Azza, we believe good food begins with good ingredients.
            We bring you carefully selected honey and natural products,
            prepared with quality and care.
          </p>

          <button className="story-button">
            Discover Azza
            <span>→</span>
          </button>

        </div>

      </div>
    </section>
  );
}

export default OurStory;