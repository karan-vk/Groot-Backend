const express = require('express');
const { authenticateJWT } = require('../auth');
const { createUser, loginUser, updateUser, deleteUser, getUser } = require('./service');
const router = express.Router();

router.post("/signup", async (req, res) => {
    const user = await createUser(req.body);

    return res.status(user.status).json(user.data);
})
router.get("/login", async (req, res) => {
    const user = await loginUser(req.body);

    return res.status(user.status).json(user.data);
})
router.put("/", authenticateJWT, async (req, res) => {
    const user = await updateUser(req.user.user, req.body);
    return res.status(user.status).json(user.data);
})
router.delete("/", authenticateJWT, async (req, res) => {
    const user = await deleteUser(req.user.user);
    return res.status(user.status).json(user.data);
})
router.get("/", authenticateJWT, async (req, res) => {
    const user = await getUser(req.user.user);
    return res.status(user.status).json(user.data);
})
module.exports = router;