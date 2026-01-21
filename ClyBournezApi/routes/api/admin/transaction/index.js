const router = require('express').Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Transaction = require('../../../../models/transactions.model');

router.get('/', async (req, res) => {
    try {
        let query = {};

        // Apply filters if query parameters exist
        if (req.query.planOrderId) {
            query.orderId = req.query.planOrderId;
        }
        if (req.query.country) {
            query.country = req.query.country;
        }
        if (req.query.planType) {
            query.planType = req.query.planType;
        }
        if (req.query.orderType) {
            query.orderType = req.query.orderType;
        }
        if (req.query.fromDate && req.query.toDate) {
            query.createdAt = {
                $gte: new Date(req.query.fromDate),
                $lte: new Date(req.query.toDate)
            };
        } else if (req.query.fromDate) {
            query.createdAt = {
                $gte: new Date(req.query.fromDate)
            };
        } else if (req.query.toDate) {
            query.createdAt = {
                $lte: new Date(req.query.toDate)
            };
        }

        const transactions = await Transaction.find(query);
        res.json(transactions);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get a specific plan
router.get('/:id', async (req, res) => {
    try {
        const transaction = await Transaction.findById(req.params.id).populate('customerId', 'first_name last_name customerId');
        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }
        res.json(transaction);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;