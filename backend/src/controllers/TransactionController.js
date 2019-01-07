const mongoose = require('mongoose');
const Transaction = mongoose.model('Transaction');
const User = mongoose.model('User');

module.exports = {
    async index(req, res) {
        const transactions = await Transaction.find();
        return res.json(transactions);
    },
    async show(req, res) {
        const transactions = await Transaction.find({ from: req.params.id }).sort('-createdAt')
        return res.json(transactions);
    },
    async store(req, res) {
        const { from, to, value, model } = req.body;
        var toUser = "";

        try {
            const fromUser = await User.findOne({ account: from });
            if (!fromUser) return res.status(400).send({ error: "From user not found" });

            if (to !== undefined && model === "T") {
                toUser = await User.findOne({ account: to });
                if (!toUser) return res.status(400).send({ error: "To user not found" });
            }

            const { balance } = fromUser;
            let newBalance = 0;

            if (balance < value) return res.status(401).send({ error: "Balance unavailable" });

            switch (model) {
                case "T":
                    newBalance = parseFloat(balance) - parseFloat(value);
                    break;
                case "D":
                    newBalance = parseFloat(balance) + parseFloat(value);
                    break;
                case "S":
                    newBalance = parseFloat(balance) - parseFloat(value);
                    break;
            }

            const transaction = await Transaction.create(req.body);

            fromUser.set({ balance: newBalance });
            await fromUser.save();

            if (toUser != "") {
                toUser.set({ balance: parseFloat(toUser.balance) + parseFloat(value) });
                await toUser.save();
            }

            req.io.emit('transaction', transaction);
            req.io.emit('fromuser', fromUser);
            req.io.emit('touser', toUser);

            return res.json(transaction);
        } catch (e) {
            return res.status(400).send({ error: "Transaction failed" });
        }
    }
};
