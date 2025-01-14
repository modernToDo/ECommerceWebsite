import mongoose from "mongoose";
mongoose
  .connect("mongodb://localhost:27017/favs")
  .then(() => console.log("mongodb is connected"))
  .catch((err) => console.log(err));

const userSchema = new mongoose.Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  email: { type: String, required: true },
  pass: { type: String, required: true },
  favourites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Favourite" }],
  carts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Cart" }],
});

 const productSchema = new mongoose.Schema({
  src: { type: String, required: true },
  desc: { type: String, required: true },
  price: { type: String, required: true },
});

const cartSchema = new mongoose.Schema({
  product: productSchema,
  qty: { type: Number, requred: true },
  colors: { type: String, requred: true },
  size: { type: String, requred: true },
});
const reviewSchema = new mongoose.Schema({
  src: { type: String, requred: true },
  userName: { type: String, required: true },
  message: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

export const usermodel = mongoose.model("user", userSchema);
export const favModel = mongoose.model("Favourite", productSchema);
export const cartModel = mongoose.model("Cart", cartSchema);
export const reviewModel = mongoose.model("Review", reviewSchema);
