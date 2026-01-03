import React from "react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error(" Error Boundary Caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[50vh] flex flex-col items-center justify-center text-center px-4">
          <div className="text-6xl mb-4">😵</div>
          <h2 className="text-2xl font-serif text-[#2c3e50] mb-2">Oops! Something went wrong.</h2>
          <p className="text-gray-500 mb-6 max-w-md">
            We encountered an unexpected error. Please try refreshing the page.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-[#2c3e50] text-white px-6 py-2 rounded-full hover:bg-[#1a252f] transition"
          >
            Refresh Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
