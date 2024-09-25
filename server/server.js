import express from "express";
import getProducts from "./api/products";

const app = express();

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.get("/products", async (req, res) => {
  const products = await getProducts;

  res.json({ products });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
