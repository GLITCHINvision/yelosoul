export default function ShippingInfoPage() {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4 text-gray-900">
        Shipping Information
      </h1>

      <p className="text-sm text-gray-700 mb-4 leading-relaxed">
        We proudly deliver across <strong>India</strong> and select{" "}
        <strong>international locations</strong>, ensuring your{" "}
        <strong>YeloSoul</strong> jewelry reaches you safely and on time.
      </p>

      {/* Domestic Shipping */}
      <h2 className="text-lg font-semibold mt-6 mb-2 text-gray-800">
        Domestic Shipping (India)
      </h2>
      <ul className="list-disc ml-6 text-sm space-y-2 text-gray-700">
        <li>
          Standard Shipping: <strong>₹50</strong>{" "}
          <span className="text-green-600 font-medium">
            (Free for orders above ₹999)
          </span>
        </li>
        <li>Estimated Delivery: 5-7 business days</li>
        <li>Orders are processed within 24-48 hours after payment confirmation</li>
      </ul>

      {/* International Shipping */}
      <h2 className="text-lg font-semibold mt-6 mb-2 text-gray-800">
        International Shipping
      </h2>
      <ul className="list-disc ml-6 text-sm space-y-2 text-gray-700">
        <li>
          Shipping rates vary by location (calculated at checkout)
        </li>
        <li>Estimated Delivery: 10-14 business days</li>
        <li>
          Customs duties or import taxes, if applicable, are the responsibility
          of the buyer
        </li>
      </ul>

      {/* Tracking Info */}
      <h2 className="text-lg font-semibold mt-6 mb-2 text-gray-800">
        Order Tracking
      </h2>
      <p className="text-sm text-gray-700 leading-relaxed">
        Once your order is shipped, you will receive a tracking link via{" "}
        <strong>email</strong> and <strong>SMS</strong>. You can also track it
        anytime from the{" "}
        <strong className="text-gray-900">“My Orders”</strong> section of your
        account.
      </p>

      {/* Support Info */}
      <div className="bg-gray-50 border-l-4 border-blue-500 p-4 mt-6 rounded-md text-sm text-gray-700">
        <strong>Need help with shipping?</strong> Email us at{" "}
        <a
          href="mailto:support@yelosoul.com?subject=Shipping%20Query"
          className="text-blue-600 font-medium hover:underline"
        >
          support@yelosoul.com
        </a>{" "}
        and our team will respond within 24 hours.
      </div>
    </div>
  );
}
