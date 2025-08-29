const db = require('../db');

exports.createUser = async (email, username, password) => {
    if (!email || !username || !password) {
        throw new Error("Missing required fields");
    }

    console.log("inside createUser");

    // Query to get the count of users
    const countQuery = "SELECT COUNT(*) AS userCount FROM users";
    const insertQuery = "INSERT INTO users (id, email, username, password) VALUES (?, ?, ?, ?)";

    try {
        const [rows] = await db.execute(countQuery);
        const userCount = rows[0].userCount; // Get the count of users
        const newId = userCount + 1; // Calculate the next `id`

        await db.execute(insertQuery, [newId, email, username, password]);
        console.log("User created successfully with id:", newId);
    } catch (err) {
        console.error("Error inserting user into database:", err);
        throw err;
    }
};



exports.findUserByEmail = async (email) => {
    const query = 'SELECT * FROM users WHERE email = ?';
    const [rows] = await db.execute(query, [email]);
    return rows[0];
};