exports.getProfile = (req, res) => {
    const userId = req.userId; // `userId` is set in authMiddleware
    res.status(200).json({ message: 'User Profile', userId });
};
