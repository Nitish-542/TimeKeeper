import { createRoot } from "react-dom/client";

import "mdb-ui-kit/css/mdb.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/auth.jsx";
import "antd/dist/reset.css";
import { SearchProvider } from "./context/search.jsx";
import { CartProvider } from "./context/cart.jsx";
import CartDropdown from "./components/CartDropdown.jsx";

createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <SearchProvider>
      <CartProvider>
        <BrowserRouter>
          <App />
          <CartDropdown />
        </BrowserRouter>
      </CartProvider>
    </SearchProvider>
  </AuthProvider>
);
