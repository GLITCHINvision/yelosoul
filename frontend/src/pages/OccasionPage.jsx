import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

const OccasionPage = () => {
  const [occasions, setOccasions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const navigate = useNavigate();
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchOccasions = async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/api/occasions");
        setOccasions(Array.isArray(data.occasions) ? data.occasions : []);
      } catch (error) {
        console.error(" Error fetching occasions:", error);
        setOccasions([]);
      } finally {
        setLoading(false);
      }
    };
    fetchOccasions();
  }, []);

  const handleShopNow = (product) => {
    if (!product?._id) {
      alert(" Product is not linked properly. Please refresh.");
      return;
    }
    addToCart(product, 1);
    navigate("/cart");
  };

  const closeModal = () => setSelectedImage(null);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh] bg-[#faf9f7]">
        <p className="text-lg text-[#6b5e4a] animate-pulse">
          Curating beautiful gifts for you...
        </p>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-8 md:px-12 py-10 bg-[#faf9f7] min-h-screen">
      <h1 className="text-3xl md:text-4xl font-semibold text-center text-[#5a4d3b] mb-10 tracking-wide">
        Shop by Occasion
      </h1>

      {occasions.length === 0 ? (
        <p className="text-center text-gray-500 text-sm">
          No occasions available right now. Check back soon!
        </p>
      ) : (
        <div className="space-y-14">
          {occasions.map((occasion) => (
            <div key={occasion._id} className="space-y-5">
              <div className="text-center">
                <h2 className="text-2xl font-semibold text-[#6b5e4a]">{occasion.name}</h2>
                <p className="text-sm text-gray-500">{occasion.description}</p>
              </div>

              {occasion.products?.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                  {occasion.products.map((product) => (
                    <div
                      key={product._id}
                      className="bg-white rounded-2xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 p-4 text-center"
                    >
                      <div
                        className="cursor-pointer"
                        onClick={() => setSelectedImage(product.image)}
                      >
                        <img
                          src={product.image || "/placeholder.jpg"}
                          alt={product.name}
                          className="w-full h-52 object-cover rounded-xl mb-3 transition duration-300 hover:opacity-90"
                        />
                      </div>
                      <h3 className="text-base font-semibold text-[#4e4437] truncate">{product.name}</h3>
                      <p className="text-sm text-gray-500 mb-3">₹{product.price}</p>
                      <button
                        onClick={() => handleShopNow(product)}
                        className="bg-[#e9dfd1] text-[#4e4437] text-sm px-4 py-2 rounded-full hover:bg-[#d8cbb8] transition"
                      >
                        Add to Cart
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-400 text-sm">
                  No products for this occasion yet.
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Fullscreen Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
          onClick={closeModal}
        >
          <img
            src={selectedImage}
            alt="Full View"
            className="max-w-full max-h-full rounded-lg shadow-lg transition duration-300"
          />
        </div>
      )}
    </div>
  );
};

export default OccasionPage;








