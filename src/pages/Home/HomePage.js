import React, { useEffect, useReducer } from 'react';
import { useParams } from 'react-router-dom';
import Search from '../../components/Search/Search';
import Tags from '../../components/Tags/Tags';
import Thumbnails from '../../components/Thumbnails/Thumbnails';
import {
  getAll,
  getAllByTag,
  getAllTags,
  search,
} from '../../services/foodService';
import NotFound from '../../components/NotFound/NotFound';
import './HomePage.css';
import bannerImage from '../../components/assets/images/banner.png';
import aboutImage from '../../components/assets/images/about.png';


const initialState = { foods: [], tags: [] };

const reducer = (state, action) => {
  switch (action.type) {
    case 'FOODS_LOADED':
      return { ...state, foods: action.payload };
    case 'TAGS_LOADED':
      return { ...state, tags: action.payload };
    default:
      return state;
  }
};

export default function HomePage() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { foods, tags } = state;
  const { searchTerm, tag } = useParams();

  useEffect(() => {
    getAllTags().then(tags =>
      dispatch({ type: 'TAGS_LOADED', payload: tags })
    );

    const loadFoods = tag
      ? getAllByTag(tag)
      : searchTerm
      ? search(searchTerm)
      : getAll();

    loadFoods.then(foods =>
      dispatch({ type: 'FOODS_LOADED', payload: foods })
    );
  }, [searchTerm, tag]);

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section
        className="hero-section"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${bannerImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="hero-content animated fadeInDown">
          <h1 className="hero-title">WELCOME TO ISVARYAM</h1>
          <p className="hero-subtitle">HEALTHY HEART BETTER LIFE</p>
          <div className="search-container">
            <Search />
          </div>
        </div>
      </section>

      {/* Product Section */}
      <section className="products-section container fadeInUp">
        <h2 className="section-title"> <br></br>Fresh From Our Farms</h2>
        <div className="filter-container">
          <Tags tags={tags} />
        </div>
        {foods.length === 0 && <NotFound linkText="Reset Search" />}
        <Thumbnails foods={foods} />
      </section>

      {/* Why Choose Us */}
      <section className="why-choose-section fadeInUp">
        <div className="container">
          <h2 className="section-title"><br></br>Why Choose Us</h2>
          <div className="benefits-grid">
            <div className="benefit-card">
              <div className="benefit-icon">🌱</div>
              <h3>100% Organic</h3>
              <p>Chemical-free farming practices for healthier living</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">🚚</div>
              <h3>Farm to Table</h3>
              <p>Directly from our farms to your home within 24 hours</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">🌍</div>
              <h3>Sustainable</h3>
              <p>Eco-friendly packaging & sustainable farming practices</p>
            </div>
          </div>
        </div>
      </section>
      {/* About Us Section */}
<section className="about-us-section fadeInUp">
  <div className="container">
    <h2 className="section-title"><br></br>About Us</h2>
    <div className="about-us-content">
      <img
  src={aboutImage}
  alt="Our Farm"
  className="about-image"
/>

      <div className="about-text">
        <p>
          At Isvaryam, we are committed to delivering nature’s best straight
          from our farms to your home. Our journey began with a mission to
          promote healthier lifestyles through organic, sustainable, and
          chemical-free food. We believe in transparency, purity, and tradition—every product is a
          reflection of our values and deep-rooted farming expertise. Experience
          the true taste of nature with Isvaryam.
        </p>
      </div>
    </div>
  </div>
</section>

{/* Testimonials Section */}
<section className="testimonials-section fadeInUp">
  <div className="container">
    <h2 className="section-title"><br></br>What Our Customers Say</h2>
    <div className="testimonials-grid">
      <div className="testimonial-card">
        <p>"The cold-pressed coconut oil is the best I’ve ever used! Natural, pure, and fragrant."</p>
        <h4>- Priya R.</h4>
      </div>
      <div className="testimonial-card">
        <p>"Fresh and chemical-free vegetables delivered fast. My family loves them!"</p>
        <h4>- Suresh K.</h4>
      </div>
      <div className="testimonial-card">
        <p>"Great quality jaggery and spices. I appreciate their eco-friendly practices."</p>
        <h4>- Anjali M.</h4>
      </div>
    </div>
  </div>
</section>

    </div>
  );
}
