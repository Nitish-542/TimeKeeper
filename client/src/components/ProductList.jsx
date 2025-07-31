import React, { useState, useEffect } from "react";
import axios from "axios";
import ProductCard from "./ProductCard";

const ProductList = ({ limit = 12, filters }) => {
  const { checked, radio } = filters;
  const [products, setProducts] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(limit);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        const { data } = await axios.get(
          `${import.meta.env.VITE_API}/api/v1/product/product-list`,
          {
            params: {
              checked: checked.join(","),
              radio: radio.join(","),
              page,
              limit: perPage,
            },
          }
        );

        setProducts(data.products);
        setTotalProducts(data.countTotal);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [checked, radio, page, perPage]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handlePerPageChange = (e) => {
    setPerPage(Number(e.target.value));
    setPage(1);
  };

  const totalPages =
    totalProducts && perPage ? Math.ceil(totalProducts / perPage) : 0;

  return (
    <div className='container my-3'>
      <div className='row mb-4'>
        <div className='col-12'>
          <div className='d-flex justify-content-between align-items-center'>
            <h2 className='h2 text-center'>Products</h2>
            <select onChange={handlePerPageChange} value={perPage}>
              <option value={12}>12 per page</option>
              <option value={24}>24 per page</option>
              <option value={36}>36 per page</option>
            </select>
          </div>
        </div>
      </div>

      <div className='row'>
        {loading ? (
          <p className='text-center col-12'>Loading products...</p>
        ) : products.length === 0 ? (
          <p className='text-center col-12'>No products found</p>
        ) : (
          products.map((product) => (
            <div
              key={product._id}
              className='col-12 col-sm-6 col-md-3 col-lg-4 mb-4 d-flex justify-content-center'>
              <ProductCard
                _id={product._id}
                imageSrc={`${
                  import.meta.env.VITE_API
                }/api/v1/product/product-photo/${product._id}`}
                productName={product.name}
                productCategory={product.category
                  .map((cat) => cat.name)
                  .join(", ")}
                originalPrice={product.price}
                discountedPrice={product.discountedPrice}
                availableQuantity={product.quantity}
                productSlug={product.slug}
                showCategory={false}
                showPrice={true}
                showAddToView={true}
                showAddToCartButton={true}
              />
            </div>
          ))
        )}
      </div>

      <div className='row'>
        <div className='col-12'>
          <nav>
            <ul className='pagination justify-content-center gap-3'>
              {page > 1 && (
                <li className='page-item'>
                  <button
                    className='page-link'
                    onClick={() => handlePageChange(page - 1)}>
                    Prev
                  </button>
                </li>
              )}
              {totalPages > 0 &&
                [...Array(totalPages)].map((_, index) => (
                  <li
                    key={index}
                    className={`page-item ${
                      page === index + 1 ? "active" : ""
                    }`}>
                    <button
                      className='page-link'
                      onClick={() => handlePageChange(index + 1)}>
                      {index + 1}
                    </button>
                  </li>
                ))}
              {page < totalPages && (
                <li className='page-item'>
                  <button
                    className='page-link'
                    onClick={() => handlePageChange(page + 1)}>
                    Next
                  </button>
                </li>
              )}
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default ProductList;
