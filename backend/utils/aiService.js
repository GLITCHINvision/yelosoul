import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

let genAI = null;
let model = null;
let embeddingModel = null;
let vectorStore = [];

// Initialize AI Service
const initAI = () => {
  if (!process.env.GEMINI_API_KEY) {
    console.warn("⚠️ GEMINI_API_KEY is missing in .env. AI features will be disabled.");
    return false;
  }
  try {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    // For text generation
    model = genAI.getGenerativeModel({ model: "gemini-pro" });
    // For embeddings
    embeddingModel = genAI.getGenerativeModel({ model: "embedding-001" });
    console.log(" Gemini AI Initialized");
    return true;
  } catch (error) {
    console.error(" Failed to initialize Gemini AI:", error.message);
    return false;
  }
};

// Generate Embedding for a text string
const getEmbedding = async (text) => {
  if (!embeddingModel) return null;
  try {
    const result = await embeddingModel.embedContent(text);
    return result.embedding.values;
  } catch (error) {
    console.error("Error generating embedding:", error.message);
    return null;
  }
};

// Calculate Cosine Similarity
const cosineSimilarity = (vecA, vecB) => {
  const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
  const magA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
  const magB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
  return dotProduct / (magA * magB);
};

// Initial Vector Store Load (Call this on server start)
export const loadVectorStore = async (products) => {
  if (!initAI()) return;

  console.log(` Generating embeddings for ${products.length} products...`);
  vectorStore = [];

  for (const product of products) {
    // Create a rich text representation of the product
    const textToEmbed = `
            Product: ${product.name}
            Category: ${product.category}
            Price: ${product.price}
            Rating: ${product.rating}
            Description: ${product.description}
            Tags: ${product.category}, ${product.name.split(" ").join(", ")}
        `.trim();

    const embedding = await getEmbedding(textToEmbed);
    if (embedding) {
      vectorStore.push({
        product,
        embedding,
        text: textToEmbed
      });
    }
  }
  console.log(` Vector Store Ready with ${vectorStore.length} items.`);
};

// Main function to get AI response
export const getAIResponse = async (userQuery) => {
  if (!model) {
    return {
      reply: "I'm currently unable to access my brain (API Key missing). Please contact support!",
      products: []
    };
  }

  try {
    // 1. Embed User Query
    const queryEmbedding = await getEmbedding(userQuery);

    // 2. Find Relevant Products (Vector Search)
    let relevantProducts = [];
    if (queryEmbedding && vectorStore.length > 0) {
      relevantProducts = vectorStore.map(item => ({
        product: item.product,
        score: cosineSimilarity(queryEmbedding, item.embedding)
      }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 4) // Top 4 matches
        .map(item => item.product);
    }

    // 3. Construct Prompt for RAG
    const context = relevantProducts.map(p =>
      `- ${p.name} ($${p.price}): ${p.description}. Category: ${p.category}`
    ).join("\n");

    const prompt = `
            You remain the "YeloSoul Professional Assistant", a luxury jewelry styling expert.
            Your tone is elegant, helpful, and concise. 
            
            Context (Relevant Products from our catalog):
            ${context}

            User Question: "${userQuery}"

            Instructions:
            1. Answer the user's question directly.
            2. If the user asks for recommendations, use the Context provided to recommend specific items. Mention them by name and explain *why* they fit the request.
            3. If context is empty, apologize politely and suggest general categories like Necklaces/Rings.
            4. Keep the response under 3 sentences unless detailed styling advice is needed.
            5. Do NOT mention "context" or "database". Just talk naturally.
        `;

    // 4. Generate Response
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return {
      reply: text,
      products: relevantProducts
    };

  } catch (error) {
    console.error("AI Generation Error:", error);
    return {
      reply: "I apologize, I'm having a moment of dizziness. Could you ask that again?",
      products: []
    };
  }
};
