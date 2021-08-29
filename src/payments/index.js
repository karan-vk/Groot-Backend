const { Router } = require("express")
const { authenticateJWT } = require("../auth")
const { createPayment } = require("./service")
const router = Router()

router.post("/", authenticateJWT, async (req, res) => {
    const { user } = req
    const { funds } = req.body
    const paymentId = await createPayment(funds, user.user)
    res.status(paymentId.status).json(paymentId.data)
})


module.exports = router