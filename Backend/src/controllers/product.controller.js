const config = require("../config/config");
const productModel = require("../models/product.model");
const jwt = require("jsonwebtoken");
const cloudinary = require("cloudinary").v2;

async function createProduct(req, res) {
  try {
    const data = req.body;
    let image = "";
    if (req.files && req.files.image && req.files.image[0]) {
      const result = await cloudinary.uploader.upload(req.files.image[0].path, {
        folder: "shoesmart/products",
      });
      image = result.secure_url;
    } else {
      return res.status(400).json({ message: "Image file is required" });
    }

    await productModel.create({
      name: data.name,
      price: data.price,
      originalPrice: data.originalPrice,
      category: data.category,
      type: data.type,
      brand: data.brand,
      description: data.description,
      size: data.size,
      image: image,
      stock: data.stock,
      rating: data.rating,
      tag: data.tag,
    });
    res.status(201).json({
      message: "Product created successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating product",
      error: error.message,
    });
  }
}

async function getAllProducts(req, res) {
  try {
    const products = await productModel.find({});
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving products",
      error: error.message,
    });
  }
}

async function getProductById(req, res) {
  try {
    const product = await productModel.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({
      product,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving product",
      error: error.message,
    });
  }
}

async function updateProduct(req, res) {
  try {
    const data = req.body;
    const product = await productModel.findByIdAndUpdate(
      req.params.id,
      {
        name: data.name,
        price: data.price,
        originalPrice: data.originalPrice,
        category: data.category,
        type: data.type,
        brand: data.brand,
        description: data.description,
        size: data.size,
        stock: data.stock,
        rating: data.rating,
        tag: data.tag,
      },
      { new: true },
    );
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating product",
      error: error.message,
    });
  }
}

async function deleteProduct(req, res) {
  try {
    const product = await productModel.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting product",
      error: error.message,
    });
  }
}

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
