const pool = require('../config/dbConfig');
const bcrypt = require("bcryptjs");

const getUser = async (req, res) => {
    let query = "SELECT * FROM users";
    try {
        const [result] = await pool.execute(query); //[] nhi lagaya to data or field dono 
        console.log("Data fetched successfully", result);

        res.status(200).json({ message: "Data fetched successfully", data: result });

    } catch (err) {
        console.log("Error fetching data from database");
    }
};


const postUser = async (req, res) => {
    let query = "INSERT INTO users(user_id, name, email, password) values (?, ?, ?, ?)";

    try {

        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        await pool.execute(query, [
            req.body.user_id,
            req.body.name,
            req.body.email,
            hashedPassword
        ]);

        res.status(201).json({ message: "User registered successfully" });

    } catch (err) {

        console.log("Error inserting data", err.message);
        res.status(500).json({ message: "User registration failed" });
    }
};


module.exports = { getUser, postUser };