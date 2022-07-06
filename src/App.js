import React from "react"
import Info from "./components/Mint"
import About from "./components/About"
import Interests from "./components/Thanks"
import Footer from "./components/Footer"
import "./index.css"

function App() {
    return (
        <div className="container">
            <Mint />
            <About />
            <Thanks />
            <Footer />
        </div>
    )
}

export default App