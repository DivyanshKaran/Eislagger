import express from "express";
import authRoutes from "./routes/auth.routes.ts";

const app = express();
const port = process.env.PORT || 3002;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Auth service is running!");
});

app.use("/api/v1/auth", authRoutes);

app.listen(port, () => {
  console.log(`Auth service listening at http://localhost:${port}`);
});
