
const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Order = require("./Order");
const Product = require("./Product");
const User = require("./User");

const router = express.Router();

// Verify the logged-in user using their JWT
async function authenticateUser(req, res, next) {
  try {
    const header = req.headers.authorization;

    if (!header || !header.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Please log in first." });
    }

    const token = header.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id || decoded.userId);

    if (!user) {
      return res.status(401).json({ message: "User not found." });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired login. Please log in again." });
  }
}

// Create a new order
router.post("/", authenticateUser, async (req, res) => {
  try {
    const { items } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Your cart is empty." });
    }

    const orderItems = [];
    let totalAmount = 0;

    for (const item of items) {
      if (
        !item.productId ||
        !mongoose.isValidObjectId(item.productId) ||
        !Number.isInteger(item.quantity) ||
        item.quantity < 1 ||
        item.quantity > 100
      ) {
        return res.status(400).json({ message: "Invalid product or quantity." });
      }

      const product = await Product.findById(item.productId);

      if (!product) {
        return res.status(400).json({ message: "A product in your cart no longer exists." });
      }

      orderItems.push({
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
      });

      totalAmount += product.price * item.quantity;
    }

    const order = await Order.create({
      userId: req.user._id,
      customerName: req.user.name,
      customerEmail: req.user.email,
      items: orderItems,
      totalAmount,
    });

    res.status(201).json({
      message: "Order placed successfully!",
      order,
    });
  } catch (error) {
    console.error("Create order error:", error.message);
    res.status(500).json({ message: "Could not place your order." });
  }
});

// Get the logged-in user's orders
router.get("/my-orders", authenticateUser, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id })
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Could not load your orders." });
  }
});

module.exports = router;
