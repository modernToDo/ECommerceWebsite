import { FaHeart } from "react-icons/fa6";
import img1 from "../../assets/applelogo.jpg";
import img2 from "../../assets/htmlLap.jpg";
import img3 from "../../assets/drizzle.png";
import img4 from "../../assets/htmipic.jpg";
import img5 from "../../assets/p3.coffe.jpeg";
import img6 from "../../assets/book.png";
import "./home.css";
import axios from "axios";
import { Link, useNavigate, useLocation } from "react-router-dom";

const Home = ({ color, setColor }) => {
  const location = useLocation();
  const Fname = location.state.firstname;
  const Lname = location.state.lastname;
  const userId = location.state._id;
  const navigateTo = useNavigate();

  //add to favourite
  const handleOnImport = (div) => {
    axios
      .post("http://localhost:2024/api/favourite", {
        div,
        id: location.state._id,
      })
      .then(() => alert("item added to the fav list"))
      .catch((err) => alert(err.response.data.message));
  };

  const divs = [
    { src: img1, desc: "ghdjskalsiwudfgbnm", price: "23.421" },
    { src: img2, desc: "ghdjskalsiwudfgbnm", price: "24.01" },
    { src: img3, desc: "ghdjskalsiwudfgbnm", price: "12" },
    { src: img4, desc: "ghdjskalsiwudfgbnm", price: "221" },
    { src: img5, desc: "ghdjskalsiwudfgbnm", price: "21" },
    { src: img6, desc: "ghdjskalsiwudfgbnm", price: "23421" },
  ];

  const handleItemClick = (i) => {
    setColor((currentColor) =>
      currentColor.includes(i)
        ? currentColor.filter((num) => num !== i)
        : [...currentColor, i]
    );
  };
  return (
    <div className="home">
      <nav>
        <ul>
          <li>
            <Link to="/" className="links">
              home
            </Link>
          </li>
          <li>
            <button
              onClick={() => navigateTo("/cart", { state: location.state._id })}
              className="links"
            >
              cart
            </button>
          </li>
          <li>
            <button
              onClick={() =>
                navigateTo("/favourite", { state: location.state._id })
              }
              className="links"
            >
              favourite
            </button>
          </li>
        </ul>
      </nav>
      <div className="cards">
        {divs.map((div, i) => (
          <figure className="figure" key={i}>
            <article className="article">
              <img
                src={div.src}
                onClick={() =>
                  navigateTo("/review", {
                    state: { div, Fname, Lname, userId },
                  })
                }
              />
              <FaHeart
                className={`heart ${color.includes(i) ? "red" : "green"}`}
                onClick={() => {
                  handleOnImport(div);
                  handleItemClick(i);
                }}
              />
            </article>
            <figcaption>
              <span>{div.desc}</span>
              <p>{div.price}&euro;</p>
            </figcaption>
          </figure>
        ))}
      </div>
      <div className="account">
        <input type="text" defaultValue={Fname.charAt(0)} disabled />
        {/* <label>{ location.state.fname}</label>
        <label>{ location.state.lname}</label> */}
      </div>
    </div>
  );
};

export default Home;
