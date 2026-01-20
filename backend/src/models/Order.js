const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    orderId: {
        type: String,
        required: true,
        unique: true,
        uppercase: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [{
        gamepass: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Gamepass'
        },
        name: String,
        price: Number,
        quantity: Number
    }],
    total: {
        type: Number,
        required: true
    },
    paymentMethod: {
        type: String,
        enum: ['pix', 'credit_card', 'balance'],
        required: true
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'approved', 'rejected', 'cancelled'],
        default: 'pending'
    },
    mercadopagoId: String,
    pixQRCode: String,
    pixCopyPaste: String,
    cpf: String,
    discordNotified: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    paidAt: Date
});

module.exports = mongoose.model('Order', orderSchema);
