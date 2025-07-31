import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import connectDb from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cors from "cors";
import wishlistRoutes from "./routes/wishlistRoutes.js";

dotenv.config();

//databse config
connectDb();

const app = express();

//middelwares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

//routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/product", productRoutes);
app.use("/api/v1/wishlist", wishlistRoutes);

app.get("/", (req, res) => {
  res.send("<h1>Welcome to ecommerce app</h1>");
});

//PORT
const PORT = process.env.PORT || 8080;

//run listen
app.listen(PORT, () => {
  console.log(`Server Running on ${process.env.DEV_MODE} mode on port ${PORT}`);
});
