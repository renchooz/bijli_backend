import jwt from "jsonwebtoken"

export const checkAuth = async(userId,res)=>{
    try {
        const token = jwt.sign({userId},process.env.JWT_SECRET,{
            expiresIn:"7d"
        })
        res.cookie("token",token,{
            httpOnly: true,       // Prevents access from JavaScript
            secure: true,  // Sends cookie only on HTTPS
            sameSite: "None",   // Protects against CSRF
            maxAge: 7 * 24 * 60 * 60 * 1000,  // 7 days in ms
        })
        return token;
    } catch (error) {
        return res.status(500).json({message: "Authentication failed" });
    }
}