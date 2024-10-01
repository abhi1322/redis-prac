import express from "express";
import { getProducts } from "./api/products.js";
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
  const isExist = await redis.exists("products");

  if (isExist) {
    const cachedProducts = await redis.get("products");
    return res.json({ products: JSON.parse(cachedProducts) });
  }

  const products = await getProducts();

  redis.setex("products", 60, JSON.stringify(products)); // Cache for 1 minute

  res.json({ products });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
