import { useCart } from "../context/CartContext";
import { API_URL } from "../config";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();

  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("India");
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

  const handleOrder = async (e) => {
    e.preventDefault();
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
        `${API_URL}/orders/payment`,
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
              `${API_URL}/orders/verify-payment`,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              },
              { headers: { Authorization: `Bearer ${token}` } }
            );


            const { data: placedOrder } = await axios.post(
              `${API_URL}/orders`,
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
          color: "#2c3e50", // Matching new theme
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

  const calculateTotal = () => {
    return cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  };

  return (
    <div className="min-h-screen bg-[#fcfbf8] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-serif text-[#2c3e50] mb-8 text-center md:text-left">
          Checkout
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Shipping Form */}
          <div className="lg:col-span-7">
            <div className="bg-white p-5 md:p-8 rounded-2xl md:rounded-3xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-serif text-[#2c3e50] mb-6">Shipping Address</h2>
              <form onSubmit={handleOrder} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Street Address</label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#2c3e50] focus:ring-1 focus:ring-[#2c3e50] outline-none transition-all"
                    placeholder="123 Fashion St"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#2c3e50] focus:ring-1 focus:ring-[#2c3e50] outline-none transition-all"
                      placeholder="New Delhi"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Postal Code</label>
                    <input
                      type="text"
                      required
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#2c3e50] focus:ring-1 focus:ring-[#2c3e50] outline-none transition-all"
                      placeholder="110001"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                  <input
                    type="text"
                    required
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#2c3e50] focus:ring-1 focus:ring-[#2c3e50] outline-none transition-all"
                    placeholder="India"
                  />
                </div>
              </form>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-5">
            <div className="bg-white p-5 md:p-8 rounded-2xl md:rounded-3xl shadow-sm border border-gray-100 sticky top-24">
              <h2 className="text-xl font-serif text-[#2c3e50] mb-6">Your Order</h2>

              <div className="space-y-4 mb-6 max-h-80 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-200">
                {cart.map((item) => (
                  <div key={item._id} className="flex gap-4">
                    <div className="w-16 h-16 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-[#2c3e50] text-sm">{item.name}</h4>
                      <div className="flex justify-between items-center mt-1">
                        <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                        <p className="text-sm font-medium text-[#2c3e50]">₹{(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 pt-6 space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{calculateTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="text-green-600 font-medium">calculated at next step</span>
                </div>
                <div className="flex justify-between items-end pt-3 border-t border-gray-50">
                  <span className="font-medium text-[#2c3e50]">Total to Pay</span>
                  <span className="text-2xl font-serif text-[#2c3e50]">₹{calculateTotal().toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handleOrder}
                disabled={loading}
                className={`w-full bg-[#2c3e50] text-white py-4 rounded-xl mt-8 hover:bg-[#1a252f] transition-all duration-300 shadow-lg hover:shadow-xl font-medium tracking-wide flex justify-center items-center gap-2 ${loading ? "opacity-70 cursor-not-allowed" : ""
                  }`}
              >
                {loading ? (
                  <>Processing...</>
                ) : (
                  <>
                    <span>🔒</span> Pay Securely
                  </>
                )}
              </button>

              <div className="mt-6 flex justify-center gap-4 opacity-50 grayscale transition-all hover:grayscale-0">
                {/* Placeholder icons for payment methods */}
                <div className="text-xs text-center">Contains Secure Payment Gateways</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
