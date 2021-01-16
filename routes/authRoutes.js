const { Router } = require("express");
const authControllers = require("../controllers/authControllers");
const { requireAuth, validToken } = require("../middleware/authMiddleware");
const router = Router();

router.post("/signup", authControllers.signup_post);
router.post("/login", authControllers.login_post);
router.post("/logout", authControllers.logout_post);
router.post("/valid", validToken, authControllers.valid_get);
// 404 error page backend
router.use((req, res) => {
  res.send("404 error");
});

module.exports = router;
