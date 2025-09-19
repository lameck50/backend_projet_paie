const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Récupérer le token de l'en-tête
      token = req.headers.authorization.split(' ')[1];

      // Vérifier le token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');

      // Attacher les infos utilisateur à la requête
      req.user = decoded; // Contient {id, role, name}

      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ ok: false, error: 'Non autorisé, token invalide' });
    }
  }

  if (!token) {
    res.status(401).json({ ok: false, error: 'Non autorisé, pas de token' });
  }
};

const isRole = (role) => (req, res, next) => {
    if(req.user && req.user.role === role){
        next();
    } else {
        res.status(403).json({ok: false, error: "Accès refusé, rôle insuffisant"});
    }
}

module.exports = { protect, isRole };
