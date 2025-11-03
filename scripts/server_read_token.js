import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Main
app.get("/", (req, res) => {
  res.send("Server ETHXRP connected");
});

// Get the XRP price in CoinMarketCap
app.get("/price", async (req, res) => {
  try {
    const url = "https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest";
    const response = await axios.get(url, {
      headers: { "X-CMC_PRO_API_KEY": process.env.COINMARKETCAP_API_KEY },
      params: { symbol: "XRP", convert: "USD" }
    });

    const price = response.data.data.XRP.quote.USD.price;
    res.json({ symbol: "XRP", priceUSD: price.toFixed(4) });

  } catch (error) {
    console.error("Error to get price:", error.message);
    res.status(500).send("Error to get price in CoinMarketCap");
  }
});

app.listen(PORT, () => {
  console.log(`Server ETHXRP running in http://localhost:${PORT}`);
});
