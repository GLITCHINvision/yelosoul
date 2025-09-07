import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useState, useEffect, useMemo, useRef } from "react";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

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
  const [isPlaying, setIsPlaying] = useState(true);
  const autoPlayRef = useRef(null);

  const goPrev = () => setCurrent((c) => (c - 1 + images.length) % images.length);
  const goNext = () => setCurrent((c) => (c + 1) % images.length);
  const goTo = (idx) => setCurrent(idx);
  const togglePlay = () => setIsPlaying((p) => !p);

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
      const { data } = await axios.get(`${BASE_URL}/api/products/${id}`);
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

  // Slider autoplay
  useEffect(() => {
    if (images.length <= 1 || !isPlaying) return;

    autoPlayRef.current = setInterval(() => {
      setCurrent((c) => (c + 1) % images.length);
    }, 3000);

    return () => clearInterval(autoPlayRef.current);
  }, [images.length, isPlaying]);

  const pauseSlider = () => clearInterval(autoPlayRef.current);
  const resumeSlider = () => {
    if (images.length <= 1 || !isPlaying) return;
    autoPlayRef.current = setInterval(() => {
      setCurrent((c) => (c + 1) % images.length);
    }, 3000);
  };

  const handleAddToCart = () => {
    if (!product) return;
    addToCart({
      _id: product._id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: images[0] || product.image,
    });
    alert(`✅ ${product.name} added to cart`);
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
        `${BASE_URL}/api/products/${id}/reviews`,
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
      await axios.delete(`${BASE_URL}/api/products/${id}/reviews/${reviewId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchProduct();
      alert("🗑 Review deleted");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to delete review");
    }
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;
  if (!product) return null;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* IMAGE SLIDER */}
      <div
        className="relative w-full aspect-[4/3] bg-white rounded-xl border border-gray-100 overflow-hidden group"
        onMouseEnter={pauseSlider}
        onMouseLeave={resumeSlider}
      >
        <img
          src={images[current] || "/placeholder.jpg"}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 ease-in-out"
          style={{ transform: "scale(1.02)" }}
        />

        {/* Prev / Next Buttons */}
        {images.length > 1 && (
          <>
            <button
              onClick={goPrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full w-10 h-10 grid place-items-center shadow opacity-0 group-hover:opacity-100 transition"
            >
              ‹
            </button>
            <button
              onClick={goNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full w-10 h-10 grid place-items-center shadow opacity-0 group-hover:opacity-100 transition"
            >
              ›
            </button>
          </>
        )}

        {/* Play/Pause */}
        {images.length > 1 && (
          <button
            onClick={togglePlay}
            className="absolute top-3 right-3 bg-black/50 text-white px-3 py-1 rounded-full text-sm shadow hover:bg-black/70"
          >
            {isPlaying ? "Pause" : "Play"}
          </button>
        )}

        {/* Dots */}
        {images.length > 1 && (
          <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2">
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={() => goTo(idx)}
                className={`w-2.5 h-2.5 rounded-full transition ${
                  idx === current
                    ? "bg-white shadow ring-1 ring-black/10"
                    : "bg-white/50 hover:bg-white"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="mt-3 grid grid-cols-5 sm:grid-cols-6 md:grid-cols-5 gap-2">
          {images.map((src, idx) => (
            <button
              key={idx}
              onClick={() => goTo(idx)}
              className={`border rounded-lg overflow-hidden transition-transform ${
                idx === current
                  ? "ring-2 ring-primary border-transparent scale-105"
                  : "border-gray-200 hover:scale-105"
              }`}
            >
              <img src={src} className="w-full h-20 object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* PRODUCT INFO & REVIEWS */}
      <div>
        <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
        <p className="text-gray-700 mb-3">{product.description}</p>
        {product.category && (
          <p className="text-sm text-gray-500 mb-2">
            Category: <span className="font-semibold">{product.category}</span>
          </p>
        )}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-yellow-500">
            {"★".repeat(Math.round(product.rating || 0))}
            <span className="text-gray-300">
              {"★".repeat(5 - Math.round(product.rating || 0))}
            </span>
          </span>
          <span className="text-sm text-gray-600">
            {product.rating?.toFixed(1) || "0.0"} ({product.numReviews || 0} reviews)
          </span>
        </div>
        <p className="text-2xl font-semibold text-green-600 mb-4">
          ₹{Number(product.price || 0).toFixed(2)}
        </p>
        <div className="flex flex-wrap gap-3 mb-8">
          <button onClick={handleAddToCart} className="bg-primary text-white px-6 py-3 rounded hover:opacity-90">
            ➕ Add to Cart
          </button>
          <button onClick={handleBuyNow} className="bg-green-600 text-white px-6 py-3 rounded hover:opacity-90">
            🛒 Buy Now
          </button>
        </div>

        {/* REVIEWS */}
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-3">Customer Reviews</h2>
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 mb-5">
            <div className="flex flex-col sm:flex-row gap-3">
              <select
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                className="border rounded px-3 py-2"
              >
                {[5, 4, 3, 2, 1].map((r) => (
                  <option key={r} value={r}>{r} Stars</option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Write a review..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="border rounded px-3 py-2 flex-1"
              />
              <button
                disabled={reviewLoading}
                onClick={submitReview}
                className="bg-primary text-white px-4 py-2 rounded hover:opacity-90 disabled:opacity-60"
              >
                {reviewLoading ? "Submitting..." : "Submit"}
              </button>
            </div>
          </div>

          {Array.isArray(product.reviews) && product.reviews.length > 0 ? (
            <div className="space-y-4">
              {product.reviews.map((rev) => (
                <div key={rev._id} className="border-b pb-3 last:border-none">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{rev.name || "User"}</p>
                    <p className="text-xs text-gray-500">{new Date(rev.createdAt).toLocaleDateString()}</p>
                  </div>
                  <p className="text-yellow-500">
                    {"★".repeat(Number(rev.rating) || 0)}
                    <span className="text-gray-300">
                      {"★".repeat(5 - (Number(rev.rating) || 0))}
                    </span>
                  </p>
                  <p className="text-gray-700">{rev.comment}</p>
                  {rev.user === userId && (
                    <button
                      onClick={() => deleteReview(rev._id)}
                      className="mt-2 text-sm text-red-500 hover:underline"
                    >
                      🗑 Delete
                    </button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No reviews yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}


