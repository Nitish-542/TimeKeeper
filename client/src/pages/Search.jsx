import React, { useEffect } from "react";
import { useSearch } from "../context/search";
import { Container, Row } from "react-bootstrap";
import ProductCard from "../components/ProductCard";
import LayoutTheme from "../components/Layout/LayoutTheme";

const SearchPage = () => {
  const [values] = useSearch();

  return (
    <LayoutTheme>
      <Container>
        <h3>Search Results</h3>

        <Row className='mt-4'>
          {values.results?.length > 0 ? (
            values.results.map((product) => (
              <div key={product._id} className='col-lg-4 mb-4'>
                <ProductCard
                  _id={product._id}
                  imageSrc={`${
                    import.meta.env.VITE_API
                  }/api/v1/product/product-photo/${product._id}`}
                  productName={product.name}
                  productCategory={product.category}
                  originalPrice={product.price}
                  productSlug={product.slug}
                  productQuantity={product.quantity}
                  showCategory={false}
                  showPrice={true}
                />
              </div>
            ))
          ) : (
            <div>No products found</div>
          )}
        </Row>
      </Container>
    </LayoutTheme>
  );
};

export default SearchPage;
