import React, { createContext, useContext, useState, useEffect } from "react";


const CartContext = createContext();


export const useCart = () => useContext(CartContext);


export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false); 

  
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart"));
    if (savedCart) {
      setCart(savedCart);
    }
  }, []);

  
  useEffect(() => {
    if (cart.length > 0) {
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }, [cart]);

  
  const toggleCartVisibility = () => {
    setIsCartOpen((prev) => !prev);
  };

  
  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingProduct = prevCart.find((item) => item._id === product._id);
      if (existingProduct) {
        return prevCart.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      } else {
        return [...prevCart, { ...product, quantity: 1 }]; 
      }
    });
  };

  const increaseQuantity = (productId) => {
    const updatedCart = cart.map((item) => {
      if (item._id === productId) {
        return { ...item, quantity: item.quantity + 1 }; 
      }
      return item;
    });
    setCart(updatedCart); 
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const decreaseQuantity = (productId) => {
    const updatedCart = cart.map((item) => {
      if (item._id === productId && item.quantity > 1) {
        return { ...item, quantity: item.quantity - 1 };
      }
      return item;
    });
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const removeFromCart = (productId) => {
    const updatedCart = cart.filter((item) => item._id !== productId);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const clearCart = () => {
    setCart([]); 
    localStorage.removeItem("cart"); 
  };

  const totalPrice = () => {
    return cart
      .reduce((total, item) => total + item.price * item.quantity, 0)
      .toLocaleString("en-US", {
        style: "currency",
        currency: "$",
      });
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        increaseQuantity,
        decreaseQuantity,
        removeFromCart,
        clearCart,
        isCartOpen,
        toggleCartVisibility, 
        totalPrice, 
      }}>
      {children}
    </CartContext.Provider>
  );
};
