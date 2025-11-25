import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter , RouterProvider } from 'react-router'
import App from './App.jsx'
import Home from './pages/home/home.jsx'
import Services from './pages/services/services.jsx'
import Login from './pages/login/login.jsx'
import Plans from './pages/plans/plans.jsx'
import About from './pages/about/about.jsx'
import UserRegistration from './pages/userRegistration/userRegistration.jsx'
import ProviderRegistration from './pages/providerRegistration/providerRegistration.jsx'
import ProviderDatails from './pages/providerDatails/providerDatails.jsx'
import UserPerfil from './pages/userPerfil/userPerfil.jsx'

const pages = createBrowserRouter([
  {
    path:'/',
    element:<App/>,
    children:[
      { path: '/' , element: <Home/> },
      { path: '/services' , element: <Services/> },
      { path: '/login' , element: <Login/> },
      { path: '/plans' , element: <Plans/> },
      { path: '/about' , element: <About/> },
      { path: '/userRegistration' , element: <UserRegistration/> },
      { path: '/providerRegistration' , element: <ProviderRegistration/> },
      { path: '/providerDatails' , element: <ProviderDatails/> },
      { path: '/userPerfil' , element: <UserPerfil/> },
    ]
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={pages}> </RouterProvider>
  </StrictMode>,
)
