import React, { useEffect, useState, useRef } from "react";
import { API_URL } from "../config";
import axios from "axios";
import ProductCard from "../components/ProductCard";

const OccasionPage = () => {
  const [occasions, setOccasions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("");
  const sectionRefs = useRef({});

  useEffect(() => {
    const fetchOccasions = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/occasions`);
        const occasionsData = Array.isArray(data.occasions) ? data.occasions : [];
        setOccasions(occasionsData);
        if (occasionsData.length > 0) {
          setActiveTab(occasionsData[0]._id);
        }
      } catch (error) {
        console.error(" Error fetching occasions:", error);
        setOccasions([]);
      } finally {
        setLoading(false);
      }
    };
    fetchOccasions();
  }, []);

  // Scroll to section when tab is clicked
  const scrollToSection = (id) => {
    setActiveTab(id);
    const element = sectionRefs.current[id];
    if (element) {
      const offset = 150; // Offset for sticky header
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] bg-[#fcfbf8]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#2c3e50] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg text-[#2c3e50] animate-pulse tracking-wide font-serif">
            Curating collections...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fcfbf8]">
      <div className="relative bg-[#fcfbf8] text-[#2c3e50] overflow-hidden mb-4 md:mb-8 border-b border-[#f0f0f0]">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="relative px-6 py-10 md:py-24 text-center">
          <h1 className="text-3xl md:text-6xl font-serif text-[#1a1a1a] mb-2 md:mb-3">
            Shop by Occasion
          </h1>
          <p className="text-[10px] md:text-xl opacity-70 font-light tracking-[0.2em] md:tracking-widest uppercase max-w-2xl mx-auto">
            Thoughtful gifts for every special moment
          </p>
        </div>
      </div>

      {occasions.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-500 text-lg font-light">
            No occasions available right now. Check back soon!
          </p>
        </div>
      ) : (
        <>
          {/* Sticky Navigation Tabs */}
          <div className="sticky top-[72px] z-30 bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-100 mb-8 md:mb-12">
            <div className="max-w-7xl mx-auto px-4">
              <div className="flex overflow-x-auto scrollbar-hide py-3 md:py-4 gap-3 md:gap-4 md:justify-center">
                {occasions.map((occasion) => (
                  <button
                    key={occasion._id}
                    onClick={() => scrollToSection(occasion._id)}
                    className={`whitespace-nowrap px-5 py-1.5 md:px-6 md:py-2 rounded-full text-[10px] md:text-sm uppercase tracking-wider transition-all duration-300 ${activeTab === occasion._id
                      ? "bg-[#2c3e50] text-white shadow-md transform scale-105"
                      : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                      }`}
                  >
                    {occasion.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Occasion Sections */}
          <div className="max-w-7xl mx-auto px-4 pb-20 space-y-16 md:space-y-24">
            {occasions.map((occasion) => (
              <div
                key={occasion._id}
                ref={(el) => (sectionRefs.current[occasion._id] = el)}
                className="scroll-mt-32"
              >
                {/* Section Header */}
                <div className="text-center mb-10 px-4">
                  <h2 className="text-2xl md:text-4xl font-serif text-[#2c3e50] mb-3 relative inline-block">
                    {occasion.name}
                    <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-[#e0e0e0] rounded-full"></span>
                  </h2>
                  {occasion.description && (
                    <p className="text-gray-500 font-light max-w-2xl mx-auto mt-4">
                      {occasion.description}
                    </p>
                  )}
                </div>

                {/* Product Grid */}
                {occasion.products?.length > 0 ? (
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-10">
                    {occasion.products.map((product) => (
                      <ProductCard key={product._id} product={product} />
                    ))}
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-xl p-10 text-center border border-dashed border-gray-200">
                    <p className="text-gray-400 font-light">
                      Collections for this occasion are being curated.
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default OccasionPage;
