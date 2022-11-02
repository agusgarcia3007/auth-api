const express = require("express");
const dotenv = require("dotenv");
const connect = require("./src/config/connect");
const routes = require("./src/routes");

dotenv.config();
const app = express();
app.use(express.json());

const PORT = process.env.PORT || 4000;

connect();

app.use("/api", routes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT} ⚡️`);
});
