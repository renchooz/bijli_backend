import bcrypt from "bcryptjs";
import User from "../models/UserModel.js";
import { checkAuth } from "../lib/jwt.js";
import cloudinary from "../lib/Cloudinary.js";
export const signUp = async (req, res) => {
  const { fullName, email, password } = req.body;

  try {
    // Validate inputs
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "Please fill all credentials" });
    }

    // Check if user already exists
    const checkPrev = await User.findOne({ email });
    if (checkPrev) {
      return res.status(409).json({ message: "User already exists" });
    }

    // Hash the password
    const hashedPass = await bcrypt.hash(password, 10);

    // Create new user instance
    const user = new User({
      fullName,
      email,
      password: hashedPass,
    });

    // Save the user and set token cookie
    await user.save();
    await checkAuth(user._id, res); // Pass user._id to create token

    // Respond with success
    return res.status(201).json({ message: "User created successfully", user });
  } catch (error) {
    console.error("SignUp Error:", error);
    return res.status(500).json({ message: "Failed to create user" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "invalid crediantials" });
    }
    const checkPass = await bcrypt.compare(password, user.password);
    if (!checkPass) {
      return res.status(404).json({ message: "invalid crediantials" });
    }
    await checkAuth(user._id, res);
    return res.status(200).json({ message: "logged in succesfully", user });
  } catch (error) {
    console.error("login Error:", error);
    return res.status(500).json({ message: "Failed to login" });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
    });
    return res.status(200).json({ message: "logged out succesfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateProfile = async (req, res) => {
  const { profile } = req.body;
  if (!profile) {
    return res.status(400).json({ message: "Please fill all credentials" });
  }
  try {
    const userId = req.user._id;
    if (!userId) {
      return res.status(401).json({ message: "UserId not found" });
    }
    const updateRespone = await cloudinary.uploader.upload(profile)
    const user = await User.findByIdAndUpdate(
      userId,
      { profile:updateRespone.secure_url  },
      { new: true }
    );
    return res.status(200).json({ message: "Profile Updated Sucessfully" });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

export const CheckUser = (req,res)=>{
try {
  return res.status(200).json({user:req.user})
} catch (error) {
   return res.status(500).json({ message: error.message });
}
}