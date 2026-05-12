const express = require("express");
const router = express.Router();
const productController = require("../controllers/product.controller");
const upload = require("../middlewares/multer");

router.post(
  "/create",
  upload.fields([{ name: "image", maxCount: 1 }]),
  productController.createProduct,
);
router.get("/get-all", productController.getAllProducts);
router.get("/get/:id", productController.getProductById);
router.patch("/update/:id", productController.updateProduct);
router.delete("/delete/:id", productController.deleteProduct);

module.exports = router;
