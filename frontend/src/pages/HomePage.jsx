import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { ArrowRight, Star, ShieldCheck, Truck, Search, ChevronDown, Filter, X, Check } from "lucide-react";

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Smart Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isSortOpen, setIsSortOpen] = useState(false);

  // Constants
  const categories = ["All", "Necklaces", "Rings", "Earrings", "Bracelets", "Luxury Sets"];
  const sortOptions = [
    { value: "newest", label: "Newest Collections" },
    { value: "price-low-high", label: "Price: Low to High" },
    { value: "price-high-low", label: "Price: High to Low" },
    { value: "rating-high-low", label: "Rating: High to Low" },
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Fetch ALL products (up to 1000) so client-side filtering works on the whole catalog
        const { data } = await axios.get("http://localhost:5000/api/products?limit=1000");
        setProducts(data?.products || []);
      } catch (err) {
        setError("Failed to load collections.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Helper to safely parse price (handles "$1,200", "1200", number)
  const getPrice = (p) => {
    if (!p || p.price === undefined || p.price === null) return 0;
    if (typeof p.price === 'number') return p.price;
    if (typeof p.price === 'string') {
      const cleanString = p.price.replace(/[^0-9.]/g, '');
      return parseFloat(cleanString) || 0;
    }
    return 0;
  };

  // Helper to safely get rating
  const getRating = (p) => {
    if (!p || p.rating === undefined || p.rating === null) return 0;
    return parseFloat(p.rating) || 0;
  };

  // Helper for fuzzy category matching (handles singles/plurals: "Rings" matches "Ring")
  const normalize = (str) => {
    if (!str || typeof str !== 'string') return "";
    return str.toLowerCase().trim().replace(/s$/, "");
  };

  const filteredProducts = products.filter(p => {
    // 1. Search Filter
    const searchLower = searchTerm.toLowerCase();
    const nameMatch = p.name?.toLowerCase().includes(searchLower);
    const catMatch = p.category?.toLowerCase().includes(searchLower);
    const matchesSearch = !searchTerm || nameMatch || catMatch;

    // 2. Category Filter (Robust Matching)
    let matchesCategory = true;
    if (selectedCategory !== "All") {
      const pCat = normalize(p.category);
      const selCat = normalize(selectedCategory);
      // Check for exact match, substring match, or plural/singular match
      matchesCategory = pCat.includes(selCat) || selCat.includes(pCat);
    }

    return matchesSearch && matchesCategory;
  }).sort((a, b) => {
    // 3. Sorting
    if (sortBy === "price-low-high") return getPrice(a) - getPrice(b);
    if (sortBy === "price-high-low") return getPrice(b) - getPrice(a);
    if (sortBy === "rating-high-low") return getRating(b) - getRating(a);
    if (sortBy === "rating-low-high") return getRating(a) - getRating(b);
    return 0;
  });

  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center bg-[#fcfbf8]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1a1a1a]"></div>
      <p className="mt-4 font-serif text-lg tracking-widest animate-pulse">Curating Collections...</p>
    </div>
  );

  return (
    <div className="bg-[#fcfbf8] min-h-screen">

      {/* 1. HERO SECTION */}
      <section className="relative h-[85vh] w-full flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
            alt="Luxury Jewelry"
            className="w-full h-full object-cover scale-105 animate-[zoomIn_20s_infinite_alternate]"
          />
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 text-center text-white px-6 max-w-5xl mx-auto animate-fadeIn mt-10">
          <div className="inline-block border-b border-white/30 pb-2 mb-6">
            <p className="text-xs md:text-sm tracking-[0.4em] uppercase opacity-90 font-light">
              Est. 2024 • Handcrafted in India
            </p>
          </div>
          <h1 className="text-6xl md:text-8xl font-serif mb-6 leading-tight drop-shadow-lg">
            Adorn Your Soul
          </h1>
          <p className="text-lg md:text-xl font-light mb-10 max-w-2xl mx-auto opacity-95 leading-relaxed tracking-wide">
            Jewelry that speaks to your essence. Minimalist designs curated for the modern muse.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link to="/occasions" className="group bg-white text-[#1a1a1a] px-10 py-4 rounded-none min-w-[200px] font-medium hover:bg-[#f4f1ea] transition-all text-sm tracking-[0.2em] uppercase duration-300">
              Shop Collections
            </Link>
          </div>

          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-70">
            <ChevronDown size={24} />
          </div>
        </div>
      </section>

      {/* 2. SMART SEARCH & FILTERS */}
      <section className="py-24 px-6 max-w-[1400px] mx-auto min-h-[60vh]">
        <div className="flex flex-col items-center mb-12 space-y-4">
          <span className="text-[#c4a287] tracking-[0.2em] text-xs font-bold uppercase">Discover</span>
          <h2 className="text-4xl md:text-5xl font-serif text-[#1a1a1a]">Curated Selections</h2>

          {/* Main Search Bar */}
          <div className="w-full max-w-lg mt-8 relative group z-20">
            <div className="absolute inset-0 bg-[#c4a287]/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <input
              type="text"
              placeholder="Search for necklaces, rings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="relative w-full pl-14 pr-6 py-4 rounded-full border border-gray-200 bg-white/80 backdrop-blur-md focus:border-[#1a1a1a] focus:ring-0 outline-none transition-all shadow-sm group-hover:shadow-lg font-light text-[#1a1a1a]"
            />
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-[#1a1a1a] transition-colors duration-300" size={20} />
          </div>
        </div>

        {/* ⚡ SMART FILTER BAR */}
        {/* ⚡ STANDARD FILTER BAR */}
        <div className="sticky top-4 z-30 mb-12 bg-[#fcfbf8]/95 backdrop-blur-md py-6 border-y border-gray-100">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 max-w-7xl mx-auto px-6">

            {/* Filter Controls Group */}
            <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">

              {/* Category Dropdown */}
              <div className="relative group">
                <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-[#1a1a1a] transition-colors" size={16} />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="pl-12 pr-10 py-3 bg-white border border-gray-200 text-sm tracking-wide text-[#1a1a1a] focus:ring-0 focus:border-[#c4a287] outline-none appearance-none min-w-[180px] cursor-pointer"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
              </div>

              {/* Sort Dropdown */}
              <div className="relative group">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="pl-5 pr-10 py-3 bg-white border border-gray-200 text-sm tracking-wide text-[#1a1a1a] focus:ring-0 focus:border-[#c4a287] outline-none appearance-none min-w-[200px] cursor-pointer"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
              </div>

            </div>

            {/* Active Filters / Clear */}
            {(selectedCategory !== "All" || searchTerm) && (
              <button
                onClick={() => { setSelectedCategory("All"); setSearchTerm(""); }}
                className="text-xs uppercase tracking-widest text-[#1a1a1a] border-b border-[#1a1a1a] hover:text-[#c4a287] hover:border-[#c4a287] transition-all pb-1"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16">
            {filteredProducts.slice(0, 12).map((product) => (
              <div key={product._id} className="group fade-in-up">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-gray-50 rounded-lg max-w-2xl mx-auto">
            <p className="text-gray-500 font-serif italic text-lg mb-4">No precious finds with these criteria.</p>
            <p className="text-xs text-gray-400 uppercase tracking-widest mb-6">Try adjusting your filters or search terms</p>
            <button onClick={() => { setSearchTerm(""); setSelectedCategory("All"); }} className="bg-[#1a1a1a] text-white px-8 py-3 text-xs tracking-widest uppercase hover:bg-[#c4a287] transition-colors">
              Clear All Filters
            </button>
          </div>
        )}

        <div className="text-center mt-20">
          <Link to="/products" className="inline-flex items-center gap-3 text-[#1a1a1a] hover:text-[#c4a287] transition-colors border-b border-[#1a1a1a] hover:border-[#c4a287] pb-1 uppercase text-xs tracking-[0.2em] font-bold py-2">
            View All Products <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* 3. BRAND STORY / TRUST */}
      <section className="bg-[#1a1a1a] text-white py-24 px-6 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-[#c4a287] rounded-full mix-blend-overlay filter blur-[100px] opacity-20"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#c4a287] rounded-full mix-blend-overlay filter blur-[100px] opacity-10"></div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left relative z-10">
          <div className="flex flex-col items-center md:items-start gap-6 p-8 border border-white/10 hover:border-white/20 transition-colors duration-300 rounded-none bg-white/5 backdrop-blur-sm group hover:-translate-y-2 transform">
            <Star className="text-[#c4a287]" size={32} strokeWidth={1} />
            <div>
              <h3 className="text-2xl font-serif mb-3">Premium Global Quality</h3>
              <p className="opacity-60 text-sm leading-relaxed font-light tracking-wide">
                Crafted with precision using ethically sourced materials. Every piece is a testament to lasting beauty.
              </p>
            </div>
          </div>
          <div className="flex flex-col items-center md:items-start gap-6 p-8 border border-white/10 hover:border-white/20 transition-colors duration-300 rounded-none bg-white/5 backdrop-blur-sm group hover:-translate-y-2 transform">
            <Truck className="text-[#c4a287]" size={32} strokeWidth={1} />
            <div>
              <h3 className="text-2xl font-serif mb-3">Secure & Fast Shipping</h3>
              <p className="opacity-60 text-sm leading-relaxed font-light tracking-wide">
                Fast and insured delivery across India. We ensure your treasures arrive safely at your doorstep.
              </p>
            </div>
          </div>
          <div className="flex flex-col items-center md:items-start gap-6 p-8 border border-white/10 hover:border-white/20 transition-colors duration-300 rounded-none bg-white/5 backdrop-blur-sm group hover:-translate-y-2 transform">
            <ShieldCheck className="text-[#c4a287]" size={32} strokeWidth={1} />
            <div>
              <h3 className="text-2xl font-serif mb-3">Lifetime Asset Support</h3>
              <p className="opacity-60 text-sm leading-relaxed font-light tracking-wide">
                We stand by our creations. Enjoy dedicated support and easy returns on all your purchases.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. NEWSLETTER / CTA */}
      <section className="py-32 px-6 text-center max-w-5xl mx-auto bg-[#f4f1ea]">
        <h2 className="text-5xl md:text-6xl font-serif text-[#1a1a1a] mb-6">Join the Inner Circle</h2>
        <p className="text-gray-600 mb-12 text-lg font-light max-w-xl mx-auto">
          Be the first to see our new drops and receive exclusive offers directly to your inbox.
        </p>
        <form onSubmit={(e) => e.preventDefault()} className="flex flex-col sm:flex-row gap-0 max-w-lg mx-auto shadow-2xl">
          <input
            type="email"
            placeholder="Your email address"
            className="flex-1 px-8 py-5 border-none bg-white focus:ring-0 text-[#1a1a1a] placeholder:text-gray-400 font-light"
          />
          <button className="bg-[#1a1a1a] text-white px-10 py-5 font-medium hover:bg-[#c4a287] transition-all text-xs tracking-[0.2em] uppercase duration-300">
            Subscribe
          </button>
        </form>
      </section>

    </div>
  );
}
