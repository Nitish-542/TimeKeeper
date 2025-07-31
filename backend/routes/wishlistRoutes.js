import express from "express";
import { requireSignIn } from "../middlewares/authMiddleware.js";
import {
  addToWishlist,
  getUserWishlist,
  removeFromWishlist,
} from "../controllers/wishlistController.js";

const router = express.Router();

router.post("/add", requireSignIn, addToWishlist);
router.get("/", requireSignIn, getUserWishlist);
router.delete("/:productId", requireSignIn, removeFromWishlist);

export default router;
