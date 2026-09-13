import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import FeaturedProducts from "../components/FeaturedProducts";
import OurStory from "../components/OurStory";

function Home() {
  return (
    <>
      <Navbar />

      <main>
        <Hero />

        <FeaturedProducts />
        <OurStory />
        
      </main>
    </>
  );
}

export default Home;