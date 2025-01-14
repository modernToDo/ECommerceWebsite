import { usermodel, cartModel, favModel, reviewModel } from "./schema.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import express from "express"

const router=express.Router()

//favourite
router.post("/api/favourite", async (req, res) => {
  const {
    body: {
      div: { src, desc, price },
      id,
    },
  } = req;
  try {
    if (!src || !desc || !price || !id)
      return res.send({ message: "error id" });
    const favourite = await favModel.findOne({ src });
    if (favourite)
      return res
        .status(400)
        .send({ message: "fav is in the list.you can't add twice." });
    const newFavourite = new favModel({ src, desc, price });
    await newFavourite.save();
    await usermodel.findByIdAndUpdate(
      { _id: id },
      { $push: { favourites: newFavourite._id } }
    );
    res.status(201).send({ message: newFavourite });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

router.delete("/api/favourite/delete/:id", async (req, res) => {
  const { id } = req.params;
  const { userId } = req.query;
  try {
    if (!id) return res.status(400).json({ message: "id is required" });
    const user = await usermodel.findByIdAndUpdate(
      userId,
      { $pull: { favourites: id } },
      { new: true }
    );
    if (!user) return res.status(404).send({ message: "user not found" });
    const deletedFav = await favModel.findByIdAndDelete({
      _id: id,
    });
    if (deletedFav) {
      const getAllFAvs = await usermodel
        .findById(userId, { favourites: 1, _id: 0 })
        .populate("favourites");
      res.status(200).send({ message: getAllFAvs.favourites });
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

//cart
router.get("/api/cart", async (req, res) => {
  const { query: { userId } } = req;
  try {
      if (!userId) return res.status(400).send({ message: "user id is not avai" });
  const user = await usermodel.findById({ _id: userId }, { carts: 1, _id: 0 }).populate("carts");
  if(user) return res.status(200).send(user.carts)
  } catch (error) {
    return res.status(500).send(error.message)
  }

})

router.post("/api/cart", async (req, res) => {
  const {
    body: {
      item: {
        div: { src, desc, price },
        userId,
      },
      usersChoice: { qty, colors, size },
    },
  } = req;
  try {
    if (!src || !desc || !price || !userId || !size || !colors || !qty)
      return res.status(400).send({ message: "all fields are required" });    
    const newItem = new cartModel({ product: { src, desc, price}, size ,colors,qty});
    await newItem.save();
    await usermodel.findByIdAndUpdate(userId,{$push:{carts:newItem._id}})
    res.status(201).send({ message:newItem });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

router.delete("/api/cart/:id", async (req, res) => {
  const {
    params: { id },
  } = req;
  const { query: { userId } } = req;
    try {
      if (!id || !userId)
        return res.status(403).send({ message: "bad credentials" });
      const user = await usermodel.findByIdAndUpdate({ _id: userId }, { $pull: { carts: id } });
      const deletedItem = await cartModel.findByIdAndDelete({ _id: id });
      if (!deletedItem) return res.status(404).send("not found");
      const userItems = await usermodel.findOne({_id:userId})
      const items = await cartModel.find({ _id:{$in:userItems.carts} })
      res.status(200).send(items);
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
});

router.get("/api/user/cart", async(req, res) => {
  const { query: { src, userId } } = req;
    try {
      if (!src || !userId)
        return res.status(400).send({ message: "src is empty" });
      const item = await cartModel.find({ "product.src": src });
      if(!item) return res.status(404).send({message:"item is not on the cart"})
      const itemId = item.map((items) => items._id);
      const user = await usermodel.findOne({ _id: userId });
      if(!user) res.status(404).send({message:"user with the given user id not exist"})
      const isCartIdAvai = user.carts.filter((cartId) =>
        itemId.some((item) => item._id.equals(cartId))
      );
      if (isCartIdAvai) {
        const carts = await cartModel.find({ _id: { $in: isCartIdAvai } });
        res.status(200).send({ message: carts });
      }
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  
});

//update qty
router.patch("/api/user/cart/:id", async(req, res) => {
  const { params: { id } } = req;
  const { body: { qty } } = req;
  try {
     if (!id) return res.status(400).send({ message: "id is not found" })
  await cartModel.findByIdAndUpdate(id, { qty: parseInt(qty) })
  } catch (error) {
   res.status(500).send({message:error.message}) 
  } 
})

//review
router.post("/api/review", async (req, res) => {
  const {
    body: {
      value: {
        userName,
        message,
        src,
      },
    },
  } = req;
  try {
    if (!userName || !message || !src)
      return res.status(400).send({ msg: "there is no review to send" });
    const newReview = new reviewModel({
      userName,
      message,
      src,
    });
    await newReview.save();
    res.status(200).send({ msg: "review successfully created" });
  } catch (error) {
    res.status(500).send({ msg: error.message });
  }
});

router.get("/api/allReviews", async (req, res) => {
  const { src } = req.query;
  try {
    const allReviews = await reviewModel.find({src})
    res.status(200).send({ message: allReviews });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

//register
router.post("/api/register", async (req, res) => {
  const {
    body: {
      data: { firstname, lastname, email, pass },
    },
  } = req;
  try {
    if (!firstname || !lastname || !email || !pass)
      return res.status(400).send({ message: "Fill all the fields" });
    const user = await usermodel.findOne({ email });
    if (user) return res.status(403).send({ message: "User already exists" });
    const hashedpass = await bcrypt.hash(pass, 10);
    const newuser = new usermodel({
      firstname,
      lastname,
      email,
      pass: hashedpass,
    });
    const token = jwt.sign({ id: newuser._id }, "userregister", {
      expiresIn: "1hr",
    });
    res.cookie("newcookie", token, {
      httpOnly: true,
      maxAge: 60 * 60 * 1000,
    });
    await newuser.save();
    res.status(201).json({ message: "user registered successfully" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

//login
router.post("/api/login", async (req, res) => {
  const { email, pass } = req.body.data;
  try {
    if (!email || !pass)
      return res.status(403).send({ message: "please fill the fields" });
    const user = await usermodel.findOne({ email });
    if (!user)
      return res.status(404).send({ message: "account does not exist" });
    const checkpass = await bcrypt.compare(pass, user.pass);
    if (!checkpass)
      return res.status(400).send({ message: "wrong credentials" });
    const token = jwt.sign({ id: user._id }, "LoginSecret", {
      expiresIn: "1d",
    });
    res.cookie("netcookie", token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.status(200).send({ message: user });
  } catch (error) {
    res.status(500).send({ message: "error while login" });
  }
});
//get fav from user
router.get("/api/user/:id", async (req, res) => {
  const { id } = req.params;
  try {
    if (!id) return res.status(400).send({ message: "user id is not found" });
    const user = await usermodel.findById({ _id: id });
    if (user) {
      const fav = await favModel.find({ _id: { $in: user.favourites } });
      res.status(200).send({ message: fav });
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

export default router;