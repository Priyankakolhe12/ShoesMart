const express = require("express");
const authRouter = require("./routes/auth.routes");
const cookieParser = require("cookie-parser");
// const userModel = require("./models/user.model");
// const productModel = require("./models/product.model");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRouter);
app.use("/api/products", require("./routes/product.routes"));

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Welcome to the API",
  });
});

// app.post("/products", async (req, res) => {
//   const data = req.body;
//   await productModel.create({
//     name: data.name,
//     price: data.price,
//     originalPrice: data.originalPrice,
//     category: data.category,
//     type: data.type,
//     brand: data.brand,
//     description: data.description,
//     image: data.image,
//     stock: data.stock,
//     rating: data.rating,
//     tag: data.tag,
//   });
//   res.status(201).json({
//     message: "Product created successfully",
//   });
// });

// app.get("/products", async (req, res) => {
//   const products = await productModel.find({});
//   res.status(200).json(products);
// });

// app.get("/products/:id", async (req, res) => {
//   const product = await productModel.findById(req.params.id);

//   if (!product) {
//     return res.status(404).json({ message: "Product not found" });
//   }

//   res.status(200).json({
//     product,
//   });
// });

// app.post("/users", async (req, res) => {
//   const data = req.body;
//   await userModel.create({
//     name: data.name,
//     email: data.email,
//     password: data.password,
//   });
//   res.status(201).json({
//     message: "User created successfully",
//   });
// });

// app.get("/users", async (req, res) => {
//   const users = await userModel.find({});
//   res.status(200).json({
//     message: "Users retrieved successfully",
//     users: users,
//   });
// });

// app.delete("/users/:id", async (req, res) => {
//   const id = req.params.id;
//   await userModel.findOneAndDelete({
//     _id: id,
//   });
//   res.status(200).json({
//     message: "User deleted successfully",
//   });
// });

// app.patch("/users/:id", async (req, res) => {
//   const id = req.params.id;
//   const data = req.body;
//   await userModel.findOneAndUpdate(
//     {
//       _id: id,
//     },
//     {
//       name: data.name,
//       email: data.email,
//       password: data.password,
//     },
//   );
//   res.status(200).json({
//     message: "User updated successfully",
//   });
// });
// const notes = [];

// app.post("/notes", (req, res) => {
//   notes.push(req.body);
//   res.status(201).json({ message: "Note created successfully" });
// });

// app.get("/notes", (req, res) => {
//   res.status(200).json({
//     message: "Notes retrieved successfully",
//     notes: notes,
//   });
// });

// app.delete("/notes/:index", (req, res) => {
//   const index = req.params.index;
//   delete notes[index];
//   res.status(200).json({
//     message: "Note deleted successfully",
//   });
// });

// app.patch("/notes/:index", (req, res) => {
//   const index = req.params.index;
//   const description = req.body.description;

//   notes[index].description = description;

//   res.status(200).json({
//     message: "Note updated successfully",
//   });
// });

module.exports = app;
