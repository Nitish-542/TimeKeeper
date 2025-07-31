import toast from "react-hot-toast";
import axios from "axios";
import React, { useState, useEffect } from "react";
import AdminMenu from "../../components/Layout/AdminMenu";
import LayoutTheme from "../../components/Layout/LayoutTheme";
import { Link } from "react-router-dom";

const Products = () => {
  const [products, setProducts] = useState([]);

  const getAllProducts = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API}/api/v1/product/get-product`
      );
      setProducts(data.products);
    } catch (error) {
      console.log(error);
      toast.error("Something Went Wrong");
    }
  };

  useEffect(() => {
    getAllProducts();
  }, []);

  return (
    <LayoutTheme title={"Products"}>
      <div className='container'>
        <div className='row'>
          <div className='col-md-3 mb-4'>
            <AdminMenu />
          </div>
          <div className='col-md-9'>
            <h1 className='text-center'>All Products List</h1>
            <div className='table-responsive'>
              <table className='table table-bordered'>
                <thead>
                  <tr>
                    <th>Photo</th>
                    <th>Name</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products?.map((p) => (
                    <tr key={p._id}>
                      <td>
                        <img
                          src={`${
                            import.meta.env.VITE_API
                          }/api/v1/product/product-photo/${p._id}`}
                          className='img-fluid'
                          style={{ width: "50px", height: "50px" }}
                          alt={p.name}
                        />
                      </td>
                      <td>{p.name}</td>
                      <td>{p.quantity}</td>
                      <td>{p.price}</td>
                      <td>
                        <Link
                          to={`/dashboard/admin/product/${p.slug}`}
                          className='btn btn-primary'>
                          Edit Product
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </LayoutTheme>
  );
};

export default Products;
