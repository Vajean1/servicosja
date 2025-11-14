import { Outlet } from "react-router"
import Navbar from "./components/navbar/navbar"
import Footer from "./components/footer/footer"
import Chatbot from "./components/chatbot/chatbot"


export default function App() {

  return (
    <>
        <Navbar/>
        <Outlet/>
        <Chatbot/>
        <Footer/>
    </>
  )
}


