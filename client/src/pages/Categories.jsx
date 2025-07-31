import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import LayoutTheme from "../components/Layout/LayoutTheme";
import useCategory from "../hooks/useCategory";

const Categories = () => {
  const categories = useCategory();
  return (
    <LayoutTheme title={"all categories"}>
      <div className='container'>
        <div className='row'>
          {categories.map((c) => (
            <div className='col-md-6 mt-5 mb-3 gx-3 gy-3' key={c._id}>
              <Link to={`/category/${c.slug}`} className='btn btn-primary'>
                {c.name}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </LayoutTheme>
  );
};

export default Categories;
