import React, { useState, useEffect } from "react";
import UserMenu from "../../components/Layout/UserMenu";
import LayoutTheme from "../../components/Layout/LayoutTheme";
import axios from "axios";
import { useAuth } from "../../context/auth";
import moment from "moment";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [auth, setAuth] = useAuth();

  const getOrders = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API}/api/v1/auth/orders`,
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );
      setOrders(data);
    } catch (error) {
      console.log("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    if (auth?.token) {
      getOrders();
    }
  }, [auth?.token]);

  return (
    <LayoutTheme title={"Your Orders"}>
      <div className='container dashboard'>
        <div className='row'>
          <div className='col-md-3 mb-4'>
            <UserMenu />
          </div>
          <div className='col-md-9'>
            <h1 className='text-center'>All Orders</h1>
            {orders?.map((order, i) => (
              <div className='border shadow' key={order._id || i}>
                <div className='table-responsive'>
                  <table className='table'>
                    <thead>
                      <tr>
                        <th scope='col'>#</th>
                        <th scope='col'>Product Name</th>
                        <th scope='col'>Total</th>
                        <th scope='col'>Quantity</th>
                        <th scope='col'>Payment</th>
                        <th scope='col'>Status</th>
                        <th scope='col'>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {order?.products && order.products.length > 0 ? (
                        order.products.map((product, index) => (
                          <tr
                            key={
                              product.productId?._id ||
                              product.productId?.slug ||
                              "unknown"
                            }
                          >
                            <td>{index + 1}</td>
                            <td>
                              {product.productId
                                ? product.productId.name
                                : "Product not found"}
                            </td>
                            <td>
                              {(
                                (product.productId?.price || 0) *
                                product.quantity
                              ).toLocaleString("en-US", {
                                style: "currency",
                                currency: "USD", // Change to your desired currency
                              })}
                            </td>
                            <td>{product.quantity}</td>
                            <td>{order?.payment}</td>
                            <td>{order?.status}</td>
                            <td>{moment(order?.createdAt).fromNow()}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan='7' className='text-center'>
                            No products found in this order.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </LayoutTheme>
  );
};

export default Orders;
