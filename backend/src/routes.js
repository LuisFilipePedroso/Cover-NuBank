const express = require('express');
const router = express.Router();
const UserController = require('./controllers/UserController');
const TransactionController = require('./controllers/TransactionController');

router.get('/user', UserController.index);
router.get('/user/:email', UserController.show);
router.post('/user', UserController.store);
router.put('/user/:id', UserController.update);
router.delete('/user/:id', UserController.destroy);

router.get('/transaction', TransactionController.index);
router.get('/transaction/:id', TransactionController.show);
router.post('/transaction', TransactionController.store);

module.exports = router;