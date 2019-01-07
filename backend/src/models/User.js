const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const bcrypt = require('bcryptjs');

const UserSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
        select: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    account: {
        type: Number,
        unique: true,
    },
    balance: {
        type: Number,
        default: 0,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
});

UserSchema.pre('save', async function (next) {
    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;

    next();
})

UserSchema.plugin(AutoIncrement, {inc_field: 'account'});
module.exports = mongoose.model('User', UserSchema);