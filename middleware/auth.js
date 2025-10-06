const supabase = require('../config/supabase');

const authMiddleware = async (req, res, next) => {
  const accessToken = req.cookies.sb_access_token || req.headers.authorization?.split(" ")[1];
  if (!accessToken) return res.status(401).json({ error: "Unauthorized" });

  const { data, error } = await supabase.auth.getUser(accessToken);
  if (error) return res.status(401).json({ error: "Invalid or expired token" });

  req.user = data.user;
  next();
};

module.exports = authMiddleware;