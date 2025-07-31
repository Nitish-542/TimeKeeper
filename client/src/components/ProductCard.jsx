import React from "react";
import {
  MDBCard,
  MDBCardBody,
  MDBCardImage,
} from "mdb-react-ui-kit";
import { useCart } from "../context/cart";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { useAuth } from "../context/auth";
import { FaHeart } from "react-icons/fa";
import axios from "axios";

const ProductCard = ({
  _id,
  imageSrc,
  productName,
  productCategory,
  originalPrice,
  productSlug,
  productQuantity,
  showCategory = true,
  showPrice = true,
  showAddToCartButton = true,
  showAddToView = true,
}) => {
  const { cart, addToCart, toggleCartVisibility } = useCart();
  const [auth] = useAuth();

  // 🛒 Add to Cart
  const handleAddToCart = () => {
    const existingProduct = cart.find((item) => item._id === _id);
    const existingQuantity = existingProduct ? existingProduct.quantity : 0;

    if (existingQuantity >= productQuantity) {
      toast.error(
        `Sorry, only ${productQuantity} items of this product are available.`
      );
      return;
    }

    const product = {
      _id,
      slug: productSlug,
      name: productName,
      price: originalPrice,
      image: imageSrc,
      quantity: 1,
    };

    addToCart(product);
    toast.success(`${productName} added to cart`);
    toggleCartVisibility();
  };

  // 💖 Add to Wishlist
  const handleAddToWishlist = async () => {
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API}/api/v1/wishlist/add`,
        { productId: _id },
        {
          headers: {
            Authorization: `Bearer ${auth?.token}`,
          },
        }
      );

      if (data?.success) {
        toast.success("Added to wishlist");
      } else {
        toast.info("Already in wishlist");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to add to wishlist");
    }
  };

  return (
    <MDBCard
      style={{ width: "350px" }}
      className="d-flex flex-column align-items-center"
    >
      {/* Image Wrapper with relative for wishlist icon */}
      <div style={{ position: "relative", width: "350px", height: "180px" }}>
        <Link to={`/product/${productSlug}`}>
          <MDBCardImage
            src={imageSrc}
            position="top"
            className="img-fluid pt-3"
            alt={productName}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </Link>

        {/* Wishlist Icon - Top Right */}
        <div
          title="Add to Wishlist"
          onClick={handleAddToWishlist}
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            fontSize: "1.4rem",
            color: "red",
            cursor: "pointer",
            zIndex: 10,
          }}
        >
          <FaHeart />
        </div>
      </div>

      {/* Card Body */}
      <MDBCardBody
        className="d-flex flex-column align-items-center"
        style={{ width: "270px" }}
      >
        {showCategory && productCategory && (
          <div className="d-flex justify-content-between w-100">
            <p className="small">{productCategory}</p>
          </div>
        )}

        <div className="d-flex justify-content-between w-100 mb-3 align-items-center">
          <h5 className="mb-0">{productName}</h5>
          {showPrice && (
            <h5 className="text-dark mb-0">{`$${originalPrice}`}</h5>
          )}
        </div>

        <div className="d-flex justify-content-between w-100">
          {showAddToView && (
            <Link
              to={`/product/${productSlug}`}
              className="btn search-button ms-1"
            >
              View
            </Link>
          )}
          {showAddToCartButton && (
            <button
              className="btn ms-1 search-button"
              onClick={handleAddToCart}
              disabled={productQuantity <= 0}
            >
              {productQuantity <= 0 ? "SOLD OUT" : "ADD TO CART"}
            </button>
          )}
        </div>
      </MDBCardBody>
    </MDBCard>
  );
};

export default ProductCard;
