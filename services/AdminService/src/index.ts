import express from "express";
import dotenv from "dotenv";

import adminRoutes from "./routes/admin.routes.ts";

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Admin service is running!");
});

app.use("/api/v1/admin", adminRoutes);

app.listen(port, () => {
  console.log(`Admin service listening at http://localhost:${port}`);
});
