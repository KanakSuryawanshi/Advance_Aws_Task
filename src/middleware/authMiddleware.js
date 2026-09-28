const jwt = require("jsonwebtoken");

const JwtKey = process.env.JWT_SECRET;

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: "Authorization header missing" });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {

        return res.status(401).json({ message: "Invalid token" });

    }

    try {

        const decode = jwt.verify(token, JwtKey);
        console.log(decode);
        req.user = decode;
        next();

    } catch (error) {
        console.log("error");
        return res.status(401).json({ message: "Token expired or invalid" });

    }

};

module.exports = authenticateToken;