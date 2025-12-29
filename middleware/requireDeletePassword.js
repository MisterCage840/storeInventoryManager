function requireDeletePassword(req, res, next) {
  if (req.body?.deletePassword === process.env.DELETE_PASSWORD) return next()
  return res.status(403).json({ error: "Incorrect delete password" })
}

module.exports = requireDeletePassword
