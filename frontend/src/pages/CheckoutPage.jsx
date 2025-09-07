import { useCart } from "../context/CartContext";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();

  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("");
  const [loading, setLoading] = useState(false);

  // Load Razorpay script dynamically
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleOrder = async () => {
    if (!address || !city || !postalCode || !country) {
      return alert("Please fill all address fields");
    }

    if (cart.length === 0) {
      return alert("Your cart is empty!");
    }

    const invalid = cart.find((item) => !item._id || item._id.length !== 24);
    if (invalid) {
      console.error("Invalid Product in Cart:", invalid);
      alert(
        `Invalid product in cart: ${invalid.name}. Please remove it and try again.`
      );
      return;
    }

    const totalPrice = cart.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    setLoading(true);

    const razorpayLoaded = await loadRazorpayScript();
    if (!razorpayLoaded) {
      setLoading(false);
      return alert("Failed to load payment gateway. Try again later.");
    }

    try {
      const token = localStorage.getItem("token");

     
      const { data: paymentOrder } = await axios.post(
        "http://localhost:5000/api/orders/payment", // ✅ FIXED ROUTE
        { totalPrice },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: paymentOrder.amount,
        currency: paymentOrder.currency,
        name: "YELOSOUL Store",
        description: "Order Payment",
        order_id: paymentOrder.orderId,
        handler: async function (response) {
          try {
            
            await axios.post(
              "http://localhost:5000/api/orders/verify-payment", 
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              },
              { headers: { Authorization: `Bearer ${token}` } }
            );

            
            const { data: placedOrder } = await axios.post(
              "http://localhost:5000/api/orders",
              {
                orderItems: cart.map((item) => ({
                  name: item.name,
                  qty: item.quantity,
                  price: item.price,
                  product: item._id,
                })),
                shippingAddress: { address, city, postalCode, country },
                totalPrice: Number(totalPrice.toFixed(2)),
                paymentInfo: {
                  method: "Razorpay",
                  status: "Paid",
                  transactionId: response.razorpay_payment_id,
                },
              },
              { headers: { Authorization: `Bearer ${token}` } }
            );

            alert(` Payment successful! Order ID: ${placedOrder.order._id}`);
            clearCart();
            navigate("/my-orders");
          } catch (error) {
            console.error("Order placement failed:", error);
            alert(" Payment done but order placement failed. Contact support.");
          }
        },
        prefill: {
          name: localStorage.getItem("userName") || "Customer",
          email: localStorage.getItem("userEmail") || "test@example.com",
          contact: "9999999999",
        },
        theme: {
          color: "#3399cc",
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error("Payment initiation failed:", error);
      alert(
        " Payment initiation failed: " +
          (error.response?.data?.message || "Please try again later")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>

      <input
        type="text"
        placeholder="Address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        className="border p-2 w-full mb-2"
      />
      <input
        type="text"
        placeholder="City"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        className="border p-2 w-full mb-2"
      />
      <input
        type="text"
        placeholder="Postal Code"
        value={postalCode}
        onChange={(e) => setPostalCode(e.target.value)}
        className="border p-2 w-full mb-2"
      />
      <input
        type="text"
        placeholder="Country"
        value={country}
        onChange={(e) => setCountry(e.target.value)}
        className="border p-2 w-full mb-4"
      />

      <button
        onClick={handleOrder}
        disabled={loading}
        className="bg-green-600 text-white px-4 py-2 rounded w-full hover:opacity-90"
      >
        {loading ? "Processing..." : "Pay & Place Order"}
      </button>
    </div>
  );
}












