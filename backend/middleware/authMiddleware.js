const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
    try {
        let token;
        const authHeader = req.headers.authorization;

        if (authHeader && authHeader.startsWith("Bearer")) {
            token = authHeader.split(" ")[1];
        }

        if (!token) {
            res.status(401);
            throw new Error("Not authorized, no token");
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = await User.findById(decoded.id).select("-password");

        if (!req.user) {
            res.status(401);
            throw new Error("Not authorized, user not found");
        }

        next();
    } catch (error) {
        res.status(401);
        next(new Error("Not authorized, token failed"));
    }
};

// Only allows the request through if the logged-in user is an admin
const adminOnly = (req, res, next) => {
    if (req.user && req.user.role === "admin") {
        next();
    } else {
        res.status(403);
        next(new Error("Not authorized, admin access only"));
    }
};

module.exports = { protect, adminOnly };