import { useState, useEffect } from "react";
import axios from "axios";
import { Plus, Trash2, Edit2, X, UploadCloud, Search } from "lucide-react";
import { toast } from "react-hot-toast";

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);

  // Form State
  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
    image: "",
    countInStock: "",
  });

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/api/products");
      setProducts(data?.products || []);
    } catch (err) {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.price || !form.image) {
      return toast.error("Please fill required fields (Name, Price, Image)");
    }

    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const productData = {
        ...form,
        price: Number(form.price),
        countInStock: Number(form.countInStock || 0),
      };

      if (editId) {
        // Update
        await axios.put(`http://localhost:5000/api/products/${editId}`, productData, config);
        toast.success("Product updated successfully");
      } else {
        // Create
        await axios.post("http://localhost:5000/api/products", productData, config);
        toast.success("Product created successfully");
      }

      closeModal();
      fetchProducts();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Operation failed");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Product deleted");
      fetchProducts();
    } catch (err) {
      toast.error("Failed to delete product");
    }
  };

  const openEditModal = (product) => {
    setForm({
      name: product.name,
      price: product.price,
      description: product.description || "",
      category: product.category || "",
      image: product.image,
      countInStock: product.countInStock || 0,
    });
    setEditId(product._id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setForm({ name: "", price: "", description: "", category: "", image: "", countInStock: "" });
    setEditId(null);
    setIsModalOpen(false);
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#fcfbf8] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-serif text-[#2c3e50] mb-2">Product Management</h1>
            <p className="text-gray-500">Manage your collection and inventory.</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-[#2c3e50] text-white px-6 py-3 rounded-full hover:bg-[#1a252f] transition-all shadow-md group"
          >
            <Plus size={20} className="group-hover:rotate-90 transition-transform" /> Add Product
          </button>
        </div>

        {/* Search & Stats */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8 flex flex-col md:flex-row gap-6 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search products by name or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-1 focus:ring-[#2c3e50] focus:border-[#2c3e50] outline-none"
            />
          </div>
          <div className="flex gap-8 text-sm text-gray-600">
            <div className="text-center">
              <span className="block text-2xl font-serif text-[#2c3e50]">{products.length}</span>
              Total Items
            </div>
            <div className="text-center">
              <span className="block text-2xl font-serif text-[#2c3e50]">
                {products.filter(p => p.countInStock > 0).length}
              </span>
              In Stock
            </div>
          </div>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="text-center py-20 text-gray-400">Loading inventory...</div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
            <p className="text-gray-500 mb-4">No products found.</p>
            <button onClick={() => setSearchTerm("")} className="text-[#2c3e50] underline">Clear Search</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
              <div key={product._id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-md transition-all">
                <div className="relative h-48 overflow-hidden bg-gray-50">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => openEditModal(product)} className="p-2 bg-white rounded-full shadow hover:text-blue-600 transition-colors">
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => handleDelete(product._id)} className="p-2 bg-white rounded-full shadow hover:text-red-500 transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                  {product.countInStock === 0 && (
                    <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                      <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Out of Stock</span>
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-serif text-lg text-[#2c3e50] line-clamp-1">{product.name}</h3>
                    <span className="font-semibold text-[#2c3e50]">₹{product.price}</span>
                  </div>
                  <p className="text-sm text-gray-500 line-clamp-2 mb-4 h-10">{product.description}</p>
                  <div className="flex items-center justify-between text-xs text-gray-400 border-t pt-3">
                    <span className="uppercase tracking-wider">{product.category}</span>
                    <span>Stock: {product.countInStock}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-scaleIn">
            <div className="p-6 border-b flex justify-between items-center bg-gray-50">
              <h2 className="text-xl font-serif text-[#2c3e50]">{editId ? "Edit Product" : "Add New Product"}</h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Product Name *</label>
                  <input
                    required
                    type="text"
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-1 focus:ring-[#2c3e50] outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Price (₹) *</label>
                  <input
                    required
                    type="number"
                    value={form.price}
                    onChange={e => setForm({ ...form, price: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-1 focus:ring-[#2c3e50] outline-none"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Image URL *</label>
                <div className="flex gap-2">
                  <input
                    required
                    type="text"
                    value={form.image}
                    onChange={e => setForm({ ...form, image: e.target.value })}
                    className="flex-1 px-4 py-2 rounded-lg border border-gray-200 focus:ring-1 focus:ring-[#2c3e50] outline-none"
                    placeholder="https://..."
                  />
                  {form.image && (
                    <img src={form.image} alt="Preview" className="w-10 h-10 rounded object-cover border" />
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Category</label>
                  <input
                    type="text"
                    value={form.category}
                    onChange={e => setForm({ ...form, category: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-1 focus:ring-[#2c3e50] outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Stock Count</label>
                  <input
                    type="number"
                    value={form.countInStock}
                    onChange={e => setForm({ ...form, countInStock: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-1 focus:ring-[#2c3e50] outline-none"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Description</label>
                <textarea
                  rows="4"
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-1 focus:ring-[#2c3e50] outline-none resize-none"
                ></textarea>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={closeModal} className="px-6 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-600 font-medium transition-colors">
                  Cancel
                </button>
                <button type="submit" className="px-6 py-2 rounded-lg bg-[#2c3e50] text-white font-medium hover:bg-[#1a252f] transition-colors shadow-lg">
                  {editId ? "Update Product" : "Create Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
