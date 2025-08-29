const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1]; // Extract token from Authorization header

    if (!token) {
        console.log("Access denied");
        return res.status(401).json({ message: "Access denied" });
    }

    try {
        // Verify the token and extract payload
        const decoded = jwt.verify(token, JWT_SECRET);
        req.userId = decoded.userId; // Attach userId to the request object
        req.username = decoded.username;
        next();
    } catch (err) {
        res.status(401).json({ message: "Invalid or expired token" });
    }
};

module.exports = authMiddleware;