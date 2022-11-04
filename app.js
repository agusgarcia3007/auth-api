const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connect = require("./src/config/connect");
const routes = require("./src/routes");

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 4000;

connect();

app.use("/api", routes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT} ⚡️`);
});
