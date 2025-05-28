// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Home from "./pages/Home";
import Booking from "./pages/Booking";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/booking/:id" element={<Booking />} />
        </Routes>

        {/* Контейнер для toast сповіщень */}
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          toastStyle={{
            fontSize: "14px",
            borderRadius: "10px",
            boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
          }}
        />
      </div>
    </Router>
  );
}

export default App;
