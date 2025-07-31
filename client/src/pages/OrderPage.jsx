import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import LayoutTheme from "../components/Layout/LayoutTheme";
import axios from "axios";
import { useAuth } from "../context/auth";

const OrderPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [auth] = useAuth();
  const order = location.state?.order;
  const orderId = location.pathname.split("/").pop();
  const [orderDetails, setOrderDetails] = useState(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API}/api/v1/auth/order/${orderId}`
        );
        setOrderDetails(response.data);

        const productSlugs = response.data.products.map((item) => item.slug);
        const productDetailsPromises = productSlugs.map((slug) =>
          axios.get(
            `${import.meta.env.VITE_API}/api/v1/product/get-product/${slug}`
          )
        );
        const productResponses = await Promise.all(productDetailsPromises);
        setProducts(productResponses.map((res) => res.data.product));
      } catch (error) {
        console.error("Error fetching order details:", error);
      }
    };

    if (!order) {
      fetchOrderDetails();
    } else {
      setOrderDetails(order);
      const productSlugs = order.products.map((item) => item.slug);
      const productDetailsPromises = productSlugs.map((slug) =>
        axios.get(
          `${import.meta.env.VITE_API}/api/v1/product/get-product/${slug}`
        )
      );
      Promise.all(productDetailsPromises).then((productResponses) => {
        setProducts(productResponses.map((res) => res.data.product));
      });
    }
  }, [order, orderId]);

  if (!orderDetails || products.length === 0) {
    return <div>Loading...</div>;
  }

  const customerName = auth.user?.name || orderDetails.guestName || "Guest";
  const customerEmail =
    auth.user?.email || orderDetails.guestEmail || "No email provided";
  const customerAddress =
    auth.user?.address || orderDetails.guestAddress || "No address provided";

  return (
    <LayoutTheme title={"Order Summary"}>
      <div className='container'>
        <div className='summary bg-white p-4 m-5 rounded'>
          <h1 className='text-center'>Thank you for placing an order!</h1>

          <div className='d-flex justify-content-center mb-3'>
            <img
              src='/images/success.png'
              alt='Order Success'
              className='img-fluid'
              style={{ maxWidth: "100px" }}
            />
          </div>

          <h2 className='text-center mb-3'>Order Summary</h2>

          <div className='row justify-content-between'>
            <div className='col-12 col-md-6'>
              <h3>Order Items:</h3>
              <div className='order-summary'>
                <div className='d-flex flex-column'>
                  {orderDetails.products.map((item, index) => (
                    <div
                      key={item.slug}
                      className='mb-3 d-flex flex-column flex-md-row justify-content-between'>
                      <h5 className='order-text'>
                        {index + 1}. {products[index]?.name}
                      </h5>
                      <p>Price: ${products[index]?.price}</p>
                      <p>Quantity: {item.quantity}</p>
                    </div>
                  ))}
                </div>

                <div>
                  <h5>
                    Payment Method:
                    <span> {orderDetails.payment || "Not specified"}</span>
                  </h5>
                </div>

                <div>
                  <h3>
                    Total Price: $
                    <span>
                      {orderDetails.products
                        .reduce(
                          (total, item) =>
                            total +
                            (products.find((p) => p.slug === item.slug)
                              ?.price || 0) *
                              item.quantity,
                          0
                        )
                        .toLocaleString("en-US")}
                    </span>
                  </h3>
                </div>
              </div>
            </div>

            <div className='col-12 col-md-6'>
              <div>
                <h3>Customer Details</h3>

                <div className='d-flex  flex-column'>
                  <div className='mr-3'>
                    <strong>Name:</strong> {customerName}
                  </div>
                  <div className='mr-3'>
                    <strong>Email:</strong> {customerEmail}
                  </div>
                  <div className='mr-3'>
                    <strong>Shipping Address:</strong> {customerAddress}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='mt-3 justify-content-center'>
            <button
              className='btn search-button text-center'
              onClick={() => navigate("/")}>
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </LayoutTheme>
  );
};

export default OrderPage;
