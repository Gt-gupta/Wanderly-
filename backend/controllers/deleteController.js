const db = require('../db');

exports.deleteFriend = async (req, res) => {
    // Correctly access headers
    const {id2} = req.body;  
    const userId = req.userId;   

    if (!id2 || !userId) {
        return res.status(400).json({
            success: false,
            message: 'User ID or Friend ID is missing',
        });
    }

    try {
        // Ensure that the IDs are safe to use in the query (use parameterized queries for security)
        const query = `DELETE FROM friends WHERE id1 = ? AND id2 = ?`;
        const [rows] = await db.execute(query, [userId, id2]);

        if (rows.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Friend not found or already deleted',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Friend deleted successfully',
        });
    } catch (err) {
        console.error('Error deleting friend:', err);

        res.status(500).json({
            success: false,
            message: 'Failed to delete friend',
            error: err.message,
        });
    }
};
