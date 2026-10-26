require("dotenv").config();

const mongoose = require("mongoose");
const Product = require("./Product");

const products = [
  {
    name: "Wireless Headphones",
    category: "Electronics",
    price: 1499,
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=85",
    description:
      "Enjoy rich sound, deep bass, and comfortable listening with active noise cancellation and 40-hour battery reserve.",
    stock: 20,
  },
  {
    name: "Classic Smart Watch",
    category: "Electronics",
    price: 2299,
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=85",
    description:
      "A stylish aerospace aluminum timepiece with AMOLED display and comprehensive health analytics.",
    stock: 15,
  },
  {
    name: "Running Sneakers",
    category: "Fashion",
    price: 1899,
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=85",
    description:
      "Sporty breathable mesh sneakers engineered with responsive kinetic foam cushioning.",
    stock: 12,
  },
  {
    name: "Travel Backpack",
    category: "Accessories",
    price: 999,
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=85",
    description:
      "A versatile weather-resistant canvas backpack with dedicated 16-inch padded laptop chamber.",
    stock: 25,
  },
  {
    name: "Modern Smartphone",
    category: "Electronics",
    price: 14999,
    image:
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=85",
    description:
      "A sleek flagship smartphone with 120Hz LTPO display and triple 50MP studio camera.",
    stock: 8,
  },
  {
    name: "Classic Sunglasses",
    category: "Accessories",
    price: 799,
    image:
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=85",
    description:
      "A timeless hand-polished Italian acetate frame fitted with Category 3 polarized UV400 lenses.",
    stock: 30,
  },
  {
    name: "Minimalist Leather Cardholder",
    category: "Accessories",
    price: 649,
    image:
      "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=85",
    description:
      "Ultra-slim 6-slot everyday carry wallet cut from vegetable-tanned leather with RFID protection.",
    stock: 18,
  },
  {
    name: "Merino Wool Crewneck Sweater",
    category: "Fashion",
    price: 2499,
    image:
      "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=800&q=85",
    description:
      "Spun from 100% fine Australian merino wool with natural thermoregulating comfort.",
    stock: 14,
  },
];

async function seedProducts() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is missing from server/.env");
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    let added = 0;

    for (const product of products) {
      const exists = await Product.findOne({ name: product.name });

      if (!exists) {
        await Product.create(product);
        added++;
      }
    }

    console.log(`${added} new products added.`);
    console.log("Existing products were preserved.");
  } catch (error) {
    console.error("Seeding failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

seedProducts();
