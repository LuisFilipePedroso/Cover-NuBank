const mongoose = require('mongoose');
require('mongoose-double')(mongoose);

const SchemaTypes = mongoose.Schema.Types;

const TransactionSchema = mongoose.Schema({
    from: {
        type: Number,
        required: true,
    },
    to: {
        type: Number,
    },
    model: {
        type: String,
        required: true,
    },
    value: {
        type: SchemaTypes.Double,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model('Transaction', TransactionSchema);