const Client = require("../models/Client");

// GET all clients
exports.getClients = async (req, res) => {
  try {
    const clients = await Client.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(clients);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CREATE client
exports.createClient = async (req, res) => {
  try {
    const { name, email, company, phone, notes } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }

    const client = await Client.create({
      user: req.user._id,
      name,
      email,
      company,
      phone,
      notes
    });

    res.status(201).json(client);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE client
exports.deleteClient = async (req, res) => {
  try {
    const client = await Client.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    await client.deleteOne();

    res.json({ message: "Client deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// UPDATE client
exports.updateClient = async (req, res) => {
  try {
    const client = await Client.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    const updatedClient = await Client.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updatedClient);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};