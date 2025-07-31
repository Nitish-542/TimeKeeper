import { useState, useEffect } from "react";
import React from "react";
import LayoutTheme from "../components/Layout/LayoutTheme";
import axios from "axios";
import toast from "react-hot-toast";
import { useCart } from "../context/cart";

import { useParams, useNavigate } from "react-router-dom";

const ProductDetails = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({});
  const { cart, addToCart, toggleCartVisibility } = useCart();

  useEffect(() => {
    if (params?.slug) getProduct();
  }, [params?.slug]);

  const getProduct = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API}/api/v1/product/get-product/${params.slug}`
      );
      console.log(data.product);
      setProduct(data?.product);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddToCart = () => {
    const existingProduct = cart.find((item) => item._id === product._id);
    const existingQuantity = existingProduct ? existingProduct.quantity : 0;

    if (existingQuantity >= product.quantity) {
      toast.error(
        `Sorry, only ${product.quantity} items of this product are available.`
      );
      return;
    }

    const newProduct = {
      _id: product._id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      image: `${import.meta.env.VITE_API}/api/v1/product/product-photo/${
        product._id
      }`,
      quantity: 1,
    };

    addToCart(newProduct);
    toggleCartVisibility();
  };

  return (
    <LayoutTheme>
      <div className='row container m-2 p-4'>
        <div className='col-md-6 mb-3'>
          <img
            src={`${import.meta.env.VITE_API}/api/v1/product/product-photo/${
              product._id
            }`}
            className='card-img-top'
            alt={product.name}
            style={{
              width: "100%",
              maxWidth: "500px",
              height: "300px",
              objectFit: "contain",
            }}
          />
        </div>
        <div className='col-md-6 '>
          <h1>{product.name}</h1>
          <h6>${product.price}</h6>
          <h6>Description : {product.description}</h6>
          <h6>Quantity: {product.quantity}</h6>
          <h6>Category: {product?.category?.[0]?.name || "No category"}</h6>
          <button
            className='btn search-button'
            onClick={handleAddToCart}
            disabled={product.quantity <= 0}>
            {product.quantity <= 0 ? "SOLD OUT" : "ADD TO CART"}
          </button>
        </div>
      </div>
    </LayoutTheme>
  );
};

export default ProductDetails;
