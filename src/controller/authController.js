const pool = require("../config/dbConfig");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JwtKey = process.env.JWT_SECRET;

const registerUser = async (req, res) => {
    try {
        const { user_id, name, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const query = `INSERT INTO users (user_id, name, email, password) values (?, ?, ?, ?)`;

        await pool.execute(query, [
            user_id,
            name,
            email,
            hashedPassword
        ]);

        res.status(201).json({ message: "User registered successfully" });

    } catch (err) {

        console.log("Error registering user:", err);
        res.status(500).json({ message: "User registration failed" });

    }

};


const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const query = "SELECT * FROM users WHERE email = ?";
        const [result] = await pool.execute(query, [email]);
        if (result.length === 0) {

            return res.status(401).json({ message: "Authentication failed" });

        }

        const user = result[0];
        const passwordMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordMatch) {
            return res.status(401).json({ message: "Authentication failed" });

        }

        const token = jwt.sign(
            {
                id: user.user_id,
                name: user.name,
                email: user.email
            },
            JwtKey,
            {
                expiresIn: "1h"
            }
        );

        res.status(200).json({ message: "Login successfully", token: token });

    } catch (err) {

        console.log("Error logging in:", err.message);
        res.status(500).json({ message: "Login failed" });

    }

};


module.exports = { registerUser, loginUser };