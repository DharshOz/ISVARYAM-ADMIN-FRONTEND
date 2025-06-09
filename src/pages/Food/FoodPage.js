import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Price from '../../components/Price/Price';
import StarRating from '../../components/StarRating/StarRating';
//import Tags from '../../components/Tags/Tags';
import { useCart } from '../../hooks/useCart';
import { getById } from '../../services/foodService';
import classes from './foodPage.module.css';
import NotFound from '../../components/NotFound/NotFound';
import { useWishlist } from '../../hooks/usewishlist';

export default function FoodPage() {
  const [food, setFood] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [hoveredImageIndex, setHoveredImageIndex] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const { id } = useParams();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const navigate = useNavigate();

  useEffect(() => {
    getById(id).then(data => {
      console.log('FoodPage id:', id);      // Add this
      console.log('FoodPage data:', data);  // Add this
      if (data) {
        setFood(data);
        setSelectedImage(0);
        setSelectedSize(data.quantities?.[0]?.size || '');
      } else {
        setFood(null);
      }
    });
  }, [id]);

  useEffect(() => {
    if (food?.quantities?.length > 0) {
      setSelectedSize(food.quantities[0].size);
    }
  }, [food]);

  const handleAddToCart = () => {
    if (food && selectedSize) {
      //const quantityObj = food.quantities.find(q => q.size === selectedSize);
      addToCart(food, selectedSize);
      navigate('/cart');
    }
  };

  const handleFavoriteToggle = () => {
    toggleWishlist(food);
  };

  if (!food) return <NotFound message="Food Not Found!" linkText="Back To Homepage" />;

  const isFavorite = isInWishlist(food.id);

  return (
    <div className={classes.container}>
      <div className={classes.imageGallery}>
        <div className={classes.imageWrapper}>
          <img 
            className={classes.image}
            src={
              food.images?.length > 0
                ? food.images[hoveredImageIndex !== null ? hoveredImageIndex : selectedImage]
                : food.imageUrl
            }
            alt={food.name}
          />
          <button 
            className={`${classes.favoriteButton} ${isFavorite ? classes.active : ''}`}
            onClick={handleFavoriteToggle}
          >
            {isFavorite ? '❤' : '♡'}
          </button>
        </div>

        {food.images?.length > 1 && (
          <div className={classes.thumbnailContainer}>
            {food.images.map((img, index) => (
              <div 
                key={index}
                className={`${classes.thumbnail} ${index === selectedImage ? classes.active : ''}`}
                onClick={() => setSelectedImage(index)}
                onMouseEnter={() => setHoveredImageIndex(index)}
                onMouseLeave={() => setHoveredImageIndex(null)}
              >
                <img 
                  src={img} 
                  alt={`Thumbnail ${index}`}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className={classes.details}>
        <div className={classes.detailsHeader}>
          <h1 className={classes.name}>{food.name}</h1>

          <div className={classes.price}>
            <Price price={food.quantities.find(q => q.size === selectedSize)?.price} />
          </div>

          <div className={classes.rating}>
            <div className={classes.stars}>
              <StarRating stars={food.stars} size={25} />
            </div>
            <span className={classes.reviewCount}>({food.reviews} reviews)</span>
          </div>
        </div>

        <p className={classes.description}>{food.description}</p>

        <div className={classes.meta}>
          <div className={classes.metaItem}>
            <span className={classes.metaIcon}>⏱</span>
            Cook time: <strong>{food.cookTime} minutes</strong>
          </div>

          {food.calories && (
            <div className={classes.metaItem}>
              <span className={classes.metaIcon}>🔥</span>
              Calories: <strong>{food.calories}</strong>
            </div>
          )}

          {food.dietary && (
            <div className={classes.metaItem}>
              <span className={classes.metaIcon}>🥗</span>
              Dietary: <strong>{food.dietary.join(', ')}</strong>
            </div>
          )}
        </div>

        {food.origins?.length > 0 && (
          <div className={classes.origins}>
            <h4>Origin:</h4>
            <div className={classes.originTags}>
              {food.origins.map((origin) => (
                <span key={origin} className={classes.originTag}>
                  {origin}
                </span>
              ))}
            </div>
          </div>
        )}

        {food.tags?.length > 0 && (
          <div className={classes.tags}>
            <h4>Tags:</h4>
            <div>
              {food.tags.map((tag) => (
                <span key={tag} className={classes.tag}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {food.quantities && food.quantities.length > 0 && (
          <div>
            <label>Select Size: </label>
            <select
              value={selectedSize}
              onChange={e => setSelectedSize(e.target.value)}
            >
              {food.quantities.map(q => (
                <option key={q.size} value={q.size}>
                  {q.size} - ₹{q.price}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className={classes.actions}>
          <button className={classes.addToCartBtn} onClick={handleAddToCart}>
            <span>Add to Cart</span>
            <span>🛒</span>
          </button>
        </div>
      </div>
    </div>
  );
}
