import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Price from '../Price/Price';
import StarRating from '../StarRating/StarRating';
import { useCart } from '../../hooks/useCart'; // make sure this path is correct
import classes from './thumbnails.module.css';

export default function Thumbnails({ foods }) {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [selectedSizes, setSelectedSizes] = React.useState({});

  const handleSizeChange = (foodId, size) => {
    setSelectedSizes(prev => ({ ...prev, [foodId]: size }));
  };

  const handleAddToCart = (food) => {
    const size = selectedSizes[food._id] || food.quantities[0].size;
    addToCart(food, size);
    navigate('/cart');
  };

  return (
    <div className={classes.productsGrid}>
      {foods
        .filter(food => Array.isArray(food.quantities) && food.quantities.length > 0)
        .map(food => (
        <div key={food._id} className={classes.productCard}>
          <div className={classes.imageContainer}>
            <Link to={`/food/${food._id}`}>
              <img
                className={classes.productImage}
                src={food.images?.[0]}
                alt={food.name}
              />
            </Link>
            <div className={classes.organicBadge}>
              <span>Organic</span>
            </div>
          </div>

          <div className={classes.productInfo}>
            <div className={classes.name}>{food.name}</div>
            <div className={classes.productFooter}>
              <div className={classes.stars}>
                <StarRating stars={food.stars} />
              </div>
              {/* Show price for the selected size */}
              <div className={classes.price}>
                <Price price={
                  food.quantities.find(q => q.size === (selectedSizes[food._id] || food.quantities[0].size))?.price
                } />
              </div>
            </div>
            <div>
              <select
                value={selectedSizes[food._id] || food.quantities[0].size}
                onChange={e => handleSizeChange(food._id, e.target.value)}
              >
                {food.quantities.map(q => (
                  <option key={q.size} value={q.size}>
                    {q.size} - ₹{q.price}
                  </option>
                ))}
              </select>
            </div>
            <button
              className={classes.addToCart}
              onClick={() => handleAddToCart(food)}
            >
              Add to Cart
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
