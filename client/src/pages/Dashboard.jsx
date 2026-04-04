import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import API from "../services/api";
import toast from "react-hot-toast";

const Dashboard = () => {
  const { user, logout } = useAuth();

  const [clients, setClients] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    notes: ""
  });

  // Fetch clients
  const fetchClients = async () => {
    try {
      const { data } = await API.get("/clients");
      setClients(data);
    } catch (error) {
      toast.error("Failed to fetch clients");
    }
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

    try {
      if (editingId) {
        await API.put(`/clients/${editingId}`, form);
        toast.success("Client updated successfully");
        setEditingId(null);
      } else {
        await API.post("/clients", form);
        toast.success("Client added successfully");
      }

      setForm({
        name: "",
        email: "",
        company: "",
        phone: "",
        notes: ""
      });

      fetchClients();
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  // Delete client
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this client?");

    if (!confirmDelete) return;

    try {
      await API.delete(`/clients/${id}`);
      toast.success("Client deleted successfully");
      fetchClients();
    } catch (error) {
      toast.error("Failed to delete client");
    }
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

  // Search filter
  const filteredClients = clients.filter((client) =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.company?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">ClientOrbit</h1>
            <p className="text-gray-600">Welcome back, {user?.name}</p>
          </div>

          <button
            onClick={logout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
          >
            Logout
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 rounded-xl shadow">
            <h3 className="text-gray-500">Total Clients</h3>
            <p className="text-2xl font-bold">{clients.length}</p>
          </div>

          <div className="bg-white p-4 rounded-xl shadow">
            <h3 className="text-gray-500">Active Projects</h3>
            <p className="text-2xl font-bold">0</p>
          </div>

          <div className="bg-white p-4 rounded-xl shadow">
            <h3 className="text-gray-500">Revenue</h3>
            <p className="text-2xl font-bold">₹0</p>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white p-6 rounded-xl shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">
            {editingId ? "Edit Client" : "Add New Client"}
          </h2>

          <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
            <input
              name="name"
              placeholder="Client Name"
              value={form.name}
              onChange={handleChange}
              className="border p-3 rounded-lg"
            />

            <input
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className="border p-3 rounded-lg"
            />

            <input
              name="company"
              placeholder="Company"
              value={form.company}
              onChange={handleChange}
              className="border p-3 rounded-lg"
            />

            <input
              name="phone"
              placeholder="Phone"
              value={form.phone}
              onChange={handleChange}
              className="border p-3 rounded-lg"
            />

            <input
              name="notes"
              placeholder="Notes"
              value={form.notes}
              onChange={handleChange}
              className="border p-3 rounded-lg md:col-span-2"
            />

            <button className="bg-black hover:bg-gray-800 text-white py-3 rounded-lg md:col-span-2">
              {editingId ? "Update Client" : "Add Client"}
            </button>
          </form>
        </div>

        {/* Client List */}
        <div className="bg-white p-6 rounded-xl shadow">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 gap-3">
            <h2 className="text-xl font-semibold">Clients</h2>

            <input
              type="text"
              placeholder="Search by name, email, or company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border p-2 rounded-lg w-full md:w-80"
            />
          </div>

          {filteredClients.length === 0 ? (
            <p className="text-gray-500">No matching clients found</p>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {filteredClients.map((client) => (
                <div
                  key={client._id}
                  className="border rounded-xl p-4 flex justify-between items-center hover:shadow-md transition"
                >
                  <div>
                    <p className="font-bold text-lg">{client.name}</p>
                    <p className="text-sm text-gray-600">{client.email}</p>
                    <p className="text-sm">{client.company}</p>
                    <p className="text-sm text-gray-500">{client.phone}</p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(client)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(client._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
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