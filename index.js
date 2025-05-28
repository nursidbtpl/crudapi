const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet()); // Security headers
app.use(cors()); // Enable CORS
app.use(morgan('combined')); // Logging
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// In-memory data store (replace with database in production)
let items = [
  { id: 1, name: 'Sample Item 1', description: 'This is a sample item', category: 'electronics', price: 99.99, createdAt: new Date().toISOString() },
  { id: 2, name: 'Sample Item 2', description: 'Another sample item', category: 'books', price: 19.99, createdAt: new Date().toISOString() },
  { id: 3, name: 'Sample Item 3', description: 'Yet another sample item', category: 'clothing', price: 49.99, createdAt: new Date().toISOString() }
];
let nextId = 4;

// Helper function to find item by ID
const findItemById = (id) => items.find(item => item.id === parseInt(id));

// Helper function to validate item data
const validateItem = (item) => {
  const errors = [];
  if (!item.name || item.name.trim() === '') {
    errors.push('Name is required');
  }
  if (!item.description || item.description.trim() === '') {
    errors.push('Description is required');
  }
  if (!item.category || item.category.trim() === '') {
    errors.push('Category is required');
  }
  if (item.price === undefined || item.price === null || isNaN(item.price) || item.price < 0) {
    errors.push('Price must be a valid positive number');
  }
  return errors;
};

// Routes

// GET / - API Info
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the CRUD API',
    version: '1.0.0',
    endpoints: {
      'GET /api/items': 'Get all items',
      'GET /api/items/:id': 'Get item by ID',
      'POST /api/items': 'Create new item',
      'PUT /api/items/:id': 'Update item by ID',
      'DELETE /api/items/:id': 'Delete item by ID'
    }
  });
});

// GET /api/items - Get all items
app.get('/api/items', (req, res) => {
  const { category, minPrice, maxPrice, search } = req.query;
  let filteredItems = [...items];

  // Filter by category
  if (category) {
    filteredItems = filteredItems.filter(item => 
      item.category.toLowerCase() === category.toLowerCase()
    );
  }

  // Filter by price range
  if (minPrice) {
    filteredItems = filteredItems.filter(item => item.price >= parseFloat(minPrice));
  }
  if (maxPrice) {
    filteredItems = filteredItems.filter(item => item.price <= parseFloat(maxPrice));
  }

  // Search in name and description
  if (search) {
    const searchTerm = search.toLowerCase();
    filteredItems = filteredItems.filter(item => 
      item.name.toLowerCase().includes(searchTerm) || 
      item.description.toLowerCase().includes(searchTerm)
    );
  }

  res.json({
    success: true,
    count: filteredItems.length,
    data: filteredItems
  });
});

// GET /api/items/:id - Get item by ID
app.get('/api/items/:id', (req, res) => {
  const item = findItemById(req.params.id);
  
  if (!item) {
    return res.status(404).json({
      success: false,
      message: 'Item not found'
    });
  }

  res.json({
    success: true,
    data: item
  });
});

// POST /api/items - Create new item
app.post('/api/items', (req, res) => {
  const { name, description, category, price } = req.body;
  
  // Validate input
  const errors = validateItem(req.body);
  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors
    });
  }

  // Create new item
  const newItem = {
    id: nextId++,
    name: name.trim(),
    description: description.trim(),
    category: category.trim(),
    price: parseFloat(price),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  items.push(newItem);

  res.status(201).json({
    success: true,
    message: 'Item created successfully',
    data: newItem
  });
});

// PUT /api/items/:id - Update item by ID
app.put('/api/items/:id', (req, res) => {
  const item = findItemById(req.params.id);
  
  if (!item) {
    return res.status(404).json({
      success: false,
      message: 'Item not found'
    });
  }

  // Validate input
  const errors = validateItem(req.body);
  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors
    });
  }

  // Update item
  const { name, description, category, price } = req.body;
  item.name = name.trim();
  item.description = description.trim();
  item.category = category.trim();
  item.price = parseFloat(price);
  item.updatedAt = new Date().toISOString();

  res.json({
    success: true,
    message: 'Item updated successfully',
    data: item
  });
});

// DELETE /api/items/:id - Delete item by ID
app.delete('/api/items/:id', (req, res) => {
  const itemIndex = items.findIndex(item => item.id === parseInt(req.params.id));
  
  if (itemIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Item not found'
    });
  }

  const deletedItem = items.splice(itemIndex, 1)[0];

  res.json({
    success: true,
    message: 'Item deleted successfully',
    data: deletedItem
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📖 API Documentation available at http://localhost:${PORT}`);
  console.log(`🔗 API Base URL: http://localhost:${PORT}/api`);
});

module.exports = app;
