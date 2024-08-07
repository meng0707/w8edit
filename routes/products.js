const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth'); // นำเข้า middleware นี้
const Product = require('../models/product');

// GET /api/products
router.get('/', authenticateToken, async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// POST /api/products
router.post('/', authenticateToken, async (req, res) => {
  const { name, price, description } = req.body;
  try {
    const newProduct = new Product({ name, price, description });
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// PUT /api/products/:id
router.put('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { name, price, description } = req.body;
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { name, price, description },
      { new: true }
    );
    if (!updatedProduct) return res.status(404).send('Product not found');
    res.json(updatedProduct);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// DELETE /api/products/:id
router.delete('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) return res.status(404).send('Product not found');
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(400).send(err.message);
  }
});

module.exports = router;
