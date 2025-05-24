import Transaction from '../models/Transaction.js';
import Product from '../models/Product.js';

export const createTransaction = async (req, res) => {
  try {
    const { productId, type, quantity, note } = req.body;

    const product = await Product.findByPk(productId);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    if (type === 'sale') {
      if (product.quantity < quantity) {
        return res.status(400).json({ error: 'Not enough stock to sell' });
      }
      product.quantity -= quantity;
    } else if (type === 'restock') {
      product.quantity += quantity;
    } else {
      return res.status(400).json({ error: 'Invalid transaction type' });
    }

    await product.save();
    const transaction = await Transaction.create({ productId, type, quantity, note });

    res.status(201).json(transaction);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.findAll({ order: [['createdAt', 'DESC']], limit: 50 });
    res.json(transactions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
};
