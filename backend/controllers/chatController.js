import asyncHandler from "express-async-handler";
import Product from "../models/productModel.js";

// --- Configuration & Constants ---
const INTENTS = {
  GREETING: "greeting",
  RETURNS: "returns",
  SHIPPING: "shipping",
  HELP: "help",
  PRODUCT_SEARCH: "product_search",
  UNKNOWN: "unknown",
};

// Keywords/Patterns for non-product intents
const PATTERNS = {
  [INTENTS.GREETING]: /\b(hello|hi|hey|greetings|good morning|good afternoon|good evening)\b/i,
  [INTENTS.RETURNS]: /\b(return|refund|exchange|money back|policy)\b/i,
  [INTENTS.SHIPPING]: /\b(shipping|delivery|ship|track|arrive|how long)\b/i,
  [INTENTS.HELP]: /\b(help|assist|support|human|agent)\b/i,
};

// Responses for static intents
const RESPONSES = {
  [INTENTS.GREETING]: [
    "Hello! How can I help you find the perfect style today?",
    "Hi there! Looking for something specific?",
    "Welcome to YeloSoul! I'm here to help you shop.",
  ],
  [INTENTS.RETURNS]: [
    "We have a 30-day return policy. If you're not satisfied, you can return items in their original condition for a full refund.",
  ],
  [INTENTS.SHIPPING]: [
    "Shipping usually takes 3-5 business days. We offer free shipping on orders over $50!",
  ],
  [INTENTS.HELP]: [
    "I can help you find products, answer questions about shipping, or check our return policy. Just ask!",
  ],
  [INTENTS.UNKNOWN]: [
    "I'm not sure I understand. Try asking about a product (e.g., 'red shoes') or our policies.",
    "Could you rephrase that? I'm great at finding products!",
    "I didn't catch that. Do you want to see our latest collection?",
  ],
};

// --- Helper Functions ---

/**
 * Determines the intent of a user message.
 */
const detectIntent = (message) => {
  for (const [intent, pattern] of Object.entries(PATTERNS)) {
    if (pattern.test(message)) {
      return intent;
    }
  }
  // Default to product search if it's not a known static intent
  // We assume practically anything else is a search query
  return INTENTS.PRODUCT_SEARCH;
};

/**
 * Calculates a relevance score for a product against a set of query tokens.
 */
const calculateRelevance = (product, queryTokens) => {
  let score = 0;
  const nameLower = product.name.toLowerCase();
  const descLower = (product.description || "").toLowerCase();
  const categoryLower = (product.category || "").toLowerCase();

  queryTokens.forEach((token) => {
    // Exact name match (Highest weight)
    if (nameLower.includes(token)) score += 10;
    // Category match (Medium weight)
    if (categoryLower.includes(token)) score += 5;
    // Description match (Low weight)
    if (descLower.includes(token)) score += 1;
  });

  return score;
};




export const chatWithAI = asyncHandler(async (req, res) => {
  const { message } = req.body;

  if (!message) {
    res.status(400);
    throw new Error("Message is required");
  }

  const cleanMessage = message.trim();
  const intent = detectIntent(cleanMessage);

  // 1. Handle Static Intents (Greeting, Policy, etc.)
  if (intent !== INTENTS.PRODUCT_SEARCH) {
    const possibleResponses = RESPONSES[intent];
    const reply = possibleResponses[Math.floor(Math.random() * possibleResponses.length)];
    return res.json({ reply, products: [] });
  }


  const queryTokens = cleanMessage
    .toLowerCase()
    .replace(/[^\w\s]/g, "") // remove punctuation
    .split(/\s+/)
    .filter((t) => t.length > 2); // ignore short words like 'is', 'a', 'to'

  if (queryTokens.length === 0) {
    // If the user typed "is a to", tokens might be empty. Fallback.
    return res.json({
      reply: RESPONSES[INTENTS.UNKNOWN][0],
      products: [],
    });
  }

  const allProducts = await Product.find({});


  const scoredProducts = allProducts.map((p) => ({
    product: p,
    score: calculateRelevance(p, queryTokens),
  }));

  const topProducts = scoredProducts
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3) // Return top 3 recommendations
    .map((item) => item.product);

  if (topProducts.length > 0) {
    // Dynamic response based on results
    const productNames = topProducts.map((p) => p.name).join(", ");
    res.json({
      reply: `I found some great items for you: ${productNames}.`,
      products: topProducts.map((p) => ({
        _id: p._id,
        name: p.name,
        price: p.price,
        image: p.image || (p.images && p.images[0]) || "",
        link: `/product/${p._id}`,
      })),
    });
  } else {
    // Search yielded no results
    res.json({
      reply: "I couldn't find any products matching that description. Could you be more specific?",
      products: [],
    });
  }
});
