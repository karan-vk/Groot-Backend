const { Router } = require("express");
const { authenticateJWT } = require("../../auth");
const { createUser, loginUser, sendResetPasswordEmail, verifyResetPassword, changePassword, emailVerification } = require("./service")

const auth = Router()


auth.post("/signup", async (req, res) => {
    const user = await createUser(req.body);

    return res.status(user.status).json(user.data);
})
auth.get("/login", async (req, res) => {
    const user = await loginUser(req.body);

    return res.status(user.status).json(user.data);
})

auth.post("/reset-email-send", async (req, res) => {
    const user = await sendResetPasswordEmail(req.body.email);

    return res.status(user.status).json(user.data);
})

auth.post("/reset-verify", async (req, res) => {
    const user = await verifyResetPassword({ email: req.body.email, code: req.body.code });

    return res.status(user.status).json(user.data);
})

auth.post("/change-password", authenticateJWT, async (req, res) => {
    const user = await changePassword({ id: req.user.user, password: req.body.password, type: req.user.role });

    return res.status(user.status).json(user.data);
})
auth.post("/verify-email", async (req, res) => {
    // console.log(req.body)
    const user = await emailVerification(req.body.email, req.body.code);

    return res.status(user.status).json(user.data);
})


module.exports = auth