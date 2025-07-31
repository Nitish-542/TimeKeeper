import React, { useState, useEffect } from "react";
import LayoutTheme from "../components/Layout/LayoutTheme";
import { Container, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from "axios";
import ProductCard from "../components/ProductCard";
import Hero from "../components/Hero";

const HomePage = () => {
  const [bestsellers, setBestsellers] = useState([]);
  const [loadingBestsellers, setLoadingBestsellers] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const getBestsellers = async () => {
    try {
      setLoadingBestsellers(true);
      const { data } = await axios.get(
        `${import.meta.env.VITE_API}/api/v1/product/bestsellers`
      );
      setBestsellers(data.products);

      setLoadingBestsellers(false);
    } catch (error) {
      setLoadingBestsellers(false);
      console.log(error);
    }
  };

  const getProducts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${import.meta.env.VITE_API}/api/v1/product/product-list`
      );
      setProducts(data.products);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    getBestsellers();
    getProducts();
  }, []);

  return (
    <LayoutTheme title={"Home"}>
      <Hero />
      <Container className='my-5 container'>
        <div className='mb-6'>
          <h1 className='text-center display-2'>Products</h1>
          <p
            className='text-center mb-4 homepage-text'
            style={{ width: "400px", textAlign: "center", margin: "0 auto" }}>
          Discover the latest TimeKeeper collections — precision-crafted timepieces that blend elegance, innovation, and everyday luxury.
          </p>
          <div className='d-flex justify-content-center'>
            <Link to='/shopall'>
              <button
                size='lg'
                className='mb-4 px-5 search-button-outline text-center'
                href='/shopall'
                target='_self'>
                Shop Now
              </button>
            </Link>
          </div>
          {loading ? (
            <div className='text-center'>Loading Products...</div>
          ) : (
            <Row className='justify-content-center align-items-center'>
              {products
                ?.slice(0, 3)
                .reverse()
                .map((p) => (
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
                      showPrice={false}
                      showAddToView={false}
                      showAddToCartButton={false}
                    />
                  </Col>
                ))}
            </Row>
          )}
        </div>
        <h2 className='text-center display-2'>Bestsellers</h2>
        <p
          className='text-center mb-4 homepage-text'
          style={{ width: "400px", textAlign: "center", margin: "0 auto" }}>
Explore our bestsellers, made for the modern man who values both timeless design and reliable performance.
        </p>
        {loadingBestsellers ? (
          <div className='text-center'>Loading Bestsellers...</div>
        ) : (
          <Row>
            {bestsellers?.slice(0, 3).map((p) => (
              <Col key={p._id} className='col-lg-4 mb-2 centered-card'>
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
                />
              </Col>
            ))}
          </Row>
        )}
      </Container>
    </LayoutTheme>
  );
};

export default HomePage;
