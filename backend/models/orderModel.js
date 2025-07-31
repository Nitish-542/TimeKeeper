import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, required: true },
        slug: { type: String, required: true },
      },
    ],

    payment: {},
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: false,
    },
    guestName: {
      type: String,
      required: false,
    },
    guestEmail: {
      type: String,
      required: false,
    },
    guestAddress: {
      type: String,
      required: false,
    },
    status: {
      type: String,
      default: "Not Process",
      enum: ["Not Processed", "Processing", "Shipped", "Delivered", "Canceled"],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
