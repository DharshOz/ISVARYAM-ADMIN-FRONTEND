import axios from 'axios';

// Fetch current user's wishlist
export async function fetchWishlist() {
  const res = await axios.get('/api/whishlist');
  return res.data;
}

// Add a product to wishlist (send { productId })
export async function addToWishlist(productId) {
  const res = await axios.post('/api/whishlist', { productId });
  return res.data;
}

// Remove a product from wishlist
export async function removeFromWishlist(productId) {
  const res = await axios.delete(`/api/whishlist/${productId}`);
  return res.data;
}
