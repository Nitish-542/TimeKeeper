import productModel from "../models/productModel.js";
import categoryModel from "../models/categoryModel.js";
import mongoose from "mongoose";
import fs from "fs";
import slugify from "slugify";

export const createProductController = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      quantity,
      shipping,
      bestseller,
    } = req.fields;
    const { photo } = req.files;

    let categoryIds = [];
    if (category) {
      categoryIds = category
        .split(",")
        .map((id) => new mongoose.Types.ObjectId(id.trim()));
    }

    switch (true) {
      case !name:
        return res.status(500).send({ error: "Name is Required" });
      case !description:
        return res.status(500).send({ error: "Description is Required" });
      case !price:
        return res.status(500).send({ error: "Price is Required" });
      case !categoryIds || categoryIds.length === 0:
        return res
          .status(500)
          .send({ error: "At least one Category is Required" });
      case !quantity:
        return res.status(500).send({ error: "Quantity is Required" });
      case photo && photo.size > 1000000:
        return res
          .status(500)
          .send({ error: "Photo is required and should be less than 1MB" });
    }


    const product = new productModel({
      ...req.fields,
      slug: slugify(name),
      bestseller: bestseller || false,
      category: categoryIds,
    });

    if (photo) {
      product.photo.data = fs.readFileSync(photo.path);
      product.photo.contentType = photo.type;
    }

    await product.save();
    res.status(201).send({
      success: true,
      message: "Product Created Successfully",
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in creating product",
    });
  }
};

export const getProductController = async (req, res) => {
  try {
    const products = await productModel
      .find({})
      .populate("category")
      .select("-photo")
      .limit(12)
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      countTotal: products.length,
      message: "All Products",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in getting products",
      error: error.message,
    });
  }
};

export const getSingleProductController = async (req, res) => {
  try {
    const product = await productModel
      .findOne({ slug: req.params.slug })
      .select("-photo")
      .populate("category");
    res.status(200).send({
      success: true,
      message: "Single Product Fetched",
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while getting single product",
      error,
    });
  }
};

export const productPhotoController = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.pid).select("photo");
    if (product.photo.data) {
      res.set("Content-type", product.photo.contentType);
      return res.status(200).send(product.photo.data);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while getting photo",
      error,
    });
  }
};

export const deleteProductController = async (req, res) => {
  try {
    await productModel.findByIdAndDelete(req.params.pid).select("-photo");
    res.status(200).send({
      success: true,
      message: "Product Deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while deleting product",
      error,
    });
  }
};

export const updateProductController = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      quantity,
      shipping,
      bestseller,
    } = req.fields;
    const { photo } = req.files;

    switch (true) {
      case !name:
        return res.status(500).send({ error: "Name is Required" });
      case !description:
        return res.status(500).send({ error: "Description is Required" });
      case !price:
        return res.status(500).send({ error: "Price is Required" });
      case !category:
        return res.status(500).send({ error: "Category is Required" });
      case !quantity:
        return res.status(500).send({ error: "Quantity is Required" });
      case photo && photo.size > 1000000:
        return res
          .status(500)
          .send({ error: "Photo is required and should be less than 1MB" });
    }

    const product = await productModel.findById(req.params.pid);
    if (!product) {
      return res.status(404).send({ error: "Product not found" });
    }

    const updatedFields = { ...req.fields, slug: slugify(name), bestseller };


    if (photo) {
      updatedFields.photo = {
        data: fs.readFileSync(photo.path),
        contentType: photo.type,
      };
    }

    const updatedProduct = await productModel.findByIdAndUpdate(
      req.params.pid,
      updatedFields,
      { new: true }
    );

    res.status(201).send({
      success: true,
      message: "Product Updated Successfully",
      updatedProduct,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in updating product",
    });
  }
};

export const productFiltersController = async (req, res) => {
  try {
    const { checked, radio } = req.body;

    let args = {};

    if (checked.length > 0) {
      args.category = { $in: checked };
    }

    if (radio.length) {
      args.price = { $gte: radio[0], $lte: radio[1] };
    }

    const products = await productModel.find(args);

    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error while filtering products",
      error,
    });
  }
};

export const productCountController = async (req, res) => {
  try {
    const total = await productModel.find({}).estimatedDocumentCount();
    res.status(200).send({
      success: true,
      total,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      message: "Error in product count",
      error,
      success: false,
    });
  }
};

export const productListController = async (req, res) => {
  try {
    const { checked = "", radio = [], page = 1, limit = 12 } = req.query;

    let args = {};

    let priceRange = [];
    if (typeof radio === "string") {
      priceRange = radio.split(",").map(Number);
    } else if (Array.isArray(radio)) {
      priceRange = radio.map(Number);
    }

    if (checked && checked.length > 0) {
      args.category = { $in: checked.split(",") };
    }

    if (priceRange.length === 2) {
      const [minPrice, maxPrice] = priceRange;
      if (!isNaN(minPrice) && !isNaN(maxPrice)) {
        args.price = { $gte: minPrice, $lte: maxPrice };
      }
    }

    const filteredProducts = await productModel.find(args);

    const totalProducts = filteredProducts.length;
    const paginatedProducts = filteredProducts.slice(
      (page - 1) * limit,
      page * limit
    );

    res.status(200).send({
      success: true,
      products: paginatedProducts,
      countTotal: totalProducts,
      totalPages: Math.ceil(totalProducts / limit),
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error fetching products",
      error: error.message,
    });
  }
};

export const searchProductController = async (req, res) => {
  try {
    const { keyword } = req.params;

    const results = await productModel
      .find({
        $or: [
          { name: { $regex: keyword, $options: "i" } },
          { description: { $regex: keyword, $options: "i" } },
        ],
      })
      .select("-photo");

    res.status(200).json(results);
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error in Search Product API",
      error: error.message,
    });
  }
};

export const relatedProductController = async (req, res) => {
  try {
    const { pid, cid } = req.params;
    const products = await productModel
      .find({
        category: cid,
        _id: { $ne: pid },
      })
      .select("-photo")
      .limit(3)
      .populate("category");
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error while getting related products",
      error,
    });
  }
};

export const productCategoryController = async (req, res) => {
  try {
    const category = await categoryModel.findOne({ slug: req.params.slug });
    const products = await productModel
      .find({ category })
      .populate("category");
    res.status(200).send({
      success: true,
      category,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      error,
      message: "Error while getting products",
    });
  }
};

export const getBestsellersController = async (req, res) => {
  try {
    const bestsellers = await productModel.find({ bestseller: true }).limit(10);
    if (!bestsellers || bestsellers.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No bestsellers found" });
    }
    return res.json({ success: true, products: bestsellers });
  } catch (error) {
    console.error("Error fetching bestsellers:", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};
