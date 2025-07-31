import React, { useState, useEffect } from "react";
import LayoutTheme from "../components/Layout/LayoutTheme";
import { Row, Col } from "react-bootstrap";
import { useParams } from "react-router-dom";
import axios from "axios";
import ProductCard from "../components/ProductCard"; 

const CategoryProduct = () => {
  const params = useParams();
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState([]);

  useEffect(() => {
    if (params?.slug) {
      
      getProductsByCat();
    }
  }, [params?.slug]);

  const getProductsByCat = async () => {
    try {
      const url = `${
        import.meta.env.VITE_API
      }/api/v1/product/product-category/${params.slug}`;

      const { data } = await axios.get(url);
      setProducts(data?.products);
      setCategory(data?.category);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  return (
    <LayoutTheme>
      <div className='container'>
        <div className='p-4'>
          <h4 className='text-center'>Category - {category?.name}</h4>
          <h6 className='text-center'>
            {products?.length} {products?.length === 1 ? "result" : "results"}{" "}
            found
          </h6>

          <Row className='justify-content-center align-items-center'>
            {products?.length > 0 ? (
              products.map((p) => (
                <Col
                  key={p._id}
                  className='col-lg-4 mb-2 centered-card'
                  lg={4}
                  md={6}
                  sm={12}>
                  <ProductCard
                    _id={p._id}
                    imageSrc={`${
                      import.meta.env.VITE_API
                    }/api/v1/product/product-photo/${p._id}`}
                    productName={p.name}
                    productCategory={p.category}
                    originalPrice={p.price}
                    productSlug={p.slug}
                    productQuantity={p.quantity}
                    showCategory={false}
                    showPrice={true}
                    showAddToCartButton={true}
                    showAddToView={true}
                  />
                </Col>
              ))
            ) : (
              <p>No products found in this category</p>
            )}
          </Row>
        </div>
      </div>
    </LayoutTheme>
  );
};

export default CategoryProduct;
