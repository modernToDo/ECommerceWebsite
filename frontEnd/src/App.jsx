import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./components/home/Home";
import Favourite from "./components/favourite/Favourite";
import Cart from "./components/cart/Cart";
import { useState } from "react";
import Review from "./components/review/Review";
import Register from "./components/loginSignUp/Register";
import LogIn from "./components/loginSignUp/LogIn";
function App() {
  const [color, setColor] = useState([]);
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <Home
                color={color}
                setColor={setColor}
              />
            }
          />
          <Route path="/favourite" element={<Favourite/>} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/review" element={<Review />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<LogIn />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
