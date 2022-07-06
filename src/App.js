import React from "react"
import Mint from "./components/Mint"
import About from "./components/About"
import Thanks from "./components/Thanks"
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