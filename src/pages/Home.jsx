import Hero from "../components/home/Hero";
import MarketOverview from "../components/home/MarketOverview";
import WhychooseUs from "../components/home/WhyChooseUs";
import Portfolio from "../components/home/Portfolio";
import CTA from "../components/home/CTA";


const Home = () => {
    return (
        <div>
            <Hero />
            <MarketOverview />
            <WhychooseUs />
            <Portfolio />
            <CTA />
        </div>
    );
};

export default Home;