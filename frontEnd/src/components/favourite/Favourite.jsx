import React, { useState,useEffect } from 'react'
import { FaShoppingCart } from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import axios from 'axios';
import { useLocation } from 'react-router-dom';
const Favourite = () => {
  const [favourite, setFavourite] = useState([])
  const location = useLocation()
  const _id=location.state
   useEffect(() => {
     axios
       .get(`http://localhost:2024/api/user/${_id}`)
       .then((response) => {
         setFavourite(response.data.message);
       })
       .catch((err) => console.log(err));
   }, []);
  const handleOnDeleteFav = (id) => {
    const itemToDelete = confirm("you want to delete item?");
    if(!itemToDelete) return 
     axios
       .delete(`http://localhost:2024/api/favourite/delete/${id}?userId=${_id}`)
       .then((response) => {
         setFavourite(response.data.message);
         alert("item deleted from favourite list.");
       })
       .catch((err) => console.log(err.response.data.message));
   };
  return (
    <div className="cards">
      {favourite.map((div, i) => (
        <figure className="figure" key={i}>
          <article className="article">
            <img src={div.src} />
            <MdCancel  className='heart' color='red' title='delete' onClick={()=>handleOnDeleteFav(div._id)}/>
          </article>
          <figcaption>
            <span>{div.desc}</span>
            <p>{div.price}&euro;</p>
            <button>buy now</button>
            <FaShoppingCart />
          </figcaption>
        </figure>
      ))}
    </div>
  );
}

export default Favourite