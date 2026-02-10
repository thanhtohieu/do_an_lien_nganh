import React from "react";
import './../css/App.css';
import './../css/lam.css';
import './../css/binh.css';
import './../css/phi.css';
import './../css/quanmain.css';
import './../css/quanfooter.css';

import Myheader from './Myheader';
import Footer from './Footer';

import HomeSlider from '../components/home/HomeSlider';
import HomeBanner from '../components/home/HomeBanner';
import SpecialOffers from '../components/home/SpecialOffers';
import CategoryGrid from '../components/home/CategoryGrid';
import FlashSale from '../components/home/FlashSale';
import ProductSection from '../components/home/ProductSection';
import MarketingSection from '../components/home/MarketingSection';
import SuggestionSection from '../components/home/SuggestionSection';
import FullPageSection from '../components/home/FullPageSection';
import BottomSection from '../components/home/BottomSection';

const Home = () => {
  return (
    <div>
      <Myheader />
      <main>
        <section className="main-section">
          <div className="background-blur" />
          <div className="container">
            <HomeSlider />
            <HomeBanner />
          </div>
        </section>
        <SpecialOffers />
        <CategoryGrid />
      </main>
      <div className="binhtongcabai">
        <div className="binhtong">
          <FlashSale />
          <ProductSection />
        </div>
        <MarketingSection />
        <SuggestionSection />
      </div>
      <FullPageSection />
      <BottomSection />
      <Footer />
    </div>
  );
}

export default Home;
