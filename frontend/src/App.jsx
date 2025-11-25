import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css'; 

import { Outlet } from "react-router"
import Navbar from "./components/navbar/navbar"
import Footer from "./components/footer/footer"
import Chatbot from "./components/chatbot/chatbot"

export default function App() {

  useEffect(() => {
    AOS.init({
      // Opcional: Aqui você pode configurar as opções globais
      duration: 1000, // Duração da animação em milissegundos
      once: false, // Se true, as animações só ocorrem uma vez
    });
    // Opcional: Você pode querer atualizar o AOS se o layout mudar
    // AOS.refresh(); 
  }, []);


  return (
    <>
        <Navbar/>
        <Outlet/>
        <Chatbot/>
        <Footer/>
    </>
  )
}


