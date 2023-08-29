const { Cart } = require('../model/Cart');
const {Product} = require("../model/Product");

exports.fetchCartByUser = async (req, res) => {
    const { id } = req.user;
    try {
        const cartItems = await Cart.find({ user: id })
        res.status(200).json(cartItems);
    } catch (err) {
        res.status(400).json(err);
    }
};

exports.addToCart = async (req, res) => {
    const {id} = req.user
    const cart = new Cart({...req.body,user:id});
    try {
        const doc = await cart.save();

        res.status(201).json(doc);
    } catch (err) {
        res.status(400).json(err);
    }
};
exports.deleteFromCart = async (req, res) => {
    const { id } = req.params;
    try {
        const doc = await Cart.findByIdAndDelete(id)

        res.status(200).json(doc);
    } catch (err) {
        res.status(400).json(err);
    }
};
exports.updateCart = async (req, res) => {
    const { id } = req.params;
    try {
        const cart = await Cart.findByIdAndUpdate(id, req.body, {
            new: true,
        });
        res.status(200).json(cart);
    } catch (err) {
        res.status(400).json(err);
    }
};