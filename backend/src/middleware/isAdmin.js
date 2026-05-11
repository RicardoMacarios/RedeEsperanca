const ADMIN_EMAIL = 'juniormacarios92@gmail.com';

function isAdmin(req, res, next) {
  if (req.user?.email !== ADMIN_EMAIL) {
    return res.status(403).json({ erro: 'Acesso negado.' });
  }
  next();
}

module.exports = isAdmin;
