import { useState } from "react";

export default function FaqPage() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqs = [
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
      question: "What is your return or exchange policy?",
      answer:
        "We offer a hassle-free 7-day return or exchange policy on unused items in their original packaging. Contact our support team for quick assistance."
    },
    {
      question: "Do you provide a warranty on jewelry?",
      answer:
        "Yes, all products come with a 6-month warranty covering manufacturing defects. Normal wear and tear or accidental damage are not covered."
    },
    {
      question: "Can I track my order?",
      answer:
        "Yes, you’ll receive a tracking link via email and SMS once your order is shipped."
    },
    {
      question: "Do you ship internationally?",
      answer:
        "Yes, we ship worldwide with reliable courier partners. Shipping charges vary based on location."
    }
  ];

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-900">
        Frequently Asked Questions
      </h1>
      {faqs.map((faq, index) => (
        <div
          key={index}
          className="mb-3 border rounded-lg shadow-sm hover:shadow-md transition-shadow"
        >
          <button
            className="w-full flex justify-between items-center p-4 text-left font-semibold text-gray-800 hover:text-blue-600"
            onClick={() => toggleFaq(index)}
          >
            {faq.question}
            <span className="text-gray-500">
              {openIndex === index ? "−" : "+"}
            </span>
          </button>
          {openIndex === index && (
            <p className="p-4 pt-0 text-gray-700 text-sm leading-relaxed">
              {faq.answer}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
