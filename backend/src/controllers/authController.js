const login = (req, res) => {
  const { password } = req.body;
  if (!password || password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ message: 'Invalid password' });
  }
  req.session.isAdmin = true;
  return res.json({ message: 'Logged in', admin: true });
};

const logout = (req, res) => {
  req.session.destroy(() => {
    res.clearCookie('bh_session');
    res.json({ message: 'Logged out' });
  });
};

const status = (req, res) => {
  res.json({ admin: !!req.session?.isAdmin });
};

module.exports = { login, logout, status };
