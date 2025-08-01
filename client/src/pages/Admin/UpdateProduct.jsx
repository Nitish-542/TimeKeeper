import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import AdminMenu from "../../components/Layout/AdminMenu";
import LayoutTheme from "../../components/Layout/LayoutTheme";
import axios from "axios";
import { Select } from "antd";
import { useNavigate, useParams } from "react-router-dom";
const { Option } = Select;

const UpdateProduct = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [shipping, setShipping] = useState("");
  const [photo, setPhoto] = useState("");
  const [id, setId] = useState("");
  const [isBestseller, setIsBestseller] = useState(false);

  const getSingleProduct = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API}/api/v1/product/get-product/${params.slug}`
      );

      setName(data.product.name);
      setId(data.product._id);
      setDescription(data.product.description);
      setPrice(data.product.price);
      setQuantity(data.product.quantity);
      setShipping(data.product.shipping);
      setCategory(data.product.category._id);
      setIsBestseller(data.product.bestseller);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getSingleProduct();
  }, []);

  const getAllCategory = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API}/api/v1/category/get-category`
      );
      if (data?.success) {
        setCategories(data?.category);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong in getting category");
    }
  };


  useEffect(() => {
    getAllCategory();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const productData = new FormData();
      productData.append("name", name);
      productData.append("description", description);
      productData.append("price", price);
      productData.append("quantity", quantity);
      if (photo) productData.append("photo", photo);
      productData.append("category", category);
      productData.append("bestseller", isBestseller);

      const { data } = await axios.put(
        `${import.meta.env.VITE_API}/api/v1/product/update-product/${id}`,

        productData
      );

      if (data?.success) {
        toast.success("Product Updated Successfully");
        navigate("/dashboard/admin/products");
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  const handleDelete = async () => {
    try {
      let answer = window.prompt("Are You Sure want to delete this product?");
      if (!answer) return;
      const { data } = await axios.delete(
        `${import.meta.env.VITE_API}/api/v1/product/delete-product/${id}`
      );
      toast.success("Product Deleted Successfully");
      navigate("/dashboard/admin/products");
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  return (
    <LayoutTheme title={"Dashboard - Update Product"}>
      <div className='container'>
        <div className='row'>
          <div className='col-md-3 mb-4'>
            <AdminMenu />
          </div>
          <div className='col-md-9'>
            <h1>Update Product</h1>
            <div className='m-1 w-75'>
              <Select
                variant={false}
                placeholder='Select a category'
                size='large'
                showSearch
                className='form-select mb-3'
                onChange={(value) => setCategory(value)}
                value={category}>
                {categories?.map((c) => (
                  <Option key={c._id} value={c._id}>
                    {c.name}
                  </Option>
                ))}
              </Select>


              <div className='mb-3'>
                <label className='btn btn-outline-secondary col-md-12'>
                  {photo ? photo.name : "Upload Photo"}
                  <input
                    type='file'
                    name='photo'
                    accept='image/*'
                    onChange={(e) => setPhoto(e.target.files[0])}
                    hidden
                  />
                </label>
              </div>
              <div className='mb-3'>
                {photo ? (
                  <div className='text-center'>
                    <img
                      src={URL.createObjectURL(photo)}
                      alt='product_photo'
                      height={"200px"}
                      className='img img-responsive'
                    />
                  </div>
                ) : (
                  <div className='text-center'>
                    <img
                      src={`${
                        import.meta.env.VITE_API
                      }/api/v1/product/product-photo/${id}`}
                      alt='product_photo'
                      height={"200px"}
                      className='img img-responsive'
                    />
                  </div>
                )}
              </div>
              <div className='mb-3'>
                <input
                  type='text'
                  value={name}
                  placeholder='Write a name'
                  className='form-control'
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className='mb-3'>
                <textarea
                  value={description}
                  placeholder='Write a description'
                  className='form-control'
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className='mb-3'>
                <input
                  type='number'
                  value={price}
                  placeholder='Write a price'
                  className='form-control'
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>
              <div className='mb-3'>
                <input
                  type='number'
                  value={quantity}
                  placeholder='Write a quantity'
                  className='form-control'
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </div>
              <div className='mb-3'>
                <Select
                  variant={false}
                  placeholder='Select Shipping'
                  size='large'
                  showSearch
                  className='form-select mb-3'
                  onChange={(value) => setShipping(value)}
                  value={shipping ? "yes" : "No"}>
                  <Option value='0'>No</Option>
                  <Option value='1'>Yes</Option>
                </Select>
              </div>

              <div className='mb-3'>
                <Select
                  placeholder='Is Bestseller?'
                  size='large'
                  className='form-select mb-3'
                  onChange={(value) => setIsBestseller(value === "1")}
                  value={isBestseller ? "1" : "0"}>
                  <Option value='0'>No</Option>
                  <Option value='1'>Yes</Option>
                </Select>
              </div>

              <div className='mb-3'>
                <button className='btn btn-primary' onClick={handleUpdate}>
                  UPDATE PRODUCT
                </button>
              </div>
              <div className='mb-3'>
                <button className='btn btn-danger' onClick={handleDelete}>
                  DELETE PRODUCT
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </LayoutTheme>
  );
};

export default UpdateProduct;
