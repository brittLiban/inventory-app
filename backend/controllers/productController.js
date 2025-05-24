import Product from '../models/Product.js';

export const getProducts = async (req, res) => {
    const products = await Product.findAll();
    res.json(products);
};

export const createProduct = async (req, res) => {
    const { name, quantity, price, description, category, subtype } = req.body;
    const product = await Product.create({ name, quantity, price, description, category, subtype });

    res.status(201).json(product);
};

export const updateProduct = async (req, res) => {
    const { id } = req.params;
    const { name, quantity, price, description, category, subtype } = req.body;
    const product = await Product.findByPk(id);
    if (!product) return res.status(404).json({ error: 'Not found' });

    product.name = name;
    product.quantity = quantity;
    product.price = price;
    product.description = description;
    product.category = category;
    product.subtype = subtype;
    await product.save();

    res.json(product);
};

export const deleteProduct = async (req, res) => {
    const { id } = req.params;
    const product = await Product.findByPk(id);
    if (!product) return res.status(404).json({ error: 'Not found' });

    await product.destroy();
    res.json({ message: 'Deleted' });
};
