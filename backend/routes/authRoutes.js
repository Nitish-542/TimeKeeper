import express from "express";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
import {
  registerController,
  loginController,
  testController,
  getAllOrdersController,
  getOrdersController,
  forgotPasswordController,
  updateProfileController,
  orderStatusController,
  createOrderController,
  deleteAccountController,
  deleteUserController,
  getAllUsersController, 
} from "../controllers/authController.js"; 

const router = express.Router();

// Register a new user
router.post("/register", registerController);

// Login
router.post("/login", loginController);

// Forgot Password
router.post("/forgot-password", forgotPasswordController);

// Test Route
router.get("/test", requireSignIn, isAdmin, testController);

// Admin Protected Route (for testing admin access)
router.get("/admin-auth", requireSignIn, isAdmin, (req, res) => {
  res.status(200).send({ ok: true });
});

// Protected User Route (for authenticated users)
router.get("/user-auth", requireSignIn, (req, res) => {
  res.status(200).send({ ok: true });
});
router.delete("/users/:userId", requireSignIn, isAdmin, deleteUserController);
router.delete("/profile", requireSignIn, deleteAccountController);

router.put("/profile", requireSignIn, updateProfileController);

router.get("/orders", requireSignIn, getOrdersController);

router.post("/create-order", requireSignIn, createOrderController); 

router.get("/all-orders", requireSignIn, isAdmin, getAllOrdersController);
router.get("/users", requireSignIn, isAdmin, getAllUsersController);


// Admin: Update order status
router.put(
  "/order-status/:orderId",
  requireSignIn,
  isAdmin,
  orderStatusController
);

export default router;
