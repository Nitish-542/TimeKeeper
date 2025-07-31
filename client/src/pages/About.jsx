import React from "react";
import LayoutTheme from "../components/Layout/LayoutTheme";

const About = () => {
  return (
    <LayoutTheme title={"About us"}>
      <div className='container'>
        <h1 className='text-center my-4'>About Us</h1>
        <div className='row m-3'>
          <div className='col-md-6 col-12 d-flex justify-content-center'>
            <img
              src='/images/timekeepers.png'
              className='img-fluid rounded'
              alt='aboutus'
              style={{
                width: "100%",
                maxWidth: "500px",
                height: "300px",
                objectFit: "cover",
              }}
            />
          </div>
          <div className='col-md-6 col-12 d-flex align-items-start'>
            <p className='text-justify mt-2'>
              At TimeKeeper, we’re building a curated e-commerce platform dedicated entirely to wristwatches. From luxury timepieces to affordable everyday options, we bring together a wide range of brands and styles in one seamless shopping experience.
              <br />
              Whether you're looking for a bold chronograph, a minimalist design, or a smart wearable, TimeKeeper offers something for every wrist. Our platform is designed for watch lovers who value both quality and convenience.
              <br />
              We work only with trusted sellers and verified products to ensure you get authentic watches, competitive prices, and secure delivery — all in one place. With a user-friendly interface, reliable shipping, and a smooth return policy, TimeKeeper is your go-to destination for everything time.

            </p>
          </div>
        </div>
      </div>
    </LayoutTheme>
  );
};

export default About;
