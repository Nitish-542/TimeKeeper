import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import AdminMenu from "../../components/Layout/AdminMenu";
import { useAuth } from "../../context/auth";
import moment from "moment";
import { Select } from "antd";
import LayoutTheme from "../../components/Layout/LayoutTheme";
const { Option } = Select;

const AdminOrders = () => {
  const [status, setStatus] = useState([
    "Not Processed",
    "Processing",
    "Shipped",
    "Delivered",
    "Cancelled",
  ]);
  const [orders, setOrders] = useState([]);
  const [auth, setAuth] = useAuth();

  const getOrders = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API}/api/v1/auth/all-orders`,
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );
      setOrders(data);
      
    } catch (error) {
      console.log(error);
      toast.error("Error fetching orders.");
    }
  };

  useEffect(() => {
    if (auth?.token) getOrders();
  }, [auth?.token]);

  const handleChange = async (orderId, value) => {
    try {
      const { data } = await axios.put(
        `${import.meta.env.VITE_API}/api/v1/auth/order-status/${orderId}`,
        {
          status: value,
        },
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );
      getOrders();
      toast.success("Order status updated successfully");
    } catch (error) {
      console.log(error);
      toast.error("Error updating order status.");
    }
  };

  return (
    <LayoutTheme>
      <div className='row dashboard container'>
        <div className='col-md-3 mb-4'>
          <AdminMenu />
        </div>
        <div className='col-md-9'>
          <h1 className='text-center'>All Orders</h1>
          {orders?.map((o, i) => {
            return (
              <div className='border shadow' key={o._id}>
                <div className='table-responsive'>
                  <table className='table'>
                    <thead>
                      <tr>
                        <th scope='col'>#</th>
                        <th scope='col'>Buyer</th>
                        <th scope='col'>Product Name</th>
                        <th scope='col'>Price</th>
                        <th scope='col'>Quantity</th>
                        <th scope='col'>Total</th>
                        <th scope='col'>Payment</th>
                        <th scope='col'>Order Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {o?.products?.map((p, index) => (
                        <tr
                          key={
                            p.productId?._id || p.productId?.slug || "unknown"
                          }>
                          <td>{index + 1}</td>
                          <td>
                            {o?.buyer ? o.buyer.name : o?.guestName || "Guest"}
                          </td>

                          <td>
                            {p.productId
                              ? p.productId.name
                              : "Product not found"}
                          </td>
                          <td>
                            {p.productId ? `₦${p.productId.price}` : "₦0"}
                          </td>
                          <td>{p.quantity}</td>
                          <td>
                            ₦
                            {(p.productId && p.productId.price
                              ? p.productId.price
                              : 0) *
                              p.quantity.toLocaleString("en-US", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                          </td>

                          <td>{o.payment}</td>
                          <td>
                            <Select
                              onChange={(value) => handleChange(o._id, value)}
                              defaultValue={o?.status}
                              style={{ width: "100%" }}>
                              {status.map((s, i) => (
                                <Option key={i} value={s}>
                                  {s}
                                </Option>
                              ))}
                            </Select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </LayoutTheme>
  );
};

export default AdminOrders;
