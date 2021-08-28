const { Router } = require("express")
const { createLike, deleteLike, getLike } = require("./service")

const treeLike = Router()

treeLike.post("/:treeId", async (req, res) => {
    const { data, status } = await createLike(req.user.user, req.params.treeId)
    return res.status(status).json(data)
})

treeLike.delete("/:treeId", async (req, res) => {
    const { data, status } = await deleteLike(req.user.user, req.params.treeId)
    return res.status(status).json(data)
})

treeLike.get("/:treeId", async (req, res) => {
    const { data, status } = await getLike(req.user.user, req.params.treeId)
    return res.status(status).json(data)
})

module.exports = treeLike