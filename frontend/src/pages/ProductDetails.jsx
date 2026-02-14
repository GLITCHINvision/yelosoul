import { useParams, useNavigate } from "react-router-dom";
import { API_URL } from "../config";
import { useCart } from "../context/CartContext";
import { useState, useEffect, useMemo, useRef } from "react";
import axios from "axios";
import { FaStar, FaRegStar } from "react-icons/fa";

// Replaced local BASE_URL with imported API_URL


export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userId, setUserId] = useState(null);

  // reviews
  const [reviewLoading, setReviewLoading] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  // slider
  const images = useMemo(() => {
    if (!product) return [];
    const multi = Array.isArray(product.images) ? product.images : [];
    const single = product.image ? [product.image] : [];
    return Array.from(new Set([...multi, ...single].filter(Boolean)));
  }, [product]);

  const [current, setCurrent] = useState(0);

  // Fetch logged-in user ID
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setUserId(payload.id || payload._id);
      } catch {
        console.error("Invalid token");
      }
    }
  }, []);

  // Fetch product
  const fetchProduct = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/products/${id}`);
      setProduct(data);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Product not found");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart({
      _id: product._id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: images[0] || product.image,
    });
    alert(`✅ ${product.name} added to cart`); // Simple alert, could use toast in future
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate("/checkout");
  };

  const submitReview = async () => {
    if (!comment.trim()) return alert("Please add a comment");
    const token = localStorage.getItem("token");
    if (!token) return alert("Please login to submit a review");

    try {
      setReviewLoading(true);
      await axios.post(
        `${API_URL}/products/${id}/reviews`,
        { rating, comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchProduct();
      setComment("");
      setRating(5);
      alert("✅ Review submitted");
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "Failed to submit review");
    } finally {
      setReviewLoading(false);
    }
  };

  const deleteReview = async (reviewId) => {
    const token = localStorage.getItem("token");
    if (!token) return alert("Please login first");
    if (!window.confirm("Are you sure you want to delete this review?")) return;

    try {
      await axios.delete(`${API_URL}/products/${id}/reviews/${reviewId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchProduct();
      alert("🗑 Review deleted");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to delete review");
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#fcfbf8] flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#2c3e50]"></div>
    </div>
  );

  if (error) return <div className="text-center py-20 text-red-500">{error}</div>;
  if (!product) return null;

  return (
    <div className="min-h-screen bg-[#fcfbf8] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">

          {/* LEFT: IMAGE GALLERY */}
          <div className="space-y-4 md:space-y-6">
            <div className="bg-white rounded-2xl md:rounded-3xl overflow-hidden shadow-sm aspect-[4/5] md:aspect-square relative group">
              <img
                src={images[current] || "/placeholder.jpg"}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>
            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-3 md:gap-4 overflow-x-auto pb-4 scrollbar-hide">
                {images.map((src, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrent(idx)}
                    className={`relative w-16 h-16 md:w-24 md:h-24 flex-shrink-0 rounded-lg md:rounded-xl overflow-hidden border-2 transition-all ${idx === current ? "border-[#2c3e50] opacity-100" : "border-transparent opacity-60 hover:opacity-100"
                      }`}
                  >
                    <img src={src} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: PRODUCT INFO */}
          <div>
            <div className="mb-8 border-b border-gray-100 pb-8">
              <h1 className="text-3xl md:text-5xl font-serif text-[#2c3e50] mb-4 leading-tight">{product.name}</h1>
              <div className="flex items-center gap-4 mb-6">
                <p className="text-3xl font-medium text-[#2c3e50]">
                  ₹{Number(product.price || 0).toFixed(2)}
                </p>
                <div className="flex items-center gap-1 text-yellow-500 text-sm bg-yellow-50 px-3 py-1 rounded-full">
                  <FaStar />
                  <span className="font-semibold text-gray-700 ml-1">{product.rating?.toFixed(1) || "0.0"}</span>
                  <span className="text-gray-400 font-normal">({product.numReviews || 0} reviews)</span>
                </div>
              </div>

              <p className="text-gray-600 leading-relaxed text-lg font-light">
                {product.description}
              </p>
            </div>

            {/* Actions - Desktop */}
            <div className="hidden md:flex flex-row gap-4 mb-12">
              <button onClick={handleAddToCart} className="flex-1 bg-white text-[#2c3e50] border border-[#2c3e50] py-4 rounded-xl hover:bg-gray-50 transition-colors font-medium text-lg">
                Add to Cart
              </button>
              <button onClick={handleBuyNow} className="flex-1 bg-[#2c3e50] text-white py-4 rounded-xl hover:bg-[#1a252f] transition-all shadow-lg hover:shadow-xl font-medium text-lg">
                Buy Now
              </button>
            </div>

            {/* Sticky Actions - Mobile */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-gray-100 p-4 z-40 flex gap-3 shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)]">
              <button onClick={handleAddToCart} className="flex-1 bg-white text-[#2c3e50] border border-[#2c3e50] py-3 rounded-xl font-medium text-sm">
                Add to Cart
              </button>
              <button onClick={handleBuyNow} className="flex-[1.5] bg-[#2c3e50] text-white py-3 rounded-xl font-medium text-sm shadow-md">
                Buy Now
              </button>
            </div>

            {/* Additional Details */}
            <div className="grid grid-cols-2 gap-6 mb-12 text-sm text-gray-500">
              <div className="bg-white p-4 rounded-xl border border-gray-100">
                <span className="block text-[#2c3e50] font-medium mb-1">Material</span>
                Premium Stainless Steel
              </div>
              <div className="bg-white p-4 rounded-xl border border-gray-100">
                <span className="block text-[#2c3e50] font-medium mb-1">Durability</span>
                Waterproof & Tarnish Free
              </div>
            </div>

            {/* REVIEWS SECTION */}
            <div>
              <h2 className="text-2xl font-serif text-[#2c3e50] mb-6">Customer Reviews</h2>

              {/* Review Input */}
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm mb-8">
                <h3 className="font-medium text-gray-900 mb-4">Write a Review</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">Rating:</span>
                    <select
                      value={rating}
                      onChange={(e) => setRating(Number(e.target.value))}
                      className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-1 outline-none focus:border-[#2c3e50]"
                    >
                      {[5, 4, 3, 2, 1].map((r) => (
                        <option key={r} value={r}>{r} Stars</option>
                      ))}
                    </select>
                  </div>
                  <textarea
                    rows="3"
                    placeholder="Share your thoughts..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#2c3e50] transition-colors resize-none"
                  ></textarea>
                  <button
                    disabled={reviewLoading}
                    onClick={submitReview}
                    className="bg-[#2c3e50] text-white px-6 py-2 rounded-lg text-sm hover:bg-[#1a252f] transition-all disabled:opacity-50"
                  >
                    {reviewLoading ? "Submitting..." : "Submit Review"}
                  </button>
                </div>
              </div>

              {/* Review List */}
              <div className="space-y-6">
                {Array.isArray(product.reviews) && product.reviews.length > 0 ? (
                  product.reviews.map((rev) => (
                    <div key={rev._id} className="border-b border-gray-100 pb-6 last:border-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-[#2c3e50] font-bold text-sm">
                            {rev.name ? rev.name[0].toUpperCase() : "U"}
                          </div>
                          <div>
                            <p className="font-medium text-[#2c3e50] text-sm">{rev.name || "User"}</p>
                            <div className="flex text-yellow-500 text-xs">
                              {"★".repeat(Number(rev.rating) || 0)}
                              <span className="text-gray-300">
                                {"★".repeat(5 - (Number(rev.rating) || 0))}
                              </span>
                            </div>
                          </div>
                        </div>
                        <span className="text-xs text-gray-400">{new Date(rev.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p className="text-gray-600 text-sm ml-14">{rev.comment}</p>

                      {rev.user === userId && (
                        <button
                          onClick={() => deleteReview(rev._id)}
                          className="ml-14 mt-2 text-xs text-red-400 hover:text-red-600 hover:underline"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 italic">No reviews yet. Be the first to review!</p>
                )}
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
