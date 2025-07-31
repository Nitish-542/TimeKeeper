import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import productModel from "../models/productModel.js";
import { comparePassword, hashPassword } from "../helpers/authHelper.js";
import jwt from "jsonwebtoken";

// -------------------- AUTH --------------------

export const registerController = async (req, res) => {
  try {
    const { name, email, password, phone, address, answer } = req.body;
    if (!name || !email || !password || !phone || !address || !answer) {
      return res.status(400).send({ message: "All fields are required" });
    }

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(200).send({
        success: false,
        message: "Already Registered. Please login",
      });
    }

    const hashedPassword = await hashPassword(password);
    const user = await new userModel({
      name,
      email,
      phone,
      address,
      password: hashedPassword,
      answer,
    }).save();

    res.status(201).send({
      success: true,
      message: "User Registered Successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Registration",
      error,
    });
  }
};

export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(404).send({
        success: false,
        message: "Invalid email or password",
      });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Email is not registered",
      });
    }

    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(200).send({
        success: false,
        message: "Invalid Password",
      });
    }

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).send({
      success: true,
      message: "Login successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in login",
      error,
    });
  }
};

export const forgotPasswordController = async (req, res) => {
  try {
    const { email, answer, newPassword } = req.body;
    if (!email || !answer || !newPassword) {
      return res.status(400).send({ message: "All fields are required" });
    }

    const user = await userModel.findOne({ email, answer });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Wrong Email Or Answer",
      });
    }

    const hashed = await hashPassword(newPassword);
    await userModel.findByIdAndUpdate(user._id, { password: hashed });

    res.status(200).send({
      success: true,
      message: "Password Reset Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Something went wrong",
      error,
    });
  }
};

export const updateProfileController = async (req, res) => {
  try {
    const { name, email, password, address, phone } = req.body;
    const user = await userModel.findById(req.user._id);

    if (password && password.length < 6) {
      return res.json({
        error: "Password must be 6 characters or longer",
      });
    }

    const hashedPassword = password ? await hashPassword(password) : undefined;
    const updatedUser = await userModel.findByIdAndUpdate(
      req.user._id,
      {
        name: name || user.name,
        password: hashedPassword || user.password,
        phone: phone || user.phone,
        address: address || user.address,
      },
      { new: true }
    );

    res.status(200).send({
      success: true,
      message: "Profile Updated Successfully",
      updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error while updating profile",
      error,
    });
  }
};

// -------------------- ACCOUNT DELETION --------------------

export const deleteAccountController = async (req, res) => {
  try {
    const userId = req.user._id;
    const deletedUser = await userModel.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).send({
      success: true,
      message: "Your account has been deleted successfully.",
    });
  } catch (error) {
    console.error("Delete account error:", error);
    res.status(500).send({
      success: false,
      message: "Error while deleting account",
      error,
    });
  }
};

// -------------------- ADMIN: Users --------------------

export const getAllUsersController = async (req, res) => {
  try {
    if (req.user.role !== 1) {
      return res.status(403).send({
        success: false,
        message: "Unauthorized access",
      });
    }

    const users = await userModel.find({ role: 0 }).select("-password");
    res.status(200).send({
      success: true,
      users,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).send({
      success: false,
      message: "Error fetching users",
      error,
    });
  }
};

export const deleteUserController = async (req, res) => {
  try {
    const userId = req.params.userId;
    const deleted = await userModel.findByIdAndDelete(userId);

    if (!deleted) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).send({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).send({
      success: false,
      message: "Error deleting user",
      error,
    });
  }
};

// -------------------- ORDERS --------------------

export const createOrderController = async (req, res) => {
  try {
    const { products, payment, guestName, guestEmail, guestAddress } = req.body;
    const { user } = req;

    const orderProducts = products.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
      slug: item.slug,
    }));

    const orderData = {
      products: orderProducts,
      payment,
      status: "Not Processed",
    };

    if (user) {
      orderData.buyer = user._id;
    } else {
      orderData.guestName = guestName;
      orderData.guestEmail = guestEmail;
      orderData.guestAddress = guestAddress;
    }

    const order = new orderModel(orderData);

    await order.save();

    for (let item of products) {
      const product = await productModel.findById(item.productId);
      if (product) {
        if (product.quantity >= item.quantity) {
          product.quantity -= item.quantity;
          await product.save();
        } else {
          return res.status(400).json({
            success: false,
            message: `Not enough stock for: ${product.name}`,
          });
        }
      } else {
        return res.status(404).json({
          success: false,
          message: `Product not found with id: ${item.productId}`,
        });
      }
    }

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error placing order",
      error,
    });
  }
};

export const getOrdersController = async (req, res) => {
  try {
    const orders = await orderModel
      .find({ buyer: req.user?._id })
      .populate({
        path: "products.productId",
        select: "name price description slug photo",
      })
      .populate("buyer", "name");
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while getting orders",
      error,
    });
  }
};

export const getAllOrdersController = async (req, res) => {
  try {
    if (req.user.role !== 1) {
      return res.status(403).send({
        success: false,
        message: "Unauthorized access",
      });
    }

    const orders = await orderModel
      .find({})
      .populate({
        path: "products.productId",
        select: "name price description slug photo",
      })
      .populate("buyer", "name")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while getting orders",
      error,
    });
  }
};

export const orderStatusController = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    if (req.user.role !== 1) {
      return res.status(403).send({
        success: false,
        message: "You are not authorized to change the order status",
      });
    }

    const order = await orderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    res.json(order);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while updating order status",
      error,
    });
  }
};

// -------------------- TEST --------------------

export const testController = (req, res) => {
  try {
    res.send("Protected Routes are working");
  } catch (error) {
    console.log(error);
    res.send({ error });
  }
};
