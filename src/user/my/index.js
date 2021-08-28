const { Router } = require("express")
const router = Router()
const { myFunds, myPayments, myTrees } = require("./service")

router.get("/trees", async (req, res) => {
    const user = await myTrees(req.user.user);
    return res.status(user.status).json(user.data);
})
router.get("/funds", async (req, res) => {
    const funds = await myFunds(req.user.user);
    return res.status(funds.status).json(funds.data);
})
router.get("/payments", async (req, res) => {
    const payments = await myPayments(req.user.user);
    return res.status(payments.status).json(payments.data);
})

module.exports = router