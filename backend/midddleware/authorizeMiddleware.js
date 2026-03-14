const authorizeRole = (requiredRole) => {
  return (req, res, next) => {
    if (req.role !== requiredRole) {
      return res.status(403).json({ 
        message: `Forbidden: Only ${requiredRole} can access this.` 
      });
    }
    next();
  };
};





const authorizeOwner = (paramIdField = "id") => {
  return (req, res, next) => {
    const targetId = req.params[paramIdField];
    const currentUserId = req.userId;

    if (currentUserId === targetId) {
      return next();
    }

    return res.status(403).json({ message: "Forbidden: You don't own this resource" });
  };
};

module.exports = { authorizeRole, authorizeOwner };