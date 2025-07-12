import jwt from "jsonwebtoken";
import User from "../models/UserModel.js";

export const protected_route = async (req, res, next) => {
  const token = req.cookies.token;

  try {
    if (!token) {
      return res
        .status(401)
        .json({ message: "Not Authorized. Token Not Found" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(500).json({ message: "Invalid or Expired Token", error: error.message });
  }
};


