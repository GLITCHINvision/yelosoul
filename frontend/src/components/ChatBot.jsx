import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { MessageCircle, X, Send, ShoppingBag, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const initialMessage = {
    sender: "bot",
    text: "Hello! I'm your YeloSoul Assistant. Looking for something special today? 🛍️",
    products: [],
  };
  const [messages, setMessages] = useState([initialMessage]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const { data } = await axios.post("http://localhost:5000/api/chat", {
        message: userMessage.text,
      });

      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: data.reply, products: data.products || [] },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "Oops! I'm having trouble connecting right now. Please try again later.",
          products: [],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([initialMessage]);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div className="w-80 sm:w-96 bg-white dark:bg-gray-900 shadow-2xl rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 flex flex-col transition-all duration-300 transform scale-100 origin-bottom-right mb-4 h-[500px]">
          {/* Header */}
          <div className="bg-yellow-400 p-4 flex justify-between items-center shadow-md">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <ShoppingBag size={18} className="text-yellow-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 leading-tight">YeloSoul AI</h3>
                <p className="text-xs text-gray-800">Professional Assistant</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Delete/Clear Button */}
              <button
                onClick={clearChat}
                title="Clear Chat"
                className="text-gray-900 bg-white/20 hover:bg-white/40 p-1.5 rounded-full transition-colors"
              >
                <Trash2 size={16} />
              </button>

              {/* Close Button */}
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-900 hover:text-white transition-colors p-1"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900 scrollbar-hide">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"
                  }`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed ${msg.sender === "user"
                      ? "bg-yellow-400 text-gray-900 rounded-br-none font-medium"
                      : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-bl-none shadow-sm"
                    }`}
                >
                  {msg.text}
                </div>

                {/* Product Recommendations */}
                {msg.products && msg.products.length > 0 && (
                  <div className="mt-3 grid grid-cols-1 gap-2 w-full">
                    {msg.products.map((product) => (
                      <Link
                        key={product._id}
                        to={product.link}
                        className="flex items-center gap-3 bg-white dark:bg-gray-800 p-2 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:border-yellow-400 transition-all group"
                        onClick={() => setIsOpen(false)}
                      >
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-12 h-12 rounded-lg object-cover bg-gray-100"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate group-hover:text-yellow-500 transition-colors">
                            {product.name}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            ${product.price}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-200 dark:bg-gray-800 text-gray-500 text-xs px-3 py-2 rounded-full animate-pulse">
                  AI is thinking...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 flex items-center gap-2">
            <input
              type="text"
              placeholder="Ask about products..."
              className="flex-1 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white text-sm rounded-full px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || loading}
              className="bg-yellow-400 text-gray-900 p-2.5 rounded-full hover:bg-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg transform active:scale-95"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`${isOpen ? "rotate-90 opacity-0 pointer-events-none" : "rotate-0 opacity-100"
          } absolute bottom-0 right-0 w-14 h-14 bg-yellow-400 text-gray-900 rounded-full shadow-lg hover:shadow-xl hover:bg-yellow-500 transition-all duration-300 flex items-center justify-center transform hover:scale-105 z-50`}
      >
        <MessageCircle size={28} />
      </button>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`${!isOpen ? "-rotate-90 opacity-0 pointer-events-none" : "rotate-0 opacity-100"
          } absolute bottom-0 right-0 w-14 h-14 bg-gray-900 text-white rounded-full shadow-lg hover:shadow-xl hover:bg-gray-800 transition-all duration-300 flex items-center justify-center transform hover:scale-105 z-50`}
      >
        <X size={24} />
      </button>
    </div>
  );
};

export default ChatBot;
