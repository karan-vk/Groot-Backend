const { Router } = require("express")
const { createLike, deleteLike, getLike } = require("./service")

const treeLike = Router()

treeLike.post("/:treeId", async (req, res) => {
    const { message, status } = await createLike(req.user.user, req.params.treeId)
    return res.status(status).json(message)
})

treeLike.delete("/:treeId", async (req, res) => {
    const { message, status } = await deleteLike(req.user.user, req.params.treeId)
    return res.status(status).json(message)
})

treeLike.get("/:treeId", async (req, res) => {
    const { message, status } = await getLike(req.user.user, req.params.treeId)
    return res.status(status).json(message)
})

module.exports = treeLike