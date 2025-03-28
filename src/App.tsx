import { useRoutes } from "react-router";
import { CartProvider } from "./providers/CartContext"; // ✅ Import CartProvider

import ClientLayout from "./pages/client/ClientLayout";
import AdminLayout from "./pages/admin/AdminLayout";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/client/home";
import ProductDetail from "./pages/client/productDetail";
import Register from "./pages/auth/register";
import Login from "./pages/auth/login";
import Cart from "./pages/cart/cart";
import Checkout from "./pages/checkout/Checkout";

import ProductList from "./pages/admin/product/list";
import ProductAdd from "./pages/admin/product/add";
import ProductEdit from "./pages/admin/product/edit";

function App() {
  const element = useRoutes([
    {
      path: "/",
      element: <ClientLayout />,
      children: [
        { path: "", element: <Home /> },
        { path: "product/cart", element: <Cart /> }, 
        { path: "/checkout", element: <Checkout /> }, 
        { path: "product/:id", element: <ProductDetail /> },
        { path: "register", element: <Register /> },
        { path: "login", element: <Login /> },
      ],
    },
    {
      path: "/admin",
      element: (
        <ProtectedRoute>
          <AdminLayout />
        </ProtectedRoute>
      ),
      children: [
        { path: "", element: <ProductList /> },
        { path: "product/list", element: <ProductList /> },
        { path: "product/add", element: <ProductAdd /> },
        { path: "product/:id/edit", element: <ProductEdit /> },
      ],
    },
  ]);

  return (
    <CartProvider> 
      {element}
    </CartProvider>
  );
}

export default App;
