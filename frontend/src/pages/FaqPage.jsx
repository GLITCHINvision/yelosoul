import { useState } from "react";
import { FaPlus, FaMinus, FaSearch } from "react-icons/fa";

export default function FaqPage() {
  const [openIndex, setOpenIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const allFaqs = [
    {
      category: "Product",
      items: [
        {
          question: "What materials are used in YeloSoul jewelry?",
          answer:
            "All our jewelry is crafted from hypoallergenic stainless steel, 925 sterling silver, and premium gold-plated materials. They are designed for safe, daily wear."
        },
        {
          question: "Is your jewelry waterproof and tarnish-free?",
          answer:
            "Yes, our jewelry is waterproof and tarnish-resistant. However, for long-lasting shine, keep it away from harsh chemicals, perfumes, and excessive humidity."
        },
        {
          question: "Do you provide a warranty?",
          answer:
            "Yes, all products come with a 6-month warranty covering manufacturing defects. Normal wear and tear or accidental damage are not covered."
        },
      ]
    },
    {
      category: "Shipping & Returns",
      items: [
        {
          question: "How long does delivery take?",
          answer:
            "Delivery within India takes 5-7 business days. International orders usually arrive within 10-14 business days, depending on customs clearance."
        },
        {
          question: "Do you offer gift packaging?",
          answer:
            "Absolutely! Every order is shipped in premium, eco-friendly YeloSoul packaging, making it perfect for gifting."
        },
        {
          question: "What is your return policy?",
          answer:
            "We offer a hassle-free 7-day return or exchange policy on unused items in their original packaging. Contact our support team for quick assistance."
        },
        {
          question: "Can I track my order?",
          answer:
            "Yes, you’ll receive a tracking link via email and SMS once your order is shipped."
        },
      ]
    }
  ];

  // Flatten for search if needed, or filter within categories
  const filteredFaqs = allFaqs.map(cat => ({
    ...cat,
    items: cat.items.filter(item =>
      item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(cat => cat.items.length > 0);


  return (
    <div className="min-h-screen bg-[#fcfbf8] py-16 px-4">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-3xl md:text-5xl font-serif text-[#2c3e50] mb-6">
            Frequently Asked Questions
          </h1>
          <p className="text-gray-500 max-w-xl mx-auto mb-8">
            Find answers to common questions about our jewelry, shipping, and returns. Can't find what you're looking for? Contact us.
          </p>

          {/* Search Bar */}
          <div className="relative max-w-md mx-auto">
            <input
              type="text"
              placeholder="Search for answers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-full border border-gray-200 focus:border-[#2c3e50] focus:ring-1 focus:ring-[#2c3e50] shadow-sm outline-none transition-all"
            />
            <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        {/* FAQs */}
        <div className="space-y-12">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((category, catIndex) => (
              <div key={catIndex}>
                <h2 className="text-xl font-serif text-[#2c3e50] mb-6 border-b border-gray-200 pb-2">{category.category}</h2>
                <div className="space-y-4">
                  {category.items.map((faq, index) => {
                    const uniqueIndex = `${catIndex}-${index}`;
                    const isOpen = openIndex === uniqueIndex;

                    return (
                      <div
                        key={index}
                        className={`bg-white rounded-2xl border transition-all duration-300 overflow-hidden ${isOpen ? "border-[#2c3e50] shadow-md" : "border-gray-100 shadow-sm hover:border-gray-300"
                          }`}
                      >
                        <button
                          className="w-full flex justify-between items-center p-6 text-left"
                          onClick={() => toggleFaq(uniqueIndex)}
                        >
                          <span className={`font-medium text-lg ${isOpen ? "text-[#2c3e50]" : "text-gray-700"}`}>
                            {faq.question}
                          </span>
                          <span className={`flex-shrink-0 ml-4 w-8 h-8 flex items-center justify-center rounded-full transition-colors ${isOpen ? "bg-[#2c3e50] text-white" : "bg-gray-100 text-gray-500"}`}>
                            {isOpen ? <FaMinus size={12} /> : <FaPlus size={12} />}
                          </span>
                        </button>

                        <div
                          className={`transition-all duration-300 ease-in-out ${isOpen ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
                            }`}
                        >
                          <p className="px-6 pb-6 text-gray-600 leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-500">No results found for "{searchTerm}"</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
