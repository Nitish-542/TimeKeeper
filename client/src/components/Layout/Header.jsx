import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/auth";
import { useCart } from "../../context/cart";
import toast from "react-hot-toast";
import SearchInput from "../Form/SearchInput";
import useCategory from "../../hooks/useCategory";
import axios from "axios";
import { Badge } from "antd";
import { HiOutlineBars3 } from "react-icons/hi2";
import {
  Container,
  Nav,
  Navbar,
  NavDropdown,
  Offcanvas,
} from "react-bootstrap";

const Header = () => {
  const [auth, setAuth] = useAuth();
  const { cart } = useCart();
  const categories = useCategory();

  const [wishlistCount, setWishlistCount] = useState(0);

  const handleLogout = () => {
    setAuth({
      ...auth,
      user: null,
      token: "",
    });
    localStorage.removeItem("auth");
    toast.success("Logout Successfully");
  };

  const loadWishlistCount = async () => {
    try {
      if (auth?.token) {
        const { data } = await axios.get(
          `${import.meta.env.VITE_API}/api/v1/wishlist`,
          {
            headers: {
              Authorization: `Bearer ${auth.token}`,
            },
          }
        );
        setWishlistCount(data?.wishlist?.length || 0);
      }
    } catch (err) {
      console.error("Error loading wishlist:", err);
      setWishlistCount(0);
    }
  };

  useEffect(() => {
    loadWishlistCount();
  }, [auth?.token]);

  return (
    <>
      {/* Top Bar */}
      <Navbar className='navbar-bg'>
        <Container fluid className='container'>
          <div className='d-flex justify-content-between w-100'>
            <div className='d-lg-block text-center free-shipping-text'>
              Free shipping for orders above 500
            </div>

            <div className='d-lg-block'>
              {!auth?.user ? (
                <div className='d-flex justify-content-between gap-2'>
                  <Nav.Link
                    as={Link}
                    to='/register'
                    className='nav-link-custom'>
                    Register
                  </Nav.Link>
                  <Nav.Link as={Link} to='/login' className='nav-link-custom'>
                    Login
                  </Nav.Link>
                </div>
              ) : (
                <NavDropdown
                  title={`Welcome ${auth?.user?.name}`}
                  id='offcanvasNavbarDropdown-auth'>
                  <NavDropdown.Item
                    as={Link}
                    to={`/dashboard/${auth?.user?.role === 1 ? "admin" : "user"}`}>
                    Dashboard
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    as={Link}
                    to='/login'
                    onClick={handleLogout}>
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              )}
            </div>
          </div>
        </Container>
      </Navbar>

      {/* Main Nav */}
      <Navbar expand='lg' className='navbar-btm'>
        <Container fluid className='container'>
          <Navbar.Toggle aria-controls='offcanvasNavbar'>
            <HiOutlineBars3 />
          </Navbar.Toggle>
          <Navbar.Offcanvas
            id='offcanvasNavbar'
            aria-labelledby='offcanvasNavbarLabel'
            placement='start'>
            <Offcanvas.Header closeButton>
              <Offcanvas.Title id='offcanvasNavbarLabel'>
                TimeKeeper
              </Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <Nav className='justify-content-start flex-grow-1'>
                <Nav.Link as={Link} to='/'>
                  Home
                </Nav.Link>
                <Nav.Link as={Link} to='/about'>
                  About us
                </Nav.Link>
                <Nav.Link as={Link} to={`/category/analog`}>
                  Analog
                </Nav.Link>
                <Nav.Link as={Link} to={`/category/digital`}>
                  Digital
                </Nav.Link>
                <Nav.Link as={Link} to={`/category/smart`}>
                  Smart
                </Nav.Link>
                <Nav.Link as={Link} to='/shopall'>
                  Shop All
                </Nav.Link>
                <SearchInput />
              </Nav>
            </Offcanvas.Body>
          </Navbar.Offcanvas>

          {/* Brand */}
          <Navbar.Brand as={Link} to='/'>
            TimeKeeper
          </Navbar.Brand>

          {/* Wishlist & Cart */}
          <div className='d-flex align-items-center gap-3'>
            <Badge count={wishlistCount} showZero>
              <Nav.Link as={Link} to='/wishlist'>
                Wishlist
              </Nav.Link>
            </Badge>
            <Badge count={cart?.length} showZero>
              <Nav.Link as={Link} to='/cart'>
                Cart
              </Nav.Link>
            </Badge>
          </div>
        </Container>
      </Navbar>
    </>
  );
};

export default Header;
