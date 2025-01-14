import { useLocation } from "react-router-dom";
import "./review.css";
import { useEffect, useRef, useState } from "react";
import { FaShoppingCart } from "react-icons/fa";
import axios from "axios";
const Review = () => {
  const location = useLocation();
  //console.log(location.state)
  const fullName = location.state.Fname + " " + location.state.Lname;

  const numRef = useRef(1);
  const [color, setColor] = useState("");
  const sizeRef = useRef(null);

  const [check, setCheck] = useState([]);
  const [allReviews, setAllReviews] = useState([]);
  const [moreLess, setMoreLess] = useState(2);
  const [value, setValue] = useState({
    userName: fullName,
    message: null,
    src: location.state.div.src,
  });
  const addReview = () => {
    axios
      .post("http://localhost:2024/api/review", { value })
      .then((response) => console.log(response.data.msg))
      .catch((err) => console.log(err.response.data.msg));
  };

  const getAllReviews = (src) => {
    axios
      .get(`http://localhost:2024/api/allReviews/?src=${src}`)
      .then((response) => {
        console.log(response.data.message);
        setAllReviews(response.data.message);
      })
      .catch((err) => console.log(err.response.data.message));
  };

  const showMore = () => {
    setMoreLess((current) => Math.min(current + 2, allReviews.length));
  };

  const showLess = () => {
    setMoreLess((current) => Math.max(current - 2, 2));
  };

  //add to cart
  const handleAddCart = (item) => {
    const usersChoice = {
      qty: numRef.current.value,
      colors: color,
      size: sizeRef.current.value,
    };
    if (!usersChoice.colors) return alert("select color please.");
    const isItemExisted = check.find(element => element.colors == usersChoice.colors &&
      element.size == usersChoice.size);
    if (isItemExisted) {
      isItemExisted.qty += Number(usersChoice.qty);
        axios
          .patch(`http://localhost:2024/api/user/cart/${isItemExisted._id}`,{qty:isItemExisted.qty})
          .then((response) => {
            setCheck((cur) => [...cur, { ...response.data.message }]);
            alert("item added successfully")
          })
          .catch((error) => console.log(error.response.data.message));
      } else {
        axios
          .post("http://localhost:2024/api/cart", { item, usersChoice })
          .then((response) => {
            setCheck((cur) => [...cur, { ...response.data.message }]);
            alert("item added successfully");
          })
          .catch((error) => console.log(error.response.data.message));
      } 
  };

  useEffect(() => {
    axios
      .get(
        `http://localhost:2024/api/user/cart?src=${location.state.div.src}&userId=${location.state.userId}`
      )
      .then((response) => {
        console.log(response.data.message);
        setCheck(  response.data.message );
      })
      .catch((error) => console.log(error.response.data.message));
  }, []);
  return (
    <section className="rev-cont">
      <div className="review">
        <figure className="figure">
          <article className="article">
            <img src={location.state.div.src} />
          </article>
          <figcaption>
            <span>{location.state.div.desc}</span>
            <p>{location.state.div.price}&euro;</p>
          </figcaption>
        </figure>
        <article className="desc">
          <p>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Magni,
            dolore.
          </p>
          <input
            type="number"
            defaultValue={numRef.current}
            placeholder="qty"
            ref={numRef}
          />
          <input
            type="text"
            style={{ background: "green" }}
            onClick={(e) => setColor(e.target.style.backgroundColor)}
          />
          <input
            type="text"
            style={{ background: "red" }}
            onClick={(e) => setColor(e.target.style.backgroundColor)}
          />
          <input
            type="text"
            style={{ background: "black" }}
            onClick={(e) => setColor(e.target.style.backgroundColor)}
          />
          <select
            ref={sizeRef}
            onBlur={(e) => sizeRef.current == e.target.value}
          >
            <option value="small">small</option>
            <option value="medium">medium</option>
            <option value="large">large</option>
          </select>
          <label>
            add to cart:
            <FaShoppingCart
              onClick={() => handleAddCart(location.state)}
              style={{ cursor: "pointer" }}
            />
          </label>
        </article>
      </div>
      <article>
        <textarea
          cols={20}
          rows={10}
          placeholder="write your review"
          onBlur={(e) =>
            setValue((currentValue) => ({
              ...currentValue,
              message: e.target.value,
            }))
          }
        ></textarea>
        <button onClick={addReview}>add review</button>
      </article>

      <button onClick={() => getAllReviews(location.state.div.src)}>
        all reviews
      </button>
      <div>
        {allReviews.slice(0, moreLess).map((review, i) => (
          <div key={i}>
            <h2>{review.userName}</h2>
            <p>{review.message}</p>
            <p>{review.date.split("T")[0]}</p>
          </div>
        ))}
      </div>
      {moreLess < allReviews.length && (
        <button onClick={showMore}>show more</button>
      )}
      {moreLess > 2 && <button onClick={showLess}>show less</button>}
    </section>
  );
};

export default Review;
