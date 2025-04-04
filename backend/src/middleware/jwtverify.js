const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const userModel = require("../Models/UserModel");

const jwtVerify = asyncHandler(async (req, res, next) => {
    const accessToken = req.cookies.accessToken;
    const refreshToken = req.cookies.refreshToken;
    if(!accessToken || !refreshToken) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    try {
        const decodedToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
        req.userId = decodedToken.userId;
        next();
    } catch(error) {
        if (error instanceof jwt.tokenExpiredError) {
            try {
                const decodedToken = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
                const user = await userModel.findById(decodedToken.userId);
                if (!user || user.refreshToken !== refreshToken) {
                    return res.status(403).json({ message: "Forbidden" });
                }
                const newAccessToken = jwt.sign({ userId: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
                const newRefreshToken = jwt.sign({ userId: user._id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "30d" });
                user.refreshToken = newRefreshToken;
                await user.save();
                res.cookie("accessToken", newAccessToken, {
                    httpOnly: true,
                    sameSite: "none",
                    secure: process.env.NODE_ENV === "production",
                    path: "/",
                    maxAge: 30 * 24 * 60 * 60 * 1000,
                });
                res.cookie("refreshToken", newRefreshToken, {
                    httpOnly: true,
                    sameSite: "none",
                    secure: process.env.NODE_ENV === "production",
                    path: "/",
                    maxAge: 1000 * 60 * 15,
                });
                req.userId = decodedToken.userId;
                next();
            } catch (error) {
                return res.status(403).json({ message: "Forbidden" });
            }
        }
    }
})

module.exports = jwtVerify;