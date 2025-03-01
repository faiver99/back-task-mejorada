const jwt = require('jsonwebtoken');
require('dotenv').config();

const checkAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Acceso denegado. Token no proporcionado.' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId;
        req.userRole = decoded.role;
        next();
    } catch (error) {
        return res.status(403).json({ message: 'Token inválido o expirado.' });
    }
};

const checkRole = (role) => (req, res, next) => {
    if (req.userRole !== role) {
        return res.status(403).json({ message: 'Acceso denegado. Permiso insuficiente.' });
    }
    next();
};

module.exports = { checkAuth, checkRole };
