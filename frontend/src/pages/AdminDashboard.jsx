import { useState } from "react";
import { products as initialProducts } from "../data/products";

export default function AdminDashboard() {
  const [products, setProducts] = useState(initialProducts);
  const [form, setForm] = useState({ name: "", price: "", image: "" });
  const [editId, setEditId] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.price || !form.image) {
      return alert("Please fill all fields!");
    }

    if (editId) {
      setProducts(
        products.map((p) =>
          p._id === editId ? { ...p, ...form, price: Number(form.price) } : p
        )
      );
      setEditId(null);
    } else {
      setProducts([
        ...products,
        {
          _id: String(Date.now()),
          name: form.name,
          price: Number(form.price),
          image: form.image,
        },
      ]);
    }

    setForm({ name: "", price: "", image: "" });
  };

  const handleEdit = (product) => {
    setForm({ name: product.name, price: product.price, image: product.image });
    setEditId(product._id);
  };

  const handleDelete = (id) => {
    if (confirm("Delete this product?")) {
      setProducts(products.filter((p) => p._id !== id));
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-primary mb-6">Admin Dashboard</h1>

      {/* Add/Edit Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow p-4 rounded mb-6 grid grid-cols-1 md:grid-cols-4 gap-3"
      >
        <input
          type="text"
          placeholder="Product Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="border rounded px-3 py-2"
        />
        <input
          type="number"
          placeholder="Price"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          className="border rounded px-3 py-2"
        />
        <input
          type="text"
          placeholder="Image URL"
          value={form.image}
          onChange={(e) => setForm({ ...form, image: e.target.value })}
          className="border rounded px-3 py-2"
        />
        <button
          type="submit"
          className="bg-primary text-white px-4 py-2 rounded hover:opacity-90"
        >
          {editId ? "Update" : "Add"}
        </button>
      </form>

      {/* Products Table */}
      <div className="bg-white shadow rounded p-4">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Image</th>
              <th className="border p-2">Name</th>
              <th className="border p-2">Price</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id} className="text-center">
                <td className="border p-2">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-16 h-16 object-cover mx-auto"
                  />
                </td>
                <td className="border p-2">{product.name}</td>
                <td className="border p-2">${product.price.toFixed(2)}</td>
                <td className="border p-2">
                  <button
                    onClick={() => handleEdit(product)}
                    className="text-blue-500 mr-2 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="text-red-500 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
