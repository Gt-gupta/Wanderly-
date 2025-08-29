const { response } = require('express');
const db = require('../db');  // Import your database connection

exports.getPosts = async (req, res) => {
    const userId = req.userId; // Current user ID from middleware
    const page = parseInt(req.query.page, 10) || 1; // Default to page 1 if not provided
    const limit = 10; // Number of posts per page
    const offset = (page - 1) * limit; // Calculate offset for pagination

    try {
        // Query to fetch posts with likedByYou flag
        const query = `
            SELECT 
                p.*, 
                CASE 
                    WHEN l.userId IS NOT NULL THEN true 
                    ELSE false 
                END AS likedByYou
            FROM posts p
            LEFT JOIN likes l 
                ON p.id = l.postId AND l.userId = ?
            ORDER BY p.created_at DESC 
            LIMIT ${limit} OFFSET ${offset}
        `;

        // Execute query with parameters for userId, limit, and offset
        const [rows] = await db.execute(query, [userId]);

        // Return successful response with posts
        res.status(200).json({
            success: true,
            message: "Posts retrieved successfully",
            data: rows,
            metadata: {
                page,
                limit,
                totalItems: rows.length, // This is just for the current response
            },
        });
    } catch (err) {
        console.error("Error fetching posts:", err);

        // Send error response
        res.status(500).json({
            success: false,
            message: "Failed to fetch posts",
            error: err.message,
        });
    }
};

exports.getPolls = async (req, res) => {
    const userId = req.userId; // Current user ID from middleware
    const page = parseInt(req.query.page, 10) || 1; // Default to page 1 if not provided
    const limit = 10; // Number of posts per page
    const offset = (page - 1) * limit; // Calculate offset for pagination
    try {
        // Query to get posts along with likedByYou information
        const query = `
            SELECT 
                p.*, 
                CASE 
                    WHEN o.userId IS NOT NULL THEN o.no 
                    ELSE -1
                END AS no
            FROM polls p
            LEFT JOIN opinion o ON p.id = o.pollId AND o.userId = ? order by p.created_at desc limit ${limit} offset ${offset}
        `;
        
        const [rows] = await db.execute(query,[userId]);

        // Send the retrieved posts along with likedByYou as a response
        res.status(200).json({
            success: true,
            message: "Polls retrieved successfully",
            data: rows
        });
    } catch (err) {
        console.error('Error fetching polls:', err);

        // Send an error response
        res.status(500).json({
            success: false,
            message: 'Failed to fetch polls',
            error: err.message
        });
    }
};

exports.getFriends = async (req , res) => {
    const userId = req.userId;
    try {
        // Fetch posts excluding the current user's posts
        console.log("inside getFreinds");
        const query = `SELECT * FROM friends where id1=${userId}`;
        const [rows] = await db.execute(query);
        // Send the retrieved posts as a response
        res.status(200).json({
            success: true,
            message: "Friends retrieved successfully",
            data: rows
        });
        
        
    } catch (err) {
        console.error('Error fetching friends:', err);
        
        // Send an error response
        res.status(500).json({
            success: false,
            message: 'Failed to fetch friends',
            error: err.message
        });
    }
};

exports.getUsers = async (req, res) => {
    const { username } = req.query; // Read `username` from query parameters
    const userId = req.userId;
    try {
        const query = `
            SELECT 
                u.*,
                CASE 
                    WHEN f.id2 IS NOT NULL THEN true
                    ELSE false
                END AS friend
            FROM users u
            LEFT JOIN friends f 
                ON f.id1 = ? AND f.id2 = u.id
            WHERE LOWER(u.username) LIKE LOWER(?)
        `;


        // const query = 'SELECT * FROM users WHERE LOWER(username) LIKE LOWER(?)';
        const [rows] = await db.execute(query, [userId,`${username.toLowerCase()}%`]);

        res.status(200).json({
            success: true,
            message: "Users retrieved successfully",
            data: rows,
        });
    } catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch users',
            error: err.message,
        });
    }
};

exports.getChatId = async (req, res) => {
    const { id } = req.query; // User ID of the other participant
    const userId = req.userId; // Current user's ID

    try {
        const query1 = `SELECT chatId FROM chatTable WHERE (id1 = ? AND id2 = ?) OR (id1 = ? AND id2 = ?)`;
        const [rows] = await db.execute(query1, [id, userId, userId, id]);

        // If chatId exists, return it
        if (rows.length > 0 && rows[0].chatId) {
            return res.status(200).json({
                success: true,
                message: "Chat ID retrieved successfully",
                data: rows[0].chatId,
            });
        }

        // If no chatId exists, create one
        const query2 = `INSERT INTO chatTable (id1, id2) VALUES (?, ?)`;
        const [insertResult] = await db.execute(query2, [userId, id]);

        // Retrieve the newly created chatId
        const newChatIdQuery = `SELECT chatId FROM chatTable WHERE id1 = ? AND id2 = ?`;
        const [newChat] = await db.execute(newChatIdQuery, [userId, id]);

        return res.status(201).json({
            success: true,
            message: "Chat ID created successfully",
            data: newChat[0].chatId,
        });
    } catch (err) {
        console.error("Error retrieving or creating chatId:", err);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

exports.getChat = async (req, res) => {
    const { chatId  } = req.query; // Extract chatId from query parameters
    // Validate chatId
    if (!chatId) {
        return res.status(400).json({
            success: false,
            message: "chatId is required",
        });
    }

    try {
        // Query to retrieve messages by chatId
        const query = `select * from messages where chatId = ?`;
        // const query = `SELECT * FROM messages WHERE chatId = ? order BY created_at desc limit ${limit} offset ${offset}`;
        const [rows] = await db.execute(query, [chatId]);

        res.status(200).json({
            success: true,
            message: "Chat retrieved successfully",
            data: rows,
        });
    } catch (err) {
        console.error("Error retrieving chats:", err);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

exports.getProfilePosts = async(req,res) => {
    const {id} = req.query;
    const userId = req.userId;
    try{
        const query = `
            SELECT 
                p.*, 
                CASE 
                    WHEN l.userId IS NOT NULL THEN true 
                    ELSE false 
                END AS likedByYou
            FROM posts p
            LEFT JOIN likes l ON p.id = l.postId AND l.userId = ? AND p.userId = ?
        `;
        // const query = `select * from posts where userId = ?`;
        const [rows] = await db.execute(query,[userId , id]);
        res.status(201).json({
            success:true,
            message:"Posts retrived succesfully",
            data:rows,
        });
        console.log("Profile post fetched");
    }catch(err){
        console.error("Error retrieving posts:", err);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

exports.getTopPosts = async (req, res) => {
    try {
        // SQL query to get top 5 posts based on likes for the current month
        const query = `
            SELECT * 
            FROM posts 
            WHERE created_at >= DATE_FORMAT(NOW() ,'%Y-%m-01') 
            ORDER BY likes DESC 
            LIMIT 5
        `;

        const [rows] = await db.execute(query);

        res.status(200).json({
            success: true,
            message: "Top posts retrieved successfully",
            data: rows,
        });
    } catch (err) {
        console.error("Error retrieving top posts:", err);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};
