import express from "express";
import cors from "cors";
import router from "./routing.js";
const app = express();
app.use(express.json());
app.use(cors());
app.use(router)


app.listen(2024, () => {
  console.log("server is running on port:2024");
});




