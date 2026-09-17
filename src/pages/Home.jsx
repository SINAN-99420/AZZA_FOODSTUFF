import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import FeaturedProducts from "../components/FeaturedProducts";
import OurStory from "../components/OurStory";
import WhyAzza from "../components/WhyAzza";
import ContactSection from "../components/ContactSection";

function Home() {
  return (
    <>
      <Navbar />

      <main>
        <Hero />

        <FeaturedProducts />
        <WhyAzza/>
        <OurStory />
        <ContactSection/>
        
      </main>
    </>
  );
}

export default Home;