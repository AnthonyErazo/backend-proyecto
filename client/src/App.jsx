/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import './App.css'
import Home from './pages/home/Home'
import Cart from './pages/cart/Cart'
import MainLayout from './layouts/MainLayout'
import NoMatch from './error/NoMatch'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import ItemProduct from './pages/home/ItemProduct'
import SearchPage from './pages/home/SearchPage'
import Dashboard from './pages/dashboard/Dashboard'
import ResetPassword from './pages/auth/ResetPassword'
import { useEffect, useState } from 'react'
import axios from 'axios'

function App() {
  const [autenticado, setAutenticado] = useState(false);
  const verificarAutenticacion = async () => {
    try {
      // Realizar una solicitud al backend para verificar la autenticación del usuario
      const respuesta = await axios.get('http://localhost:8080/api/sessions/current',{withCredentials:true});
      console.log(respuesta)
      if (respuesta.data) {
        setAutenticado(true);
      }
    } catch (error) {
      console.error('Error al verificar la autenticación:', error);
    }
  };
  useEffect(() => {
        verificarAutenticacion();
      }, []);

  const router = createBrowserRouter([
    {
      path: "/",
      Component: MainLayout,
      children: [
        {
          path:'',
          element: <Navigate to="/home" replace />
        },
        {
          path: "home",
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
        },
        autenticado && {
          path: "dashboard",
          Component: Dashboard
        }
      ]
    },
    //Autenticacion
    {
      path:'/auth',
      children: [
        {
          path:'',
          element: <Navigate to="/auth/login" replace />
        },
        {
          path:'login',
          Component: Login
        },
        {
          path:'register',
          Component: Register
        },
        {
          path:'reset-password',
          Component:ResetPassword
        }
      ]
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



// import React, { useState, useEffect } from 'react';
// import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
// import Login from './Login';
// import Perfil from './Perfil';
// import axios from 'axios';

// function App() {
//   const [autenticado, setAutenticado] = useState(false);

//   useEffect(() => {
//     // Verificar si el usuario está autenticado al cargar la aplicación
//     verificarAutenticacion();
//   }, []);

//   const verificarAutenticacion = async () => {
//     try {
//       // Realizar una solicitud al backend para verificar la autenticación del usuario
//       const respuesta = await axios.get('/api/verificar-autenticacion');
//       if (respuesta.data.autenticado) {
//         setAutenticado(true);
//       }
//     } catch (error) {
//       console.error('Error al verificar la autenticación:', error);
//     }
//   };

//   return (
//     <Router>
//       <Switch>
//         <Route path="/login" component={Login} />
//         <Route path="/perfil">
//           {/* Redirigir al usuario a la página de inicio de sesión si no está autenticado */}
//           {autenticado ? <Perfil /> : <Redirect to="/login" />}
//         </Route>
//         {/* Otras rutas */}
//       </Switch>
//     </Router>
//   );
// }

// export default App;
