const express = require("express");

function keepAlive() {
  const app = express();

  app.get("/", (req, res) => {
    res.send("Bot is running!");
  });

  const PORT = 3000;
  app.listen(PORT, () => {
    console.log(`✅ Keep-alive server running on port ${PORT}`);
  });
}

module.exports = keepAlive;
