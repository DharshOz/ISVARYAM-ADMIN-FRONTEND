import { useEffect, useState } from 'react';
import { useAuth } from './useAuth';
import {
  fetchWishlist,
  addToWishlist,
  removeFromWishlist,
} from '../services/wishlistService';

export function useWishlist() {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    if (user) {
      fetchWishlist().then(setWishlist).catch(console.error);
    }
  }, [user]);

  const toggleWishlist = async (product) => {
    if (!user) return;

    const exists = wishlist.find(i => i.productId === product.productId);
    let updatedWishlist;

    if (exists) {
      await removeFromWishlist(product.productId);
      updatedWishlist = wishlist.filter(i => i.productId !== product.productId);
    } else {
      await addToWishlist(product.productId);
      updatedWishlist = [...wishlist, product];
    }

    setWishlist(updatedWishlist);
  };

  const isInWishlist = (productId) => {
    return wishlist.some(item => item.productId === productId);
  };

  return { wishlist, toggleWishlist, isInWishlist };
}