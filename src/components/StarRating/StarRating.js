import React from 'react';
import classes from './starRating.module.css';

export default function StarRating({ stars = 0, size, showNumber = true, reviewsCount, pulse = false }) {
  const styles = {
    width: size + 'px',
    height: size + 'px',
    marginRight: size / 6 + 'px',
  };

  function Star({ number }) {
    const halfNumber = number - 0.5;

    return stars >= number ? (
      <img src="/star-full.svg" style={styles} alt={number} className={classes.star} />
    ) : stars >= halfNumber ? (
      <img src="/star-half.svg" style={styles} alt={number} className={classes.star} />
    ) : (
      <img src="/star-empty.svg" style={styles} alt={number} className={classes.star} />
    );
  }

  const ratingClass = `${classes.rating} ${pulse ? classes.pulse : ''}`;
  const safeStars = typeof stars === 'number' && !isNaN(stars) ? stars : 0;

  return (
    <div className={ratingClass}>
      {[1, 2, 3, 4, 5].map(number => (
        <Star key={number} number={number} />
      ))}
      {showNumber && (
        <span className={classes.ratingText}>
          {safeStars.toFixed(1)}
          {reviewsCount && (
            <span className={classes.reviewsCount}> ({reviewsCount.toLocaleString()})</span>
          )}
        </span>
      )}
    </div>
  );
}

StarRating.defaultProps = {
  size: 18,
};