import wishlistModel from "../models/wishlistModel.js";

export const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    const existing = await wishlistModel.findOne({
      user: req.user._id,
      product: productId,
    });

    if (existing) {
      return res.status(200).send({ success: false, message: "Already in wishlist" });
    }

    const wish = new wishlistModel({ user: req.user._id, product: productId });
    await wish.save();

    res.status(201).send({ success: true, message: "Added to wishlist" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: "Error adding to wishlist", error });
  }
};

export const getUserWishlist = async (req, res) => {
  try {
    const items = await wishlistModel
      .find({ user: req.user._id })
      .populate("product");

    res.status(200).send({ success: true, wishlist: items });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: "Error fetching wishlist", error });
  }
};

export const removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;
    await wishlistModel.findOneAndDelete({
      user: req.user._id,
      product: productId,
    });

    res.status(200).send({ success: true, message: "Removed from wishlist" });
  } catch (error) {
    res.status(500).send({ success: false, message: "Error removing item", error });
  }
};
