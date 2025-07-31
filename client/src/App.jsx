import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import About from "./pages/About";
import Contact from "./pages/Contact";
import PageNotFound from "./pages/PageNotFound";
import Register from "./pages/Auth/Register";
import Login from "./pages/Auth/Login";
import "mdb-ui-kit/css/mdb.min.css";
import Dashboard from "./pages/user/Dashboard";
import PrivateRoute from "./components/Routes/Private";
import ForgotPasssword from "./pages/Auth/ForgotPassword";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminRoute from "./components/Routes/AdminRoute";
import CreateCategory from "./pages/Admin/CreateCategory";
import CreateProduct from "./pages/Admin/CreateProduct";
import Users from "./pages/Admin/Users";
import Orders from "./pages/user/Orders";
import Profile from "./pages/user/Profile";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap/dist/css/bootstrap.min.css";
import Products from "./pages/Admin/Products";
import UpdateProduct from "./pages/Admin/UpdateProduct";
import Search from "./pages/Search";
import ProductDetails from "./pages/ProductDetails";
import Categories from "./pages/Categories";
import CategoryProduct from "./pages/CategoryProduct";
import CartPage from "./pages/CartPage";
import AdminOrders from "./pages/Admin/AdminOrders";
import ShopPage from "./pages/ShopPage";
import OrderPage from "./pages/OrderPage";
import ShippingPage from "./pages/ShippingPage";
import WishlistPage from "./pages/WishlistPage";


function App() {
  return (
    <Routes>
      <Route path='/' element={<HomePage />} />
      <Route path='/shopall' element={<ShopPage />} />
      <Route path='/search' element={<Search />} />
      <Route path='/product/:slug' element={<ProductDetails />} />
      <Route path='/categories' element={<Categories />} />
      <Route path='/category/:slug' element={<CategoryProduct />} />
      <Route path='/cart' element={<CartPage />} />
      <Route path='/order/:orderId' element={<OrderPage />} />
      <Route path='/dashboard' element={<PrivateRoute />}>
        <Route path='user' element={<Dashboard />} />
        <Route path='user/orders' element={<Orders />} />
        <Route path='user/profile' element={<Profile />} />
      </Route>
      <Route path='/dashboard' element={<AdminRoute />}>
        <Route path='admin' element={<AdminDashboard />} />
        <Route path='admin/create-category' element={<CreateCategory />} />
        <Route path='admin/create-product' element={<CreateProduct />} />
        <Route path='admin/product/:slug' element={<UpdateProduct />} />
        <Route path='admin/products' element={<Products />} />
        <Route path='admin/users' element={<Users />} />
        <Route path='admin/orders' element={<AdminOrders />} />
      </Route>
      <Route path='/register' element={<Register />} />
      <Route path='/forgot-password' element={<ForgotPasssword />} />
      <Route path='/login' element={<Login />} />
      <Route path='/shipping' element={<ShippingPage />} />
      <Route path='/about' element={<About />} />
      <Route path='/contact' element={<Contact />} />
      <Route path='/wishlist' element={<WishlistPage />} />
      <Route path='*' element={<PageNotFound />} />
      
    </Routes>
  );
}

export default App;
