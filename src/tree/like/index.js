const { Router } = require("express")
const { noCacheQuery, cacheLikeSetName, cache } = require("../../plugins")
const { createLike, deleteLike, getLike } = require("./service")

const treeLike = Router()

treeLike.post("/:treeId", noCacheQuery, cacheLikeSetName, cache.route({ expire: { default: 0, 404: 20 } }), async (req, res) => {
    const { data, status } = await createLike(req.user.user, req.params.treeId)
    return res.status(status).json(data)
})

treeLike.delete("/:treeId", noCacheQuery, cacheLikeSetName, cache.route({ expire: { default: 0, 404: 20 } }), async (req, res) => {
    const { data, status } = await deleteLike(req.user.user, req.params.treeId)
    return res.status(status).json(data)
})

treeLike.get("/:treeId", noCacheQuery, cacheLikeSetName, cache.route({ expire: { default: 0, 404: 20 } }), async (req, res) => {
    const { data, status } = await getLike(req.user.user, req.params.treeId)
    return res.status(status).json(data)
})

module.exports = treeLike