import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import { Helmet } from "react-helmet";
import { Toaster } from "react-hot-toast";
const LayoutTheme = ({ children, title }) => {
  return (
    <div>
      <Helmet>
        <meta charSet='utf-8' />
        <meta name='description' content='Ecommerce App' />
        <meta name='keywords' content='TimeKeeper' />
        <meta name='author' content='The TimeKeeper' />
        <title>{title}</title>
      </Helmet>
      <Header />
      <main style={{ minHeight: "80vh" }}>
        <Toaster />
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default LayoutTheme;
