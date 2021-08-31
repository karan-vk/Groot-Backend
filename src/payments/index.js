const { Router } = require("express")
const { authenticateJWT } = require("../auth")
const { createPayment } = require("./service")
const router = Router()

router.post("/", async (req, res) => {
    // const { user } = req
    const { amount } = req.body
    const paymentId = await createPayment(amount)
    res.status(paymentId.status).json(paymentId.data)
})


module.exports = router