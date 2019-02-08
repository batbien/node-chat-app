const path = require("path");
const express = require("express");
const PORT = process.env.PORT || 3333

const app = express();


app.use(express.static(path.join(__dirname, "..", "public")));




app.listen(PORT, () => {
  console.log(`Server started: \n http://localhost:${PORT}`);
})
