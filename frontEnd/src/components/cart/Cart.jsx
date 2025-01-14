
import axios from "axios";
import { useEffect, useState } from "react";
import { MdCancel } from "react-icons/md";
import "./cart.css"
import { useLocation } from "react-router-dom";

const Cart = () => {
  const location = useLocation();
  const [totalPrice, setTotalPrice] = useState(0);
  const [addCart, setAddCart] = useState([]);
  useEffect(() => {
    setTotalPrice(0);
     axios
       .get(`http://localhost:2024/api/cart?userId=${location.state}`)
       .then((response) => {
         console.log(response.data)
         setAddCart(response.data);
         response.data.map((it) =>
           setTotalPrice((currentPrice) => currentPrice + Number(it.product.price)*it.qty)
         );
       })
       .catch((err) => console.log(err));
   }, []);

  const deleteItem = (id) => {
      const itemToDelete = confirm("you want to delete item?");
      if (!itemToDelete) return; 
     setTotalPrice(0);
     axios
       .delete(`http://localhost:2024/api/cart/${id}?userId=${location.state}`)
       .then((response) => {
         setAddCart(response.data);
         alert("item removed successfully.")
         response.data.map((it) =>
           setTotalPrice(currentSum=>currentSum+ Number(it.product.price)*it.qty)
         );
       })
       .catch((err) => console.log(err));
   };
  
  return (
    <div>
      <p style={{ fontSize: "22px", fontWeight: "600", marginLeft: "2rem" }}>
        your total price is:
        <strong style={{ color: "red" }}> {totalPrice.toFixed()}&euro;</strong>
      </p>
      <div className="carts">
        {addCart.map((item, i) => (
          <section key={i} className="section">
            <figure className="figure">
              <article className="article">
                <img src={item.product.src} />
                <MdCancel
                  color="red"
                  className="heart"
                  title="remove"
                  onClick={() => deleteItem(item._id)}
                />
              </article>
              <figcaption>
                <span>{item.product.desc}</span>
                <p>{item.product.price}&euro;</p>
                <button>buy now</button>
              </figcaption>
            </figure>
            <article>
              <p>
                Quantity: <strong>{item.qty}</strong>
              </p>
              <p>
                Color: <strong>{item.colors}</strong>
              </p>
              <p>
                Size: <strong>{item.size}</strong>
              </p>
            </article>
          </section>
        ))}
      </div>
    </div>
  );
}

export default Cart