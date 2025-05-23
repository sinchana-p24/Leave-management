module.exports = (req, res, next) => {
  if (req.user.role !== 'manager') {
    return res.status(403).json({ message: 'Access denied. Not a manager.' });
  }
  next();
};
