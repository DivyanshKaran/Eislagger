import express from "express";
import dotenv from "dotenv";

import inventoryRoutes from "./routes/inventory.routes.ts";

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Inventory Service is running!");
});

app.use("/api/v1/inventory", inventoryRoutes);

app.listen(port, () => {
  console.log(`Inventory Service listening at http://localhost:${port}`);
});
