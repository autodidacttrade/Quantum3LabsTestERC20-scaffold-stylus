import express from "express";
import path from "path";
import "dotenv/config";
import { ethers } from "ethers";
import axios from "axios";

const app = express();
const PORT = 3000;
const __dirname = path.resolve();

app.use(express.static(__dirname));

// ENDPOINT: Get Wallet Information
app.get("/balances", async (req, res) => {
  try {
    const RPC = process.env.API_SEPOLIA_TESTNET_URL + process.env.API_SEPOLIA_TESTNET_KEY;
    const PK = process.env.PRIVATE_KEY;
    const TOKEN_ADDRESS = "0x8F423758Ac39B6962CB052c819d5F1761768fCb2";

    const ERC20_ABI = [
      "function balanceOf(address) view returns (uint256)",
      "function decimals() view returns (uint8)",
      "function symbol() view returns (string)"
    ];

    const provider = new ethers.JsonRpcProvider(RPC);
    const wallet = new ethers.Wallet(PK, provider);
    const address = await wallet.getAddress();

    const ethBalance = await provider.getBalance(address);
    const token = new ethers.Contract(TOKEN_ADDRESS, ERC20_ABI, provider);
    const [rawBalance, decimals, symbol] = await Promise.all([
      token.balanceOf(address),
      token.decimals(),
      token.symbol().catch(() => "EXRP")
    ]);

    res.json({
      address,
      eth: ethers.formatEther(ethBalance),
      token: {
        symbol,
        raw: rawBalance.toString(),
        formatted: ethers.formatUnits(rawBalance, decimals)
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error to read wallet information" });
  }
});

// ENDPOINT: XRP price from CoinMarketCap
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
    console.error("Error getting price:", error.message);
    res.status(500).send("Error getting price from CoinMarketCap");
  }
});

// Middleware para recibir JSON
app.use(express.json());

// ENDPOINT: Mint EXRP tokens
app.post("/mint", async (req, res) => {
  try {
    const { amount } = req.body; // token amount
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      return res.status(400).json({ error: "Invalid amount" });
    }

    const RPC = process.env.API_SEPOLIA_TESTNET_URL + process.env.API_SEPOLIA_TESTNET_KEY;
    const PK = process.env.PRIVATE_KEY;
    const TOKEN_ADDRESS = "0x8F423758Ac39B6962CB052c819d5F1761768fCb2";

    const ERC20_ABI = [
      "function mint(address to, uint256 amount) external",
      "function decimals() view returns (uint8)"
    ];

    const provider = new ethers.JsonRpcProvider(RPC);
    const wallet = new ethers.Wallet(PK, provider);
    const contract = new ethers.Contract(TOKEN_ADDRESS, ERC20_ABI, wallet);

    // Get token decimals to convert the amount to wei
    const decimals = await contract.decimals();
    const mintAmount = ethers.parseUnits(amount.toString(), decimals);

    const tx = await contract.mint(await wallet.getAddress(), mintAmount);
    await tx.wait();

    res.json({ success: true, txHash: tx.hash, amount });
  } catch (err) {
    console.error("Error minting tokens:", err);
    res.status(500).json({ error: "Error minting tokens" });
  }
});


// Main page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "connect_wallet.html"));
});

// Run Server
//app.listen(PORT, () => console.log(`Servidor running in http://localhost:${PORT}`));


