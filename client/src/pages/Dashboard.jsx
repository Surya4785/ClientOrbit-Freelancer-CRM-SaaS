import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import API from "../services/api";

const Dashboard = () => {
  const { user, logout } = useAuth();

  const [clients, setClients] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    notes: ""
  });

  // Fetch clients
  const fetchClients = async () => {
    const { data } = await API.get("/clients");
    setClients(data);
  };

  useEffect(() => {
    fetchClients();
  }, []);

  // Handle input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Add or Update client
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editingId) {
      await API.put(`/clients/${editingId}`, form);
      setEditingId(null);
    } else {
      await API.post("/clients", form);
    }

    setForm({
      name: "",
      email: "",
      company: "",
      phone: "",
      notes: ""
    });

    fetchClients();
  };

  // Delete client
  const handleDelete = async (id) => {
    await API.delete(`/clients/${id}`);
    fetchClients();
  };

  // Edit client
  const handleEdit = (client) => {
    setForm({
      name: client.name || "",
      email: client.email || "",
      company: client.company || "",
      phone: client.phone || "",
      notes: client.notes || ""
    });

    setEditingId(client._id);
  };

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">ClientOrbit Dashboard</h1>
            <p className="text-gray-600">Welcome, {user?.name}</p>
          </div>

          <button
            onClick={logout}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>

        {/* Add/Edit Client Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white p-4 rounded shadow mb-6 grid md:grid-cols-2 gap-4"
        >
          <input
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            className="border p-2 rounded"
          />
          <input
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="border p-2 rounded"
          />
          <input
            name="company"
            placeholder="Company"
            value={form.company}
            onChange={handleChange}
            className="border p-2 rounded"
          />
          <input
            name="phone"
            placeholder="Phone"
            value={form.phone}
            onChange={handleChange}
            className="border p-2 rounded"
          />
          <input
            name="notes"
            placeholder="Notes"
            value={form.notes}
            onChange={handleChange}
            className="border p-2 rounded col-span-2"
          />

          <button className="bg-black text-white p-2 rounded col-span-2">
            {editingId ? "Update Client" : "Add Client"}
          </button>
        </form>

        {/* Client List */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Your Clients</h2>

          {clients.length === 0 ? (
            <p>No clients yet</p>
          ) : (
            <div className="space-y-3">
              {clients.map((client) => (
                <div
                  key={client._id}
                  className="border p-3 rounded flex justify-between items-center"
                >
                  <div>
                    <p className="font-bold">{client.name}</p>
                    <p className="text-sm text-gray-600">{client.email}</p>
                    <p className="text-sm">{client.company}</p>
                    <p className="text-sm">{client.phone}</p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(client)}
                      className="bg-blue-500 text-white px-3 py-1 rounded"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(client._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Dashboard;