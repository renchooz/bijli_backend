import express from "express";
import {
  CheckUser,
  login,
  logout,
  signUp,
  updateProfile,
} from "../controller/auth.js";
import { protected_route } from "../middleware/Protected.js";

const authRoute = express.Router();

authRoute.post("/signup", signUp);
authRoute.post("/login", login);
authRoute.post("/logout", logout);
authRoute.put("/update-profile", protected_route, updateProfile);
authRoute.get("/check", protected_route, CheckUser);

export default authRoute;
