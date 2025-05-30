import { useEffect, useState } from 'react';
import {
    Container, Typography, Button, Box, Dialog, DialogTitle, DialogContent, TextField, DialogActions
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import api from '../services/api';

const Inventory = () => {
    const [transactionForm, setTransactionForm] = useState({ type: '', quantity: '', note: '', productId: null });
    const [transactionOpen, setTransactionOpen] = useState(false);
    const [products, setProducts] = useState([]);
    const [form, setForm] = useState({
        name: '', quantity: '', price: '', description: '', category: '', subtype: ''
    });
    const [open, setOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [filterCategory, setFilterCategory] = useState('');
    const [fullProducts, setFullProducts] = useState([]); // for filtering

    const fetchProducts = async () => {
        const res = await api.get('/products');
        setProducts(res.data);
        setFullProducts(res.data);
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleOpen = (product = null) => {
        if (product) {
            setForm(product);
            setEditingId(product.id);
        } else {
            setForm({
                name: '',
                quantity: '',
                price: '',
                description: '',
                category: '',
                subtype: ''
            });
            setEditingId(null);
        }
        setOpen(true);
    };

    const handleSubmit = async () => {
        if (editingId) {
            await api.put(`/products/${editingId}`, form);
        } else {
            await api.post('/products', form);
        }
        fetchProducts();
        setFilterCategory('');
        setOpen(false);
    };

    const handleDelete = async (id) => {
        await api.delete(`/products/${id}`);
        fetchProducts();
        setFilterCategory('');
    };

    const openTransaction = (type, productId) => {
        setTransactionForm({ type, quantity: '', note: '', productId });
        setTransactionOpen(true);
    };

    const handleTransactionSubmit = async () => {
        try {
            await api.post('/transactions', transactionForm);
            fetchProducts(); // refresh inventory
            setTransactionOpen(false);
        } catch (err) {
            console.error('Transaction failed', err);
        }
    };


    const columns = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'name', headerName: 'Name', flex: 1 },
        { field: 'quantity', headerName: 'Quantity', width: 100 },
        { field: 'price', headerName: 'Price', width: 100 },
        { field: 'description', headerName: 'Description', flex: 1 },
        { field: 'category', headerName: 'Category', width: 130 },
        { field: 'subtype', headerName: 'Subtype', width: 130 },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 280,
            renderCell: (params) => (
                <Box>
                    <Button size="small" onClick={() => handleOpen(params.row)}>Edit</Button>
                    <Button size="small" color="error" onClick={() => handleDelete(params.row.id)}>Delete</Button>
                    <Button size="small" onClick={() => openTransaction('sale', params.row.id)}>Sell</Button>
                    <Button size="small" onClick={() => openTransaction('restock', params.row.id)}>Restock</Button>
                </Box>
            ),
        },
    ];

    return (
        <Container sx={{ mt: 5 }}>
            <Typography variant="h4" gutterBottom>Inventory</Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Button variant="contained" onClick={() => handleOpen()}>Add Product</Button>

                <TextField
                    select
                    label="Filter by Category"
                    value={filterCategory}
                    onChange={(e) => {
                        const selected = e.target.value;
                        setFilterCategory(selected);
                        setProducts(selected ? fullProducts.filter(p => p.category === selected) : fullProducts);
                    }}
                    sx={{ width: 200 }}
                    SelectProps={{ native: true }}
                >
                    <option value="">All</option>
                    {[...new Set(fullProducts.map(p => p.category).filter(Boolean))].map((cat, i) => (
                        <option key={i} value={cat}>{cat}</option>
                    ))}
                </TextField>
            </Box>

            <div style={{ height: 500, width: '100%' }}>
                <DataGrid rows={products} columns={columns} pageSize={7} />
            </div>

            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>{editingId ? 'Edit Product' : 'Add Product'}</DialogTitle>
                <DialogContent>
                    <TextField fullWidth margin="dense" label="Name" name="name" value={form.name} onChange={handleChange} />
                    <TextField fullWidth margin="dense" label="Quantity" name="quantity" value={form.quantity} onChange={handleChange} />
                    <TextField fullWidth margin="dense" label="Price" name="price" value={form.price} onChange={handleChange} />
                    <TextField fullWidth margin="dense" label="Description" name="description" value={form.description} onChange={handleChange} />
                    <TextField fullWidth margin="dense" label="Category" name="category" value={form.category} onChange={handleChange} />
                    <TextField fullWidth margin="dense" label="Subtype" name="subtype" value={form.subtype} onChange={handleChange} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button onClick={handleSubmit} variant="contained">{editingId ? 'Update' : 'Create'}</Button>
                </DialogActions>
            </Dialog>
            <Dialog open={transactionOpen} onClose={() => setTransactionOpen(false)}>
                <DialogTitle>{transactionForm.type === 'sale' ? 'Sell Product' : 'Restock Product'}</DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        margin="dense"
                        label="Quantity"
                        name="quantity"
                        type="number"
                        value={transactionForm.quantity}
                        onChange={(e) => setTransactionForm({ ...transactionForm, quantity: e.target.value })}
                    />
                    <TextField
                        fullWidth
                        margin="dense"
                        label="Note (optional)"
                        name="note"
                        value={transactionForm.note}
                        onChange={(e) => setTransactionForm({ ...transactionForm, note: e.target.value })}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setTransactionOpen(false)}>Cancel</Button>
                    <Button onClick={handleTransactionSubmit} variant="contained">Submit</Button>
                </DialogActions>
            </Dialog>

        </Container>
    );
};

export default Inventory;
