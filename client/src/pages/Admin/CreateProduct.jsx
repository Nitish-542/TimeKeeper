import toast from "react-hot-toast";
import axios from "axios";
import { Select } from "antd";
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import AdminMenu from "../../components/Layout/AdminMenu";
import LayoutTheme from "../../components/Layout/LayoutTheme";
const { Option } = Select;

const CreateProduct = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState([]);
  const [quantity, setQuantity] = useState("");
  const [shipping, setShipping] = useState("");
  const [photo, setPhoto] = useState("");
  const [bestseller, setBestseller] = useState(false);

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


  const getAllLengths = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API}/api/v1/length/get-length`
      );
      setLengths(data.lengths);
    } catch (error) {
      console.log(error);
      toast.error("Failed to load lengths");
    }
  };

  useEffect(() => {
    getAllCategory();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const productData = new FormData();
      productData.append("name", name);
      productData.append("description", description);
      productData.append("price", price);
      productData.append("quantity", quantity);
      productData.append("photo", photo);
      productData.append("category", category);
      productData.append("shipping", shipping);
      productData.append("bestseller", bestseller);

      const { data } = await axios.post(
        `${import.meta.env.VITE_API}/api/v1/product/create-product`,
        productData
      );
      if (data?.success) {
        toast.success("Product Created Successfully");
        navigate("/dashboard/admin/products");
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  return (
    <LayoutTheme title={"Dashboard - Create Product"}>
      <div className='container'>
        <div className='row'>
          <div className='col-md-3 mb-4'>
            <AdminMenu />
          </div>
          <div className='col-md-9'>
            <h1>Create Product</h1>
            <div className='m-1'>
              <Select
                mode='multiple'
                placeholder='Select Categories'
                size='large'
                className='form-select mb-3'
                onChange={(value) => setCategory(value)}>
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
                {photo && (
                  <div className='text-center'>
                    <img
                      src={URL.createObjectURL(photo)}
                      alt='product_photo'
                      height={"50px"}
                      width={"50px"}
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
                  placeholder='Write a Price'
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
                  onChange={(value) => setShipping(value)}>
                  <Option value='0'>No</Option>
                  <Option value='1'>Yes</Option>
                </Select>
              </div>

              <div className='mb-3'>
                <Select
                  variant={false}
                  placeholder='Is this a bestseller?'
                  size='large'
                  showSearch
                  className='form-select mb-3'
                  onChange={(value) => setBestseller(value === "1")}>
                  <Option value='0'>No</Option>
                  <Option value='1'>Yes</Option>
                </Select>
              </div>

              <div className='mb-3'>
                <button className='btn btn-primary' onClick={handleCreate}>
                  CREATE PRODUCT
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </LayoutTheme>
  );
};

export default CreateProduct;
