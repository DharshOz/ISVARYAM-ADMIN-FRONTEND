import React, { createContext, useContext, useEffect, useState } from 'react';

const CartContext = createContext(null);
const CART_KEY = 'cart';
const EMPTY_CART = {
  items: [],
  totalPrice: 0,
  totalCount: 0,
};

export default function CartProvider({ children }) {
  const initCart = getCartFromLocalStorage();
  const [cartItems, setCartItems] = useState(initCart.items);
  const [totalPrice, setTotalPrice] = useState(initCart.totalPrice);
  const [totalCount, setTotalCount] = useState(initCart.totalCount);

  useEffect(() => {
    const totalPrice = sum(cartItems.map(item => item.price));
    const totalCount = sum(cartItems.map(item => item.quantity));
    setTotalPrice(totalPrice);
    setTotalCount(totalCount);

    localStorage.setItem(
      CART_KEY,
      JSON.stringify({
        items: cartItems,
        totalPrice,
        totalCount,
      })
    );
  }, [cartItems]);

  function getCartFromLocalStorage() {
    const storedCart = localStorage.getItem(CART_KEY);
    return storedCart ? JSON.parse(storedCart) : EMPTY_CART;
  }

  const sum = items => {
    return items.reduce((prevValue, curValue) => prevValue + curValue, 0);
  };

  function removeFromCart(foodId, size) {
    setCartItems(prevCartItems =>
      prevCartItems.filter(
        item => !(item.food._id === foodId && item.size === size)
      )
    );
  }

  const changeQuantity = (cartItem, newQauntity) => {
    const { food } = cartItem;

    const changedCartItem = {
      ...cartItem,
      quantity: newQauntity,
      price: food.price * newQauntity,
    };

    setCartItems(
      cartItems.map(item => (item.food.id === food.id ? changedCartItem : item))
    );
  };

  function addToCart(food, size) {
    setCartItems(prevCartItems => {
      const existingIndex = prevCartItems.findIndex(
        item => item.food._id === food._id && item.size === size
      );
      if (existingIndex !== -1) {
        // Item exists, increase quantity
        const updatedItems = [...prevCartItems];
        updatedItems[existingIndex].quantity += 1;
        return updatedItems;
      } else {
        // New item
        return [
          ...prevCartItems,
          {
            food,
            size,
            price: food.quantities.find(q => q.size === size)?.price || 0,
            quantity: 1,
          },
        ];
      }
    });
  }

  const clearCart = () => {
    localStorage.removeItem(CART_KEY);
    const { items, totalPrice, totalCount } = EMPTY_CART;
    setCartItems(items);
    setTotalPrice(totalPrice);
    setTotalCount(totalCount);
  };

  return (
    <CartContext.Provider
      value={{
        cart: { items: cartItems, totalPrice, totalCount },
        removeFromCart,
        changeQuantity,
        addToCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
