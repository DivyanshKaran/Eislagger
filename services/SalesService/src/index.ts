import express from "express";
import dotenv from "dotenv";

import salesRoutes from "./routes/sales.routes.ts";

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Sales Service is running!");
});

app.use("/api/v1/sales", salesRoutes);

app.listen(port, () => {
  console.log(`Sales Service listening at http://localhost:${port}`);
});
