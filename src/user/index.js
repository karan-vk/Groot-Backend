const express = require('express');
const multer = require('multer');
const { authenticateJWT } = require('../auth');
const { updateUser, deleteUser, getUser, setUserPic } = require('./service');
const my = require('./my');
const router = express.Router();
const upload = multer({ dest: 'uploads/', storage: multer.memoryStorage() })

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

router.post("/set-profile-pic", authenticateJWT, upload.single('pic'), async (req, res) => {
    const user = await setUserPic(req.user.user, req.file.buffer);
    return res.status(user.status).json(user.data);
})

router.use("/my", authenticateJWT, my);

router.use("/auth", require("./auth"));


module.exports = router;