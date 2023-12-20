var express = require('express');
var router = express.Router();
var User = require('../models/user');

// GET all users
router.get('/', async function(req, res, next) {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    next(error);
  }
});

// GET a specific user by ID
router.get('/:id', async function(req, res, next) {
  try {
    const user = await User.findById(req.params.id);
    res.json(user);
  } catch (error) {
    next(error);
  }
});

// POST create a new user
router.post('/', async function(req, res, next) {
  try {
    const newUser = await User.create(req.body);
    res.json(newUser);
  } catch (error) {
    next(error);
  }
});

// PUT update a user by ID
router.put('/:id', async function(req, res, next) {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedUser);
  } catch (error) {
    next(error);
  }
});

// DELETE a user by ID
router.delete('/:id', async function(req, res, next) {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
