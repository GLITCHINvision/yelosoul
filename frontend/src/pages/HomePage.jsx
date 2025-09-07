import { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "../components/ProductCard";
import { useCart } from "../context/CartContext";

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("");
  const [bestDealsOnly, setBestDealsOnly] = useState(false);

  const { addToCart } = useCart();

  //  Fetch Products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/api/products");
        setProducts(data?.products || []);
      } catch (err) {
        console.error(" Error fetching products:", err);
        setError("Failed to load products. Please refresh.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  //  Filter Logic
  const filteredProducts = products.filter((p) => {
    const matchesCategory =
      category === "all" ||
      (p.category && p.category.toLowerCase() === category.toLowerCase());

    const matchesSearch = p.name?.toLowerCase().includes(search.toLowerCase());
    const matchesDeals = !bestDealsOnly || Number(p.discount || 0) >= 20;

    return matchesCategory && matchesSearch && matchesDeals;
  });

  //  Sorting
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sort === "low-high") return a.price - b.price;
    if (sort === "high-low") return b.price - a.price;
    if (sort === "rating") return (b.rating || 0) - (a.rating || 0);
    if (sort === "discount") return (b.discount || 0) - (a.discount || 0);
    return 0;
  });

  const clearFilters = () => {
    setSearch("");
    setCategory("all");
    setSort("");
    setBestDealsOnly(false);
  };

  //  Handle Add to Cart
  const handleAddToCart = (product) => {
    addToCart({
      _id: product._id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image,
    });
    alert(` ${product.name} added to cart`);
  };

  if (loading) {
    return (
      <div className="text-center text-gray-600 py-10 animate-pulse">
        Loading products...
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500 py-10">{error}</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 bg-gradient-to-br from-[#fcfbf8] to-[#f7f9f9] rounded-xl shadow-sm">
      {/*  Hero Section */}
      <div className="relative bg-gradient-to-r from-[#fefaf5] to-[#f6fdfa] text-[#4a8577] rounded-3xl overflow-hidden mb-10 shadow-md border border-[#eaeaea]">
        <div className="p-10 text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-wide mb-3 font-serif">
            🌸 YeloSoul Collections
          </h1>
          <p className="text-md sm:text-lg opacity-80 italic">
            Soft, Trendy & Minimal Jewelry Loved by Gen-Z
          </p>
        </div>
      </div>

      {/*  Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
        <input
          type="text"
          placeholder="🔍 Search your favorite jewelry..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-[#e0e0e0] bg-white rounded-lg px-4 py-2 w-full sm:w-1/3 focus:ring-2 focus:ring-[#c4e3dc] outline-none shadow-sm"
        />

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="border border-[#e0e0e0] bg-white rounded-lg px-4 py-2 w-full sm:w-48 focus:ring-2 focus:ring-[#c4e3dc] outline-none shadow-sm"
        >
          <option value="">Sort By</option>
          <option value="low-high">Price: Low to High</option>
          <option value="high-low">Price: High to Low</option>
          <option value="rating">Highest Rating</option>
          <option value="discount">Biggest Discount</option>
        </select>
      </div>

      {/*  Deals + Reset */}
      {/* <div className="flex flex-wrap items-center gap-3 mb-6">
        <label className="flex items-center gap-2 text-[#4a8577] text-sm cursor-pointer">
          <input
            type="checkbox"
            checked={bestDealsOnly}
            onChange={() => setBestDealsOnly(!bestDealsOnly)}
            className="accent-[#4a8577]"
          />
          Show Best Deals Only (20%+ Off)
        </label>
        <button
          onClick={clearFilters}
          className="text-sm bg-[#fef3e6] text-[#4a8577] px-3 py-1 rounded hover:bg-[#fde8d6] shadow-sm transition"
        >
          Reset Filters 
        </button>
      </div> */}

      {/*  Product Grid */}
      <h2 className="text-2xl font-bold text-[#4a8577] mb-5 flex items-center gap-2">
        ✨ Featured Products
      </h2>
      {sortedProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {sortedProducts.map((product, index) => (
            <div
              key={product._id}
              className="relative animate-fadeIn transition-all duration-300 group"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <span className="absolute top-2 left-2 bg-[#fef3e6] text-[#4a8577] text-xs font-bold px-2 py-1 rounded">
                {index % 2 === 0 ? "New Arrival" : "Best Seller"}
              </span>

              <ProductCard product={product} />

              {/*  Add to Cart Button */}
              <button
                onClick={() => handleAddToCart(product)}
                className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-[#4a8577] text-white text-xs px-3 py-1 rounded opacity-0 group-hover:opacity-100 transition"
              >
                ➕ Add to Cart
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No products found.</p>
      )}
    </div>
  );
}








