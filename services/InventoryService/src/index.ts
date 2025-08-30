
import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3003;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Inventory Service is running!');
});

app.listen(port, () => {
  console.log(`Inventory Service listening at http://localhost:${port}`);
});
