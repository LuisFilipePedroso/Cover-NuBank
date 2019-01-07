const mongoose = require('mongoose');
const User = mongoose.model('User');

module.exports = {

    async index(req, res) {
        const users = await User.find();
        return res.json(users);
    },
    async show(req, res) {
        const user = await User.findOne({ email: req.params.email });
        return res.json(user);
    },
    async store(req, res) {
        const { email } = req.body;

        try {
            if (await User.findOne({ email })) return res.status(400).send({ error: "User already exists" });

            const user = await User.create(req.body);
            user.password = undefined;
            user.balance = undefined;
            return res.json(user);
        } catch (e) {
            return res.status(400).send({ error: "Registration failed" });
        }
    },
    async update(req, res) {
        const { id } = req.params;

        try {
            if (await User.findOne({ id })) return res.status(401).send({ error: "User not found" });

            const user = await User.findByIdAndUpdate(id, req.body, { new: true });
            user.password = undefined;
            user.balance = undefined;
            return res.json(user);
        } catch (e) {
            return res.status(400).send({ error: "Registration failed" });
        }
    },
    async destroy(req, res) {
        const { id } = req.params;

        try {
            //if (await User.findOne({ id })) return res.status(401).send({ error: "User not found" });

            await User.findByIdAndRemove(id);
            return res.status(200).send({ success: "User deleted"});
        } catch (e) {
            return res.status(400).send({ error: "Error on delete" });
        }
    }
}
