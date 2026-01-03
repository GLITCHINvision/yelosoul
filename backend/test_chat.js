// Native fetch assumed or already polyfilled


async function testChat() {
  const url = 'http://localhost:5000/api/chat';

  const tests = [
    { message: "Hello" },
    { message: "Return policy" },
    { message: "red shoes" }, // Assuming "red" or "shoes" might match something. If not, it tests unknown or empty search.
  ];

  for (const body of tests) {
    console.log(`\nTesting message: "${body.message}"`);
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const data = await response.json();
      console.log("Reply:", data.reply);
      console.log("Products found:", data.products ? data.products.length : 0);
      if (data.products && data.products.length > 0) {
        console.log("Top product:", data.products[0].name);
      }
    } catch (error) {
      console.error("Error:", error.message);
    }
  }
}

testChat();
