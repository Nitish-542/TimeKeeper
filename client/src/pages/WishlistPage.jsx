import React, { useEffect, useState } from "react";
import LayoutTheme from "../components/Layout/LayoutTheme";
import { useAuth } from "../context/auth";
import axios from "axios";
import { toast } from "react-toastify";

const WishlistPage = () => {
  const [auth] = useAuth();
  const [wishlist, setWishlist] = useState([]);

  const loadWishlist = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API}/api/v1/wishlist`,
        {
          headers: {
            Authorization: `Bearer ${auth?.token}`,
          },
        }
      );
      setWishlist(data?.wishlist || []);
    } catch (error) {
      toast.error("Failed to load wishlist");
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API}/api/v1/wishlist/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${auth?.token}`,
          },
        }
      );
      toast.success("Removed from wishlist");
      loadWishlist();
    } catch (error) {
      toast.error("Error removing item");
    }
  };

  useEffect(() => {
    loadWishlist();
  }, []);

  return (
    <LayoutTheme title="Your Wishlist">
      <div className="container mt-4">
        <h3>Your Wishlist</h3>
        <div className="row">
          {wishlist.length === 0 ? (
            <p>No items in wishlist.</p>
          ) : (
            wishlist.map((item) => (
              <div className="col-md-3 mb-4" key={item._id}>
                <div className="card h-100">
                  <img
                    src={`${import.meta.env.VITE_API}/api/v1/product/product-photo/${item.product._id}`}
                    className="card-img-top"
                    alt={item.product.name}
                    style={{ height: "200px", objectFit: "contain" }}
                  />
                  <div className="card-body">
                    <h5 className="card-title">{item.product.name}</h5>
                    <p className="card-text">₹{item.product.price}</p>
                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => removeFromWishlist(item.product._id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </LayoutTheme>
  );
};

export default WishlistPage;
