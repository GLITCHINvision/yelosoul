// Native fetch assumed
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/productModel.js';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

async function debugChat() {
  const url = 'http://localhost:5000/api/chat';

  // 1. Check DB Content directly (bypass API for a moment to see truth)
  // We need to connect to DB first. 
  // Copying connection logic roughly or just relying on the API test if we assume DB works.
  // Actually, simpler to just hit the products API if it exists to see what's there.
  // GET /api/products

  console.log("--- checking products via API ---");
  try {
    const prodRes = await fetch('http://localhost:5000/api/products');
    const products = await prodRes.json(); // Assuming returns { products: [...] } or [...]

    const productList = products.products || products; // adjust based on actual API response structure
    console.log(`Total Products in DB: ${Array.isArray(productList) ? productList.length : 'Unknown'}`);

    if (Array.isArray(productList) && productList.length > 0) {
      console.log("Sample Product Names:", productList.slice(0, 3).map(p => p.name));

      // Now use one of these names for the search test
      const targetName = productList[0].name.split(' ')[0]; // First word of first product
      console.log(`\n--- Testing Search with term: "${targetName}" ---`);

      const chatRes = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: targetName })
      });
      const chatData = await chatRes.json();
      console.log("Reply:", chatData.reply);
      console.log("Products Found:", chatData.products ? chatData.products.length : 0);
    } else {
      console.log("No products found to test search against.");
    }

  } catch (e) {
    console.error("Error fetching products:", e.message);
  }

  // 2. Test Greeting
  console.log("\n--- Testing Greeting ---");
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: "Hello" })
    });
    const data = await res.json();
    console.log("Reply:", data.reply);
  } catch (e) { console.error(e); }
}

debugChat();
