import React from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import useCategory from "../../hooks/useCategory";

const Footer = () => {
  const categories = useCategory();
  return (
    <div className='bg-dark text-light'>
      <Container fluid className='container py-5'>
        <Row className='text-center text-md-start'>
          <Col xs={12} md={4} className='mb-4'>
            <h4>TimeKeeper</h4>
            <p>
              Crafted for those who value every second. TimeKeeper delivers timeless style for watch lovers across the world designed with precision, worn with pride.
            </p>
            <div>
              <Link
                to='https://www.instagram.com/timekeeper/'
                target='_blank'
                className='text-light nav-link-custom'>
                Instagram
              </Link>
            </div>
            <p className='mt-3'>
              Site by{" "}
              <a
                href='https://github.com/Nitish-542/'
                target='_blank'
                className='text-light nav-link-custom'>
                Nitish Sharma
              </a>
            </p>
          </Col>

          <Col xs={12} md={4} className='d-flex flex-column mb-4'>
            <div className='mb-4'>
              <h5>QUICK LINKS</h5>
              <ul className='list-unstyled'>
                <li>
                  <Link to='/shipping' className='text-light nav-link-custom'>
                    Shipping & Returns
                  </Link>
                </li>
                <li>
                  <Link to='/contact' className='text-light nav-link-custom'>
                    Support
                  </Link>
                </li>
                <li>
                  <Link to='/about' className='text-light nav-link-custom'>
                    About
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h5>HOT CATEGORIES</h5>
              <ul className='list-unstyled'>
                <li></li>
                <li>
                  <Link
                    to='/category/Analog'
                    className='text-light nav-link-custom'>
                    Analog
                  </Link>
                </li>
                <li>
                  <Link
                    to='/category/Digital'
                    className='text-light nav-link-custom'>
                    Digital
                  </Link>
                </li>
                <li>
                  <Link
                    to='/category/Smart'
                    className='text-light nav-link-custom'>
                    Smart
                  </Link>
                </li>
              </ul>
            </div>
          </Col>
          <Col xs={12} md={4} className='text-center'>
            <h5>Contact Info</h5>
            <p>Phone: +14376799376</p>
            <p>timeKeeper@gmail.com</p>
            <p>
              Store open: 9:00 – 17:30, Monday – Friday, 10:00 – 17:00, Saturday
            </p>
            <p>939 Phase 11, Mohali ,Chandigarh.</p>
          </Col>
        </Row>
      </Container>

      <div className='bg-light text-dark py-3'>
        <p className='text-center mb-0'>
          All Rights Reserved &copy; TimeKeeper
        </p>
      </div>
    </div>
  );
};

export default Footer;
