import express from "express";
import { getProductDetails, getProducts } from "./api/products.js";
import Redis from "ioredis";

const app = express();
const redis = new Redis({
  host: "redis-15332.c340.ap-northeast-2-1.ec2.redns.redis-cloud.com",
  port: 15332,
  password: "HfydXqtxyVio4e507VIukIldFaydkTNB",
});

redis.on("connect", () => {
  console.log("Connected to Redis");
});

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.get("/products", async (req, res) => {
  let products = await redis.exists("products");

  if (products) {
    const cachedProducts = await redis.get("products");
    return res.json({ products: JSON.parse(cachedProducts) });
  }

  products = await getProducts();

  redis.setex("products", 60, JSON.stringify(products)); // Cache for 1 minute

  res.json({ products });
});

app.get("/product/:id", async (req, res) => {
  const id = req.params.id;
  const key = `product:${id}`;

  let product = await redis.get(key);

  if (product) {
    return res.json({ product: JSON.parse(product) });
  }

  product = await getProductDetails(id);
  await redis.set(key, JSON.stringify(product));

  res.json({ product });
});

app.get("/order/:id", async (req, res) => {
  const productID = req.params.id;
  const key = `product:${productID}`;

  //any mutation to database here
  // like creating new order
  // reducing the product stock in database

  redis.del(key);

  return res.json({
    message:
      "Order has been placed successfully for product id " + productID + ".",
  });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
