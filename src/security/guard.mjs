export function checkToken(req, res) {
  const t = process.env.API_UI_TOKEN;
  if (!t) return true; // allow if unset (dev)
  const got = req.headers['x-imo-ui'];
  if (got === t) return true;
  res.status(401).json({ error: "unauthorized" }); return false;
}