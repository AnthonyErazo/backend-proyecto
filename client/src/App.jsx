import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './App.css'
import Home from './pages/home/Home'
import Cart from './pages/cart/Cart'
import MainLayout from './layouts/MainLayout'
import NoMatch from './error/NoMatch'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import ItemProduct from './pages/home/ItemProduct'
import SearchPage from './pages/home/SearchPage'

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      Component: MainLayout,
      children: [
        {
          path: "",
          Component: Home
        },
        {
          path: "cart",
          Component: Cart
        },
        {
          path: "product/:id",
          Component: ItemProduct
        },
        {
          path:"search/:term",
          Component:SearchPage
        }
      ]
    },
    //Autenticacion
    {
      path: "auth/login",
      Component: Login
    },
    {
      path: "auth/register",
      Component: Register
    },
    //Rutas no encontradas
    {
      path: "*",
      Component: NoMatch
    }
  ]);

  return (
    <RouterProvider router={router} />
  )
}

export default App

