const db = require('../db');  // Import your database connection
const {io} = require('../server');
// Controller for creating a post
exports.createPost = async (req, res) => {
    const {description } = req.body;
    const userId = req.userId;
    const imagePath = `/uploads/${req.file.filename}`;  // Save the path to the DB
    console.log(description);
    const countQuery = 'SELECT COUNT(*) AS postCount FROM posts';
    try {
        // Insert the post into the database
        const [rows] = await db.execute(countQuery);
        const postCount = rows[0].postCount;
        const newId = postCount+1;
        const [result] = await db.execute(
            'INSERT INTO posts (userId , id, description, image_path, created_at) VALUES (?, ?, ?, ?, NOW())',
            [userId,newId, description, imagePath]
        );
        // Send a response with post details
        res.status(201).json({ message: 'Post created successfully', postId: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating post' });
    }
};

exports.createPoll = async (req,res) => {
    const {description , options} = req.body;
    const userId = req.userId;
    console.log(description);
    console.log(options);
    const opt = ["TALK-NULL","TALK-NULL","TALK-NULL","TALK-NULL"];
    for(let i =0;i<options.length;i++){
        opt[i] = options[i];
    }
    const countQuery = 'SELECT COUNT(*) AS pollCount FROM polls';
    try{
        const [rows] = await db.execute(countQuery);
        const pollCount = rows[0].pollCount;
        const newId = pollCount+1;
        const [result] = await db.execute(
            'INSERT INTO polls (userId , id, description, opt1 , opt2 , opt3 , opt4, created_at) VALUES (?, ?, ?, ?, ?, ?, ?,NOW())',
            [userId,newId, description, opt[0] , opt[1] , opt[2] , opt[3]]
        );
        res.status(201).json({ message: 'Poll created successfully', pollId: result.insertId });    
    }catch(err){
        console.error(error);
        res.status(500).json({ message: 'Error creating poll' });
    }
};

exports.createFriend = async (req, res) => {
    const { id2 } = req.body;
    const userId = req.userId;
    console.log(`${id2} ${userId}`);
    // SQL queries
    const checkQuery = 'SELECT COUNT(*) AS check1 FROM friends WHERE id1 = ? AND id2 = ?';
    const insertQuery = 'INSERT INTO friends (id1, id2) VALUES (?, ?)';

    try {
        // Check if the friendship already exists
        const [rows] = await db.execute(checkQuery, [userId, id2]);
        const isFriend = rows[0].check1 === 1;

        if (isFriend) {
            return res.status(400).json({ message: 'Friendship already exists' });
        }

        // Insert the friendship
        await db.execute(insertQuery, [userId, id2]);
        res.status(201).json({ message: 'Friend added' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error adding friend' });
    }
};

exports.postLike = async (req, res) => {
    const { id } = req.body; // Post ID
    const userId = req.userId; // User ID from middleware/auth
    let connection;

    try {
        // Get a database connection
        connection = await db.getConnection();

        // Start a transaction
        await connection.beginTransaction();

        // Check if the user has already liked the post
        const checkQuery = `SELECT COUNT(*) AS liked FROM likes WHERE userId = ? AND postId = ?`;
        const [rows] = await connection.execute(checkQuery, [userId, id]);
        const alreadyLiked = rows[0].liked > 0;

        if (alreadyLiked) {
            // If already liked, decrement likes count and remove from likes table
            const decrementLikesQuery = `UPDATE posts SET likes = likes - 1 WHERE id = ?`;
            const deleteLikeQuery = `DELETE FROM likes WHERE postId = ? AND userId = ?`;

            await connection.execute(decrementLikesQuery, [id]);
            await connection.execute(deleteLikeQuery, [id, userId]);

            await connection.commit();

            // Emit the real-time event
            // io.emit('likeUpdated', { postId: id, action: 'likeRemoved' });

            return res.status(200).json({ message: 'Like removed' });
        } else {
            // If not already liked, increment likes count and insert into likes table
            const incrementLikesQuery = `UPDATE posts SET likes = likes + 1 WHERE id = ?`;
            const insertLikeQuery = `INSERT INTO likes (postId, userId) VALUES (?, ?)`;

            await connection.execute(incrementLikesQuery, [id]);
            await connection.execute(insertLikeQuery, [id, userId]);

            await connection.commit();

            // Emit the real-time event
            // io.emit('likeUpdated', { postId: id, action: 'likeAdded' });

            return res.status(201).json({ message: 'Like added' });
        }
    } catch (err) {
        // Rollback the transaction in case of an error
        if (connection) {
            await connection.rollback();
        }

        console.error('Error in postLike:', err);
        return res.status(500).json({ message: 'Error adding/removing like' });
    } finally {
        // Release the database connection
        if (connection) {
            connection.release();
        }
    }
};

exports.postOpinion = async (req, res) => {
    const userId = req.userId; // Extract user ID from request
    const { id, ind } = req.body; // Extract poll ID and index from request
    const no = ind + 1;
    const connection = await db.getConnection(); // Get a connection for the transaction

    try {
        // Start the transaction
        await connection.beginTransaction();

        // Check if the user has already voted on this poll
        const query1 = `SELECT no AS selectedNo FROM opinion WHERE pollId = ? AND userId = ?`;
        const [rows] = await connection.execute(query1, [id, userId]);

        let previousVote = -1;
        if (rows.length > 0) {
            previousVote = rows[0].selectedNo;
        }

        // If the user has already voted, decrement the previous vote count
        if (previousVote !== -1) {
            const query2 = `UPDATE polls SET c${previousVote} = c${previousVote} - 1 WHERE id = ?`;
            await connection.execute(query2, [id]);
        }
        else{
            const query2 = `insert into opinion(pollId,userId,no) values (?,?,?)`;
            await connection.execute(query2, [id,userId,no]);
        }

        // Update the user's opinion
        const query3 = `UPDATE opinion SET no = ? WHERE pollId = ? AND userId = ?`;
        await connection.execute(query3, [no, id, userId]);

        // Increment the new vote count
        const query4 = `UPDATE polls SET c${no} = c${no} + 1 WHERE id = ?`;
        await connection.execute(query4, [id]);

        // Commit the transaction
        await connection.commit();

        res.status(201).json({ message: 'Opinion added successfully' });
    } catch (err) {
        // Rollback the transaction in case of any error
        await connection.rollback();
        console.error('Transaction failed, changes rolled back:', err);
        res.status(500).json({ message: 'Error adding opinion' });
    } finally {
        // Release the connection back to the pool
        await connection.release();
    }
};

exports.postMessage = async (req, res) => {
    const { chatId, id, message } = req.body; // `id` is the receiver's ID
    const userId = req.userId; // Sender's ID

    // Ensure all necessary fields are provided
    if (!chatId || !id || !message) {
        return res.status(400).json({
            success: false,
            message: "Missing required fields: chatId, id, or message",
        });
    }

    try {
        const query = `
            INSERT INTO messages (chatId, senderId, receiverId, created_at, message) 
            VALUES (?, ?, ?, NOW(), ?)
        `;

        // Execute the query with parameters
        await db.execute(query, [chatId, userId, id, message]);
        console.log("Message sent successfully");
        res.status(201).json({
            success: true,
            message: "Message sent successfully",
        });
    } catch (err) {
        console.error("Error posting message:", err);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};
